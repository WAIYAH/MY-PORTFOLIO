<div align="center">

# ⚡ Lucky Nakola — Developer Portfolio

**Tier-1 multi-page developer showcase built with modern web standards**

![Portfolio Preview](img/preview.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-06b6d4.svg)](LICENSE)
[![Pages](https://img.shields.io/badge/Pages-9-8b5cf6.svg)](#-site-map)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](#-tech-stack)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)](#-tech-stack)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](#-tech-stack)

[**Live Site →**](https://lucky.nakolaexpertsystems.com) · [Report Bug](https://github.com/WAIYAH/MY-PORTFOLIO/issues) · [Request Feature](https://github.com/WAIYAH/MY-PORTFOLIO/issues)

</div>

---

## 👋 About

I'm **Lucky Nakola**, a Software Engineer & AI Innovator based in Nairobi, Kenya. This portfolio is a multi-page showcase of my work, skills, and professional journey — designed to command attention from recruiters and engineering leads.

The site follows a **"Confident Futurism"** dark theme with a cyan/violet gradient accent system, built with semantic HTML5, Tailwind CSS (compiled at build time), and vanilla JavaScript — no frameworks, no runtime dependencies. A small Node build script (`build.js`) assembles shared partials and compiles Tailwind CSS; see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for details.

## ✨ Features

| Feature | Details |
|---|---|
| **Multi-Page Architecture** | 9 purpose-built pages with consistent navigation |
| **Design System** | CSS custom properties, reusable components, 4 badge variants |
| **Scroll Animations** | IntersectionObserver-powered reveal effects (fade, slide, scale) |
| **Interactive Elements** | Typing effect, animated counters, project filters, case-study accordions |
| **CV Microsite** | Interactive view, print-optimized A4 layout, PDF download hub |
| **Contact Form** | Real delivery via FormSubmit, client-side validation, subject/budget selectors, FAQ accordion |
| **Responsive** | Mobile-first with hamburger menu, tested across breakpoints |
| **Accessible** | WCAG 2.1 AA — ARIA labels, focus-visible, reduced-motion support |
| **SEO Ready** | Semantic HTML, meta descriptions, sitemap.xml, robots.txt |
| **Performance** | Lazy loading images, font-display: swap, minimal DOM operations |

## 🗺️ Site Map

```
index.html          → Hero landing with typing effect & featured projects
about.html          → Professional narrative, timeline, interests
expertise.html      → Skills matrix, tools grid, methodology
projects.html       → Filterable project showcase (10 projects, 4 categories)
insights.html       → Technical perspectives & thought leadership
services.html       → Services & pricing, cost estimator, process timeline
contact.html        → Contact form, FAQ, social links, availability
cv/view.html        → Interactive two-column resume
cv/print.html       → Print-optimized A4 resume
cv/download.html    → Download hub (PDF + print)
404.html            → Custom error page
```

## 📁 Project Structure

```
MY-PORTFOLIO/
├── build.js                 # Build script — assembles src/ into dist/
├── package.json             # Tailwind CLI is the only devDependency
├── tailwind.config.js
├── _headers                 # Cloudflare Pages security headers
├── src/
│   ├── pages/                # One source file per output page
│   │   └── cv/                 # view.html, download.html, print.html
│   ├── partials/               # head-meta, nav, mobile-menu, footer
│   ├── data/                   # site.json, pages.json — single source of truth
│   └── tailwind-input.css
├── css/
│   └── styles.css           # Design system — tokens, components, animations
├── js/
│   └── app.js               # Interaction engine (IIFE)
├── img/                     # Project screenshots & profile photo
├── pdf/
│   └── LUCKY NAKOLA CV.pdf  # Downloadable CV
├── dist/                    # BUILD OUTPUT (gitignored) — what gets deployed
├── docs/
│   ├── ARCHITECTURE.md
│   ├── ARCHITECTURE_BLUEPRINT.md  # superseded, kept for history
│   ├── DEPLOYMENT.md
│   └── PORTFOLIO_AUDIT.md
├── .gitignore               # Git ignore rules
├── .editorconfig            # Editor consistency
├── CONTRIBUTING.md          # Contribution guidelines
├── LICENSE                  # MIT License
└── README.md                # This file
```

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Markup** | HTML5 (semantic, accessible) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) (compiled via CLI at build time) + Custom CSS design system |
| **Interactivity** | Vanilla JavaScript ES6+ (no frameworks) |
| **Typography** | [Inter](https://rsms.me/inter/) · [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) · [JetBrains Mono](https://www.jetbrains.com/lp/mono/) |
| **Icons** | Inline SVG (Heroicons style) |
| **Build** | Node.js build script (`build.js`) — see [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) |
| **Hosting** | Cloudflare Pages |

## 🎨 Design System

The visual identity is built on CSS custom properties defined in `css/styles.css`:

```
Background:   #030712 (base) → #0f172a (surface) → #1e293b (elevated)
Accent:       #06b6d4 (cyan-500)
Gradient:     135deg → cyan-500 → violet-500
Gold:         #eab308 (highlights)
```

**Components:** Buttons (primary / secondary / gold) · Cards · Badges (4 variants) · Timeline · Case-study accordions · Form inputs · Section headings · Scroll reveal classes

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/WAIYAH/MY-PORTFOLIO.git
cd MY-PORTFOLIO

# Install the one devDependency (Tailwind CLI) and build
npm install
npm run build

# Serve the built site — any static file server works, e.g.:
npx http-server dist -p 8080
```

Edit source files under `src/pages/`, `src/partials/`, `css/`, or `js/` — never hand-edit `dist/`, it's regenerated on every build. See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for how the build works.

## 🤝 Contributing

Feedback and suggestions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for details.

## 📬 Contact

| Channel | Link |
|---|---|
| **Email** | [luckiesdabwoy@gmail.com](mailto:luckiesdabwoy@gmail.com) |
| **LinkedIn** | [Lucky Nakola](https://www.linkedin.com/in/lucky-nakola-loonkishu2026) |
| **GitHub** | [@WAIYAH](https://github.com/WAIYAH) |
| **WhatsApp** | [+254 715 674 828](https://wa.me/254715674828) |
| **Location** | Nairobi, Kenya 🇰🇪 |

---

<div align="center">
  <p><strong>Built with 💙 by Lucky Nakola</strong></p>
  <p><sub>© 2026 — All rights reserved</sub></p>
</div>
