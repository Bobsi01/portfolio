# Deployment Rules

## General

- Deploy from clean, intentional source snapshots.
- Do not deploy local secrets.
- Do not rely on files that are ignored by git unless the deployment script explicitly copies them as generated artifacts.
- Record the exact deployed commit or source state in `docs/vps/change-log.md`.

## Portfolio

- Keep portfolio links aligned with production URLs.
- Project screenshots must exist locally before deployment.
- Avoid broken `images/` references.

## Records

- Use PHP 8.3 or compatible newer PHP.
- Use PostgreSQL.
- Use document root `public`.
- Build frontend assets before deployment.
- Run migrations and seed only for fresh deployment.
- Disable public registration while SMTP is unavailable.
- Run the Laravel scheduler every minute.

## HRMS

- Use PHP 8.3.
- Use PostgreSQL.
- Run at root path on `hrms.bobs-thedev.tech`.
- `BASE_URL` must be environment-driven and empty in production.
- Protect tools, docs, handoff files, database files, and env files from public web access.
- Keep `assets/uploads` persistent and backed up.
