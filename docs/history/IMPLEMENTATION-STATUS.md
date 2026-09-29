# Implementation status

This branch is a tested first implementation of the CWS website and project workspace. It is not yet the full commercial launch specified in the PRD. No repository code existed before this branch.

## Implemented

The fourteen-part homepage narrative is present, except testimonials are omitted because none were supplied. All twelve service categories and four named packages are represented. The configurator preserves the master plan’s eight stages and eight style choices. Client submissions create a lead, order and project in one transaction. New projects are visible only to the verified submitting email and configured administrators.

The portal has project status/progress, brief, quarantined files, design approvals, messages, invoices, managed-service records and support. Administration can review briefs and inquiries, update status and milestone checks, share design versions, record invoices/manual payments and service details, review orders and inspect email delivery state. Approval records include actor and version in the audit history. Payment references are unique and retries are idempotent.

## Required before public launch

1. Select and configure a hosting destination, public origin, persistent storage, HTTPS, backups and restoration procedure. The included deployment supports a single Node process and SQLite volume.
2. Configure production SMTP, sender authentication, notification recipient and verified owner email. Review rate limiting behind the selected proxy. Email is queued persistently; unconfigured SMTP does not send mail.
3. Finalize public contact information and have the business owner approve privacy, service terms, support commitments and evidence for the supplied marketing figures. Current policy pages are labeled draft.
4. Connect file malware scanning and authorized downloads. Uploads are validated and quarantined, never publicly served. DOCX/SVG and post-submission uploads are not yet enabled. This intentionally keeps unscanned assets inaccessible.
5. Add the complete quote/version/acceptance workflow, priced catalog, taxes, revision allowances and payment provider. The current experience explicitly requests a quote and supports invoice records and verified manual payments. It does not process cards or M-Pesa.
6. Complete the delivery readiness checklist, durable clock/pause events and verified launch workflow. Live status is locked at the API until these exist. Current progress is calculated from staff-selected completed milestones; full applicability/weight scheduling is pending.
7. Add finance/owner role separation, multifactor authentication and content publishing/rollback. Project owner assignment and other-session revocation are implemented. Current production access has client and configured administrator roles only. Review approval authorization to restrict final approval to the designated client signatory.
8. Complete subscription billing, renewals, reminders, cancellation and provider reconciliation. Domain, hosting, email and maintenance information is recorded manually; no provisioning is implied.
9. Add server pagination, analytics/consent integration, published knowledge base, search metadata per page, canonical URLs, sitemap/social previews and production performance/accessibility audits.
10. Finish message retry idempotency, secure file removal and expiry cleanup, downloadable invoices/quotes and retention/deletion operations. Threaded support and reopening are implemented.

## Deliberate first-release boundaries

- No fabricated clients, testimonials, project outcomes or sample live project records are seeded.
- Package amounts were not supplied. All amounts remain quote-based rather than invented.
- Authentication uses verified single-use email links and seven-day sessions. Development links are disabled in production regardless of configuration.
- Submitted drafts exclude contact identity from local storage. File binaries are never stored in browser local storage. Contact fields must be entered again after a page reload.
- Project readiness and launch cannot be inferred from an arbitrary percentage. The API blocks direct Live transitions.
- Uploaded files are private and quarantined. The API deliberately exposes metadata only.

## Verification performed locally

- Production asset compilation.
- API tests for transaction integrity, duplicate intake, durable records after reopening SQLite, single-use sign-in tokens, cross-client isolation, denied admin access, stale-version conflicts, obsolete approval rejection, payment replay/overpayment handling, same-origin rejection and privacy acknowledgement.
- Browser tests for desktop/mobile navigation, horizontal overflow, eight-step submission, sign-in and project visibility.
- Visual inspection of the homepage and mobile configurator.

GitHub CI runs the build and automated tests on Node 24. Deployment approval is separate from merging implementation work.

## Dashboard expansion

See `WORKSPACE.md` for the database-backed client/admin dashboards, client directory, tasks, scheduling, staff notes, threaded support, billing overview, profile editing, session revocation and backup command. Design approvals are now client-only. Migration 1 is applied without replacing existing records. The AWS-reference public design supersedes the original homepage narrative described above. Real email delivery, payment processing, file scanning and verified launch remain pending integrations.

## CRM and public website refinement

See `CRM-REFINEMENT.md` for filtered analytics, client profiles/read-only account previews, project status and payment drilldowns, per-currency finance charts/exports, historical snapshots, invoice due dates and migration 2. Public pages now use service-specific editorial content and distinct photography, uniform clickable pricing cards, a navy/blue logo and WhatsApp-only public contact labels. `BRAND-ASSETS.md` records the assets. Public previews remain fictional and separate from protected account data.
