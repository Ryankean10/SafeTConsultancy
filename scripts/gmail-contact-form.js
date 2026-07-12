/**
 * Safe-T Consultancy — Website Contact Form Mailer
 *
 * Receives a POST from the Vercel API route (src/app/api/contact/route.ts)
 * and sends the enquiry to admin@safetconsultancy.co.uk via Gmail.
 *
 * SETUP (one time):
 * 1. Go to https://script.google.com → New Project
 * 2. Paste this entire file, replacing the default code
 * 3. Set WEBHOOK_SECRET below to a long random string (must match
 *    CONTACT_WEBHOOK_SECRET in Vercel's environment variables)
 * 4. Deploy → New deployment → Type: Web app
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 5. Copy the resulting "/exec" Web app URL — that's CONTACT_WEBHOOK_URL
 * 6. Approve the Gmail permissions when prompted
 */

// ── CONFIG ────────────────────────────────────────────────────────────────────
const WEBHOOK_SECRET = 'REPLACE_WITH_RANDOM_SECRET'
const RECIPIENT = 'admin@safetconsultancy.co.uk'
// ─────────────────────────────────────────────────────────────────────────────

function doPost(e) {
  try {
    const headerSecret = e.parameter.secret
    const body = JSON.parse(e.postData.contents)

    if (headerSecret !== WEBHOOK_SECRET && body.secret !== WEBHOOK_SECRET) {
      return jsonResponse({ success: false, error: 'unauthorized' })
    }

    const { name, email, project, message } = body

    if (!name || !email || !message) {
      return jsonResponse({ success: false, error: 'missing required fields' })
    }

    const subject = `Website enquiry from ${name}`
    const plainBody = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Vessel / project type: ${project || '(not provided)'}`,
      '',
      message,
    ].join('\n')

    MailApp.sendEmail({
      to: RECIPIENT,
      replyTo: email,
      subject,
      body: plainBody,
    })

    return jsonResponse({ success: true })
  } catch (err) {
    return jsonResponse({ success: false, error: err.toString() })
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  )
}
