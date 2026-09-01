# Portfolio Audit — Pre-Upgrade State

> Audited February–September 2026, before the senior-engineer/founder repositioning upgrade. This documents what the site looked like beforehand, what was wrong with it, and how each issue was resolved (or explicitly deferred).

## 1. Architecture & Codebase

| Finding | Severity | Resolution |
|---|---|---|
| Zero-dependency static HTML/CSS/JS, no build tool, no `package.json`. Deployed to GitHub Pages. | Informational | Kept the zero-runtime-dependency philosophy; added a **build-time-only** Node script (`build.js`) and Tailwind CLI as the first devDependency. Nothing new ships to the browser. |
| Nav, mobile-menu, and footer markup fully copy-pasted into all 9+ HTML pages — any nav/footer change required editing every file by hand. | High | Extracted into `src/partials/{nav,mobile-menu,footer,head-meta}.html`, assembled at build time via a simple `<!--#include-->` mechanism. Confirmed `js/app.js`'s `initActiveNav()` already computes the active nav state at runtime from `location.pathname`, so the partials can be byte-identical across every page. |
| `docs/ARCHITECTURE_BLUEPRINT.md` described an aspirational design system but no build/component-sharing mechanism existed to realize it. | Medium | Superseded by `docs/ARCHITECTURE.md`, which documents the `src/` → `dist/` build that now actually exists. |
| Two dead CSS custom properties referenced but never defined: `--duration-normal` (used in the Services-page tab/estimator styles) and `--bg-card` (used in the range-slider track style). | Low | Fixed to the real tokens (`--duration-base`, `--bg-elevated`) in `css/styles.css`. |
| `img/NakolaExpertSystems.png` (405KB) and `img/Screenshot 2025-08-24 111529.png` (96KB) were present but referenced nowhere in any HTML or Markdown file. | Low | Deleted — confirmed zero references via repo-wide search before removal. |

## 2. Domain & Deployment

| Finding | Severity | Resolution |
|---|---|---|
| Production domain hardcoded to the GitHub Pages URL (`https://waiyah.github.io/MY-PORTFOLIO/`) in `sitemap.xml`, `robots.txt`, and `index.html`'s Open Graph tags. | High | All domain references now derive from a single `src/data/site.json` value (`https://lucky.nakolaexpertsystems.com`) and are generated at build time — `sitemap.xml`/`robots.txt` are build outputs, not hand-maintained files. |
| No deployment configuration existed for anything beyond GitHub Pages (no `_headers`, no build command, no custom-domain setup). | Medium | Added `_headers` for Cloudflare Pages and documented the full Cloudflare Pages project setup in `docs/DEPLOYMENT.md`. |
| External `*.vercel.app` project demo links (SpendHack, Nakola Expert Systems, Kanunka FC, etc.) | Not an issue | Confirmed these are legitimate, separately-deployed demo projects, not stale references — left untouched. |

## 3. SEO

| Finding | Severity | Resolution |
|---|---|---|
| Open Graph and Twitter Card tags existed **only on `index.html`** — every other page (about, expertise, projects, services, insights, contact, 404, CV pages) had none. | High | Every page now gets canonical, OG, and Twitter tags via `head-meta.html` + `src/data/pages.json`, generated per-page automatically. |
| Zero `<link rel="canonical">` tags anywhere on the site. | High | Added sitewide, driven by `pages.json`. |
| `og:image` on `index.html` used a relative path (`img/preview.png`), which does not resolve reliably for social-media crawlers. | Medium | Fixed to an absolute URL (`{domain}/img/preview.png`) via the build's token substitution. |
| Zero JSON-LD / structured data anywhere on the site. | Medium | Added a sitewide `Person` schema (in `head-meta.html`), a `WebSite` schema on the homepage, and an `Organization` schema for Nakola Expert Systems on the About page. |
| Favicon was an inline base64 SVG emoji only — no PNG/ICO fallback, no `apple-touch-icon`, no `manifest.json`. | Low | Added an inline-SVG `apple-touch-icon` as an interim improvement. A full binary favicon set (`.ico`/PNG sizes/`site.webmanifest`) requires image-export tooling not available in this environment — documented as a fast-follow in `docs/DEPLOYMENT.md`. The current SVG favicon renders correctly in the large majority of modern browsers, so this is not launch-blocking. |
| Heading hierarchy and semantic HTML5 (`nav`/`main`/`section`/`article`/`footer`) were already correct on every page checked. | Not an issue | No changes needed. |
| Image `alt` text was already consistently present and descriptive sitewide. | Not an issue | No changes needed. |

## 4. Performance

| Finding | Severity | Resolution |
|---|---|---|
| Tailwind CSS loaded via CDN `<script>`, compiling all utility CSS in the browser on every single page load — the project's own architecture blueprint set a <20KB CSS budget that was impossible to meet this way. | High | Replaced with a build-time-compiled, purged, minified stylesheet (Tailwind CLI, ~32KB gzippable output covering the whole site) via `build.js`. |
| Several project screenshots were unoptimized PNGs far larger than their display size: `Kanunka Cranes.png` (1.96MB), `FreshFood.png` (1.52MB), `Spendhack.png` (1.01MB), `Replicate.png` (759KB), `nestech.png` (670KB). | High | Converted each to WebP at real display width (~800px), reducing them to 20–60KB each (>95% smaller), served via `<picture>`/`<source>` with the original PNG kept as a fallback. |
| `img/preview.png` (the OG share image) was 408KB at a larger-than-needed resolution. | Low | Downscaled and recompressed to 272KB. |
| `pdf/LUCKY NAKOLA CV.pdf` is 3.9MB — large for a text-based CV. | Low, deferred | Flagged here but **not modified** — this is the canonical downloadable resume document and out of scope for this pass (see the CV-pages decision in `docs/ARCHITECTURE.md`). Lucky can re-export a lighter version from the source document if desired. |
| Images already had `loading="lazy"` and explicit `width`/`height` attributes consistently. | Not an issue | No changes needed. |

## 5. Security

| Finding | Severity | Resolution |
|---|---|---|
| No Content-Security-Policy or other security headers anywhere (no hosting config existed to set them on GitHub Pages). | Medium | Added a Cloudflare Pages `_headers` file with CSP, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and `Permissions-Policy`. |
| The contact form (`contact.html`) had no `action`/`method` attribute at all — `js/app.js` intercepted submission and **faked** a "Sent ✓" success message via `setTimeout`, with no `fetch`/API call. Visitor messages were never actually delivered anywhere. | High | Wired to FormSubmit.co via a real `fetch()` AJAX call, with a honeypot field for spam and a genuine success/error UI state. |
| No secrets, API keys, or credentials found anywhere in the repository. | Not an issue | Confirmed clean; no changes needed. |
| All `target="_blank"` links already carried `rel="noopener noreferrer"`. | Not an issue | No changes needed. |

## 6. Accessibility

Already solid before this pass and left unregressed: ARIA labels and `aria-expanded` sync on the mobile menu, Escape-to-close, a sitewide `:focus-visible` rule, `prefers-reduced-motion` handling in both CSS and JS, and consistently descriptive `alt` text.

## 7. Content Accuracy

| Finding | Resolution |
|---|---|
| Social links were inconsistent across the site — `index.html` used a different LinkedIn slug and Facebook URL than `about.html`/`contact.html`/the CV pages. | Reconciled to the correct current URLs, driven from one `site.json` value: LinkedIn `lucky-nakola-loonkishu2026`, Facebook `lucky.loonkishu.7`. |
| The KICD internship appeared in `about.html`'s narrative timeline. | Removed from the About-page narrative per explicit direction. The CV/resume pages (`cv/view.html`, `cv/print.html`) were left untouched, as they represent the factual professional record and are out of scope for this content pass. |
| `cv/view.html`'s KICD/KNLS internship dates (Sep–Nov 2023 / May–Aug 2023) don't match the dates `about.html` used for the same roles (Feb–May 2025 / Sept–Dec 2024) before this pass. | Pre-existing inconsistency, discovered during this audit. Not fixed here — the CV pages are out of scope for this pass; flagged for Lucky to correct directly since only he knows the accurate dates. |
| `expertise.html` used arbitrary percentage skill bars (e.g. "Python 90%") with no substantiation, and listed a "CI/CD Pipelines" badge with no evidence of any CI/CD pipeline anywhere in the codebase or CV. | Skill bars replaced with tiered groupings, each tied to a real project. The "CI/CD Pipelines" badge was removed as unsubstantiated. |
| Homepage stat counters: "10+ Projects Delivered", "15+ Technologies", "3+ Years Experience", "5+ Happy Clients". | Confirmed accurate and kept: Projects Delivered, Years Experience, Happy Clients. "15+ Technologies" was not confirmed and was softened to non-numeric language ("Full-Stack + AI/ML Toolkit"). |
| "Tech Pulse Insider" was named in the upgrade brief as something to highlight but did not exist anywhere in the site, CV, or prior content. | Confirmed as a real, in-progress initiative and represented factually and briefly on the About page, alongside Nakola Expert Systems and Get Techy With Lucky — present tense, no invented metrics or unconfirmed links. |
| "Case studies" for major projects (SpendHack, Smart Job Assistant, Nakola Expert Systems, Kanunka FC, Fresh Foods) did not exist — only short marketing blurbs. | Added Problem → Solution → Architecture → Contribution → Outcome case-study accordions to `projects.html`, built only from information already verified elsewhere on the site — no invented statistics, users, or revenue. |
