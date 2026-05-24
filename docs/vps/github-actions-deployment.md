# GitHub Actions Portfolio Deployment

## Purpose

The portfolio deploys automatically when a commit is pushed to `master`. The workflow runs on a self-hosted GitHub Actions runner installed on the VPS, so GitHub-hosted runner IP ranges do not need SSH access through UFW.

Workflow file:

- `.github/workflows/deploy-portfolio.yml`

Production path:

- `/home/portfolio/htdocs/www.bobs-thedev.tech`

## Runner Requirements

Install the runner on `bobs-project-vs` and give it the custom label `portfolio-vps`. The workflow expects these runner labels:

- `self-hosted`
- `linux`
- `portfolio-vps`

Recommended runner service user:

- `daniel`, using the existing verified sudo access.

Required runner tools:

- `rsync`
- `sudo`
- `curl`
- `nginx`

## Deployment Behavior

The workflow publishes only the public static portfolio payload:

- `index.html`
- `styles.css`
- `script.js`
- `robots.txt`
- `favicon.png`
- `favicon.ico`, generated from `favicon.png` if no `.ico` exists in git
- `assets/`
- `images/`

The workflow intentionally does not publish repository metadata, agent rules, VPS docs, setup notes, capture scripts, local screenshots, `node_modules`, or other operational files.

The sync uses `--delete` so files removed from git are also removed from the production portfolio root. The `.well-known/` directory is protected so certificate challenge files are not removed.

## One-Time Setup

Create the self-hosted runner from the GitHub repository settings:

1. Open `Settings -> Actions -> Runners`.
2. Choose `New self-hosted runner`.
3. Select Linux x64.
4. Run the GitHub-provided install commands on the VPS as the runner user.
5. Add the `portfolio-vps` label during configuration or from the runner settings page.
6. Install and start the runner service.

The runner user must be able to run these commands without an interactive password prompt:

```bash
sudo mkdir -p /home/portfolio/htdocs/www.bobs-thedev.tech
sudo rsync -a --delete --exclude=.well-known/ SOURCE/ /home/portfolio/htdocs/www.bobs-thedev.tech/
sudo chown -R portfolio:portfolio /home/portfolio/htdocs/www.bobs-thedev.tech
sudo find /home/portfolio/htdocs/www.bobs-thedev.tech -type d -exec chmod 755 {} +
sudo find /home/portfolio/htdocs/www.bobs-thedev.tech -type f -exec chmod 644 {} +
sudo nginx -t
```

If sudo is tightened later, allow only the command set above instead of broad passwordless sudo.

## Verification

After pushing a commit to `master`:

1. Open the GitHub Actions run for `Deploy portfolio`.
2. Confirm the `Sync static site` job completed.
3. Confirm `https://www.bobs-thedev.tech/` returns `200`.
4. Confirm removed local files are no longer present in the production portfolio root when relevant.

If the workflow remains queued, the self-hosted runner is offline or missing the `portfolio-vps` label.
