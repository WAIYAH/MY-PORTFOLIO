# Deployment — Cloudflare Pages

## 1. Local build

```bash
npm install
npm run build
```

This produces `dist/` — the full static site, ready to deploy as-is. Never edit files inside `dist/` directly; it's regenerated from `src/` on every build.

## 2. Cloudflare Pages project setup

1. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**, and select this repository.
2. Build configuration:
   - **Build command:** `npm install && npm run build` (or just `node build.js` if you'd rather commit `node_modules` — not recommended)
   - **Build output directory:** `dist`
   - **Root directory:** `/` (repo root)
3. Deploy. Cloudflare Pages will run the build and serve `dist/` on a `*.pages.dev` subdomain first — verify it there before attaching the custom domain.

## 3. Custom domain

Target production URL: `https://lucky.nakolaexpertsystems.com`

1. In the Pages project → **Custom domains → Set up a custom domain**, enter `lucky.nakolaexpertsystems.com`.
2. If `nakolaexpertsystems.com`'s DNS zone is already managed in this Cloudflare account, Cloudflare will offer to create the required `CNAME` record automatically.
3. If the zone is managed elsewhere, Cloudflare will show the exact `CNAME` target to add manually at your DNS provider (pointing the `lucky` subdomain at your `*.pages.dev` deployment).
4. Wait for the SSL certificate to provision (usually a few minutes), then verify `https://lucky.nakolaexpertsystems.com` loads the site.

The old GitHub Pages deployment (`https://waiyah.github.io/MY-PORTFOLIO/`) is a **separate host** — Cloudflare's `_redirects` file cannot redirect traffic that never reaches Cloudflare. If preserving old bookmarks/backlinks matters, that requires a separate action on the GitHub Pages side (e.g. a meta-refresh page), which is outside the scope of this repo.

## 4. Contact form — FormSubmit one-time activation

The contact form (`contact.html`) submits to `https://formsubmit.co/ajax/luckiesdabwoy@gmail.com` via AJAX. FormSubmit requires **one confirmation step** the first time a domain sends it a submission:

1. Immediately after the first production deploy, submit a real test message through the live contact form yourself.
2. FormSubmit sends a one-time confirmation email to `luckiesdabwoy@gmail.com` — click the confirmation link in that email.
3. After that, all future submissions from the live domain deliver normally with no further action needed.

Do this **before** sharing the live link publicly, so a real visitor's first message isn't the one that silently triggers the confirmation step.

## 5. Security headers

`_headers` (repo root) is copied into `dist/` on every build and picked up automatically by Cloudflare Pages — no dashboard configuration needed. It sets a Content-Security-Policy scoped to what the site actually loads (Google Fonts, FormSubmit's AJAX endpoint) plus `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and `Permissions-Policy`.

If you add a new third-party script or endpoint later, update the CSP in `_headers` accordingly — an unlisted origin will be silently blocked by the browser rather than erroring loudly, so check the browser console after any change that adds an external request.

## 6. Fast-follow: full favicon set

The current favicon is an inline SVG (a lightning-bolt "⚡" glyph) plus an SVG-based `apple-touch-icon` — this renders correctly in the large majority of modern browsers and is not launch-blocking. For full compatibility (older browsers, Android home-screen icons, Windows tiles), produce and add:

- `favicon.ico` (16×16 + 32×32 multi-size)
- `favicon-16x16.png`, `favicon-32x32.png`
- `apple-touch-icon.png` (180×180)
- `site.webmanifest` referencing the above

Export these from the existing "LN" gradient wordmark (e.g. via Figma/Canva or an online favicon generator), drop them in `img/` or a new `favicon/` folder, and reference them from `src/partials/head-meta.html`.

## 7. Final QA checklist (run against a fresh `dist/` build before each production deploy)

- [ ] `node build.js` completes with exit code 0 and no errors
- [ ] Every nav link, footer link, and CTA resolves (no 404s, no dead `#` hrefs)
- [ ] Contact form delivers a real test message via FormSubmit (including the one-time confirmation above)
- [ ] Mobile responsiveness checked at sm/md/lg/xl breakpoints, especially `services.html`'s cost estimator and `cv/view.html`'s two-column layout
- [ ] Browser console is clean (no JS errors) on every page
- [ ] `grep -r "waiyah.github.io" dist/` returns zero hits
- [ ] All `*.vercel.app` project demo links still resolve live
- [ ] Spot-check rendered `<head>` on 2–3 pages for canonical/OG/Twitter/JSON-LD correctness
- [ ] Accessibility not regressed: focus-visible still works, ARIA attributes intact, alt text present
- [ ] Lighthouse pass (Performance/Accessibility/Best Practices/SEO) against the built `dist/` output
