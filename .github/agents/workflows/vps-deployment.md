# VPS Deployment Workflow

## 1. Prepare

- Verify local public IP.
- Verify droplet identity.
- Create a DigitalOcean snapshot.
- Confirm DNS authority for `bobs-thedev.tech`.
- Record the starting state in `docs/vps/change-log.md`.

## 2. Secure Access

- Create the sudo user.
- Install the public SSH key for the sudo user.
- Verify sudo user SSH login before changing root access.
- Configure SSH key-only login.
- Configure UFW with SSH allowed before default deny.
- Reload services only after syntax checks pass.

## 3. Install Platform

- Resize droplet to the supported CloudPanel baseline.
- Install CloudPanel.
- Restrict CloudPanel to the trusted IP.
- Install PostgreSQL and required app runtimes.
- Create separate DB users and databases.

## 4. Deploy Apps

- Deploy portfolio static files.
- Deploy Records with built assets, migrations, seeds, and scheduler.
- Deploy HRMS with schema import, migrations, admin reset, and upload permissions.
- Capture screenshots for portfolio project cards.

## 5. Verify

- Run infrastructure checks.
- Run app checks.
- Run independent QA agents.
- Write final QA and lessons learned notes.
