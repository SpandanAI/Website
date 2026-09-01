# SpandanAI — Project State Snapshot

**Snapshot date:** 1 September 2026 (updated after Phase 6B GitHub landing; production remains undeployed)  
**Production URL:** https://spandanai.com/  
**Workspace:** local website source directory (absolute filesystem path omitted for the public GitHub repository)  
**Scope:** Factual state of the repository *today*. No recommendations.

This snapshot supersedes stale items in the July 2026 root reports (`PRE_LAUNCH_AUDIT_REPORT.md`, `PRE_LAUNCH_IMPLEMENTATION_REPORT.md`, `TYPOGRAPHY_REVIEW_REPORT.md`) where the code has since changed.

Phase 0 documented the product. Phase 1 connected this workspace to the official public GitHub repository without changing the website UI.

Phase 2A messaging/SEO proposal completed; no application changes implemented. See `docs/PHASE_2A_MESSAGING_SEO_PROPOSAL.md`. Proposed copy is **not** live.

**Phase 2B** remains paused (visible positioning language needs stakeholder confirmation).

**Phase 5.5:** APPROVED. Feature commit `c12e926` (`feat: add dedicated team page and routing`). GitHub: **PUSHED** to `origin/main`. Production: **NOT DEPLOYED.** Route `/team` implemented. Homepage still shows only the current four leadership members plus Meet the Team. `teamMembers`: **0**. LinkedIn: **pending real URLs**. Group photo: **pending real asset**. See `docs/PHASE_5_5_TEAM_PAGE_PROTOTYPE.md`, `docs/PHASE_5_5_COMPLETION_REPORT.md`, and `docs/TEAM_CONTENT_GUIDE.md`.

**Phase 3:** APPROVED. Feature commit `410d66e` (`feat: add Cryo-CMOS use case and responsive card layout`). GitHub: **PUSHED** to `origin/main`. Production: **NOT DEPLOYED.** Cryo-CMOS fifth Use Case, 3+2 / 2+2+1 / 1-column layout, 16px descriptions, mobile-only Back-to-Top (`md:hidden`, threshold `1.1 × innerHeight`). See `docs/PHASE_3_CRYO_CMOS_PROTOTYPE.md` and `docs/PHASE_3_COMPLETION_REPORT.md`.

**Phase 6 (6A–6A.7):** Approved. Git: committed (`5b8bf35`). GitHub: pushed to `origin/main`. Production: **NOT deployed.** Hero copy/SEO unchanged. Phase 2B remains paused pending stakeholder wording confirmation. See `docs/PHASE_6A_CURSOR_DISCHARGE_PROTOTYPE.md` and `docs/PHASE_6_COMPLETION_REPORT.md`.

**Phase 7A:** COMPLETE. Engineering quality audit. No product changes in the audit itself. See `docs/PHASE_7A_ENGINEERING_QUALITY_AUDIT.md` and `docs/PHASE_7_ENGINEERING_ROADMAP.md`. GitHub: **PUSHED** (documentation commit). Production: **NOT DEPLOYED.**

**Phase 7A.1:** Temporary local audit helper `/tmp/spandan-audit.py` (not in the repository, not part of the product) was removed after review.

**Phase 7B / 7B.1:** COMPLETE / HUMAN APPROVED. Feature commit `bc97490` (`feat: improve website accessibility`). GitHub: **PUSHED** to `origin/main`. Production: **NOT DEPLOYED.** Skip link, Back-to-Top keyboard hiding, dark-header active-nav `#60a5fa`, mobile menu Escape/focus, placeholder contrast, header logo `alt=""`, 44×44 hamburger, mobile `<nav id="mobile-navigation">` landmark. A11Y-07 deferred. See `docs/PHASE_7B_ACCESSIBILITY_PROTOTYPE.md` and `docs/PHASE_7B_COMPLETION_REPORT.md`.

**Phase 6B / 6B.1 / 6B.2:** COMPLETE / HUMAN MOTION REVIEW PASS. Feature commit `7e13358` (`feat: polish global electrical interactions`). GitHub: **PUSHED** to `origin/main`. Production: **NOT DEPLOYED.** Dedicated non-Hero click/tap discharge, jagged/asymmetric geometry, primary/secondary/tertiary visual hierarchy. Hero canvas and ambient random sparks unchanged. No 6B.3. See `docs/PHASE_6B_GLOBAL_ELECTRICAL_POLISH_PROTOTYPE.md`.

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
| Routing | **React Router** `react-router-dom` **7.18.3**. Pages: `/` and `/team`. Homepage hash anchors remain. |
| Backend | **None.** No API, no serverless functions, no database |
| Analytics | **None** |
| Fonts | **Manrope Variable**: `@fontsource-variable/manrope` **5.3.0**, Latin WOFF2 self-hosted via `@font-face` in `src/index.css`. No Google Fonts CDN. |
| Tests | **None.** No test runner, no lint script, no typecheck script |
| Vite config file | **Absent** (`vite.config.*` does not exist) |

`package.json` name is `spandanai-website` (`private: true`). Dependencies are pinned to the Phase 0 working versions (not `"latest"`).

---

## Architecture

```
index.html → src/main.jsx (BrowserRouter) → src/App.jsx
                              ├── RouteScrollManager
                              ├── ScrollProgressBar
                              ├── Header
                              ├── ScrollToTopButton
                              ├── Routes
                              │     ├── /       → HomePage (Hero, Applications, Founders, Contact)
                              │     └── /team   → TeamPage
                              ├── Footer
                              └── ElectricalCursorOverlay (Phase 6 site-wide sparks)
```

- Content for nav + use cases: `src/data/siteContent.js`
- Team data: `src/data/teamContent.js` (`leadershipMembers`, empty `teamMembers`, `teamGroupPhoto: null`)
- Shared member card: `src/components/TeamMemberCard.jsx`
- Shared motion variants: `src/lib/animations.js`
- Active-nav custom event: `src/lib/activeNavEvent.js`
- Hero electrical-effect helpers: `src/lib/neuralEffects.js` (Phase 6; Phase 6B `generateClickDischarge`; 6B.1 jagged geometry; 6B.2 path levels/weights — Hero helpers unchanged)
- Site-wide electrical overlay: `src/components/ElectricalCursorOverlay.jsx` (Phase 6 random/tap/click; Phase 6B approved click/tap discharge with hierarchy drawing)
- `src/assets/` exists and is **empty**

---

## Routes / pages

| URL | What it is |
|-----|------------|
| `/` | Homepage |
| `#home` | Hero |
| `#use-cases` | Use Cases |
| `#team` | Homepage Leadership Team |
| `#contact` | Contact |
| `/team` | Dedicated Team page (on GitHub `main`; **not** production-deployed) |

There is **no** `/about`, `/technology`, `/products`, `/blog`, or legal page.

---

## Current website sections (verified)

1. Sticky header / primary nav
2. Hero / landing (`#home`)
3. Use Cases (`#use-cases`) — **5 cards** including Cryo-CMOS (on GitHub `main`; production still has 4 until the next Vercel deploy)
4. Leadership Team (`#team`) — 4 people + Meet the Team CTA (opens `/team`)
5. Contact (`#contact`) — mailto form
6. Footer
7. Scroll progress bar (top)
8. Scroll-to-top button
9. Team page `/team` — same 4 leaders; no extra fabricated members

**Not present:** About, Technology, Products, Careers, Research, News, Team group photo, social icon row, LinkedIn links.

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
| Config | `vercel.json` — `buildCommand: npm run build`, `outputDirectory: dist`, security headers, exact rewrite `/team` → `/index.html` (**not deployed**) |
| Linked project | `.vercel/project.json` — `projectName: spandanai` (gitignored) |
| Custom domain | `https://spandanai.com/` is live and serving this codebase (same JS hash `index-DKRU34Cm.js`) |
| Env vars | **None required.** No `.env` files |
| Framework | Vite static output |
| Rewrites / redirects | Exact `/team` → `/index.html` in `vercel.json` (**not production-deployed**) |

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
| Phase 2A documentation commit | `c040b66` — `docs: propose Phase 2 messaging and SEO` |
| Phase 6 feature commit | `5b8bf35` — `feat: add interactive electrical experience and UI polish` |
| Phase 3 feature commit | `410d66e` — `feat: add Cryo-CMOS use case and responsive card layout` |
| Phase 5.5 feature commit | `c12e926` — `feat: add dedicated team page and routing` |
| Phase 7B feature commit | `bc97490` — `feat: improve website accessibility` |
| Phase 6B feature commit | `7e13358` — `feat: polish global electrical interactions` |
| Remote push | **SUCCESS** (Phase 6B: normal fast-forward from `8a4e4b8`; no force). GitHub is **not** automatically connected to Vercel. |
| Working tree | **Clean after the Phase 6B documentation commit.** Phase 6B is on GitHub `main`. **Not production-deployed.** |
| `.gitignore` | Safe baseline (`node_modules/`, `dist/`, `.vercel/`, `.env*`, logs, OS/editor junk) |
| LICENSE | **Absent** (intentionally not added; company decision pending) |
| README | Professional project README (`README.md`) |
| Package | `spandanai-website` |
| Dependencies | Pinned / reproducible. Phase 5.5 added only `react-router-dom` **7.18.3**. |
| Build | `npm run build` **pass** (Phase 6B: `index-Uk72Fn2K.js` 407.82 kB gzip 130.41 kB, `index-DwcHyqYN.css` 19.43 kB, Manrope WOFF2 `manrope-latin-wght-normal-DHIcAJRg.woff2` 24.83 kB). |

---

## Known issues (observed, not fixed)

- GitHub integration is complete; remaining product issues below are unchanged from Phase 0.
- No LinkedIn URLs anywhere in source.
- Team photos are not clickable.
- No team group photo.
- Hero canvas Phase 6 pauses off-screen / in hidden tabs and freezes under reduced motion; electrical arcs, pulses, and random firing are disabled when `prefers-reduced-motion: reduce`.
- Touch: no fake cursor; a hero tap may fire one localized discharge; lower-page taps may fire a localized micro-spark. Scroll/drag does not spark.
- Contact uses provider-neutral `mailto:spandanai.sard@gmail.com` (Email Us + form submit + Copy). No Gmail-only action.
- Page `<title>` is `SpandanAI` on the homepage; `/team` sets `Team | SpandanAI` in JavaScript. Canonical/OG remain homepage-global.
- No Schema.org JSON-LD, no web app manifest.
- Phrase **"Innovating AI with Semiconductors" does not exist in this repository or on the live homepage HTML/JS.**
- Brand name **SpandanAI** appears in the title, H1, header text, and footer text. The header logo image is decorative (`alt=""`). The footer logo image still uses `alt="SpandanAI"`.
- React/Vite are now pinned; do not treat `"latest"` as current.
- No tests / lint / typecheck.
- Use-case hover variant `cardHover` is defined and unused.
- Empty `src/assets/` directory.
- Team data for extra members lives in `src/data/teamContent.js` (`teamMembers` is currently empty). Leadership data was moved out of `Founders.jsx`.
- Filenames with spaces (`K. Dharanidhar G.jpg`, etc.).

**Pending engineering (not defects of this landing):** Phase 7C responsive, Phase 7D images, Phase 7E dead assets, Phase 7F tests, Phase 7G technical SEO, A11Y-07 footer focus.

**Pending stakeholder input:** LinkedIn URLs, extra team members, group photo, Phase 2B wording.

---

## Important constraints

- **Do not treat this as a Next.js app.** It is a Vite + React SPA.
- Adding extra URL routes now uses React Router (`/team`). Further routes still need matching Vercel rewrites for direct load.
- Contact cannot store submissions without adding a backend/service.
- Canvas hero is already the interaction surface; replacing it with WebGL/Three.js is not required for the neuron idea.
- Prior July 2026 reports are partially stale (favicons, OG, robots, sitemap, headers, team photos, compressed logos are now present).
- Production is already live. Changes will affect the public site on the next Vercel deploy.
- GitHub is **not** wired to Vercel in Phase 1. Do not assume a GitHub push deploys production.
