# Lessons Learned

## 2026-05-24

- DNS zones must be created at the apex domain, not only at `www`, otherwise subdomains such as `records` and `hrms` cannot be managed cleanly.
- Do not harden SSH until a second login path has been verified.
- Records currently needs `npm ci --legacy-peer-deps` because `laravel-vite-plugin@1.3.0` declares Vite 5 or 6 as its peer range while the lockfile installs Vite 7. Revisit the frontend dependency set after deployment.
- Do not run `php artisan optimize:clear` on a fresh Records database before migrations. The production cache driver is `database`, so cache clearing fails until the `cache` table exists.
- Public views must not reference disabled route names unless replacement routes are still registered. Records needed named disabled API routes so `welcome.blade.php` could render while signup stayed blocked.
- Apache `.htaccess` extensionless routing assumptions must be translated explicitly into CloudPanel Nginx rules. HRMS `/login` looped until Nginx routed extensionless paths through PHP-FPM.
- Do not add `$uri.php` directly to a server-level Nginx `try_files` rule for PHP apps. It can serve PHP source as a static file. Use a named rewrite that lands in the PHP location.
- Deployment should exclude operational docs, agent rules, `.env`, schema files, tools, and vendor files from public web roots wherever possible, and Nginx deny rules must still exist as defense in depth.
- Empty HRMS migration files should be removed or intentionally marked. `2025-11-07_shift_templates.sql` is empty and the runner now skips it.
- HRMS `includes/encryption.php` was missing a PHP opening tag. PHP lint and PHPUnit caught this; keep both checks in QA.
- Backup scripts that run `pg_dump` as `postgres` cannot write directly into root-only directories unless root owns the output redirection. Use `sudo -u postgres pg_dump DB > root-owned-file`.
- A push can succeed while the custom portfolio deploy remains queued if the self-hosted runner is unavailable. Always check the `Deploy portfolio` run status after pushing and verify the production HTML before considering the VPS site updated.
- Mobile Safari-style browser chrome can make `100vh` taller than the visible page area, which pushes bottom-pinned controls such as the Explore button out of view. Use `svh`/`dvh` for mobile hero sections and verify with an iPhone-sized viewport.
- Fixed floating controls can visually sit above modal content unless the page explicitly hides or disables them during modal-open state.
- iPhone Safari may keep older static CSS aggressively during repeated layout fixes. Version stylesheet and script URLs when shipping mobile CSS changes, then verify production with a cache-busted page URL.
