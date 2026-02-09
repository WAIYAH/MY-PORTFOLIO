# Architecture Blueprint — Lucky Nakola Portfolio

> Version 2.0 | Principal Engineer Redesign | February 2026

---

## A. Strategic Foundation

### Vision Statement
Transform Lucky Nakola's portfolio from a single-page showcase into a multi-page, tier-1 developer portfolio that commands attention from senior engineering leads, demonstrates architectural thinking, and communicates professional value with precision and taste.

### Target Audience
| Audience | Goal | Key Signal |
|---|---|---|
| Technical Recruiters | Quick competency assessment | Clean UI, project evidence, downloadable CV |
| Senior Engineers / CTOs | Evaluate architectural maturity | Code quality, design system thinking, interaction polish |
| Potential Collaborators | Assess communication & style | Content quality, personality, professional narrative |
| Open-Source Community | Gauge contribution readiness | GitHub presence, project breadth, technical writing |

### Success Metrics
- Lighthouse Performance: ≥ 90
- Lighthouse Accessibility: ≥ 95
- Lighthouse Best Practices: ≥ 95
- Lighthouse SEO: ≥ 95
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- Total page weight (per page): < 250KB gzipped (excluding images)

---

## B. Technical Architecture

### Stack
| Layer | Technology | Rationale |
|---|---|---|
| Markup | HTML5 Semantic | SEO, accessibility, screen-reader support |
| Styling | Tailwind CSS (CDN) + Custom CSS | Rapid utility-first styling with custom design tokens |
| Scripting | Vanilla ES6+ JavaScript | Zero framework overhead, demonstrates core mastery |
| Fonts | Inter + Space Grotesk + JetBrains Mono | Professional, modern, developer-appropriate |
| Icons | Inline SVG | Zero requests, tree-shakeable, accessible |
| Animation | CSS Animations + Intersection Observer | Native performance, no library overhead |

### File Architecture
```
/
├── index.html              # Hero landing page
├── about.html              # Professional narrative
├── expertise.html          # Skills & capabilities
├── projects.html           # Case studies & project showcase
├── insights.html           # Technical perspectives & articles
├── contact.html            # Contact form & information
├── cv/
│   ├── view.html           # Interactive CV experience
│   ├── print.html          # Print-optimized resume
│   └── download.html       # Download options
├── css/
│   └── styles.css          # Design tokens, components, animations
├── js/
│   └── app.js              # Navigation, animations, interactions
├── img/                    # Project screenshots & assets
├── pdf/                    # Downloadable documents
└── docs/
    └── ARCHITECTURE_BLUEPRINT.md
```

### Component Architecture
All pages share: Navigation, Footer, Scroll-to-top, Page transition overlay.
Components are embedded in HTML (no JS rendering) for:
- Zero FOUC on critical layout
- Full SEO crawlability
- Graceful degradation without JS

JavaScript enhances with: scroll animations, mobile menu, typing effects, form validation, counters.

---

## C. Design System

### Design Tokens

**Colors**
```
Background:   #030712 (base), #0f172a (surface), #1e293b (elevated)
Text:         #f1f5f9 (primary), #94a3b8 (secondary), #64748b (tertiary)
Accent:       #06b6d4 (cyan-500), #22d3ee (cyan-400), #0891b2 (cyan-600)
Gold:         #eab308 (brand accent), #facc15 (light), #ca8a04 (dark)
Gradient:     135deg, #06b6d4 → #8b5cf6 (cyan → violet)
```

**Typography**
```
Headings:     Space Grotesk, 600-700 weight
Body:         Inter, 400-500 weight
Code/Mono:    JetBrains Mono, 400 weight
Scale:        text-sm(0.875) → text-base(1) → text-lg(1.125) → text-xl(1.25) → text-2xl(1.5) → text-4xl(2.25) → text-6xl(3.75)
```

**Spacing**
8px baseline grid. Tailwind's default scale (p-1 = 4px, p-2 = 8px, etc.)

**Motion**
```
Duration:     150ms (micro), 300ms (standard), 500ms (emphasis), 800ms (entrance)
Easing:       cubic-bezier(0.16, 1, 0.3, 1) — smooth deceleration
Reduced:      Respect prefers-reduced-motion
```

### Responsive Breakpoints (Mobile-First)
```
base:  320px+   (mobile)
sm:    640px+   (large mobile / small tablet)
md:    768px+   (tablet)
lg:    1024px+  (desktop)
xl:    1280px+  (large desktop)
2xl:   1536px+  (ultra-wide)
```

---

## D. Implementation Phases

### Phase 1: Foundation
- [x] Architecture Blueprint
- [ ] Design token system (CSS custom properties)
- [ ] Base component styles (buttons, cards, badges, forms)
- [ ] Animation system (keyframes, scroll reveal)
- [ ] JavaScript interaction engine

### Phase 2: Core Pages
- [ ] index.html — Hero landing with stats & featured work
- [ ] about.html — Professional story, timeline, philosophy
- [ ] expertise.html — Skills matrix, tools, methodologies
- [ ] Navigation system with active states
- [ ] Footer with social proof

### Phase 3: Content Pages
- [ ] projects.html — Filterable project showcase
- [ ] insights.html — Technical perspectives
- [ ] contact.html — Form with validation

### Phase 4: CV Microsite
- [ ] cv/view.html — Interactive resume
- [ ] cv/print.html — Print-optimized
- [ ] cv/download.html — Download hub

### Phase 5: Polish & Audit
- [ ] Cross-browser testing
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Performance optimization
- [ ] SEO validation
- [ ] Final content review

---

## E. Quality Gates

### Code Review Checklist
- [ ] Semantic HTML5 elements used correctly
- [ ] All images have descriptive alt text
- [ ] All interactive elements are keyboard accessible
- [ ] Color contrast meets WCAG AA (4.5:1 minimum)
- [ ] No console errors or warnings
- [ ] Valid HTML (W3C validator)
- [ ] Consistent naming conventions
- [ ] Comments on complex logic only

### Performance Budget
| Metric | Target | Maximum |
|---|---|---|
| FCP | < 1.2s | 1.5s |
| LCP | < 2.0s | 2.5s |
| CLS | < 0.05 | 0.1 |
| FID | < 50ms | 100ms |
| JS Bundle | < 15KB | 25KB |
| CSS Bundle | < 10KB | 20KB |

### Browser Support Matrix
| Browser | Version | Priority |
|---|---|---|
| Chrome | Last 2 | P0 |
| Firefox | Last 2 | P0 |
| Safari | Last 2 | P0 |
| Edge | Last 2 | P0 |
| Mobile Safari | iOS 15+ | P0 |
| Chrome Android | Last 2 | P0 |

---

*Blueprint authored with principal-engineer rigor. Implementation begins upon completion.*
