# Client and admin workspace

## Entry points

- `/portal`: client dashboard; only projects owned by the verified email are accessible.
- `/admin`: administrator dashboard; identity must match `ADMIN_EMAILS` and complete email verification.
- `/login` and `/signup`: single-use email links. No shared or default admin password.

The requested owner identity is `project@cws.com`. It is configured in the ignored local `.env` as `ADMIN_EMAILS` and `STAFF_EMAIL`. Configure these environment values separately on deployment. SMTP and the mailbox must exist for real sign-in emails; development links remain disabled on the regular previews.

## Implemented

Dashboard totals, progress pipeline, outstanding balances grouped by currency, recent project messages, open tasks and latest pending design reviews. Searchable/paginated admin client directory, project drilldown, cross-project billing list, full briefs and client contact links. Project priority, target date and configured administrator assignment use optimistic version checks. Tasks are assigned to Team or Client; clients may update only their own project’s Client tasks. Team notes are admin-only and their content/events are excluded from client responses. Support threads allow replies and reopen resolved tickets when a new reply arrives. Profile name/company/phone can be updated without changing verified email or project ownership. Other-device session revocation preserves the current session. Final design approval is restricted to clients.

The site continues to support project messages, invoices/manual payments, design versions, quarantined file metadata and domain/hosting records. It does not yet process payments, release quarantined files or send mail without provider configuration.

## Database

SQLite with WAL and foreign keys, stored in `DATA_DIR/cws.sqlite` (`data/cws.sqlite` by default). Migrations run automatically at startup and can also run with `npm run db:init`. Migration 1 adds profiles, project scheduling, tasks, internal notes, ticket replies and indexed lookup paths. Existing project and financial records are retained. Money is stored as integer minor units; currencies are never added together in dashboard balances.

`npm run db:backup` uses SQLite's online backup API and opens the snapshot for an integrity check. Snapshots are timestamped in `DATA_DIR/backups`. Restrict filesystem access and copy backups to an appropriate protected off-device location in production. This command does not schedule backups or copy uploaded files.

### Restore procedure

1. Stop all CWS processes using this database.
2. Preserve the current database, WAL/SHM companion files, and uploads directory together in a separate recovery folder.
3. Copy the selected verified snapshot into a fresh data directory as `cws.sqlite`; copy the matching uploads directory from your file backup if required. Do not reuse old WAL/SHM files with a restored snapshot.
4. Point `DATA_DIR` at the restored directory and run `npm run db:init` to check integrity and apply any newer migrations.
5. Start one app instance and verify a known project and its billing records before reopening access.

Deployment remains a single application host with persistent storage; horizontal replication is not configured.

## Photography

Added locally served Unsplash photos of collaboration, a team at laptops and product photography: `photo-1516321318423-f06f85e504b3`, `photo-1522071820081-009f0129c71c`, `photo-1542291026-7eec264c27ff`. Images appear in homepage feature/story sections and introductions for services, packages, process, work, about and contact. These are illustrative photographs, not claims of CWS staff or client work.

## Validation

API suites cover ownership isolation, admin denial, staff-note privacy, task role restrictions, stale schedule/task writes, invalid dates, support ownership and reopening, profile persistence, grouped currencies, session revocation, client-only approval, migrations and reopen integrity. Browser coverage includes authenticated admin/client workflows and mobile overflow checks, alongside the existing website and brief flows. Dashboard screenshots use isolated sample data, never seeded into the live preview database.
