/**
 * Safe-T Consultancy — Discovery Email Ingest
 *
 * Forwards matching emails (e.g. Boardy digests, industry newsletters) to the
 * discovery webhook, where Claude extracts opportunities into the CRM.
 *
 * SETUP (one time):
 * 1. In Gmail, create a filter that applies a label (e.g. "Discovery") to the
 *    newsletters/alerts you want mined — or apply it manually.
 * 2. Go to https://script.google.com -> New Project, paste this file.
 * 3. Set CONFIG below (webhookUrl = your deployed site + /api/discovery/inbound-email,
 *    webhookSecret = DISCOVERY_WEBHOOK_SECRET from Vercel).
 * 4. Run setupTrigger() once (approve Gmail permissions when prompted).
 *
 * After that it runs automatically every 30 minutes.
 */

// -- CONFIG -------------------------------------------------------------------
const CONFIG = {
  webhookUrl: "https://www.safetconsultancy.co.uk/api/discovery/inbound-email",
  webhookSecret: "REPLACE_WITH_DISCOVERY_WEBHOOK_SECRET",
  searchQuery: 'label:Discovery newer_than:2d',
  processedLabel: "Discovery/Processed",
};
// -----------------------------------------------------------------------------

function processDiscoveryEmails() {
  let label = GmailApp.getUserLabelByName(CONFIG.processedLabel);
  if (!label) label = GmailApp.createLabel(CONFIG.processedLabel);

  const props = PropertiesService.getScriptProperties();
  const threads = GmailApp.search(CONFIG.searchQuery);
  let processed = 0;

  for (const thread of threads) {
    for (const message of thread.getMessages()) {
      const msgId = message.getId();
      if (props.getProperty("disc_" + msgId)) continue;

      const subject = message.getSubject();
      const body = message.getPlainBody();
      if (!body || body.trim().length < 40) continue;

      try {
        const response = UrlFetchApp.fetch(CONFIG.webhookUrl, {
          method: "post",
          contentType: "application/json",
          headers: { "x-webhook-secret": CONFIG.webhookSecret },
          payload: JSON.stringify({ subject: subject, emailBody: body }),
          muteHttpExceptions: true,
        });

        const code = response.getResponseCode();
        const result = JSON.parse(response.getContentText());

        if (code === 200 && result.success) {
          console.log("Processed: " + subject + " -> found " + result.found + ", added " + result.inserted);
          props.setProperty("disc_" + msgId, new Date().toISOString());
          thread.addLabel(label);
          processed++;
        } else {
          console.error("Error on: " + subject + " HTTP " + code, result);
          // Leave unmarked so it retries next run.
        }
      } catch (e) {
        console.error("Exception on: " + subject, e.toString());
      }
    }
  }

  console.log("Done. " + processed + " emails processed.");
}

/** Run once to schedule every 30 minutes. */
function setupTrigger() {
  ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === "processDiscoveryEmails")
    .forEach((t) => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger("processDiscoveryEmails").timeBased().everyMinutes(30).create();
  console.log("Trigger set up.");
}
