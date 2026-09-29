# CWS Website Product Requirements

Version 1.0 | 29 September 2026


## Product requirements


Chacha Web Services Website and Client Platform
Version 1.0 | 29 September 2026
Product definition and implementation requirements


### Purpose

CWS needs a flagship website that demonstrates the quality of its own design and development services. The website must convert visitors into complete project briefs, then give clients and the CWS team a shared place to manage delivery, approvals, invoices and support.


### Product Decision

Build four connected experiences: the marketing website, the website configurator, the client portal and CWS Admin. Deliver the public website and intake as an internal milestone, then activate authenticated project operations for the complete commercial launch. Keep the same project records and visual system across both releases.


### Established Direction

The public identity is CWS, Chacha Web Services. The palette is warm ivory #F4F5F0, soft stone #D9DDD5, deep forest green #073F32, charcoal #171918 and white #FFFFFF. The hero reads “YOUR WEBSITE. LIVE IN 5 HOURS.” The four requested metrics are 29+ Projects Completed, 98% Client Satisfaction, < 5 Hrs Fastest Standard Delivery and 24/7 Support.


### Requirement Status

The CWS Master Plan defines the identity, services, packages, eight-stage configurator, hero, metrics and four product layers. It is the primary product source. Package boundaries, delivery eligibility, permissions, validation limits and operational rules in this document are proposed implementation defaults. They form a complete build baseline and can be revised through versioned product changes.


### Audience

The CWS owner, product designer, frontend and backend developers, delivery team and test engineer should use this document to agree scope and verify the finished product. “Must” identifies required behavior. P0 identifies the internal website and intake milestone; P1 identifies the complete commercial launch; P2 identifies later expansion.


### Success

A visitor can understand the offer, inspect genuine work, submit a usable brief and receive a reliable reference. A client can see the next action and approve a specific deliverable. CWS can trace every brief from receipt to launch without losing decisions or files.


## Scope and release sequence


### P0 Internal Website And Intake Milestone

Deliver responsive marketing pages, service details, portfolio and project detail templates, process, quote-based packages, FAQ, contact, legal page slots and the complete configurator. Deliver persistent submissions, structured project and order records, uploaded assets, reference numbers, confirmation emails and a protected intake queue with search and assignment. Public intake must never depend on email delivery alone.


### P1 Complete Commercial Launch

Deliver client authentication, project overview, milestone timeline, file exchange, versioned approvals, messages, quotes, invoice records, payment reconciliation, support tickets, domain and hosting records, maintenance subscriptions and notifications. Extend administration with roles, project assignments, content publishing, claim records, finance views and reporting. P0 is an implementation checkpoint, not a reduced substitute for the master plan. The full commercial launch includes P0 and P1; customers can track submitted projects through the portal.


### P2 Expansion

Add domain registration and renewal automation, hosting provisioning, automated recurring billing, richer analytics, an AI-assisted generation workflow and multiple client organizations per account. P0 and P1 store domain and hosting choices as service requests; they do not represent live registrar or hosting integrations.


### Exclusions

This project does not include a drag-and-drop website editor for clients, automatic production deployment of customer sites, a public template marketplace, staff payroll or unrestricted AI publishing. “Build My Website” is a guided service configurator, not a self-service page builder.


### Release Dependencies

Commercial launch needs configured business contact destinations, approved service and legal copy, production domain, real portfolio permissions, an email sender and secure storage. When package amounts are not configured, display “Request a quote”; never display invented prices or a payment checkout without an approved quote. When testimonials are absent, omit the section without leaving a gap.


### Completion Rule

A frontend demonstration is not a production release. Submission persistence, permissions, uploads, email retries, monitoring and recovery must be tested against the production-equivalent backend before P0 is accepted. P1 cannot be declared complete with simulated payments or client data held only in the browser.


### Delivery Order

Design system and content model; public pages; configurator and intake backend; intake administration; P0 internal verification; client portal; delivery and finance administration; P1 verification. Each stage must preserve previously accepted journeys.


## People and permissions


### Visitor

View public content, compare services, start and resume a local draft, submit a brief and send a contact inquiry. Visitors cannot read other submissions or retrieve project files by guessing a reference number.


### Client

View only projects belonging to the client organization, see client-visible milestones, upload assets, comment, approve deliverables, accept quotes, view invoices and raise support requests. Initial P1 default is one client organization per account with several projects. Client invitation grants access only after email verification.


### Delivery Staff

See assigned projects and their briefs, edit delivery progress, upload versions and reply to client messages. Staff cannot access unrelated projects, change published prices, issue refunds, manage roles or expose internal notes to clients. Explicitly separate internal notes from client messages in both UI and storage.


### Finance

View client billing identity, accepted quotes, invoices and payment records. Create invoice drafts, record verified manual payments and review payment exceptions. Finance access does not automatically grant creative asset access or role administration.


### Administrator

Assign leads and projects, manage service content, publish portfolio items, edit packages and metrics, oversee support and inspect audit history. Admins may invite staff but cannot grant owner privileges or erase audit history. Refund execution remains a separate permission.


### Owner

Manage staff roles, billing configuration, integrations, publication settings and exports. Owner-only actions include granting administrator or finance roles and authorizing refunds. Require a second authentication challenge before sensitive changes.


### Permission Enforcement

The server must enforce organization membership and assignment on every record and file operation. Hiding a navigation item is insufficient. Signed file links expire after 15 minutes. Unauthenticated requests return an authentication error; authenticated users without access receive a non-disclosing not-found response.


### Account Lifecycle

Support verified invitations, sign in, sign out, password recovery or verified sign-in links, expired invitation states and disabled accounts. Staff accounts require multifactor authentication. Revocation invalidates sessions and removes access immediately. Keep project history after a staff account is disabled.


### Acceptance

Given two client accounts, neither can read, mutate, search or download the other client’s data through the interface or API. An unassigned staff account fails the same checks. An owner can revoke access without changing project records.


## Routes and navigation


### Public Routes

/ is Home. /services lists services; /services/{slug} describes all twelve service categories defined in the service catalog. /work lists approved projects; /work/{slug} holds case studies. /process explains delivery. /packages compares scope. /about introduces CWS. /contact accepts inquiries. /faq answers purchase questions. /build runs the configurator. /privacy and /terms contain approved policies. /login and /signup provide verified client access at commercial launch; /forgot-password provides recovery. Signup may happen before or after submitting a brief.


### Global Navigation

Desktop header: CWS home link, Services, Work, Process, Packages and primary “Build My Website”. Put About, FAQ, contact details and policies in the footer. In P1 add a restrained “Client login” link. On mobile use a labeled menu button with expanded state, accessible focus handling and a visible primary CTA within the opened menu.


### Client Routes

/portal shows projects and urgent actions. /portal/projects/{id} shows overview and timeline. Child routes /files, /approvals, /messages and /billing group the corresponding records. /portal/projects/{id}/services shows domain, hosting and business email records. /portal/subscriptions shows maintenance plans. /portal/support lists tickets and /portal/settings manages profile and notification preferences. A direct link must retain its destination through authentication.


### Admin Routes

/admin opens the operations overview. /admin/leads provides the intake queue; /admin/projects provides delivery management. /admin/orders, /admin/domains, /admin/hosting, /admin/subscriptions, /admin/clients, /admin/invoices, /admin/payments, /admin/support, /admin/content, /admin/team, /admin/analytics and /admin/settings are permission-filtered work areas. Detail pages use stable record identifiers, never an email address in the URL.


### Service Page Template

Include the service outcome, deliverables, prerequisites, suitable use cases, exclusions, process, related work and one primary CTA. Pass the selected service into the configurator while allowing the visitor to change it. Hosting pages must distinguish a managed service inquiry from instant hosting activation.


### Shared Page States

Provide branded 404 and recovery links, a recoverable server-error page and an offline notice for actions that cannot complete. Preserve form content on recoverable failures. Empty lists explain what happens next; they must not display fabricated records. Skeletons reserve layout space; loaders have an accessible status label.


### Acceptance

Every header, footer and primary CTA has a working destination. Back navigation preserves filters and configurator selections. Private pages do not appear in search indexing or public sitemaps. Mobile navigation works entirely by keyboard and closes on Escape.


## Homepage requirements


### Hero And Trust

Use “YOUR WEBSITE. LIVE IN 5 HOURS.” with the supporting line “From logo and branding to development, hosting and deployment. Everything your business needs to go online.” Primary CTA opens /build; secondary CTA opens /work. An animated browser composition illustrates Brief, Logo, Wireframe, Design, Development and Live. Include a visible qualification: “For eligible standard websites after your brief, assets and payment are ready. See how it works.”


### Metrics

Display the exact four requested values: 29+, 98%, < 5 Hrs and 24/7, with their established labels. Store labels and values in editable content records. Numerals reveal once on entry; the final values are available to assistive technology immediately. Treat the values as owner-supplied marketing claims, not measurements generated by this project. Keep internal evidence and review-date fields for each claim.


### Services And Process

Follow the master plan order: Hero, Metrics, Capabilities, How 5 Hours Works, Services, Featured Builds, Configurator Preview, Logo-to-Live Story, Packages, Why CWS, Testimonials, FAQ, Final CTA and Footer. The capabilities strip includes design, development, branding, domains, hosting, e-commerce and support. The process explains eligibility; services use interactive visual choices.


### Work And Configurator

Show two or three approved featured projects with large browser previews, project title, sector and services. Hover may reveal more of a page; touch devices show a stable preview. A preview of the configurator shows visual style choices and a CTA. The full configurator begins only when the visitor selects the CTA.


### Offer And Reassurance

After the configurator preview, tell the “YOU BRING THE BUSINESS” story through Brand, Design, Build and Launch, ending with “WE HANDLE EVERYTHING ELSE.” Then compare CWS Start, CWS Business, CWS Commerce and CWS Custom. Follow with concrete reasons to choose CWS: one coordinated process, responsive layouts, visible project progress and launch support. Show testimonials only where genuine text, attribution and display permission exist. Present FAQ and the final “Let’s build something exceptional” CTA before the footer.


### Content Rules

Do not invent client logos, staff biographies, project outcomes or reviews. Concept portfolio work is visibly labeled “Concept project”. Never imply that generated design examples are completed client work. Contact links must use configured destinations; incomplete channels are hidden. “24/7 Support” describes the requested service claim; response commitments must be stated separately in the approved service policy.


### Acceptance

At 390 px width the hero, CTAs and metric labels are legible without horizontal scrolling. With motion disabled, all content is visible and every action still works.


## Portfolio and commercial content


### Portfolio

Each project record requires title, slug, project type, industry, summary, services, cover image and image descriptions. Optional fields include approved client name, live URL, actual delivery duration, desktop/tablet/mobile images and measured outcomes. Publication requires an explicit permission flag. Drafts never appear publicly.


### Case Study

Present the business need, CWS scope, design decisions, delivered features and device previews. Show “Delivery: 5 Hours” only for a project with that recorded duration. External live-site links open with clear labels. When no genuine work is ready, display labeled concept work and invite a consultation; do not create fictional client testimonials.


### Master Plan Packages

CWS Start delivers a simple professional responsive website with contact/WhatsApp integration and deployment. CWS Business expands pages and features with branding, SEO, analytics and domain/hosting setup. CWS Commerce provides products, cart, checkout, payments and order management. CWS Custom covers marketplaces, SaaS products, portals, dashboards and complex systems. Proposed sizing defaults are one page with up to six sections for Start and up to five informational pages for Business; Commerce and Custom always receive scoped estimates.


### Pricing Behavior

Configured fixed-scope packages show an instant estimate with itemized add-ons; unpriced or complex selections show “Request a quote”. Until amounts and currency are configured, every package displays “Request a quote” and scope inclusions. Do not use zero as a missing-price substitute. A package selection pre-fills /build. The accepted quote fixes scope, currency, tax, fees, payment schedule, revision allowance, dependencies and expiry; later catalog edits do not modify accepted quotes.


### Contact

Fields: name (2–100 characters), email (valid, at most 254), subject (5–150) and message (20–3000). Optional phone accepts an international format. Require acknowledgement of the privacy notice; marketing consent is separate and unchecked. Provide accessible inline errors, rate limiting and an abuse challenge only when needed. Persist the inquiry before confirmation; email failure does not erase it.


### Faq

Cover eligibility for five-hour delivery, required assets, revisions, domain ownership, hosting renewal, ongoing care, custom applications, payment steps and post-launch changes. Answers must match the selected package and service terms. Editing an FAQ invalidates the public content cache.


### Acceptance

Package CTAs preserve the selected package. Unpublished projects return no public content. Missing optional fields leave no empty labels. A repeated contact request with the same submission key creates one inquiry and one confirmation record.


## Configurator stages and inputs


### Eight Stages

Preserve the master plan sequence: Your Business, Website Type, Website Requirements, Design Direction, Branding, Content, Domain and Hosting, Review and Submit. Show “Step 4 of 8” with the current stage name. Back preserves values; Review links to any stage. Progressive fields may appear within a stage without inventing a different stage count.


### Stage 1 Your Business

Require business name (2–120 characters), industry, description (20–2000), location (city and country), contact name (2–100) and valid email (at most 254). Phone and existing HTTP/HTTPS website are optional. International phone format is required when WhatsApp is selected as the contact method. Do not require account creation before completing the brief.


### Stages 2 And 3 Type And Requirements

Types are Corporate, E-commerce, Portfolio, Restaurant, Real estate, School, Landing page, Booking website and Custom. Requirements include page selection, forms, WhatsApp, M-Pesa, card payments, booking, maps, blog, analytics and SEO, plus Other. Page names are limited to 60 characters and 20 requested pages. Additional pages beyond the package are add-ons. Integration choices trigger dependency questions and eligibility checks.


### Stage 4 Design Direction

Offer eight visual choices: Minimal, Corporate, Luxury, Bold, Creative, Technology, Dark and Elegant. Select one preferred style or “Guide me”. Capture a palette choice, custom six-digit hex colors or existing brand colors, plus up to three optional reference URLs. Style examples illustrate a preference and do not authorize copying third-party designs.


### Stages 5 And 6 Branding And Content

Branding choices are Existing identity, New logo, Full brand identity and Refresh identity. Content choices are Ready, Provide later and Create content for me. Accept logo, images, company profile, catalog, menus and PDFs. Capture required copywriting and graphics as add-ons. Incomplete content allows submission but prevents the delivery clock from starting.


### Stage 7 Domain And Hosting

Domain choices are Existing domain, CWS domain assistance and Need advice. Validate hostname syntax and label availability “Not checked” until verified. Hosting choices are Existing hosting, CWS managed hosting and Need advice. Business email choices are Existing email, New professional email and Not required; capture requested mailbox count. Access is later granted through secure invitations, never plaintext passwords.


### Stage 8 Review And Submit

Group all answers, package, add-ons, uploaded files and an itemized estimate or quote-request message. Require privacy acknowledgement and an explicit final submit action. State what is included, what requires review and whether the five-hour offer applies. The button reads “Submit my project brief”. Submission creates backend records and a confirmation reference.


## Submission reliability and files


### Drafts

Save non-sensitive configurator answers locally after changes and show “Saved on this device”. Drafts expire after 30 days; provide a clear Reset action. Do not store file binaries, private notes or passwords in local storage. Before server submission the visitor can resume only on the same browser. Authenticated server-side draft sync is a later enhancement.


### Validation

Validate on Continue and again on the server. Keep field values and move focus to an error summary with links to invalid inputs. Required selections use text labels, not color alone. Custom colors must match six-digit hex syntax. Strip executable markup from free text. Count character limits consistently on the client and server.


### Uploads

Allow PNG, JPG, WEBP, PDF, DOCX and TXT, plus SVG logos after sanitization. Maximum 10 files, 20 MB per file and 100 MB per submission. Validate actual file type, randomize storage keys, scan uploads and quarantine until safe. Show filename, size, progress, remove, retry and rejection reason. Staff cannot download quarantined files. No public bucket or executable HTML uploads.


### Submission Transaction

The client creates an idempotency key for the submission attempt. The server validates answers and file ownership, stores the immutable brief version, creates linked lead, pending order and project records in New status, and a reference such as CWS-2026-1048, then queues confirmation and staff notification events. The reference is not an access credential. A repeated request returns the existing result instead of duplicating the lead.


### Success And Failure

Success reads “Your project brief is received” and shows the reference, summary, next step and a printable receipt. Do not say that production has begun. If persistence fails, show a retry action and preserve the draft. If email fails after persistence, keep the success state and let staff see notification failure. A timeout must permit safe retry without losing a successful submission.


### Conversion To A Project

Admin reviews the brief, asks for missing information, proposes a scope and quote, then activates the existing project and order using the same source brief after scope and payment requirements are met. Activation is idempotent; it never creates a second project. Invite the client to verified portal access in P1. Every submission already has a project record; an unverified visitor receives a secure claim invitation for portal access. P0 staff-only follow-up is restricted to internal testing.


### Acceptance

Test refresh on every step, Back, invalid inputs, interrupted upload, rejected file, double click, network timeout, server failure, email failure and duplicate submission. Each successful submission yields exactly one lead, one pending order, one project, one reference and a durable audit record.


## Delivery and approvals


### States

Lead states are New, Reviewing, Awaiting information, Quoted, Converted, Closed and Spam. Internal project states follow the master plan: New, Assigned, Designing, Development, Client Review, Changes, Ready and Live. On hold and Cancelled are exception states. Readiness and approval are separate gates, not replacement workflow labels. Only authorized staff advance delivery states; client actions produce approval or change-request events. Client stages are Branding, UI Design, Development, Client Review, Changes, Ready and Live; display New and Assigned as preparation before the first stage.


### Five Hour Policy

Proposed eligibility is a standard CWS Start or informational CWS Business website within the accepted package, with complete assets, agreed scope, required payment confirmed and a delivery slot accepted by CWS. Commerce, custom integrations and applications use an explicit custom timeline. The five-hour target starts when staff records “Start build”, after every prerequisite is satisfied; the agreed target is less than five hours of eligible active delivery time. Show the recorded start and target time in the client’s local timezone.


### Pauses And Overruns

Pause the delivery clock only for an explicit client dependency or agreed scope change, recording the reason, start and end. Internal staffing delays do not silently pause it. Retain both wall-clock duration and active build duration. When the target is missed, show “Delivery update required”, notify the assigned lead and provide a revised target with a reason. Never reset the original timing record.


### Deliverable Approval

Each deliverable has a type, version, preview, owner and client-visible description. Client actions are Approve this version or Request changes with a required comment. Approval captures actor, timestamp and version identifier. Uploading a new version marks that version unapproved without deleting earlier decisions. Launch requires approval of the current launch version.


### Revisions And Scope Changes

Default package proposal includes two consolidated revision rounds. An out-of-scope change generates a separate change request with scope, cost and timing impact. Work on the extra scope begins only after recorded acceptance. A dispute over scope goes to an administrator; the system must not charge automatically.


### Launch And Handover

The launch checklist records responsive review, form delivery, approved metadata, correct domain, HTTPS, backup, client approval and payment condition satisfaction. Mark Live only after the public URL passes a check. Handover includes agreed source or ownership transfer, access invitations, domain ownership notes and the support start date. Never send credentials as a project comment.


### Acceptance

An unready project cannot start its clock. Approval for version 1 cannot authorize version 2. Reassigning staff preserves timing and history. Cancelled projects are read-only except for authorized billing and record corrections.


## Client portal experience


### Dashboard

Lead with “Your next action” and show project name, status, next milestone, target date and unread messages. If no action is needed, explain the current team activity. New accounts with no projects receive a useful empty state and Build My Website link. Show overall progress percentage calculated from approved milestone weights and completed checks, alongside the current stage. The calculation and rollback behavior are defined under orders and progress; staff cannot type arbitrary percentages.


### Project Overview

Show project name, reference, accepted scope, assigned contact, progress percentage, latest update, milestone timeline and delivery-clock status. Include domain, hosting and completed brand-asset links. Timeline entries distinguish internal events from client-visible updates; clients see only the latter. Link directly to pending approvals and invoices. Dates display a timezone label where timing matters.


### Files

Group files into Client assets, Deliverables and Handover. Show version, uploader, time and scan status. Preview safe images and PDFs, otherwise offer an authorized download. Files in active approval records cannot be destructively replaced. Removing an asset records a tombstone and preserves its audit relationship.


### Messages

Provide a chronological project conversation with attachments, sender identity and unread state. Send must handle retries without duplicate messages. Announce successful send accessibly. Show when an attachment is being scanned. Email notifications link back to the portal and do not attach private project assets.


### Approvals And Billing

The approval screen gives sufficient preview context and a confirmation dialog naming the version before final approval. Billing lists quotes, accepted versions, invoices and payment status independently from project status. A client can download records and report a payment problem. A browser payment-return page never marks an invoice paid by itself.


### Support

Create tickets with category, subject, description, project and optional attachment. Categories are Website issue, Hosting, Billing, Change request and General. States are Open, In progress, Waiting for client and Resolved. Clients may reopen a resolved ticket within seven days; later replies create a linked new ticket. Published response expectations come from the active support policy.


### Notifications

Notify on brief receipt, information request, quote ready, payment result, milestone update, approval request, client reply, launch and support reply. Let clients opt out of nonessential progress emails while retaining required account and transaction notices. Avoid revealing message content in email subject lines.


### Acceptance

Every pending action links to its record. Failed sends preserve text. The portal works on a 360 px screen and with keyboard navigation. A stale approval screen must reject an action on an obsolete version and show the newest version.


## Administration and finance


### Operations

Overview shows unassigned leads, projects waiting on clients, delivery targets at risk, pending approvals and failed notifications. Lead and order lists filter by state, date, package, service and assignee. Domain, hosting and subscription views show renewal dates, ownership and action required. Project list filters by state, owner and target date. Sort and paginate server-side with 25 rows per page; retain filters when returning from a detail view.


### Record Management

Staff can assign leads, request information, create quote versions and activate accepted orders and projects. Duplicate lead detection warns on matching contact and similar brief but never merges automatically. Bulk assignment requires a review of selected records. Destructive actions require explicit record names and create audit events.


### Content Management

Editable objects include services, packages, projects, FAQ, homepage sections, contact channels, policy versions and metric claims. Use draft, preview and publish states. Publication validates required fields and image descriptions. Record who published and when; permit rollback to the previous published version. Preview URLs are authenticated or short-lived and never indexed.


### Quote And Invoice Model

Quote statuses are Draft, Sent, Accepted, Declined and Expired. Proposed validity is 14 days. Invoices store line items, currency, subtotal, discount, tax, total, paid amount and balance. Store monetary values in minor units, never floating point. Use one currency per invoice. Deposit percentage and tax rules are quote configuration, not hidden system assumptions.


### Payments

Initial default supports an administrator-entered payment record after external verification, including amount, date and external reference. Production online checkout is enabled only after a payment provider and credentials are configured. Verify signed webhooks, reject replays and reconcile amount, currency and invoice before applying payments. Use unique provider-event identifiers. Pending, failed, partially paid and refunded states remain distinct.


### Refunds And Audit

Refunds require an authorized owner action with amount and reason and a provider result or verified manual record. Do not delete the original payment. Audit actor, action, entity, timestamp, previous/new values and request identifier for permissions, quotes, payments, approvals and publication. Audit records are append-only and omit secrets.


### Acceptance

A duplicate payment event cannot double-credit an invoice. Overpayment is flagged for review. Expired quotes cannot be accepted without renewal. Publishing content does not modify accepted commercial records. A delivery staff member cannot execute finance operations through direct API calls.


## Data and integration contract


### Core Records

User stores identity and account status. Organization owns Projects and memberships. Lead owns contact information, a Brief version and source. Order links its Lead, Brief, package snapshot, add-ons, estimate and commercial status. Project links the Order, client Organization, accepted Quote, assignees and delivery status. DomainRecord, HostingRecord, EmailService and Subscription belong to the client Organization and optionally a Project. Milestone and DeliveryClockEvent preserve delivery history. FileAsset stores ownership, storage key, checksum, type and scan state. DeliverableVersion references files; Approval references one version and actor.


### Communication And Commerce

Message belongs to a Project and has visibility and attachment references. SupportTicket belongs to an Organization with an optional Project. Quote has immutable sent versions; QuoteAcceptance refers to one version. Invoice has line items and Payment allocations. Notification stores channel, destination, event and delivery attempts. ContentRevision and AuditEvent capture publication and sensitive changes.


### Api Behavior

POST /api/briefs creates the lead, pending order and project atomically using an idempotency key. POST /api/estimates returns versioned itemized prices or a quote-required result. POST /api/uploads/init authorizes a bounded upload; POST /api/uploads/{id}/complete queues scanning. GET /api/projects and GET /api/projects/{id} enforce membership. POST /api/projects/{id}/messages and POST /api/deliverables/{id}/approvals require current permissions and record versions. POST /api/webhooks/payments verifies provider authenticity before processing.


### Error Contract

Use consistent machine codes and user-readable messages for validation errors, unauthorized access, conflicts, oversized files, rate limits and service failure. Return field errors by stable field name. Use optimistic concurrency for project state, quote edits and approvals; a stale version yields a conflict and refresh path. Responses must never expose stack traces or storage credentials.


### Service Boundaries

Use a server-rendered public frontend, authenticated application API, relational database, private object storage and asynchronous job queue. This is an architecture requirement rather than a binding vendor choice. Keep content publishing independent of project operations. Isolate email, payment, registrar and hosting providers behind adapters so changing a provider does not change the product records.


### Jobs And Retries

Commit domain changes and notification outbox events in the same database transaction. Retry email at 1, 5 and 30 minutes, then mark failed for staff review. File scanning and webhook handling also require deduplication. Operators can retry a failed job without generating new invoices, leads or messages.


### Retention Defaults

Proposed defaults: unsubmitted server upload sessions expire after 24 hours; unconverted leads are reviewed for deletion after 12 months; completed project assets after 24 months. Billing and audit retention follow the configured business policy. Deletion requests create an owner review task and record what is retained and why; no automatic removal of accounting evidence.


## Visual system and accessibility


### Identity

Use CWS as the primary wordmark and CHACHA WEB SERVICES as the full-name descriptor. The descriptor may be omitted at small sizes. Future extensions are CWS Hosting, CWS Domains, CWS Commerce, CWS Cloud and CWS AI. Explore three marks: Frame, an open browser frame with a rising corner; Flow, a continuous geometric monogram; Signal, a typographic wordmark with a restrained launch accent. Frame is the recommended starting direction because it relates directly to websites and remains usable as a compact icon. Logo exploration is not trademark clearance.


### Color And Type

Ivory #F4F5F0 is the primary canvas; stone #D9DDD5 separates supporting areas; forest #073F32 is the primary action and signature section color; charcoal #171918 is body text and dark background; white #FFFFFF is a clean surface. Use a geometric sans-serif for headings and a highly legible sans-serif for body text. Proposed font direction is Manrope headings and Inter body, with system sans-serif fallbacks and approved font files before launch.


### Layout Tokens

Desktop content width is 1280 px with 64 px outer padding; tablet padding is 32 px and mobile is 20 px. Use 12 columns desktop, 8 tablet and 4 mobile. Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96 and 128 px. Card radius is 12 px, fields 8 px and buttons 8 px. Section spacing is 96 px desktop and 56 px mobile. Avoid heavy shadows and unnecessary capsules.


### Components

Define primary, secondary and text buttons; text, email, phone and URL fields; selects; radio cards; checkboxes; upload rows; progress indicators; tabs; accordion; dialog; toast; status badge; timeline; invoice rows and data table. Each has default, hover, focus, disabled, loading and error states where relevant. Button minimum height is 48 px and form controls retain visible labels.


### Motion

Use 160–220 ms for control feedback and 350–500 ms for section reveals. Play metric reveals once. Hero animation must offer pause if it runs longer than five seconds. Do not hijack native scrolling, conceal the cursor or make a task depend on hover. Reduced-motion preference disables parallax, counters and long transitions while retaining all information.


### Accessibility Target

Target WCAG 2.2 AA. Validate normal-text contrast at 4.5:1 and large text at 3:1, keyboard operation, visible focus, heading order, image alternatives, error association and 200% zoom. Use descriptive status text rather than color alone. Dialogs trap focus while open and restore it when closed. All interactive targets should provide at least a 44 by 44 px usable area.


### Responsive Acceptance

Check 360, 390, 768, 1024 and 1440 px layouts. No content loss or page-wide horizontal scroll. Dense administrative tables may scroll within a labeled region; priority information and row actions remain reachable.


## Quality performance and measurement


### Performance

Target Largest Contentful Paint within 2.5 seconds, Interaction to Next Paint within 200 ms and Cumulative Layout Shift at or below 0.1 at the 75th percentile when field data is available. Before launch, test on a throttled mobile profile. Keep the initial compressed JavaScript budget under 200 KB on the homepage and hero imagery under 300 KB. Lazy-load below-fold previews; reserve image dimensions and load essential content without animation dependencies.


### Security And Privacy

Use HTTPS, secure HttpOnly cookies, CSRF protection where applicable, server validation and restrictive upload handling. Rate-limit login, intake and contact endpoints. Do not log secrets or raw private brief content. Separate development, staging and production data. Keep secrets in server configuration. Test authorization boundaries and invite expiry before each release.


### Reliability

Proposed operational target is 99.9% monthly availability for intake and portal APIs. Back up the database daily and object storage according to its versioning policy. Proposed recovery objectives are 24-hour maximum data loss and eight-hour service restoration. Prove a restore in staging before P1 launch. Alert staff on intake failures, payment mismatches, queue backlog and repeated email failures.


### Search And Sharing

Public pages need unique titles, descriptions, canonical URLs, meaningful headings, social preview images, sitemap and robots configuration. Use actual business details in structured data; do not manufacture ratings. Private, preview and receipt pages are noindex. Redirect changed public slugs and retain useful 404 behavior.


### Analytics Events

Capture CTA clicked, configurator started, screen completed, validation failed, brief submitted, quote sent, quote accepted, project started, approval requested, project launched and support ticket created. Use pseudonymous identifiers and a schema version. Do not send free-text briefs, names, email addresses or file names to analytics. Apply the configured consent policy before nonessential tracking.


### Product Metrics

Measure submitted briefs divided by configurator starts, visitors reaching /build, median completion time, validation abandonment by screen, qualified-lead conversion, quote acceptance and eligible projects delivered within target. Measure client satisfaction from a defined survey and response count, separately from the public 98% claim. Establish the first 30 days as the baseline before setting conversion improvement targets.


### Reference

Accessibility implementation reference: W3C WCAG 2.2, https://www.w3.org/TR/WCAG22/. Performance measurement reference: https://web.dev/articles/vitals. These define verification terminology; the thresholds above are CWS product acceptance targets.


## Acceptance and launch checklist


### P0 Required Scenarios

P0-01: A mobile visitor navigates services, portfolio and packages, then submits a complete brief. P0-02: An incomplete brief shows precise errors and retains every valid answer. P0-03: A repeated submission and timeout create one lead. P0-04: Rejected or quarantined files never become downloadable. P0-05: A failed confirmation email leaves the lead intact and creates a staff-visible retry state. P0-06: Keyboard and reduced-motion users complete the same journey.


### P1 Required Scenarios

P1-01: Client A cannot access Client B’s project by changing a URL or file identifier. P1-02: A quote is accepted as an immutable version. P1-03: An unready project cannot start its clock. P1-04: An approval applies only to the displayed deliverable version. P1-05: Payment retries and duplicate events do not duplicate credit. P1-06: Staff reassignment and account revocation retain history. P1-07: Backup restoration recovers a complete sample project and its file references.


### Content And Brand Review

Check the exact hero, four metrics and five palette values. Confirm package exclusions, timing qualifiers and contact destinations. Verify portfolio permissions and concept labels. Remove empty testimonials. Confirm the selected logo works on ivory and green, at 24 px icon size and in monochrome. Ensure all published images have useful alternatives.


### Operational Readiness

Owner reviews published policies, claim evidence and support commitments. Configure production email authentication, notification recipient, domain, storage, backups and monitoring. Seed staff roles and verify multifactor access. Perform a real end-to-end inquiry and a controlled payment reconciliation test where payments are enabled. Record release version and rollback procedure.


### Release Control

The CWS owner accepts business content and brand choice; the product implementer records functional verification; the delivery lead verifies intake and launch workflow. Commercial release requires both P0 and P1 acceptance scenarios to pass. An internal P0 milestone is not permission to omit master-plan capabilities. Open defects must state affected journey, severity and workaround. Authentication bypass, lost submissions and incorrect payment state block release.


### Deliverables For Implementation

This PRD is the functional baseline. The companion design pack supplies logo exploration, homepage visual direction, interface compositions, color tokens and asset instructions. Design mockups illustrate hierarchy and styling; this PRD controls behavior, permissions and truthful states. Future changes update the affected requirement and acceptance scenario together.


### Source Basis

The primary source is CWS_Master_Plan.docx, Master Website and Business Concept, sections 1–18 and all service, homepage, metric, color and package tables. The pasted conversation supplements visual direction and the exact metrics. The source traceability section maps the plan to this specification. Operational limits and implementation policies remain proposed defaults.


## Service catalog and add ons


### Brand And Design

SC-01 Logo and Brand Identity delivers logo concepts, selected logo, color system, typography and brand direction. SC-02 Website Design delivers wireframes, interface design, responsive layouts and redesigns. Branding-only orders enter the same brief, quote, files and approval system without requiring a website deployment milestone. Full brand identity includes a compact usage guide and approved asset exports.


### Build And Commerce

SC-03 Website Development covers corporate sites, landing pages, portfolios, blogs and business websites. SC-04 E-commerce covers product catalog, cart, checkout, online payment and order management. SC-05 Custom Web Applications covers portals, dashboards, marketplaces, booking systems and internal tools. Capture technical dependencies and volumes during scoping; do not promise standard five-hour completion for these complex products.


### Content And Assets

SC-06 Content Creation covers headlines, website copy and product/service descriptions. SC-07 Graphics and Visual Assets covers banners, icons and launch graphics. Capture asset ownership, usage permission, requested languages and client review responsibility. Content-created-by-CWS is an explicit order line with deliverables and approval, rather than a silent assumption that supplied content exists.


### Infrastructure

SC-08 Domain and Hosting covers registration assistance, DNS, hosting, SSL and deployment. SC-09 Business Email covers email setup on the client domain, mailbox quantity and migration scope. Record the client as domain owner unless an accepted agreement states otherwise. Store provider references and administrative contact details without exposing secrets to project records.


### Integrations And Care

SC-10 Payments and Integrations includes M-Pesa, cards, payment gateways, WhatsApp, maps, CRM and third-party APIs. SC-11 SEO and Analytics includes technical SEO, metadata, sitemap/indexing setup, analytics and conversion tracking. SC-12 Maintenance and Support includes updates, backups, monitoring, bug fixes and ongoing assistance under an agreed plan.


### Add On Catalog

Catalog entries include logo design, additional pages, copywriting, professional email, M-Pesa integration, booking, advanced SEO, content/graphics and monthly website management. Each entry has code, label, description, billing mode, unit, price/currency when fixed, dependencies, delivery impact and active status. Add-on selection must update both estimate and readiness requirements.


### Acceptance

Every master-plan service has a public explanation, an intake selection path and an order representation. Standalone branding and maintenance inquiries can complete the flow. Selecting business email captures quantity; selecting content creation creates a reviewable content deliverable.


## Estimates orders and project progress


### Instant Estimate

Calculate base package plus quantity-based add-ons from a server-owned catalog version. Show currency, subtotal, discounts, tax treatment, recurring items and total. Separate one-time cost from monthly or annual cost. Estimate expiry defaults to seven days; refresh expired estimates before quote generation. Store the selection and price snapshot used for the submitted brief.


### Quote Required

Return “Custom quote required” when a package or selected add-on lacks a configured price, prerequisites are unknown, or custom scope is selected. Do not display an incomplete numerical total as the total project cost. A fixed portion may be labeled “Known items only” while awaiting a full quote. An estimate does not charge a card or bind a delivery slot; quote acceptance confirms the commercial scope.


### Order Lifecycle

Orders use Draft, Submitted, Under review, Quoted, Accepted, Awaiting payment, Active, Fulfilled and Cancelled. Submission creates a Submitted order and New project, even before a verified account exists. A secure invitation attaches access to the correct client identity; matching an unverified email never grants access to an existing organization. Keep quote status, payment status, order status and delivery status separate.


### Project Progress

Use proposed milestone weights: Branding 15%, UI Design 25%, Development 35%, Client Review 10%, Changes 5%, Ready 5% and Live 5%. Complete a milestone only after its required checks pass. If branding is not ordered, redistribute its weight proportionally across applicable milestones and save that schedule at activation. A no-change approval satisfies the Changes milestone without requiring artificial rework.


### Progress Corrections

Show “40% complete” only when the approved weighted checks total 40%. Reopening an incomplete milestone recalculates progress, records why and informs the client. Live requires the actual deployment URL check and completed handover gates; reaching a percentage alone cannot set Live. The portal always displays the stage alongside the percentage.


### Estimate And Order Acceptance

An additional page increases the itemized estimate exactly once. A recurring add-on never silently increases the one-time subtotal. An unpriced M-Pesa integration switches to quote-required. A double submit creates one order and project. Updating public prices does not alter a submitted snapshot or accepted quote.


### Custom Projects

Marketplaces, SaaS, portals and dashboards require a discovery deliverable and separately accepted schedule. Record the same milestone model with explicit custom weights if necessary, disclose the weights to the client and retain the accepted version. No automatic five-hour timer appears for ineligible work.


## Domains hosting subscriptions and integrations


### Domain Record

Store domain name, client owner, registrar, registration and expiry dates, renewal mode, renewal price/currency when known, DNS status and linked project. States are Requested, Awaiting access, Active, Expiring, Expired and Transferred. Client sees status and renewal actions; staff sees assigned responsibility. An inquiry never represents completed registration or verified availability.


### Hosting And Business Email

Hosting stores provider, plan, environment URL, activation date, renewal date, SSL state, backup policy and service state. Business email stores domain, provider, mailbox count and setup status. Show client-visible setup instructions and record secure access invitations; do not store mailbox passwords or registrar credentials in notes. Initial launch supports staff-managed fulfillment with documented verification.


### Maintenance Subscriptions

Each subscription records plan, included tasks, exclusions, billing interval, amount/currency, start, next renewal and cancellation policy. States are Pending, Active, Past due, Cancel at period end, Cancelled and Expired. Cancellation stops future renewal and shows the effective end date; it does not silently delete a live website. Hosting suspension requires explicit policy and owner review.


### Renewal Notifications

Proposed reminder schedule is 30, 7 and 1 day before renewal, deduplicated per record and date. Record provider acknowledgement before marking a domain renewed. Failed renewal creates an urgent operations task. Automatic provider provisioning and automatic recurring charging remain future automation; manual subscription records, renewal reminders and invoice linkage are required at commercial launch.


### M Pesa And Other Integrations

Website requirements may request M-Pesa, cards, WhatsApp, maps, CRM or other APIs. Capture provider, use case and account-readiness status without credentials. CWS fee collection is a separate integration from adding payments to a client website. CWS checkout supports the configured provider or verified manual payment; do not imply live M-Pesa checkout until its production connection is tested.


### Knowledge Content

Add /help and /help/{slug} with categories Getting started, Project reviews, Domains and hosting, Billing and Website care. Articles have title, summary, content, category, reviewed date and published state. Search public titles and summaries; never index private tickets. Link relevant articles from support without preventing ticket creation.


### Acceptance

Clients see only their own service records. Renewal reminders cannot duplicate on retry. Expired service records remain visible with an actionable state. Cancellation dates, recurring totals and invoice periods agree. Missing provider setup produces a service-request state, never a false success.


## Master plan traceability and decisions


### Master Plan Sections 1 To 4

Executive Concept maps to Product requirements and Scope. What CWS Delivers maps to the twelve-item Service catalog. Core Website Features maps to Routes, Portal, Administration, Orders and Managed services. Build My Website maps to the eight stages in Configurator stages and inputs, preserving every website type, feature and style choice.


### Master Plan Sections 5 To 9

Client Portal maps to portal requirements, percentage calculation and managed services. CWS Admin maps to administration, structured submission records and order management. Homepage Structure maps to the exact fourteen-section sequence. Hero Direction maps to the required headline, supporting copy, two CTAs and browser animation. Metrics maps to the exact four supplied figures and labels.


### Master Plan Sections 10 To 14

Visual Identity maps to tokens, motion and accessibility, with the five exact colors. Portfolio maps to case studies and device previews. Service Packages maps to CWS Start, CWS Business, CWS Commerce and CWS Custom plus add-ons. Revenue Model maps to one-time orders, recurring subscriptions and custom discovery. Trust maps to content evidence, permissions, scope and service policies.


### Master Plan Sections 15 To 18

Five-Hour Delivery maps to eligibility, readiness, clock events and overrun handling. Future Platform maps to P2: AI drafts, preview generation, AI content, client customization and automated domain/hosting provisioning. Architecture maps to the four connected experiences. Brand Summary maps to the Chacha Web Services identity and premium design system.


### Established Product Decisions

Keep the full brand name, package names, eight-stage configurator, website types, eight style options, all twelve services, progress percentage, client tracking, domain/hosting information, admin orders and subscriptions. Each successful brief immediately creates a structured backend project and notification event. Commercial launch includes the portal and administration capabilities in the master plan.


### Proposed Implementation Defaults

Page limits, character and upload limits, price expiry, revision rounds, milestone weights, retention periods, reminder cadence, security policies and performance budgets are implementation proposals. They make the PRD executable without representing existing business policy. Where price amounts or provider configuration do not exist, the defined fallback is quote-request or staff-managed fulfillment.


### Design Alignment

Logo and interface artwork are concept deliverables. The full-name descriptor is CHACHA WEB SERVICES. The product screen and mobile layouts use Step 4 of 8 for Design Direction. Homepage concept artwork shows selected visual sections; implement the complete sequence and approved delivery qualifiers from the PRD rather than copying every illustrative caption.
