# Chacha Web Services

CWS website and connected project workspace, based on [the product requirements](docs/PRD.md) and the CWS Master Plan. The supplied **logo 3** is used unchanged. Forest green and ivory remain the primary palette, with restrained gold from the logo.

## Run locally

Requires Node.js 24 or newer.

```sh
npm ci
cp .env.example .env
npm run dev
```

On PowerShell use `Copy-Item .env.example .env`. Open `http://localhost:5173`. The API runs on port 3001. The application reads `.env` automatically. Persistent SQLite records and private uploads live under `DATA_DIR` (default `data/`), which is excluded from Git.

For local sign-in testing only, set `DEV_AUTH_LINKS=true` in `.env`. The sign-in screen then exposes a development link. Production ignores this flag. Set `ADMIN_EMAILS` to the owner email to grant administrator access after verification. Do not ship test identities or seed customer records.

## Included in this first implementation

- Responsive marketing pages: homepage, all twelve services, concept work and detail views, process, four packages, about, FAQ and contact.
- Eight-step configurator with local non-contact draft saving, validation, file quarantine, explicit quote-request behavior, durable submission and printable reference.
- Atomic lead/order/project creation, idempotent submission handling and a persistent email outbox.
- Verified email-link sign-in, expiring HTTP-only sessions, client ownership checks and a protected admin role.
- Client project overview, brief, files, messages, version-specific approvals, invoices, service records and support tickets.
- Admin projects, milestone updates, design review links, invoice creation, verified manual payment records, domain/hosting/maintenance records, inquiries, orders and notification status.
- Security headers, same-origin mutation checks, request limits, parameterized SQL and an audit log for core sensitive operations.
- API integration tests, desktop/mobile browser tests and GitHub Actions checks.

## Production setup

Build with `npm run build` and run `npm start`. The Node server serves both the compiled site and API. A Dockerfile is included. Use one application instance with a persistent disk for SQLite and uploads, behind HTTPS; this release is not designed for ephemeral/serverless filesystems or multiple database writers on separate hosts.

Set `APP_ORIGIN` to the exact public HTTPS origin, `NODE_ENV=production`, `ADMIN_EMAILS`, SMTP host/port/user/password, `MAIL_FROM` and `STAFF_EMAIL`. Keep secrets outside Git. Configure backups and monitor `/api/health`. Reverse proxy trust settings must be reviewed for the actual deployment; the app does not blindly trust forwarded IP headers.

No production hosting or email account has been connected by this change. No live payments, domain registration or hosting purchases are performed. Do not publish before completing [launch readiness](docs/IMPLEMENTATION-STATUS.md).

## Validation

```sh
npm run check
npx playwright install chromium
npm run test:e2e
```

Browser tests start the development server with an isolated `data/e2e` database and development-only sign-in. On Windows you can set `PLAYWRIGHT_EXECUTABLE_PATH` to an installed Chromium browser path. Do not point test configuration at production data.

## Scope and assets

This is a working first implementation, **not the complete commercial launch in the PRD**. Detailed omissions and deployment requirements are listed in [implementation status](docs/IMPLEMENTATION-STATUS.md). Public policy pages are explicitly marked pre-launch drafts. Portfolio compositions are original visual concepts and are labeled accordingly. The four marketing figures are owner-supplied content, not metrics calculated by this software.

The user-supplied logo remains in `public/brand/cws-logo.png`. Typography is self-hosted using the Manrope package. Website mockups are original CSS compositions, not screenshots of claimed client projects.

## Workspace and database operations

Client dashboard: `/portal`. Admin dashboard: `/admin`. See `docs/WORKSPACE.md` for access configuration, permissions and backup/restore steps.

Run `npm run db:init` to apply migrations and check database integrity. Run `npm run db:backup` for a verified timestamped database snapshot. Do not set `NODE_ENV=development` in a Vite production build environment; set `NODE_ENV=production` when running the deployed server.
