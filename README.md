# Safe-T Consultancy website

Next.js (App Router) site for safetconsultancy.co.uk.

## Develop

```
npm install
npm run dev
```

## Deploy

Push this folder to a new GitHub repo, then import it in Vercel (or connect
the repo to your existing Vercel account). No special build settings needed -
Vercel detects Next.js automatically.

## Before launch

- Replace the placeholder booking link on /contact with a real Calendly
  (or similar) link.
- Wire the contact form (src/app/contact/ContactForm.tsx) to a real backend
  (Formspree, Resend, or a Vercel API route) - it currently opens the
  visitor's email client, which is a stopgap, not a production solution.
- Replace the illustrative entries on /track-record with real project
  details (vessel size / system kW, scope, outcome), kept vessel-anonymous.
- Point the domain (safetconsultancy.co.uk) at the new Vercel deployment
  once you're ready to cut over from Squarespace.
