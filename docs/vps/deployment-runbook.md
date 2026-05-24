# VPS Deployment Runbook

## Target

- Droplet: `bobs-project-vs`
- IPv4: `139.59.96.240`
- Region: `sgp1`
- OS: Ubuntu 24.04 LTS
- Domain: `bobs-thedev.tech`

## Sites

- Portfolio: `https://www.bobs-thedev.tech` and `https://bobs-thedev.tech`
- Records: `https://records.bobs-thedev.tech`
- HRMS: `https://hrms.bobs-thedev.tech`

## Deployment Order

1. Create a snapshot.
2. Resize the droplet to at least 2 GB RAM.
3. Correct DNS in DigitalOcean and registrar nameservers.
4. Verify SSH access.
5. Create sudo user and verify second login.
6. Harden SSH and firewall.
7. Install CloudPanel and app runtime packages.
8. Create isolated PostgreSQL databases.
9. Deploy portfolio.
10. Deploy Records.
11. Deploy HRMS.
12. Install TLS after DNS resolves to the droplet.
13. Install backup automation.
14. Run QA and document results.

## DNS Records

- `@` A `139.59.96.240`
- `www` A `139.59.96.240`
- `records` A `139.59.96.240`
- `hrms` A `139.59.96.240`

Registrar nameservers must be changed to DigitalOcean:

- `ns1.digitalocean.com`
- `ns2.digitalocean.com`
- `ns3.digitalocean.com`

## Secret Handling

- Generate secrets on the VPS.
- Store app secrets in server environment files or CloudPanel environment controls.
- Do not commit secrets.
- Record only secret names and storage locations.

## Production Paths

- Portfolio root: `/home/portfolio/htdocs/www.bobs-thedev.tech`
- Records root: `/home/records/htdocs/records.bobs-thedev.tech`
- Records document root: `/home/records/htdocs/records.bobs-thedev.tech/public`
- HRMS root: `/home/hrms/htdocs/hrms.bobs-thedev.tech`
- Nginx deny snippet: `/etc/nginx/snippets/portfolio-sensitive-deny.conf`
- Secrets file: `/root/portfolio-secrets.txt`
- Backup root: `/var/backups/portfolio`
- Backup log: `/var/log/portfolio/backup.log`

## Verification Commands

- SSH config: `sudo sshd -T -C user=root,host=139.59.96.240,addr=136.158.42.216`
- Firewall: `sudo ufw status verbose`
- PostgreSQL binding: `sudo -u postgres psql -tAc "SHOW listen_addresses;"`
- Nginx syntax: `sudo nginx -t`
- Records migrations: `sudo -u records php8.3 artisan migrate:status`
- Records login regression: `sudo -u records php8.3 artisan test --testsuite=Feature --filter=LoginRegressionTest`
- HRMS migrations: `sudo -u hrms php8.3 tools/migrate.php`
- HRMS unit tests: `sudo -u hrms php8.3 vendor/bin/phpunit --testsuite Unit`
