# Access And Recovery

## Current Target

- Droplet: `bobs-project-vs`
- IPv4: `139.59.96.240`
- Current SSH user: `daniel`
- Current access: SSH using the default local ED25519 key.
- Root SSH: disabled.
- CloudPanel: `https://139.59.96.240:8443`
- CloudPanel credentials: stored on VPS at `/root/portfolio-secrets.txt`.
- App, database, and seeded admin credentials: stored on VPS at `/root/portfolio-secrets.txt`.

## Recovery Rules

- Keep the original SSH session open while changing SSH or firewall settings.
- Verify a second SSH session as the sudo user before disabling root SSH.
- Use DigitalOcean console if SSH becomes unavailable.
- Use the latest DigitalOcean snapshot for rollback if the server becomes unrecoverable.

## Trusted Operator IP

- Last observed public IP: `136.158.42.216`
- Update firewall allow rules if this changes.

## Manual DNS Recovery

If the new server is not ready, change DNS A records back to the previous working IP at the authoritative DNS provider.

## Backup Recovery

- Backup script: `/usr/local/sbin/portfolio-backup.sh`
- Backup schedule: `/etc/cron.d/portfolio-backups`
- Backup root: `/var/backups/portfolio`
- Backup log: `/var/log/portfolio/backup.log`
- Latest verified backup during setup: `/var/backups/portfolio/20260524T073835Z`

Restore outline:

1. Extract the needed backup archive as root.
2. Restore PostgreSQL dumps with `pg_restore` into the matching database.
3. Restore app uploads or storage archives to the matching site directory.
4. Reapply ownership with the CloudPanel site user.
5. Reload Nginx and PHP-FPM.
