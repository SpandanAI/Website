# SpandanAI — File Map

Maps website features to the actual files that implement them.

Paths are relative to the repository root.

---

## Application entry and shell

| Feature | File(s) |
|---------|---------|
| HTML document, SEO meta, favicons, OG/Twitter tags, canonical | `index.html` |
| React mount | `src/main.jsx` (`BrowserRouter`) |
| Shared application shell | `src/App.jsx` |
| Skip to main content (shared) | `src/App.jsx` (`.skip-link` in `src/index.css`) |
| Homepage composition | `src/pages/HomePage.jsx` (`#main-content` skip target) |
| Team page composition (`/team`) | `src/pages/TeamPage.jsx` (`#main-content` skip target) |
| Client unmatched-route fallback | `src/pages/NotFoundPage.jsx` (`#main-content` skip target) |
| Route change scroll (top unless hash) | `src/components/RouteScrollManager.jsx` |
| Global CSS, CSS variables, reduced-motion, header/scroll-button styles, Manrope `@font-face`, selection highlight, body `user-select: none` with form exceptions; `--navbar-height` compact token uses `@media not all and (min-width: 768px)` (Tailwind `md` inverse); short-viewport Hero spacing (`.hero-section` / `.hero-copy` / `.hero-lede` / `.hero-cta-row`) | `src/index.css` |
| Tailwind theme (colors, shadow, Manrope `fontFamily.sans`) | `tailwind.config.js` |
| PostCSS | `postcss.config.cjs` |
| npm scripts and dependencies | `package.json` |
| Locked versions | `package-lock.json` |

---

## Navigation and chrome

| Feature | File(s) |
|---------|---------|
| Sticky navbar, mobile drawer (`<nav id="mobile-navigation">`), desktop primary nav landmark, route-aware `/team` links, “Partner With Us”, mobile Escape/focus cycle, `aria-controls` | `src/components/Header.jsx` |
| Nav link labels and hash hrefs (Home, Use Cases, Team, Contact) | `src/data/siteContent.js` (`navigationLinks`) |
| Resolve homepage vs `/team` destinations | `src/lib/navHrefs.js` |
| Custom event that forces active nav after CTA click | `src/lib/activeNavEvent.js` |
| Top scroll progress bar | `src/components/ScrollProgressBar.jsx` |
| Floating scroll-to-top button (hamburger-mode only; `scrollY > innerHeight * 1.1`; `inert` / not tabbable when hidden) | `src/components/ScrollToTopButton.jsx`, `.scroll-top-button` in `src/index.css` |
| Footer logo, copyright, mailto email (selectable; no Copy UI) | `src/components/Footer.jsx` |
| Shared section title block (eyebrow / h2 / description) | `src/components/SectionHeading.jsx` |
| Shared Framer Motion variants | `src/lib/animations.js` |

---

## Hero / landing

| Feature | File(s) |
|---------|---------|
| Hero layout, H1, badge, subtitle, “Explore Use Cases” CTA, parallax layer, overlays; class hooks for short-viewport CSS (`hero-section`, `hero-copy`, `hero-lede`, `hero-cta-row`) | `src/components/Hero.jsx` |
| Interactive node-network canvas (landing animation, including Phase 6 cursor discharge) | `src/components/NeuralNetworkBackground.jsx` |
| Electrical-arc / targeting / micro-spark helpers used by the hero canvas and global overlay; Phase 6B `generateClickDischarge` with 6B.1 jagged geometry and 6B.2 branch levels/weights | `src/lib/neuralEffects.js` |
| Site-wide electrical overlay (Phase 6 random sparks; Phase 6B approved click/tap discharge with visual hierarchy) | `src/components/ElectricalCursorOverlay.jsx` |
| App shell composition (mounts overlay) | `src/App.jsx` |
| Hero photographic background | `public/images/wave-background.png` (referenced from `Hero.jsx`) |
| Header/footer brand mark actually used | `public/images/logo-light.webp` |

---

## Use Cases

| Feature | File(s) |
|---------|---------|
| Section UI (five-card CSS Grid: 1-col / 2+2+1 / 3+2); card body copy **16px** | `src/components/Applications.jsx` |
| **Use-case data (title + description)** — five-card Use Cases including Cryo-CMOS | `src/data/siteContent.js` (`applicationTabs`) |

To add or edit a use case, the data change belongs in `src/data/siteContent.js`. Five-card placement is controlled by the grid classes in `Applications.jsx`.

---

## Team

| Feature | File(s) |
|---------|---------|
| Homepage Leadership section + Meet the Team CTA; homepage leadership photos use `loading="lazy"` | `src/components/Founders.jsx` |
| Reusable member card (`width`/`height` 176, `decoding="async"`, loading from caller) | `src/components/TeamMemberCard.jsx` |
| **Team data** (`leadershipMembers`, empty `teamMembers`, `teamGroupPhoto`) | `src/data/teamContent.js` |
| Dedicated `/team` page | `src/pages/TeamPage.jsx` |
| N.R. Rohan photo | `public/images/N.R. Rohan.jpg` |
| K. Dharanidhar G photo | `public/images/K. Dharanidhar G.jpg` |
| S. Aniruddhan photo | `public/images/S. Aniruddhan.jpg` |
| V. S. Chakravarthy photo | `public/images/V. S. Chakravarthy.jpg` |

LinkedIn fields exist as `null` only. Cards are **not** clickable. **No group photo file.** Additional `teamMembers` count is **0**.

How to add a real future member: `docs/TEAM_CONTENT_GUIDE.md`.

---

## Contact

| Feature | File(s) |
|---------|---------|
| Contact copy, email card (Email Us + Copy), focus-areas card, form, mailto submit | `src/components/Contact.jsx` |
| Footer mailto (same address; no duplicate Copy UI) | `src/components/Footer.jsx` |

Destination address (hard-coded in both files): `spandanai.sard@gmail.com`

---

## SEO / crawlability / social

| Feature | File(s) |
|---------|---------|
| `<title>`, meta description, canonical, OG, Twitter, favicon links | `index.html` |
| robots.txt | `public/robots.txt` |
| sitemap.xml | `public/sitemap.xml` |
| Open Graph image | `public/images/og-image.png` |
| Favicon | `public/favicon.ico`, `public/favicon-32x32.png`, `public/apple-touch-icon.png` |
| Schema.org JSON-LD | **Not present** |
| Web app manifest | **Not present** |

---

## Deployment

| Feature | File(s) |
|---------|---------|
| Vercel build command, output dir, security headers, `/team` SPA rewrite | `vercel.json` |
| Local Vercel project link (gitignored) | `.vercel/project.json` |
| Production output | `dist/` (generated; do not treat as source) |

---

## Content / docs already in the repo (not product UI)

| File | Role |
|------|------|
| `README.md` | Minimal getting-started notes |
| `PRE_LAUNCH_AUDIT_REPORT.md` | July 2026 audit — **partially stale** |
| `PRE_LAUNCH_IMPLEMENTATION_REPORT.md` | July 2026 implementation notes |
| `TYPOGRAPHY_REVIEW_REPORT.md` | July 2026 typography notes |
| `docs/SPANDANAI_PROJECT_AUDIT.md` | This Phase 0 comprehensive audit |
| `docs/SPANDANAI_PROJECT_STATE.md` | Factual snapshot |
| `docs/SPANDANAI_REQUIREMENTS.md` | Stakeholder requirements vs suggestions |
| `docs/SPANDANAI_FILE_MAP.md` | This file |
| `docs/PHASE_1_COMPLETION_REPORT.md` | Phase 1 GitHub integration report |
| `docs/PHASE_2A_MESSAGING_SEO_PROPOSAL.md` | Phase 2A messaging/SEO proposal (not implemented) |
| `docs/PHASE_6A_CURSOR_DISCHARGE_PROTOTYPE.md` | Phase 6A–6A.7 interaction/typography history and final acceptance |
| `docs/PHASE_6_COMPLETION_REPORT.md` | Phase 6 GitHub landing report (committed/pushed; not deployed) |
| `docs/PHASE_3_CRYO_CMOS_PROTOTYPE.md` | Phase 3 Cryo-CMOS + five-card layout history and final acceptance |
| `docs/PHASE_3_COMPLETION_REPORT.md` | Phase 3 GitHub landing report (committed/pushed; not deployed) |
| `docs/PHASE_5_5_TEAM_PAGE_PROTOTYPE.md` | Phase 5.5 Team page + router history and final acceptance |
| `docs/PHASE_5_5_COMPLETION_REPORT.md` | Phase 5.5 GitHub landing report (committed/pushed; not deployed) |
| `docs/TEAM_CONTENT_GUIDE.md` | How to add real members / photos later |
| `docs/PHASE_7A_ENGINEERING_QUALITY_AUDIT.md` | Phase 7A accessibility / responsive / performance / code-quality audit (historical findings; 7B addressed listed A11Y items) |
| `docs/PHASE_7_ENGINEERING_ROADMAP.md` | Follow-on implementation phases derived from the 7A audit |
| `docs/PHASE_7B_ACCESSIBILITY_PROTOTYPE.md` | Phase 7B accessibility prototype history |
| `docs/PHASE_7B_COMPLETION_REPORT.md` | Phase 7B GitHub landing report (committed/pushed; not deployed) |
| `docs/PHASE_6B_GLOBAL_ELECTRICAL_POLISH_PROTOTYPE.md` | Phase 6B / 6B.1 / 6B.2 global click/tap discharge history and final approval (committed/pushed; not deployed) |
| `docs/PHASE_7C_RESPONSIVE_HARDENING_PROTOTYPE.md` | Phase 7C RESP-01/RESP-02 prototype history |
| `docs/PHASE_7C_COMPLETION_REPORT.md` | Phase 7C GitHub landing report (committed/pushed; not deployed) |
| `docs/PHASE_7D_IMAGE_PERFORMANCE_PROTOTYPE.md` | Phase 7D image/asset performance prototype history |
| `docs/PHASE_7D_COMPLETION_REPORT.md` | Phase 7D GitHub landing report (committed/pushed; not deployed) |

---

## Intentionally unused / empty

| Path | Notes |
|------|--------|
| `src/assets/` | Empty directory |
| `public/images/logo-dark.webp` | Not referenced by any component |
| `public/images/logo-dark.png` | Not referenced |
| `public/images/logo-light.png` | Not referenced (WebP is used instead) |
| `src/lib/animations.js` → `cardHover` | Exported, never imported |

---

## Stakeholder-requirement file targets (for later phases)

| Requirement | Primary files |
|-------------|---------------|
| New Cryo-CMOS use case | `src/data/siteContent.js`, possibly `src/components/Applications.jsx` (grid) |
| GitHub upload prep | `.gitignore`, `README.md`, new git repo (none exists), `package.json` |
| Clickable LinkedIn photos | `src/data/teamContent.js` (`linkedin`), `src/components/TeamMemberCard.jsx` (blocked until real URLs) |
| Neuron-firing hero | `src/components/NeuralNetworkBackground.jsx`, `src/lib/neuralEffects.js` (Phase 6 electrical network shipped on GitHub; not a full biological neuron model) |
| Team group photo | `src/data/teamContent.js` (`teamGroupPhoto`), `src/pages/TeamPage.jsx` (renders only when a real asset is set) |
