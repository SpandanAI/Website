# SpandanAI — File Map

Maps website features to the actual files that implement them.

Paths are relative to the repository root.

---

## Application entry and shell

| Feature | File(s) |
|---------|---------|
| HTML document, SEO meta, favicons, OG/Twitter tags, canonical | `index.html` |
| React mount | `src/main.jsx` |
| Page composition (section order) | `src/App.jsx` |
| Global CSS, CSS variables, reduced-motion, header/scroll-button styles | `src/index.css` |
| Tailwind theme (colors, shadow) | `tailwind.config.js` |
| PostCSS | `postcss.config.cjs` |
| npm scripts and dependencies | `package.json` |
| Locked versions | `package-lock.json` |

---

## Navigation and chrome

| Feature | File(s) |
|---------|---------|
| Sticky navbar, mobile drawer, active-section highlighting, “Partner With Us” | `src/components/Header.jsx` |
| Nav link labels and hrefs | `src/data/siteContent.js` (`navigationLinks`) |
| Custom event that forces active nav after CTA click | `src/lib/activeNavEvent.js` |
| Top scroll progress bar | `src/components/ScrollProgressBar.jsx` |
| Floating scroll-to-top button | `src/components/ScrollToTopButton.jsx` |
| Footer logo, copyright, email | `src/components/Footer.jsx` |
| Shared section title block (eyebrow / h2 / description) | `src/components/SectionHeading.jsx` |
| Shared Framer Motion variants | `src/lib/animations.js` |

---

## Hero / landing

| Feature | File(s) |
|---------|---------|
| Hero layout, H1, badge, subtitle, “Explore Use Cases” CTA, parallax layer, overlays | `src/components/Hero.jsx` |
| Interactive node-network canvas (the landing animation) | `src/components/NeuralNetworkBackground.jsx` |
| Hero photographic background | `public/images/wave-background.png` (referenced from `Hero.jsx`) |
| Header/footer brand mark actually used | `public/images/logo-light.webp` |

---

## Use Cases

| Feature | File(s) |
|---------|---------|
| Section UI (grid of cards) | `src/components/Applications.jsx` |
| **Use-case data (title + description)** | `src/data/siteContent.js` (`applicationTabs`) |

To add a fifth use case later, the data change belongs in `src/data/siteContent.js`. Layout of 5 cards is controlled by the grid classes in `Applications.jsx`.

---

## Team

| Feature | File(s) |
|---------|---------|
| Team section UI and **hard-coded member array** | `src/components/Founders.jsx` |
| N.R. Rohan photo | `public/images/N.R. Rohan.jpg` |
| K. Dharanidhar G photo | `public/images/K. Dharanidhar G.jpg` |
| S. Aniruddhan photo | `public/images/S. Aniruddhan.jpg` |
| V. S. Chakravarthy photo | `public/images/V. S. Chakravarthy.jpg` |

There is **no** LinkedIn field, no clickable photo, and **no group photo file**.

---

## Contact

| Feature | File(s) |
|---------|---------|
| Contact copy, email card, focus-areas card, form, mailto submit | `src/components/Contact.jsx` |
| Footer mailto (duplicate of same address) | `src/components/Footer.jsx` |

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
| Vercel build command, output dir, security headers | `vercel.json` |
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
| Clickable LinkedIn photos | `src/components/Founders.jsx`, ideally also `src/data/siteContent.js` |
| Neuron-firing hero | `src/components/NeuralNetworkBackground.jsx`, possibly `src/components/Hero.jsx` |
| Team group photo | New asset under `public/images/`, `src/components/Founders.jsx` and/or `src/App.jsx` |
