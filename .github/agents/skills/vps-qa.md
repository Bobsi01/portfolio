# VPS QA Skill

Use this skill when verifying the portfolio VPS, CloudPanel, DNS, TLS, app deployments, or database setup.

## Checklist

- Confirm DNS records resolve to the intended droplet IP.
- Confirm `80` and `443` are reachable publicly.
- Confirm `22` and `8443` are only reachable from the trusted operator IP.
- Confirm CloudPanel is reachable and not publicly exposed.
- Confirm PostgreSQL listens only on localhost.
- Confirm each site returns expected HTTP status over HTTPS.
- Confirm security headers exist on app responses.
- Confirm app uploads cannot execute code.
- Confirm scheduled jobs are installed where required.
- Confirm backups exist and restore notes are documented.

## Reporting

- Add results to `docs/vps/qa-report.md`.
- Add repeated or surprising failures to `docs/vps/lessons-learned.md`.
- Report blockers with exact host, URL, command, and observed result.
