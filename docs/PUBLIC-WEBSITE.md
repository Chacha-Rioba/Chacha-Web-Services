# CWS public website

The current website has no accounts, dashboards, custom backend or database runtime. Earlier database files are preserved locally and excluded from deployment; historical documentation is under docs/history.

## Current request flow

All project, contact, meeting and callback forms prepare WhatsApp messages. Visitors must tap Send in WhatsApp. The website never reports delivery merely because WhatsApp opened. A visible fallback link handles blocked popups; entered details remain available for editing. Email is optional; callback numbers must include a country code. Meeting and callback times are requests pending confirmation, not appointments.

The email helper for project@cws.com remains inactive until a working inbox is provisioned, activated and delivery-tested. There is no SMTP credential or messaging API token in the frontend.

## Presentation

The homepage uses existing real stock photography, not generated graphics or a fictional CWS team image. The desktop hero is 276px tall at wide desktop sizes, down from the previous minimum 690px (60% smaller). Mobile reflows to preserve readability. The five-hour offer retains its eligibility note. Header and hero include Request a callback; other service and meeting flows remain available.

## Validation and deployment

npm run check builds the site and checks request helpers. npm run test:e2e checks the UI with WhatsApp opening intercepted; tests send no messages. Use Node 24, build command npm run build, publish directory dist and the included SPA redirects. This update does not confirm a live Netlify deployment or message receipt.
