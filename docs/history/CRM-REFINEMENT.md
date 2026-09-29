# CWS CRM and website refinement

## Admin navigation

Open `/admin` with a verified email listed in `ADMIN_EMAILS`. `project@cws.com` is the requested owner identity. Analytics, Projects, Clients and Finance use database records. Orders, Inquiries, Notifications, Support and Account retain their existing workflows.

`/preview/admin` demonstrates the same CRM components using fictional local data. `/preview/client` shows a fictional client workspace. Neither preview calls protected CRM APIs or changes account records.

## Analytics and filtering

- Registered clients: verified user accounts, excluding configured administrators, filtered by registration date.
- Clients with submissions (onboarded): distinct submitting emails in the filtered project cohort. A submitted brief can exist before email verification.
- Active clients: distinct submitting emails with projects in progress or awaiting approval in that project cohort.
- Project dates mean submission dates. Client directory dates normally mean registration dates; a metric drilldown preserves the project submission cohort and explicitly labels this exception.
- Filters include inclusive UTC start/end dates, client, project status, service, package, project payment state and text search. Finance adds project, invoice status and currency. Clients add account stage.
- Chart bars open matching records or a matching monthly range. Empty results remain empty, never replaced by demonstration records.
- Client directories are sorted by registration date or name and paginated in the browser, 15 rows per page. Project lists also paginate at 15 rows. Database/API pagination is a future scaling improvement.

Client profiles include ID, registration, company, contact details, stage, projects and briefs, invoice/payment records, conversations, support requests, internal project notes and recent audit activity. Account preview is read-only and does not impersonate the client. Administrators contact clients through the project email/phone links or project Messages. Internal notes are written within the project Team notes tab.

## Delivery statuses

Existing records keep their stored statuses. CRM maps New to Submitted, Assigned and Ready to Pending, Designing/Development/Changes to In progress, Client Review to Awaiting approval, and Live to Completed. Latest outstanding design reviews also mark nonterminal projects as awaiting approval. On hold and Cancelled remain separate.

The new Completed status records delivery handover without claiming production deployment. Saving it requires the Ready milestone and approval of the latest shared design, when a design has been shared. It sets progress to 100%. Direct Live transitions remain unavailable until the verified launch workflow exists.

## Finance and accounting boundaries

Amounts are integer minor units. KES and USD are always reported separately; no exchange conversion is implied. Invoice issue dates and recorded payment dates drive the relevant charts and exports. Invoice totals, recorded paid amounts and current remaining balances are shown together. Due dates can be set at invoice creation or changed with optimistic version checks. An unpaid balance with a due date before today is Overdue; fully paid invoices remain Paid.

Month-end outstanding reconstructs invoices issued by month end minus payments recorded by then. Clicking a snapshot shows balances as of that date, explicitly labelled. Payment timestamps are the dates records were entered, not an independently verified bank settlement date. Exports preserve the current filters, include currency and minor-unit labels, and escape spreadsheet formulas.

Payment entry is a manual record of a payment verified outside CWS. It does not charge a card, invoke M-Pesa, confirm provider settlement or issue a tax receipt. References remain unique, retries idempotent, and overpayments rejected. Automatic reconciliation, refunds, credit notes, tax accounting and subscription billing are not implemented.

## Database and access

Migration 2 adds invoice due dates/versioning and date indexes without replacing invoices, payments, clients or projects. Migration 1 is retained. The SQLite online backup command verifies each snapshot with an integrity check.

CRM list, profile, due-date mutation and export endpoints all require a verified administrator. Client-owned project APIs continue enforcing ownership. No public preview grants access to real accounts. Email transport still requires SMTP configuration; previews deliberately do not enable development sign-in links.

## Public website

All twelve service detail pages now have different photographs and specific audience, deliverables, use cases, delivery steps, required inputs and scope boundaries. Starting a service brief preserves that service selection for CRM reporting; older briefs receive a website-type fallback.

All four package cards use the Business Growth navy treatment and consistent hover/focus effects. The complete card is a single link. The homepage solution carousel uses relevant photographs and its whole slide is clickable. The delivery detail panel, service brief cards, and actionable dashboard cards are also clickable without nested links or buttons.

The red shoe photograph has been removed and replaced by corporate finance imagery. The supplied logo was recoloured navy/blue and is used throughout headers, footers, authentication and workspaces. Public CWS contact labels say WhatsApp CWS and link directly to the existing WhatsApp destination. Client contact information remains available only in authorised contexts. Social profiles remain marked coming soon until actual links are supplied.

See BRAND-ASSETS.md for the logo prompt and photography sources. Stock photos illustrate service categories and do not claim to show CWS employees or delivered client work.

## Verification

`npm run check` runs API/reporting/persistence tests plus production compilation. `npm run test:e2e` uses a fresh temporary database and a single process owning both its Vite server and an ephemeral API port. It does not use the normal preview database. Coverage includes metric drilldowns, read-only client profiles, finance filters and CSV download, admin/client role separation, task updates, mobile overflow, all twelve service images, whole-card pricing links, brief selection, public navigation and account flows.
