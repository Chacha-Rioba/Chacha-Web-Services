# CWS — Chacha Web Services

A public business website built with React and Vite. The current version has **no CWS backend, database connection, accounts, login or dashboards**. Visitors browse services, send an inquiry or request a meeting. FormSubmit delivers form submissions to `project@cws.com` after inbox activation.

## Run and build

```sh
npm ci
npm run dev
npm run build
```

The local site is at `http://localhost:5173`. Deploy the contents of `dist/` to a static host with SPA fallback to `index.html`. No Node application server, SMTP secrets or persistent volume are required. `npm start` previews the compiled files locally; it is not a production application server. An optional Docker image serves only the compiled files with Nginx on port 80.

Use Node 24+ for development and the optional archival backup command. Fonts and photographs are served locally.

## Pages

Home, twelve services, solution examples, pricing, process, About, FAQs, contact, project inquiry, meeting request, privacy and service information. The About page includes CWS’s purpose, connected design/software/AI approach, six guiding principles and delivery process.

Workflow Automation has been replaced by AI Agents & Automation. The old URL redirects to the new service. Legacy login, signup, verification, portal, admin and preview URLs redirect to Contact. There are no links offering an account or dashboard.

## Form delivery: activation required

The inquiry, contact and meeting forms use `https://formsubmit.co/ajax/project@cws.com`. No email-service password or secret API key is placed in the frontend.

Before accepting live inquiries:

1. Open the website over HTTP/HTTPS and submit a clearly labelled setup inquiry.
2. Open `project@cws.com` and confirm the activation email from FormSubmit. Check spam/junk if necessary.
3. Submit another test inquiry and verify its arrival, all fields and the reply-to address.
4. Submit a meeting request and verify its preferred date, local time and named time zone.

[FormSubmit setup instructions](https://formsubmit.co/) and [AJAX documentation](https://formsubmit.co/ajax-documentation).

This repository configures delivery but cannot confirm mailbox ownership or receipt. Automated tests mock the provider; no live delivery is claimed. The UI reports acceptance only when the provider explicitly returns success. Network, HTTP, malformed-response and activation failures keep the input and show an error with a direct-email alternative. Provider acceptance is not a guarantee of inbox receipt.

Spam controls include a honeypot and provider filtering. AJAX does not provide an interactive CAPTCHA here. Monitor the mailbox/provider filtering and choose a stronger hosted spam-control option if necessary. Form submissions are not persisted in browser storage or a CWS database. Public forms do not accept files or passwords.

## Meeting requests

The default page collects name, email, optional company/phone, service, preferred date/time/time zone, alternative times and discussion topic. It clearly states that the appointment is pending confirmation. CWS replies by email with availability and the meeting link.

If an actual scheduling service is available, set `VITE_MEETING_URL` to its HTTPS booking URL and rebuild. The page will add an external calendar link while retaining the meeting-request form. This value is public and must not contain a private access token. No scheduling link has been supplied, so the request form is the active option.

## Preserved data and retired backend

The previous implementation is recoverable from Git commit `5a424e6`. Before retirement, an integrity-checked SQLite backup was created at `data/backups/cws-2026-09-29T23-25-57-412Z.sqlite`. Original database files and uploads remain under ignored `data/`; configuration was preserved as `data/retired-backend.env`. None of these files is included in the static build or committed to Git.

The backend modules, API proxy, dashboard/auth components and server dependencies have been removed from the current source. `npm run archive:backup` is an optional local recovery tool for the preserved database, not part of website runtime. Documentation under `docs/history/` records the retired architecture and is not the current deployment guide.

## Validation

```sh
npm run check
npx playwright install chromium
npm run test:e2e
```

Browser tests launch only Vite, use simulated email-provider responses and check public navigation, retired routes, form acceptance/error handling, meeting details, mobile layout, imagery and clickable cards. On Windows, `PLAYWRIGHT_EXECUTABLE_PATH` can select an installed Edge/Chromium executable.

The original PRD and historical documents reflect earlier scope. This README and `docs/PUBLIC-WEBSITE.md` describe the approved public-only version. No public production deployment is included.
