# Public website refurbishment

The approved scope replaces the CWS application with a static marketing and inquiry website. This supersedes the account, CRM and database requirements in the original PRD.

## Implemented

- Removed backend source, authentication/dashboard components, API proxy and server dependencies. No website actions create accounts, projects, invoices or database records.
- Preserved the original database/uploads/configuration locally and created an integrity-checked backup before retirement. Git retains the previous implementation at commit 5a424e6.
- Replaced the eight-stage configurator with a project inquiry form. Contact and meeting forms use the same hosted email integration targeting project@cws.com.
- Forms include validation, required privacy acknowledgement, honeypot, disabled submit while sending, a timeout, explicit provider-success checking, and retained input after errors. No input is persisted to local storage.
- Meeting requests contain preferred date/time, IANA time zone, alternative availability and topic. The UI states that booking is not confirmed. An optional HTTPS scheduling URL can be configured later.
- Replaced Workflow Automation with AI Agents & Automation, with support/knowledge agents, lead qualification, appointment assistance, document workflows, integrations, evaluation and human-review boundaries.
- Rebuilt About with a photographic hero, purpose and approach, connected capabilities, six principles, delivery process and meeting invitation.
- Removed decorative directional arrows; carousel navigation uses labelled Previous/Next buttons. Whole-card links and keyboard focus remain.
- Updated header/footer/homepage/process/FAQs/privacy to remove the CWS account workflow. Existing AI/software offerings may still describe accounts or databases built for clients; that does not offer a CWS account.

## Email activation and testing boundary

FormSubmit requires recipient confirmation. Submit a setup inquiry, activate it from project@cws.com, then verify a second inquiry and meeting request arrive. Automated tests use mocked HTTP responses and do not send test emails. Inbox receipt has not been verified.

A browser-only website cannot send SMTP mail by itself. FormSubmit is the external delivery processor; the CWS site runs no backend. See the README for configuration and deployment.

## Hosting

Build command: npm run build. Publish directory: dist. Configure SPA fallback. Nginx and Netlify-style redirect examples are included. The former API is not deployed. Old account routes lead to Contact, and the old automation service URL redirects to AI Agents & Automation.

No production host has been connected or published by this change.
