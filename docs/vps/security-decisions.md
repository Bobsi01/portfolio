# VPS Security Decisions

## Implemented Defaults

- Key-only SSH.
- Sudo user for daily operations.
- Root SSH disabled only after sudo SSH verification.
- SSH port remains `22` to reduce lockout risk.
- SSH and CloudPanel are IP-whitelisted.
- Public web access is limited to `80` and `443`.
- PostgreSQL is localhost-only.
- Records and HRMS use separate PostgreSQL users and databases.
- Public signup is disabled until SMTP is configured.
- CloudPanel remains on `8443` and is restricted by UFW to the trusted operator IP.
- Sensitive web paths are denied through a shared Nginx snippet.
- Upload script execution is blocked through Nginx.
- Root-only backups are scheduled daily and logged under `/var/log/portfolio`.

## Deferred Hardening

- SSH 2FA is deferred until baseline deployment is stable.
- Origin IP hiding through CDN is deferred until DNS and TLS are stable.
- Cloudflare or WAF integration is deferred.
- IPv6 is not globally disabled; firewall policy must cover it.
- Moving all HRMS operational files outside the web root is deferred because the current app expects its legacy flat PHP layout. Nginx blocks sensitive paths as defense in depth.

## Rationale

The first production pass prioritizes avoiding lockout, establishing reliable backups, and keeping the app/database surfaces isolated. More aggressive hardening can be layered after CloudPanel, DNS, TLS, and application health are verified.
