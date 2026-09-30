# CWS — Chacha Web Services

A public business website built with React and Vite. The current version has **no CWS backend, database connection, accounts, login or dashboards**. Visitors browse services, send an inquiry or request a meeting. All request forms currently prepare WhatsApp messages. Visitors must tap Send in WhatsApp; opening the app does not send a request.

## Run and build

```sh
npm ci
npm run dev
npm run build
```

The local site is at `http://localhost:5173`. Deploy the contents of `dist/` to a static host with SPA fallback to `index.html`. No Node application server, SMTP secrets or persistent volume are required. `npm start` previews the compiled files locally; it is not a production application server. An optional Docker image serves only the compiled files with Nginx on port 80.

Use Node 24+ for development and the optional archival backup command. Fonts and photographs are served locally.

## Pages

Home, twelve services, solution examples, pricing, process, About, FAQs, contact, project inquiry, meeting request, callback request, privacy and service information. The About page includes CWS’s purpose, connected design/software/AI approach, six guiding principles and delivery process.

Workflow Automation has been replaced by AI Agents & Automation. The old URL redirects to the new service. Legacy login, signup, verification, portal, admin and preview URLs redirect to Contact. There are no links offering an account or dashboard.

## Requests via WhatsApp

Project inquiries, contact queries, meetings and callback requests prepare a URL-encoded message for WhatsApp CWS. The visitor must tap Send in WhatsApp. Opening WhatsApp is not delivery confirmation. If a new tab is blocked, the page provides an explicit Open WhatsApp CWS link and preserves form values. Editing clears the old prepared link. No request is stored in a CWS database or local storage.

The callback page is /request-a-callback and is linked prominently from the header and homepage. It requires a name, international phone number, date, time, IANA timezone and discussion topic; email is optional. Meetings and callbacks require confirmation by CWS. Privacy acknowledgement and field validation are required before preparing the message.

Email is not active in the public interface. The retained email helper targets project@cws.com for future use, but must only be reconnected after mailbox provisioning, FormSubmit activation and an actual delivery test. No automatic sending or WhatsApp Business API integration is claimed.

## Preserved data and retired backend

The previous implementation is recoverable from Git commit `5a424e6`. Before retirement, an integrity-checked SQLite backup was created at `data/backups/cws-2026-09-29T23-25-57-412Z.sqlite`. Original database files and uploads remain under ignored `data/`; configuration was preserved as `data/retired-backend.env`. None of these files is included in the static build or committed to Git.

The backend modules, API proxy, dashboard/auth components and server dependencies have been removed from the current source. `npm run archive:backup` is an optional local recovery tool for the preserved database, not part of website runtime. Documentation under `docs/history/` records the retired architecture and is not the current deployment guide.

## Validation

```sh
npm run check
npx playwright install chromium
npm run test:e2e
```

Browser tests launch only Vite, intercept WhatsApp opening without sending messages and check public navigation, retired routes, validation, blocked-popup fallback, scheduling details, mobile layout, imagery and clickable cards. On Windows, `PLAYWRIGHT_EXECUTABLE_PATH` can select an installed Edge/Chromium executable.

The original PRD and historical documents reflect earlier scope. This README and `docs/PUBLIC-WEBSITE.md` describe the approved public-only version. No public production deployment is included.
