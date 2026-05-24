# QA Report

## 2026-05-24

## Infrastructure And Security

- Droplet `bobs-project-vs` verified active at `139.59.96.240`, size `s-1vcpu-2gb`, Ubuntu 24.04 LTS.
- SSH user `daniel` verified with passwordless sudo.
- Effective SSH config verified with `sshd -T`: `PermitRootLogin no`, `PasswordAuthentication no`, `KbdInteractiveAuthentication no`, `PubkeyAuthentication yes`, and `AllowUsers daniel`.
- UFW verified active with default incoming deny, public `80/tcp` and `443`, trusted-IP-only `22/tcp` and `8443/tcp` for `136.158.42.216`.
- CloudPanel is reachable from the trusted IP on `8443`.
- External `8080` is blocked by UFW. Nginx still listens internally for CloudPanel app routing.
- PostgreSQL verified with `SHOW listen_addresses`: `localhost`.
- PostgreSQL sockets verified on `127.0.0.1:5432` and `[::1]:5432`.
- Services verified active: `nginx`, `php8.3-fpm`, `mysql`, `postgresql`, `fail2ban`, `auditd`, and `clp-agent`.
- `systemctl --failed` reported zero failed units during the QA pass.

## DNS And TLS

- DigitalOcean zone `bobs-thedev.tech` has A records for `@`, `www`, `records`, and `hrms` pointing to `139.59.96.240`.
- `records.bobs-thedev.tech` and `hrms.bobs-thedev.tech` resolved to `139.59.96.240` from Google and Cloudflare resolvers during final QA.
- Cloudflare resolver returned `139.59.96.240` for apex and `www`.
- Google resolver still cached old apex and `www` values `167.71.203.158` during final QA. This is DNS propagation residue because the DigitalOcean authoritative records are correct.
- Let's Encrypt certificates installed successfully for portfolio, Records, and HRMS.
- HTTPS checks returned `ssl_verify_result 0` for `www.bobs-thedev.tech`, `bobs-thedev.tech`, `records.bobs-thedev.tech`, and `hrms.bobs-thedev.tech`.

## Portfolio

- `https://www.bobs-thedev.tech/` returned `200`.
- `https://bobs-thedev.tech/` returned `301` to `https://www.bobs-thedev.tech/`.
- Portfolio project links point to `https://records.bobs-thedev.tech` and `https://hrms.bobs-thedev.tech`.
- Project images deployed and verified with `200 image/png`: `hrms-live.png`, `records-live.png`, `agrisos-live.png`, `cml-thumb.png`, `cml-1.png`, `cml-2.png`, and `cml-3.png`.
- Public probes for `docs/vps/change-log.md`, `.agents/rules/vps-security.md`, `.github/copilot-instructions.md`, and `.gitignore` returned `404`.

## Records

- `https://records.bobs-thedev.tech/` returned `200`.
- `https://records.bobs-thedev.tech/login` returned `200`.
- Production login smoke test posted with a real CSRF token and reached `/admin/dashboard` with status `200`.
- `/register` returned `302` to `/login`, confirming public signup is disabled.
- `api/register/check-student-number` route name exists and is available for the Blade template while disabled endpoints remain blocked.
- Records migrations show all migration files ran.
- Records database is populated from seeders.
- Records scheduler exists at `/etc/cron.d/records-scheduler` and cron is active.
- Sensitive probes returned `404`: `/composer.json`, `/vendor/autoload.php`, `/storage/logs/laravel.log`, and database paths.
- Focused test passed: `php artisan test --testsuite=Feature --filter=LoginRegressionTest` returned `7 passed, 42 assertions`.

## HRMS

- `https://hrms.bobs-thedev.tech/` returned `302` to login for unauthenticated users.
- `https://hrms.bobs-thedev.tech/login` returned `200`.
- Production login smoke test posted with a real CSRF token and reached `/` with status `200`.
- Static assets verified with `200`: `/assets/css/app.css`, `/assets/js/app.js`, and `/assets/resources/logo.jpg`.
- Sensitive probes returned `404`: `/.env`, `/database/schema_postgre.sql`, `/composer.json`, `/vendor/autoload.php`, `/tools/reset_admin.php`, and `/assets/uploads/probe.php`.
- HRMS migration runner reported `Applied: 0, Skipped: 61, Failed: no` after the final run.
- HRMS PHP syntax sweep passed for app PHP files outside `vendor`.
- HRMS unit tests passed: `111 tests, 236 assertions`.
- HRMS `composer validate --no-check-publish` now reports `composer.json is valid`.

## Backups

- Backup script installed at `/usr/local/sbin/portfolio-backup.sh` with mode `700`.
- Daily cron installed at `/etc/cron.d/portfolio-backups`.
- Logrotate config installed at `/etc/logrotate.d/portfolio`.
- Initial backup completed at `/var/backups/portfolio/20260524T073835Z`.
- Backup contents include PostgreSQL dumps, Records storage/env, HRMS uploads/env, portfolio static files, Nginx config, cron config, and `SHA256SUMS`.

## Residual Notes

- Google DNS still cached the old apex and `www` IP during final QA. Recheck after TTL expiry.
- HRMS sensitive files still exist under the app web root on disk. Nginx blocks them, but a future deployment should move operational files out of the public root where practical.

## Public Browsability Recheck

- Date: 2026-05-24.
- DNS now resolves to `139.59.96.240` for `bobs-thedev.tech`, `www.bobs-thedev.tech`, `records.bobs-thedev.tech`, and `hrms.bobs-thedev.tech` through `1.1.1.1`, `8.8.8.8`, `9.9.9.9`, and `208.67.222.222`.
- Public HTTPS checks:
  - `https://bobs-thedev.tech/` returns `301` to `https://www.bobs-thedev.tech/`.
  - `https://www.bobs-thedev.tech/` returns `200`.
  - `https://records.bobs-thedev.tech/` returns `200`.
  - `https://records.bobs-thedev.tech/login` returns `200`.
  - `https://hrms.bobs-thedev.tech/` returns `302` to `/login`.
  - `https://hrms.bobs-thedev.tech/login` returns `200`.
- Real browser check with Puppeteer:
  - `https://www.bobs-thedev.tech/` returned `200`, final URL stayed on `www`, title `Daniel D. Bobis | Portfolio`, no failed requests, and no 4xx/5xx resources.
  - `https://records.bobs-thedev.tech/login` returned `200`, title `Ourchive`, no failed requests, and no 4xx/5xx resources.
  - `https://hrms.bobs-thedev.tech/login` returned `200`, title `Sign in · HydroMed HRMS`, no failed requests, and no 4xx/5xx resources.
- VPS checks:
  - Nginx syntax is valid.
  - Required services are active.
  - UFW allows public `80/443`.
  - TCP checks to `139.59.96.240:80` and `139.59.96.240:443` succeed.
- Small remediation:
  - Added portfolio `robots.txt`.
  - Added portfolio favicon link and deployed `favicon.png`.
  - Added expected `favicon.ico` files for portfolio and HRMS.

## Portfolio Mobile Modal Recheck

- Date: 2026-05-24.
- Local static server: `http://127.0.0.1:4173`.
- Puppeteer mobile viewport: `390x844`, mobile emulation enabled.
- Verified all project modals: `hrms`, `agrisos`, `records`, and `cml`.
- Result: every modal card stayed within the viewport, every close button stayed visible and tappable, and longer modal content scrolled inside the modal body instead of pushing the close button offscreen.
- Puppeteer desktop viewport: `1366x768`.
- Result: desktop modal remained centered, visible, and closeable after the mobile constraints were added.
- Production URL: `https://www.bobs-thedev.tech/?v=1ac30da`.
- Production HTML check found the updated modal CSS rules: `100dvh`, `modal-preview-shot:not`, and `height: clamp(150px`.
- Production Puppeteer mobile viewport: `390x844`, mobile emulation enabled.
- Production result: HRIS modal opened with card top `25`, card bottom `832`, close top `38`, close right `371`, close button reachable, card within viewport, modal closed successfully, and no failed page resources were observed.
- GitHub Actions runner service `actions.runner.Bobsi01-portfolio.bobs-project-vs-portfolio.service` was active on the VPS after installation.
- `Deploy portfolio` workflow run `26363461099` completed successfully after the runner was installed.
