# Responsive portfolio QA - 2026-09-06

The existing portfolio identity and content are preserved. Changes cover the compact mobile navigation, responsive scrolling, project dialogs, and decorative hero effects. Implementation uses HTML, CSS and vanilla JavaScript.

## Verified in the Codex internal browser

- Tested widths/heights: 320x568, 375x667, 393x852, 430x932, 479x800, 480x800, 767x800, 768x1024, 844x390, 1023x768, 1024x768 and 1440x900. Final document overflow measurements were zero at all these sizes.
- All four project dialogs opened on narrow screens; focus entered the close button, Shift+Tab reached the live link and scrolled it into view, Escape closed the dialog, and focus returned to View Details. Background content was inert while open.
- Dialog bounds fit the eight primary viewport sizes. At 844x390 the corrected dialog occupied y=12 through y=378, replacing the previous 520px minimum height.
- Mobile menu expansion, Escape dismissal, navigation dismissal and theme switching worked. Light and dark dialogs used their respective backgrounds. Inline dialog icons now have static positioning.
- Hero effects resumed on returning to Home and computed animation-play-state was paused after navigating away. Dialog opening also activated the shared paused state.
- All 18 local hero images loaded. At 393x852 all 18 were available and eight had animations; desktop retained all 18. Short landscape can suppress decorations if no collision-free position remains, prioritizing readable text and navigation.
- Reviewed hero, timeline, contact and landscape-dialog screenshots in the internal browser. No runtime errors were recorded in the local browser console.

## Static checks and performance changes

- PASS: node --check script.js and git diff --check.
- PASS: local HTML asset references resolve; all 18 SVG files parse successfully. SVG payload total: 41,398 bytes. Upstream license texts and source attribution are included in assets/tech.
- Particle count is capped at 16 on mobile and 40 on desktop; canvas density at 2. A single cancellable animation loop replaces continuous offscreen rendering. CSS pause/resume replaces the timed forced-reflow watchdog.
- Reduced-motion changes are observed at runtime; CSS disables decorative movement and JavaScript suppresses particles and pointer effects. This was source-verified, not tested by changing OS preferences.

## Visual review boundaries

The existing colorful developer identity supplies the visual direction: ENERGY 2, RHYTHM 2, MOTION 2, with quieter mobile motion. The review applies antislop to this change, not a redesign of existing copy or branding.

- PASS, responsive layout: zero document overflow in the tested matrix; viewport-bounded dialogs and two-column contact links at narrow widths.
- PASS, controls: menu, theme and dialog interactions exercised; visible focus styles and 44px action targets added.
- PASS, visual purpose: logo depth and motion distinguish technology decorations from the central biography; effects never capture pointer input.
- PASS, theme resilience: root-scoped light selectors no longer override dark dialogs.

Physical Safari/iOS safe-area and browser-toolbar behavior, actual 200% browser zoom, OS reduced-motion switching, and device frame-rate/energy profiling remain unverified. No numerical speedup or FPS claim is made. The existing Tailwind Play CDN production warning remains outside this responsive change.

## GitHub Pages verification

- Deployment run 34011107429 succeeded for commit 305efb15a2009a55d5e3e5e6fe249a2342b21b09.
- Verified https://bobsi01.github.io/portfolio/?v=305efb1 in the internal browser at 375x667: menu expanded and closed after navigation; dialog focused Close and returned focus to View Details; document overflow was zero. All hero icons used the local Pages asset paths with no broken images.
- At 844x390 the dialog bottom was within the viewport and keyboard navigation reached the live-project action. No live console errors were recorded.
