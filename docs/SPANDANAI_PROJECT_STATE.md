# SpandanAI — Project State Snapshot

**Snapshot date:** 31 August 2026 (updated after Phase 1)  
**Production URL:** https://spandanai.com/  
**Workspace:** local website source directory (absolute filesystem path omitted for the public GitHub repository)  
**Scope:** Factual state of the repository *today*. No recommendations.

This snapshot supersedes stale items in the July 2026 root reports (`PRE_LAUNCH_AUDIT_REPORT.md`, `PRE_LAUNCH_IMPLEMENTATION_REPORT.md`, `TYPOGRAPHY_REVIEW_REPORT.md`) where the code has since changed.

Phase 0 documented the product. Phase 1 connected this workspace to the official public GitHub repository without changing the website UI.

Phase 2A messaging/SEO proposal completed; no application changes implemented. See `docs/PHASE_2A_MESSAGING_SEO_PROPOSAL.md`. Proposed copy is **not** live.

**Phase 2B** remains paused (visible positioning language needs stakeholder confirmation).

**Phase 6 (6A–6A.7):** Human-approved interaction and typography milestone. Source is on GitHub `main`. **Production is not deployed from this push** (`https://spandanai.com/` remains the previous Vercel build). Hero copy/SEO unchanged. See `docs/PHASE_6A_CURSOR_DISCHARGE_PROTOTYPE.md`.

**Phase 1A attribution correction:** Cursor Agent appeared as a GitHub contributor because Phase 1 commits included a `Co-authored-by: Cursor` trailer. Those post-stakeholder commits were recreated with identical trees for `Korak Das` / `korakdas1` only. The stakeholder `Initial commit` (`e81f2ba`) was not rewritten. `git push --force-with-lease` was used after verifying the remote tip had not changed. No application source or behavior changed.

---

## Stack

| Item | Value |
|------|--------|
| Site type | Client-rendered single-page app (SPA) |
| UI library | React **19.2.5** (pinned in `package.json` and lockfile) |
| Language | JavaScript / JSX — **not TypeScript** |
| Build tool | Vite **8.0.10** (pinned in `package.json` and lockfile) |
| Package manager | npm (`package-lock.json` present) |
| CSS | Tailwind CSS **3.4.19** + `src/index.css` |
| PostCSS | `postcss.config.cjs` — Tailwind only; no Autoprefixer |
| Animation | Framer Motion **12.38.0** + custom Canvas 2D hero |
| Routing | **None.** No React Router. One HTML document. In-page hash anchors only. |
| Backend | **None.** No API, no serverless functions, no database |
| Analytics | **None** |
| Fonts | **Manrope Variable**: `@fontsource-variable/manrope` **5.3.0**, Latin WOFF2 self-hosted via `@font-face` in `src/index.css`. No Google Fonts CDN. |
| Tests | **None.** No test runner, no lint script, no typecheck script |
| Vite config file | **Absent** (`vite.config.*` does not exist) |

`package.json` name is `spandanai-website` (`private: true`). Dependencies are pinned to the Phase 0 working versions (not `"latest"`).

---

## Architecture

```
index.html → src/main.jsx → src/App.jsx
                              ├── ScrollProgressBar
                              ├── Header
                              ├── ScrollToTopButton
                              ├── <main>
                              │     ├── Hero (+ NeuralNetworkBackground)
                              │     ├── Applications (Use Cases)
                              │     ├── Founders (Team)
                              │     └── Contact
                              ├── Footer
                              └── ElectricalCursorOverlay (Phase 6 site-wide sparks)
```

- Content for nav + use cases: `src/data/siteContent.js`
- Team data: hard-coded inside `src/components/Founders.jsx` (not in `siteContent.js`)
- Shared motion variants: `src/lib/animations.js`
- Active-nav custom event: `src/lib/activeNavEvent.js`
- Hero electrical-effect helpers: `src/lib/neuralEffects.js` (Phase 6)
- Site-wide micro-spark overlay: `src/components/ElectricalCursorOverlay.jsx` (Phase 6; desktop random + click; mobile tap-only)
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
| Git repository? | **Yes** |
| Official remote | `https://github.com/SpandanAI/Website.git` (`origin`) |
| Branch | `main` (tracks `origin/main`) |
| Repository visibility | **Public** |
| Original stakeholder commit | `e81f2ba` — `Initial commit` (README only; hash unchanged through Phase 1A) |
| Website baseline commit | `45239c2` — `chore: add production SpandanAI website baseline` (Phase 1A rewrite of `46d2e38`) |
| Phase 1 documentation commit | `c11c2a5` — `docs: record Phase 1 GitHub integration` (Phase 1A rewrite of `4585614`) |
| Remote push | **SUCCESS** (Phase 1A: `--force-with-lease` `4585614` → `c11c2a5`) |
| Working tree | **Clean after Phase 6 push** (documentation follow-up may record the commit hash). Phase 6 is on GitHub `main`. **Not production-deployed.** |
| `.gitignore` | Safe baseline (`node_modules/`, `dist/`, `.vercel/`, `.env*`, logs, OS/editor junk) |
| LICENSE | **Absent** (intentionally not added; company decision pending) |
| README | Professional project README (`README.md`) |
| Package | `spandanai-website` |
| Dependencies | Pinned / reproducible |
| Build | `npm run build` **pass** (same bundle hashes as pre-Phase-1: `index-DKRU34Cm.js`, `index-Ht0_vUWf.css`) |

---

## Known issues (observed, not fixed)

- GitHub integration is complete; remaining product issues below are unchanged from Phase 0.
- No LinkedIn URLs anywhere in source.
- Team photos are not clickable.
- No team group photo.
- Hero canvas Phase 6 pauses off-screen / in hidden tabs and freezes under reduced motion; electrical arcs, pulses, and random firing are disabled when `prefers-reduced-motion: reduce`.
- Touch: no fake cursor; a hero tap may fire one localized discharge; lower-page taps may fire a localized micro-spark. Scroll/drag does not spark.
- Contact uses provider-neutral `mailto:spandanai.sard@gmail.com` (Email Us + form submit). Local Phase 6A.5 adds a Copy button; no Gmail-only action.
- Page `<title>` is only `SpandanAI`.
- No Schema.org JSON-LD, no web app manifest.
- Phrase **"Innovating AI with Semiconductors" does not exist in this repository or on the live homepage HTML/JS.**
- Brand name **SpandanAI** is repeated in title, H1, header text, footer text, and two `alt` attributes.
- React/Vite are now pinned; do not treat `"latest"` as current.
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
- GitHub is **not** wired to Vercel in Phase 1. Do not assume a GitHub push deploys production.
