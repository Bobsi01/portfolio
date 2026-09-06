# Portfolio

A responsive, mobile-first portfolio website built with plain HTML, Tailwind CSS (Play CDN), and vanilla JavaScript. No build tools required — open `index.html` and it works.

## File Structure

```
index.html   → Markup and Tailwind component classes
styles.css   → Custom CSS (colors, animations, reduced motion)
script.js    → Theme toggle, scroll reveal, contact form
README.md    → This file
```

## Quick Start

1. Clone the repo
2. Open `index.html` in your browser
3. That's it

## Deploying to Production

Production deploys are handled by GitHub Actions and GitHub Pages. Every push to `master` that changes the public portfolio files runs `.github/workflows/deploy-portfolio.yml`, packages only the public static site files, and deploys them to the repository's `github-pages` environment.

The intended custom domain is:

```
www.bobs-thedev.tech
```

GitHub Pages must be enabled in **Settings → Pages** with **Source: GitHub Actions**, and the custom domain must be configured there. DNS for `www` should point to `Bobsi01.github.io`. The apex domain may also be configured to redirect to `www` through the GitHub Pages custom-domain setup and DNS provider.

The VPS documentation under `docs/vps/` is retained for the other services and for historical deployment reference, but the portfolio itself no longer requires the VPS after the GitHub Pages cutover is complete.

## Editing Content

Search the file for `REPLACE` to find every placeholder. Key items:

| Placeholder | Where | What to change |
|---|---|---|
| `YOUR_NAME` | `index.html` — title, hero `<h1>`, meta description, footer | Your display name |
| `YOUR_TITLE` | `index.html` — hero subtitle | Professional headline |
| `YOUR_EMAIL` | `script.js` — `EMAIL_TO` variable, `index.html` — mailto social link | Contact email |
| `GITHUB_URL` | Social link `href` in contact section | GitHub profile URL |
| `LINKEDIN_URL` | Social link `href` in contact section | LinkedIn profile URL |
| Project screenshots | `<img src="...">` in each project card | Real screenshot URLs or local paths |
| Project repo links | `<a href="#">` "View on GitHub" links | Real GitHub repository URLs |
| Profile photo | `<img>` in the About section | Your own photo URL or local path |

### Adding or removing projects

Each project is a self-contained `<article class="card">` block inside the projects grid. Copy an existing card and update the content, or delete one you don't need.

## Changing Colors

The site uses an **indigo + cyan** palette by default. Two things control colors:

### 1. CSS Custom Properties (in `styles.css`)

```css
:root {
  --color-primary: #6366f1;
  --color-primary-dark: #4338ca;
  --color-accent: #06b6d4;
  --color-accent-light: #22d3ee;
}
```

These drive the hero gradient and any custom CSS accents. Change them to shift the overall feel.

### 2. Tailwind color classes in the HTML

The HTML uses Tailwind's built-in color names. To fully re-theme:

- Find-replace `indigo` with your primary color name (e.g. `violet`, `blue`, `rose`)
- Find-replace `cyan` with your accent color name (e.g. `emerald`, `amber`, `teal`)
- Update the CSS variables above to match

The hero gradient is defined in `.hero-gradient` — edit the `linear-gradient` stops there.

### Dark mode

Dark mode respects the visitor's system preference on first load and can be toggled with the button in the bottom-right corner. The preference is saved to `localStorage`.

## Tech Stack

- HTML5 (semantic markup)
- [Tailwind CSS](https://tailwindcss.com/) via Play CDN
- Vanilla JavaScript (no dependencies)
- [Inter](https://rsms.me/inter/) via Google Fonts

## License

MIT
