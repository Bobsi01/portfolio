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

## Portfolio iPhone Layout Recheck

- Date: 2026-05-24.
- Local static server: `http://127.0.0.1:4173`.
- Puppeteer mobile viewport: `393x852`, mobile emulation enabled.
- Hero result: Explore button was visible with top `772` and bottom `820`; mobile theme toggle was hidden.
- Timeline result: mobile timeline track rendered as `flex`, all timeline cards had width `266`, and no card overlaps were detected.
- Modal result: CML modal opened with the body `modal-open` class, fixed theme toggle display was `none`, and the close button remained reachable.
- Puppeteer desktop viewport: `1366x768`.
- Desktop result: theme toggle stayed visible on the base page, timeline stayed in grid layout, and the toggle was hidden while the modal was open.
- Production URL: `https://www.bobs-thedev.tech/?v=49d7e8e`.
- Production mobile result: Explore button was visible with top `778` and bottom `826`; mobile theme toggle was hidden; timeline track rendered as `flex` with no overlaps; CML modal close button was reachable; no failed page resources were observed.

## Portfolio Stack Content Recheck

- Date: 2026-05-25.
- Local static server: `http://127.0.0.1:4173`.
- Source folders reviewed:
  - `C:\Workspace\cml-management-system`
  - `C:\Workspace\Records-management`
  - `C:\Workspace\hrms-sysfunda`
- Puppeteer mobile viewport: `393x852`, mobile emulation enabled.
- Mobile hero result: 18 floating icons visible, maximum icon width `22`, no overlap with hero content, mobile theme toggle hidden, and the OpenAI icon loaded from `openai.svg`.
- Modal result: HRMS, AgriSOS, Records, and CML tech-stack tags matched the updated content; no icon or page resource failures were observed after replacing the Excel icon URL.
- Desktop timeline result: `Sept 2023` and `2026` timeline dates now render below the timeline rail.
- Production URL: `https://www.bobs-thedev.tech/?v=b7f42fb`.
- Production mobile result: 18 floating icons visible, maximum icon width `22`, no overlap with hero content, and mobile theme toggle hidden.
- Production modal result: CML modal tags were `Laravel 13`, `PHP 8.4`, `React 19`, `Inertia.js`, `Tailwind 4`, `PostgreSQL`, `Reverb`, `Sanctum`, `Spatie`, `AWS S3`, `DOMpdf`, and `Excel`.
- Production desktop result: timeline dates, including `Sept 2023` and `2026`, rendered below the rail. No failed resources were observed.

## Portfolio External CSS And Mobile Recheck

- Date: 2026-05-25.
- Local static server: `http://127.0.0.1:4173`.
- Source result: `index.html` no longer contains the inline `text/tailwindcss` component stylesheet; component styles load from `styles.css?v=20260525-3`.
- Puppeteer iPhone viewport: `393x852`, mobile emulation enabled.
- iPhone result: Explore button was visible with top `723` and bottom `772`; mobile timeline track rendered as `flex` with `column` direction; mobile theme toggle was hidden; no failed resources were observed.
- Puppeteer smaller-phone viewport: `375x667`, mobile emulation enabled.
- Smaller-phone result: Explore button was visible with top `540` and bottom `588`; mobile timeline track rendered as `flex` with `column` direction; mobile theme toggle was hidden; no failed resources were observed.
- Puppeteer desktop viewport: `1440x900`.
- Desktop result: timeline stayed in desktop grid layout, Explore button was visible, theme toggle stayed visible, and no failed resources were observed.
- Production URL: `https://www.bobs-thedev.tech/?v=4b76568`.
- Production iPhone result: `styles.css?v=20260525-3` loaded, inline Tailwind style block was absent, Explore button was visible with top `720` and bottom `768`, timeline track rendered as `flex` with `column` direction, mobile theme toggle was hidden, and no failed resources were observed.
- Production smaller-phone result: Explore button was visible with top `541` and bottom `590`, timeline track rendered as `flex` with `column` direction, mobile theme toggle was hidden, and no failed resources were observed.
- Production desktop result: timeline stayed in grid layout, Explore button was visible, theme toggle stayed visible, and no failed resources were observed.

## Portfolio Project Card Recheck

- Date: 2026-05-25.
- Local static server: `http://127.0.0.1:4173`.
- Source result: project card summaries were shortened, project cards display one stack-chip row, and hidden stack details are represented by `+1`, `+2`, or `+3` chips.
- Puppeteer desktop viewport: `1920x1000`.
- Desktop result: Projects wrapper computed `max-height: none` and `overflow-y: visible`; all four cards rendered at equal height; stack rows stayed at one row; no failed resources were observed.
- Puppeteer laptop viewport: `1366x768`.
- Laptop result: Projects wrapper computed `max-height: none` and `overflow-y: visible`; all cards kept equal height and normal page flow instead of a hidden internal section scroll.
- Puppeteer mobile viewport: `393x852`, mobile emulation enabled.
- Mobile result: project cards rendered as a single column, stack rows stayed compact, and no failed resources were observed.
- Modal result: HRMS, AgriSOS, Records, and CML modals still retained full detail with 7, 12, 8, and 12 tech tags respectively; every modal close button remained visible.
- Production URL: `https://www.bobs-thedev.tech/?v=8495cfa`.
- Production laptop result: `styles.css?v=20260525-4` loaded, Projects wrapper computed `max-height: none` and `overflow-y: visible`, all card heights were `358`, every stack row stayed at one row, and no failed resources were observed.
- Production mobile result: project cards rendered as a single column with equal `358` heights, stack rows stayed compact with `+N` chips, and no failed resources were observed.
- Production modal result: HRMS, AgriSOS, Records, and CML modals retained 7, 12, 8, and 12 tech tags respectively, and every modal close button remained visible.

## Portfolio Link Preview Recheck

- Date: 2026-05-25.
- Local static server: `http://127.0.0.1:4173`.
- Source result: Open Graph and Twitter image metadata now point to `https://www.bobs-thedev.tech/assets/share-preview-20260525.png` with explicit `image/png`, `1200`, and `630` metadata.
- Image result: `assets/share-preview-20260525.png` loaded locally with natural dimensions `1200x630`; no failed resources were observed.
- Visual result: preview text is shorter and placed in a safer central area to avoid right-edge cropping in Messenger-style link cards.
