# SpandanAI — Project State Snapshot

**Snapshot date:** 31 August 2026  
**Production URL:** https://spandanai.com/  
**Workspace:** local website source directory (absolute filesystem path omitted for the public GitHub repository)  

**Scope:** Factual state of the repository *today*. No recommendations.

This snapshot supersedes stale items in the July 2026 root reports (`PRE_LAUNCH_AUDIT_REPORT.md`, `PRE_LAUNCH_IMPLEMENTATION_REPORT.md`, `TYPOGRAPHY_REVIEW_REPORT.md`) where the code has since changed.

---

## Stack

| Item | Value |
|------|--------|
| Site type | Client-rendered single-page app (SPA) |
| UI library | React **19.2.5** (from `package-lock.json`; `package.json` says `"latest"`) |
| Language | JavaScript / JSX — **not TypeScript** |
| Build tool | Vite **8.0.10** (from lockfile; `package.json` says `"latest"`) |
| Package manager | npm (`package-lock.json` present) |
| CSS | Tailwind CSS **3.4.19** + `src/index.css` |
| PostCSS | `postcss.config.cjs` — Tailwind only; no Autoprefixer |
| Animation | Framer Motion **12.38.0** + custom Canvas 2D hero |
| Routing | **None.** No React Router. One HTML document. In-page hash anchors only. |
| Backend | **None.** No API, no serverless functions, no database |
| Analytics | **None** |
| Fonts | System UI stack (Tailwind default). No Google Fonts / no `@font-face` |
| Tests | **None.** No test runner, no lint script, no typecheck script |
| Vite config file | **Absent** (`vite.config.*` does not exist) |

`package.json` name is still `neutral-ai-landing-page`.

---

## Architecture

```
index.html → src/main.jsx → src/App.jsx
                              ├── ScrollProgressBar
                              ├── Header
                              ├── ScrollToTopButton
                              └── <main>
                                    ├── Hero (+ NeuralNetworkBackground)
                                    ├── Applications (Use Cases)
                                    ├── Founders (Team)
                                    └── Contact
                              └── Footer
```

- Content for nav + use cases: `src/data/siteContent.js`
- Team data: hard-coded inside `src/components/Founders.jsx` (not in `siteContent.js`)
- Shared motion variants: `src/lib/animations.js`
- Active-nav custom event: `src/lib/activeNavEvent.js`
- `src/assets/` exists and is **empty**

---

## Routes / pages

| URL | What it is |
|-----|------------|
| `/` | The entire website |
| `#home` | Hero |
| `#use-cases` | Use Cases |
| `#team` | Leadership Team |
| `#contact` | Contact |

There is **no** `/about`, `/technology`, `/products`, `/team` page, `/blog`, or legal page.

---

## Current website sections (verified)

1. Sticky header / primary nav
2. Hero / landing (`#home`)
3. Use Cases (`#use-cases`) — 4 cards
4. Leadership Team (`#team`) — 4 people
5. Contact (`#contact`) — mailto form
6. Footer
7. Scroll progress bar (top)
8. Scroll-to-top button

**Not present:** About, Technology, Products, Careers, Research, News, Team group photo, social icon row.

---

## Major assets

All under `public/` (copied to `dist/` on build):

| Path | Size | Dimensions | Referenced? |
|------|------|------------|-------------|
| `public/images/logo-light.webp` | 12 KB | 320×213 | Yes — Header, Footer |
| `public/images/logo-light.png` | 24 KB | 320×213 | No (dead asset) |
| `public/images/logo-dark.webp` | 4.9 KB | 280×201 | No (dead asset) |
| `public/images/logo-dark.png` | 34 KB | 280×201 | No (dead asset) |
| `public/images/wave-background.png` | 55 KB | 1024×442 | Yes — Hero CSS background |
| `public/images/og-image.png` | 84 KB | 1200×630 | Yes — Open Graph / Twitter |
| `public/images/N.R. Rohan.jpg` | 20 KB | 507×389 | Yes — Team |
| `public/images/K. Dharanidhar G.jpg` | 156 KB | 1520×1600 | Yes — Team |
| `public/images/S. Aniruddhan.jpg` | 52 KB | 391×422 | Yes — Team |
| `public/images/V. S. Chakravarthy.jpg` | 265 KB | 1439×1600 | Yes — Team |
| `public/favicon.ico` | 562 B | 16×16 | Yes |
| `public/favicon-32x32.png` | 1.3 KB | 32×32 | Yes |
| `public/apple-touch-icon.png` | 17 KB | 180×180 | Yes |
| `public/robots.txt` | — | — | Yes |
| `public/sitemap.xml` | — | — | Yes (single URL, lastmod 2026-07-04) |

No group/team photograph exists in the repository.

---

## Deployment

| Item | Value |
|------|--------|
| Platform | Vercel (confirmed live: `server: Vercel`, `x-vercel-cache: HIT`, region `bom1`) |
| Config | `vercel.json` — `buildCommand: npm run build`, `outputDirectory: dist`, security headers |
| Linked project | `.vercel/project.json` — `projectName: spandanai` (gitignored) |
| Custom domain | `https://spandanai.com/` is live and serving this codebase (same JS hash `index-DKRU34Cm.js`) |
| Env vars | **None required.** No `.env` files |
| Framework | Vite static output |
| Rewrites / redirects | **None** in `vercel.json` |

Live response for `/` is HTTP 200 with the security headers from `vercel.json` applied.

---

## Git status

| Item | Value |
|------|--------|
| Git repository? | **No.** `fatal: not a git repository` |
| Branch | N/A |
| Commits | N/A |
| Remote | N/A |
| Working tree | N/A |
| `.gitignore` | Contains only `.vercel` |
| LICENSE | **Absent** |
| README | Present, minimal (`README.md`) |

---

## Known issues (observed, not fixed)

- Folder is not a Git repository; `.gitignore` would not ignore `node_modules/` or `dist/` if Git were initialized carelessly.
- No LinkedIn URLs anywhere in source.
- Team photos are not clickable.
- No team group photo.
- Hero canvas runs a continuous `requestAnimationFrame` loop and does not pause when off-screen; reduced-motion only skips ripples.
- No touch handlers on the canvas.
- Contact is Gmail `mailto:` only (`spandanai.sard@gmail.com`).
- Page `<title>` is only `SpandanAI`.
- No Schema.org JSON-LD, no web app manifest.
- Phrase **"Innovating AI with Semiconductors" does not exist in this repository or on the live homepage HTML/JS.**
- Brand name **SpandanAI** is repeated in title, H1, header text, footer text, and two `alt` attributes.
- `package.json` pins React/Vite as `"latest"`.
- No tests / lint / typecheck.
- Use-case hover variant `cardHover` is defined and unused.
- Empty `src/assets/` directory.
- Team data lives in the component, not in `siteContent.js`.
- Filenames with spaces (`K. Dharanidhar G.jpg`, etc.).

---

## Important constraints

- **Do not treat this as a Next.js app.** It is a Vite + React SPA.
- Adding extra URL routes requires new routing infrastructure (or extra HTML entries).
- Contact cannot store submissions without adding a backend/service.
- Canvas hero is already the interaction surface; replacing it with WebGL/Three.js is not required for the neuron idea.
- Prior July 2026 reports are partially stale (favicons, OG, robots, sitemap, headers, team photos, compressed logos are now present).
- Production is already live. Changes will affect the public site on the next Vercel deploy.
