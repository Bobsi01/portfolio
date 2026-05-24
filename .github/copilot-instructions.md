# Portfolio Agent Instructions

## Project Context

This repository owns the public portfolio site and the operational documentation for the portfolio VPS. The VPS hosts:

- `www.bobs-thedev.tech` and `bobs-thedev.tech` for the portfolio.
- `records.bobs-thedev.tech` for the Student Record Management System.
- `hrms.bobs-thedev.tech` for HRMS.

The VPS is a DigitalOcean droplet named `bobs-project-vs` with IPv4 `139.59.96.240`.

## Mandatory Rules

- Do not use tables in agent-facing documentation. Prefer short sections and compact bullets.
- Never store private keys, passwords, tokens, database dumps, `.env` contents, or generated secrets in git.
- Every VPS change must be documented in `docs/vps/change-log.md`.
- Every persistent or repeated issue must be appended to `docs/vps/lessons-learned.md`.
- Preserve user changes. Do not reset, checkout, or overwrite dirty worktrees unless the user explicitly asks.
- Before changing SSH, firewall, or sudo access, verify a second working access path.
- Do not disable root SSH until the sudo user has been created, key access has been verified, and rollback access is documented.
- Use exact dates and command outcomes in documentation.

## VPS Safety Baseline

- Snapshot before major VPS changes.
- Keep SSH on port `22` unless a separate recovery method is confirmed.
- Use key-only SSH authentication.
- IP-restrict SSH and CloudPanel access to the trusted operator IP.
- Leave ports `80` and `443` public for web traffic.
- Bind PostgreSQL to localhost only.
- Keep CloudPanel on `8443` restricted by firewall.
- Prefer CloudPanel-managed Nginx/PHP-FPM sites over hand-edited ad hoc web server state.

## Deployment Defaults

- Portfolio is a static site.
- Records is Laravel 11 with PostgreSQL and document root `public`.
- HRMS is plain PHP with PostgreSQL and must run at root path on its own subdomain.
- Records and HRMS must use separate PostgreSQL databases and users.
- Fresh seeded databases are the default for this VPS.
- Public signup remains disabled until SMTP is configured and verified.

## Verification Expectations

- Run infrastructure checks after every firewall, SSH, DNS, TLS, CloudPanel, or database change.
- Run app-level smoke tests after deployment.
- Use independent QA agents when the user asks for unbiased QA.
- Summarize failures plainly and log them in the appropriate VPS docs.
