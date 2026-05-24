# VPS Security Rules

## No-Lockout Rule

- Never reload SSH or enable firewall rules without confirming the current SSH session stays open.
- Before disabling root login, verify the sudo user can log in with the same public key.
- Keep a rollback note in `docs/vps/access-and-recovery.md` before changing access controls.
- Run `sshd -t` before reloading SSH.
- Apply firewall rules in an order that allows SSH first, then web ports, then the default deny policy.

## Firewall Rule

- Permit inbound `22/tcp` only from the current trusted operator IP.
- Permit inbound `8443/tcp` only from the current trusted operator IP.
- Permit inbound `80/tcp` and `443/tcp` from anywhere.
- Deny all other inbound traffic.
- Allow outbound traffic.
- Confirm IPv4 and IPv6 policies are aligned.

## Service Exposure Rule

- PostgreSQL must bind only to `127.0.0.1` and local sockets.
- App secrets must live in per-site environment files outside public document roots.
- Public web roots must not expose `.git`, `.github`, `.agents`, docs, database files, env files, backups, or private scripts.
- Upload directories must never execute PHP or other scripts.

## Logging Rule

- VPS changes go in `docs/vps/change-log.md`.
- QA results go in `docs/vps/qa-report.md`.
- Repeated operational mistakes go in `docs/vps/lessons-learned.md`.
- Logs should include date, host, command purpose, result, and next action.
