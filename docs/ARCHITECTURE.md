# Architecture — Lucky Nakola Portfolio

> Version 3.0 | Supersedes `ARCHITECTURE_BLUEPRINT.md` | September 2026

## Stack

| Layer | Technology | Notes |
|---|---|---|
| Markup | HTML5 (semantic) | Authored per-page under `src/pages/`, assembled at build time |
| Styling | Tailwind CSS (compiled via CLI, not CDN) + custom CSS | `tailwind.config.js` scans `src/pages/`, `src/partials/`, and `js/app.js`; output is a single minified `dist/css/tailwind.css`. `css/styles.css` carries design tokens, components, and animations that aren't plain utility classes. |
| Scripting | Vanilla ES6+ (`js/app.js`) | Unchanged architecture: one IIFE, zero runtime dependencies |
| Fonts | Inter, Space Grotesk, JetBrains Mono (Google Fonts CDN, preconnected) | |
| Icons | Inline SVG | |
| Build | Node.js, built-in `fs`/`path`/`child_process` only, plus Tailwind CLI as the sole devDependency | `node build.js` |

Tailwind CLI is pinned to `^3.4.17` (the classic `tailwindcss` CLI, not v4's separate `@tailwindcss/cli` package) for a stable, well-documented `-i`/`-o`/`--minify` invocation.

## Build architecture: `src/` → `dist/`

```
src/
  pages/                  # one file per output page, using includes + tokens
    index.html  about.html  expertise.html  projects.html
    services.html  insights.html  contact.html  404.html
    cv/
      view.html           # templated like any other page
      download.html       # templated like any other page
      print.html          # copied byte-for-byte — no nav/footer, no templating
  partials/
    head-meta.html        # <head>: fonts, compiled Tailwind + styles.css links,
                           #   canonical/OG/Twitter, favicon, Person JSON-LD + {{jsonLdBlock}} slot
    nav.html               # identical on every page
    mobile-menu.html        # identical on every page
    footer.html             # identical on every page
  data/
    site.json              # domain, email, phone, socials, FormSubmit endpoint — single source of truth
    pages.json              # per-page {title, description, path, ogImage?, schemas[], priority, changefreq}
  tailwind-input.css        # @tailwind base/components/utilities

css/ js/ img/ pdf/          # unchanged locations — copied into dist/ verbatim, no templating needed
_headers                    # Cloudflare Pages security headers — copied into dist/ root
build.js                    # the entire build script
dist/                       # BUILD OUTPUT — gitignored, this is what gets deployed
```

### Why nav/footer/mobile-menu are byte-identical across pages

`js/app.js`'s `initActiveNav()` already computes the "active" nav-link state at runtime from `window.location.pathname` — the old hand-authored `class="nav-link active"` per page was redundant with this. That meant the partials could be extracted with **zero per-page variation**, which is what keeps the include mechanism this simple.

### Why `cv/print.html` and `404.html` don't use the nav/footer partials

Both were already deliberately chrome-free before this refactor (no nav, no footer, no mobile menu) — they're meant to stand alone (a print-optimized resume, a minimal error page). `404.html` still gets `head-meta.html` for consistent favicon/canonical/fonts; `cv/print.html` is copied through untouched by `build.js` since it needs no templating at all.

## The include/token mechanism

Two plain-`String.replace` mechanisms, no HTML parser, no npm dependency:

1. **Includes** — `<!--#include "partials/nav.html"-->`, resolved relative to `src/`.
2. **Tokens** — `{{title}}`, `{{description}}`, `{{canonicalUrl}}`, `{{ogImage}}`, `{{jsonLdBlock}}`, `{{base}}` (`""` at the root, `"../"` one level down, e.g. `cv/`), plus every key in `site.json` (`{{domain}}`, `{{email}}`, `{{phone}}`, `{{whatsapp}}`, `{{githubUrl}}`, `{{linkedinUrl}}`, `{{facebookUrl}}`, `{{formsubmitEndpoint}}`).

`build.js` fails loudly (non-zero exit) if a token has no matching value or an include path doesn't resolve — a broken template never silently ships.

## Structured data

- **Person** — emitted on every page (in `head-meta.html`), sourced from `site.json`.
- **WebSite** — homepage only (`pages.json` → `"schemas": ["WebSite"]`).
- **Organization** (Nakola Expert Systems) — About page only, since `services.html`'s voice is personal-freelance ("I"/"my process") rather than corporate. Its `url` points to the real, separately-deployed NES company site (`nakolaexpertsystems.vercel.app`), not this portfolio.

## Design tokens (carried forward from the original blueprint, still accurate)

```
Background:   #030712 (base), #0f172a (surface), #1e293b (elevated)
Text:         #f1f5f9 (primary), #94a3b8 (secondary), #64748b (tertiary)
Accent:       #06b6d4 (cyan-500), #22d3ee (cyan-400), #0891b2 (cyan-600)
Gold:         #eab308 (brand accent), #facc15 (light), #ca8a04 (dark)
Gradient:     135deg, #06b6d4 → #8b5cf6 (cyan → violet)
```

```
Headings:     Space Grotesk, 600–700 weight
Body:         Inter, 400–500 weight
Code/Mono:    JetBrains Mono, 400 weight
```

```
Duration:     150ms (fast), 300ms (base), 500ms (slow), 800ms (enter)
Easing:       cubic-bezier(0.16, 1, 0.3, 1)
Reduced:      prefers-reduced-motion respected in both CSS and JS
```

```
Breakpoints (mobile-first, Tailwind defaults):
base: 320px+   sm: 640px+   md: 768px+   lg: 1024px+   xl: 1280px+   2xl: 1536px+
```

## Local development

```bash
npm install        # installs Tailwind CLI (the only devDependency)
npm run build       # runs build.js — outputs dist/
# serve dist/ with any static file server to preview, e.g.:
npx http-server dist -p 8080
```

Never hand-edit files under `dist/` — they're regenerated on every build. Edit under `src/pages/`, `src/partials/`, or `src/data/` instead.
