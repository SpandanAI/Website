# SpandanAI Phase 7A — Engineering Quality Audit

## Status

AUDIT COMPLETE  
PHASE 7B ACCESSIBILITY IMPLEMENTED AND HUMAN-APPROVED  
FEATURE COMMITTED AND PUSHED (`bc97490`)  
PRODUCTION NOT DEPLOYED

**Audit date:** 1 September 2026  
**Audit HEAD:** `ac24ca9` (`docs: record Phase 5.5 completion`)  
**Feature commit:** `bc97490` (`feat: improve website accessibility`)  
**Repository:** https://github.com/SpandanAI/Website.git

**Phase 7A.1 workspace cleanup:** A temporary local Chromium CDP helper (`/tmp/spandan-audit.py`) was created during the audit and later removed. It was never in the repository, never imported by product code, never committed, never pushed, and never deployed. Related `/tmp` dumps and the headless Chrome profile were also removed. The product was not affected.

---

## Executive Summary

The accumulated GitHub `main` work (Phases 6, 3, and 5.5) **builds cleanly** and did not show P0 blockers or P1 production-breakage in this audit.

The site is a small marketing SPA. Most remaining work is **polish**, not architecture replacement.

Highest-value later engineering work:

1. Compress / resize the two large leadership JPEGs and lazy-load below-fold photos.
2. Keep the invisible Back-to-Top control out of the keyboard tab order.
3. Improve dark-header active-nav contrast.
4. Close the mobile menu with Escape and manage focus.
5. Add a skip link and a few other accessibility basics.
6. Before production deploy: decide `/team` technical SEO (sitemap/canonical) and confirm the exact Vercel `/team` rewrite is what you want.

Stakeholder-blocked items (LinkedIn, extra members, group photo, Phase 2B copy) are **not** engineering defects.

---

## Current Baseline

| Item | Value |
|------|--------|
| Stack | React 19.2.5, Vite 8.0.10, Tailwind 3.4.19, Framer Motion 12.38.0, react-router-dom 7.18.3 |
| Routes | `/`, hash sections, `/team` |
| Tests / lint / types | None |
| Production | Older deployment at https://spandanai.com/ — **not** this audit target |

---

## Build Baseline

`npm run build` **PASS**. No warnings. No errors.

```
dist/index.html                                         1.73 kB │ gzip:   0.56 kB
dist/assets/manrope-latin-wght-normal-DHIcAJRg.woff2   24.83 kB
dist/assets/index-DrMLXFnk.css                         18.83 kB │ gzip:   5.06 kB
dist/assets/index-BD4RNRl7.js                         400.26 kB │ gzip: 127.68 kB
```

Single JS chunk. No code-splitting. Size is consistent with Phase 5.5 (router + Team page vs Phase 3’s 352.81 kB JS).

Likely JS composition (not byte-accurate): React + React DOM, Framer Motion, React Router, Hero canvas, page components. **No bundle analyzer was installed.**

---

## Accessibility

No P0/P1 accessibility blockers that make the site unusable. Several P2 items are worth fixing before a public deploy of this GitHub tree.

Measured heading structure (Chromium, 1366×800 homepage):

- One `h1`: SpandanAI
- `h2`: Use Cases title, Leadership title, Contact title
- `/team`: one `h1` “Meet the Team” (`tabIndex={-1}`), one `h2`, four `h3` names

Landmarks: one `main` per page; `nav` has `aria-label="Primary navigation"`. **No skip link.**

---

## Keyboard Navigation

Tabbable homepage order (desktop, Chromium computed): logo, Home, Use Cases, Team, Contact, Partner With Us, Explore Use Cases, Meet the Team, Email Us, Copy, form fields, Contact Team, footer email.

Gaps (source + computed styles, not a full human Tab-through):

- Invisible Back-to-Top remains a real `<button>` on mobile (`opacity: 0`, `pointer-events: none`, not `disabled` / `hidden` / `inert`). It can still receive keyboard focus.
- Footer mailto can sit at Framer Motion `opacity: 0` until in-view while remaining in the tab order.
- No skip link to bypass repeating header links.

---

## Mobile Menu

Source review of `Header.jsx`:

- Accessible name: `aria-label="Toggle navigation menu"` plus redundant `sr-only` “Menu”
- `aria-expanded` is wired
- **No** `aria-controls`
- **No** Escape handler
- **No** focus trap; overlay click closes
- Nav item click calls `closeMenu()`
- Tap target measured **38×38** (class `h-10 w-10`). Passes WCAG 2.2 2.5.8 (24px); below 44×44 AAA 2.5.5

CDP `element.click()` did not reliably toggle React state in headless Chrome; do not treat that as a product bug. Human review already confirmed the hamburger works on `/team`.

---

## Forms

Contact form labels wrap inputs (Name, Email, Organization / Company, Message). `required` on name, email, message. `autocomplete` present. Email `type="email"`. Native HTML5 validation only; no custom error region.

Copy: `type="button"`, visible label swap, `aria-live="polite"` for copied/failed. Clipboard API plus `execCommand` fallback.

mailto UX: depends on a local mail client. Acceptable for this site; a backend is **optional later**, not required now.

Placeholder color `rgb(148, 163, 184)` on white is **2.56:1** (measured formula). That fails WCAG 1.4.3 if placeholders are counted as text.

---

## Responsive QA

Chromium overflow checks at 320, 360, 375, 390, 412, 430, 540, 640, 767, 768, 820, 1024, 1280, 1366, 1440, 1536, 1920: **no horizontal overflow** on `/` or `/team`.

| Width | Home Use Cases grid | `/team` cards | Hamburger | BTT | `--navbar-height` |
|-------|---------------------|---------------|-----------|-----|-------------------|
| 320–767 | 1 column | 1 column | shown | `display:block` | 80px |
| 768 | 4-col (2+2+1 spans) | 2×2 | hidden | hidden | **80px** |
| 820 | 4-col | 2×2 | hidden | hidden | 96px |
| 1024+ | 6-col (3+2) | 4-col | hidden | hidden | 96px |

**768px evidence:** Tailwind `md` (`min-width: 768px`) shows desktop nav. Custom CSS `@media (max-width: 768px)` still applies `--navbar-height: 80px`. Desktop nav + 80px token at exactly 768. Header box height measured 73px. Not a crash; scroll-offset mismatch risk.

Short viewports:

- 390×600 / 430×650: H1 and Explore CTA in view
- **667×375 landscape:** H1 in view, **Explore Use Cases CTA not in view** (hero height 517px vs 375px viewport)
- 844×390: hamburger hidden (width ≥768); CTA in view

Browser zoom 125/150/200% was **not** measured (no reliable zoom emulation without extra tooling).

---

## Browser Compatibility

| Browser | Tested? |
|---------|---------|
| Chromium/Chrome 151 headless | **Yes** — DOM, routing, overflow, titles, computed styles |
| Firefox | **Not verified.** Headless screenshot hung; killed after ~70s |
| Safari/WebKit | **Not available** on this Linux host |

`env(safe-area-inset-*)` is used with fallbacks. `-webkit-backdrop-filter` is present. Clipboard fallback exists. PostCSS has **no Autoprefixer** (already documented); prefixes that matter are hand-written where used.

---

## Performance

Local Vite (not production CDN):

- JS 400.26 kB / 127.68 kB gzip
- CSS 18.83 kB / 5.06 kB gzip
- Font 24.83 kB
- Largest images: `V. S. Chakravarthy.jpg` 270,483 bytes (1439×1600), `K. Dharanidhar G.jpg` 159,572 bytes (1520×1600), displayed at **176×176**

No Lighthouse CLI was available. **Do not treat this as a Lighthouse score.**

---

## Core Web Vital Risks

**LCP — likely risk (SPA):** Homepage paints after JS. Hero H1 / wave background are primary LCP candidates. Wave file is 55,721 bytes but named `.png` while the bytes are **JPEG 1024×442**.

**CLS — likely low / P3:** Team photos lack HTML `width`/`height` but CSS `h-44 w-44` reserves space. `font-display: swap` can cause brief text swap.

**INP — likely risk on Hero, not confirmed in traces:** 80-node pairwise line pass every frame while Hero is on-screen (`O(n²)` inner loop). Overlay rAF **stops when no sparks**. Header `setState` on scroll (active section + scrolled chrome).

No field CWV data.

---

## Images

| File | Bytes | Pixels | Used? | Loading |
|------|------:|--------|-------|---------|
| `logo-light.webp` | 11,270 | 320×213 | Header, Footer | eager / lazy (footer) |
| `logo-light.png` | 24,143 | 320×213 | **No** | — |
| `logo-dark.webp` | 4,924 | 280×201 | **No** | — |
| `logo-dark.png` | 34,619 | 280×201 | **No** | — |
| `wave-background.png` | 55,721 | 1024×442 JPEG bytes | Hero CSS | CSS background |
| `og-image.png` | 85,597 | 1200×630 | meta only | — |
| `N.R. Rohan.jpg` | 19,906 | 507×389 | cards | homepage **eager** |
| `K. Dharanidhar G.jpg` | 159,572 | 1520×1600 | cards | homepage **eager** |
| `S. Aniruddhan.jpg` | 52,811 | 391×422 | cards | homepage **eager** |
| `V. S. Chakravarthy.jpg` | 270,483 | 1439×1600 | cards | homepage **eager** |

Optimization candidates (later, do not do now): Chakravarthy JPEG, Dharanidhar JPEG, homepage `loading="eager"` below the fold, optional WebP/AVIF derivatives, rename wave JPEG.

---

## Fonts

Manrope Variable Latin WOFF2, `font-display: swap`, weights 200–800, self-hosted `@font-face`. No Google Fonts. No `<link rel="preload">`. Fallback stack includes system UI. Implementation is already reasonable; preload is optional.

---

## Hero Canvas

`NeuralNetworkBackground.jsx`: `NODE_COUNT = 80`, connection distance 140, nested pair loop each frame, DPR cap 2, IntersectionObserver pause (`HERO_VISIBILITY_THRESHOLD = 0.12`), `visibilitychange` pause, reduced-motion freeze + `drawNetwork(..., false)`, pointer/tap with interactive-target suppression, cleanup on unmount.

This is an **accepted Phase 6 product cost**, already mitigated. Further node reduction is optional later, not a defect in the approved experience.

---

## Global Electrical Overlay

`ElectricalCursorOverlay.jsx`: rAF **exits when `activeSparks` is empty**. Max 2 sparks. DPR cap 2. Missing `#home` → not inside Hero. Desktop random + click; mobile tap-only; reduced motion suppressed; hidden-tab clears sparks. Cleanup present.

Idle overlay cost is mainly pointer listeners, not a continuous draw loop.

---

## Reduced Motion

Emulated `prefers-reduced-motion: reduce` in Chromium:

- `html` `scroll-behavior: auto`
- matchMedia true
- Global CSS kills CSS animations/transitions
- JS canvas path freezes / does not spark

Framer `whileHover` is skipped when `useReducedMotion()` is true. Hash scroll and Back-to-Top already branch `auto` vs `smooth`.

Not a full visual QA of every motion token.

---

## React Architecture

Appropriate for a small SPA. Real notes (not style nits):

- Header owns a lot of route + intersection logic (necessary, a bit dense)
- `RouteScrollManager` + `HomePage` hash effect is a small two-place scroll story (works in human tests)
- High-frequency canvas stays outside React state (good)
- Header scroll still `setState`s (re-renders)
- Homepage leadership images `eager` despite sitting below Hero + Use Cases

---

## Routing

Vite: `/`, hashes, `/team`, refresh `/team`, `/not-a-real-page` → NotFoundPage (“This page is not available.”).

Production: only **exact** `/team` → `/index.html`. Other client routes **will 404 on Vercel** if opened as a full document load. That is intentional and documented. Scale later with more exact rewrites, not a wildcard, unless you explicitly want SPA fallback for all paths.

`index.html` canonical/OG always point at `https://spandanai.com/` even on `/team`. Document title is set in JS (`Team | SpandanAI`).

---

## CSS / Tailwind

Tokens (`ink`, `muted`, `surface`, `--primary`) mixed with raw Tailwind blues — normal. `user-select: none` on `body` is intentional.

768px `max-width` vs Tailwind `md` overlap: see RESP-01.

`min-width: 320px` on `body` matches smallest tested width.

---

## Dead Code

| Export | Status |
|--------|--------|
| `cardHover` (`src/lib/animations.js`) | **Unused** (confirmed) |
| `sectionTransition` | **Unused** (confirmed) |

No `console.log` / `debugger` / `TODO` / `FIXME` in `src/`.

---

## Dead Assets

Confirmed unreferenced: `logo-light.png`, `logo-dark.webp`, `logo-dark.png`.  
`src/assets/` empty.  
`wave-background.png` is used but is JPEG data with a `.png` name.

---

## Dependencies

Direct: React, React DOM, Framer Motion, Manrope, react-router-dom — all used. Exact pins.

`npm audit --registry=https://registry.npmjs.org --omit=dev`: **0 vulnerabilities**.

Default `npmmirror.com` audit API is **not implemented** (404). Recorded as a tooling limitation.

---

## Testing Gaps

Scripts: `dev`, `build`, `preview` only.

For this size of site, a huge E2E estate is not justified. A **small** later suite (Playwright smokes + optional ESLint) is enough. Vitest is optional, not required before deploy.

---

## Security

- No secrets in source
- No `dangerouslySetInnerHTML` / `eval`
- No `target="_blank"` (hence no missing `rel`)
- CSP + X-Frame-Options + nosniff + Referrer-Policy + Permissions-Policy present
- CSP allows `'unsafe-inline'` styles (needed for some tooling/inline styles; not a leak)
- Public Gmail is intentional contact copy
- No third-party scripts, analytics, or Google Fonts

Headers not present (not automatically critical): HSTS (usually at CDN), COOP/COEP, `X-DNS-Prefetch-Control`.

---

## Technical SEO

**Technical (not Phase 2B wording):**

- Homepage title `SpandanAI`; `/team` JS title `Team | SpandanAI`
- Canonical always `/`
- sitemap.xml only lists `/` (lastmod 2026-07-04)
- No JSON-LD, no web app manifest
- `/team` not in sitemap; crawlers may still find the in-page link after JS

**Copy/stakeholder (out of scope):** Phase 2B unique H1/value proposition. Do not treat as a 7A defect.

---

## Production Readiness

Safe to **keep iterating on GitHub**. Before pointing production at this tree:

- Confirm `/team` rewrite is in the deployed `vercel.json`
- Accept SPA LCP
- Prefer image compression first
- Accessibility P2s are not blockers for a private preview, but should be queued before a marketing push

---

## External / Stakeholder Dependencies

BLOCKED EXTERNAL INPUT (not code defects):

- LinkedIn URLs
- Additional team members
- Group photograph
- Phase 2B messaging / SEO wording

---

## All Findings

### A11Y-01 — Invisible Back-to-Top still focusable (mobile)

| | |
|--|--|
| Category | Accessibility / keyboard |
| Severity | **P2** |
| Confidence | **CONFIRMED** (CSS + computed) |
| Files | `src/components/ScrollToTopButton.jsx`, `src/index.css` |
| Viewport | `< 768px` |
| Evidence | `.scroll-top-button` uses opacity/pointer-events, not `hidden`/`inert`/`disabled`. Default `tabIndex` 0. At ≥768 it is `display: none` (`md:hidden`). |
| Why it matters | Keyboard users can land on an invisible control. |
| Later fix | `hidden`/`inert` or `tabIndex={-1}` + `aria-hidden` until `.visible`; keep visual design. |
| Fix risk | Low |
| Stakeholder | NO |

### A11Y-02 — No skip link

| | |
|--|--|
| Severity | **P2** |
| Confidence | **CONFIRMED** |
| Files | `src/components/Header.jsx`, `src/pages/HomePage.jsx` |
| Evidence | No skip-to-main link in DOM. |
| Why it matters | Repeating header links on a long page. |
| Later fix | Visually hidden skip link to `main`. |
| Fix risk | Low |
| Stakeholder | NO |

### A11Y-03 — Dark-header active nav contrast

| | |
|--|--|
| Severity | **P2** |
| Confidence | **CONFIRMED** (WCAG formula) |
| Files | `src/index.css` (`.nav-link.active` → `#2563eb`), Header on transparent Hero |
| Evidence | `#2563eb` on `#0B1220` ≈ **3.62:1** (needs 4.5:1 for normal text). Inactive `text-white/85` on navy is fine. On white scrolled header, primary-on-white is **5.17:1**. |
| Why it matters | Active Home/Team on the dark Hero header is harder to read. |
| Later fix | Lighter active color on dark header only. |
| Fix risk | Low–medium (visual check) |
| Stakeholder | NO (visual human check yes) |

### A11Y-04 — Mobile menu missing Escape / focus management

| | |
|--|--|
| Severity | **P2** |
| Confidence | **CONFIRMED** (source) |
| Files | `src/components/Header.jsx` |
| Evidence | No `keydown` Escape; no focus move into drawer; no restore to hamburger; no `aria-controls`. Overlay is `aria-hidden`. |
| Why it matters | Keyboard/screen-reader menu patterns. |
| Later fix | Escape closes; optional focus first item; `aria-controls` pointing at the panel id. |
| Fix risk | Medium (must not break hamburger) |
| Stakeholder | NO |

### A11Y-05 — Placeholder contrast

| | |
|--|--|
| Severity | **P2** |
| Confidence | **CONFIRMED** |
| Files | `src/components/Contact.jsx` (`placeholder:text-slate-400`) |
| Evidence | Computed placeholder `rgb(148, 163, 184)` on white ≈ **2.56:1**. Labels remain high-contrast. |
| Later fix | Darker placeholder or rely on labels only. |
| Fix risk | Low |
| Stakeholder | NO |

### A11Y-06 — Logo name announced twice

| | |
|--|--|
| Severity | **P3** |
| Confidence | **LIKELY** |
| Files | `src/components/Header.jsx` |
| Evidence | `img alt="SpandanAI"` plus adjacent text “SpandanAI”. |
| Later fix | Empty alt on decorative mark inside the named link. |
| Fix risk | Low |
| Stakeholder | NO |

### A11Y-07 — Motion-hidden footer link still tabbable

| | |
|--|--|
| Severity | **P3** |
| Confidence | **CONFIRMED** (computed `opacity: 0` while in tab list at 1366×800) |
| Files | `src/components/Footer.jsx` |
| Later fix | Don’t `opacity: 0` focusable nodes, or `visibility` until in view. |
| Fix risk | Medium (animation) |
| Stakeholder | NO |

### A11Y-08 — Hamburger 38×38

| | |
|--|--|
| Severity | **P3** |
| Confidence | **CONFIRMED** (measured 38×38) |
| Files | `src/components/Header.jsx` |
| Evidence | Passes 24px minimum; below 44px comfort size. |
| Later fix | Optional 44×44. |
| Fix risk | Low |
| Stakeholder | NO |

### RESP-01 — 768px navbar-height vs `md` nav

| | |
|--|--|
| Severity | **P2** |
| Confidence | **CONFIRMED** |
| Files | `src/index.css` `@media (max-width: 768px)`, Tailwind `md:` |
| Viewport | **exactly 768** |
| Evidence | Hamburger `display:none`, Home parent `flex`, BTT `none`, `--navbar-height: 80px` (820px uses 96px). |
| Why it matters | `scroll-margin-top` / sticky offset can disagree with desktop nav at one pixel edge. |
| Later fix | Use `max-width: 767.98px` **or** `md:`-aligned token. |
| Fix risk | Low–medium (re-check 768 layouts) |
| Stakeholder | NO |

### RESP-02 — Landscape short Hero clips CTA

| | |
|--|--|
| Severity | **P2** |
| Confidence | **CONFIRMED** |
| Viewport | 667×375 |
| Evidence | `ctaInView: false`; hero height 517px. |
| Later fix | Tighter Hero padding on short viewports only. |
| Fix risk | Medium (must not disturb approved desktop Hero) |
| Stakeholder | NO (visual check yes) |

### PERF-01 — Oversized leadership JPEGs

| | |
|--|--|
| Severity | **P2** |
| Confidence | **CONFIRMED** |
| Files | `public/images/V. S. Chakravarthy.jpg`, `K. Dharanidhar G.jpg`, `TeamMemberCard.jsx` |
| Evidence | 270 kB / 160 kB files drawn at 176×176 CSS pixels. |
| Later fix | Resize/compress (WebP optional); keep filenames until a planned asset pass. |
| Fix risk | Low if visual QA of faces |
| Stakeholder | NO |

### PERF-02 — Below-fold photos `loading="eager"` on homepage

| | |
|--|--|
| Severity | **P2** |
| Confidence | **CONFIRMED** |
| Files | `src/components/Founders.jsx` |
| Evidence | `imageLoading="eager"` for leadership under Hero + five Use Cases. |
| Later fix | `lazy` on homepage; keep eager on `/team` if above-the-fold. |
| Fix risk | Low |
| Stakeholder | NO |

### PERF-03 — Misnamed wave background

| | |
|--|--|
| Severity | **P3** |
| Confidence | **CONFIRMED** |
| Files | `public/images/wave-background.png` |
| Evidence | `file(1)`: JPEG 1024×442, `.png` name, 55,721 bytes. |
| Later fix | Serve as `.jpg`/`.webp` with matching CSS url (cache/url change). |
| Fix risk | Medium (cache + CSS path) |
| Stakeholder | NO |

### PERF-04 — Hero canvas cost while on-screen

| | |
|--|--|
| Severity | **P3** / accepted product |
| Confidence | **CONFIRMED** (source) |
| Files | `NeuralNetworkBackground.jsx` |
| Evidence | 80 nodes, pair loop, continuous rAF while visible. Off-screen/tab/reduced-motion already gated. |
| Later fix | Only if profiling shows a real device problem. |
| Fix risk | High (approved look) |
| Stakeholder | Visual if retuned |

### SEO-01 — `/team` not in sitemap; canonical is homepage

| | |
|--|--|
| Severity | **P2** |
| Confidence | **CONFIRMED** |
| Files | `index.html`, `public/sitemap.xml` |
| Evidence | sitemap one URL; canonical `https://spandanai.com/` for all routes. Title for `/team` is JS-only. |
| Why it matters | After deploy, `/team` sharing/indexing is weaker than `/`. |
| Later fix | Dedicated Phase 7G; Vite SPA cannot do real per-route meta without extra infra. |
| Fix risk | Medium |
| Stakeholder | Maybe (indexing intent) |

### SEO-02 — No JSON-LD / manifest

| | |
|--|--|
| Severity | **P3** |
| Confidence | **CONFIRMED** |
| Later fix | Optional Organization JSON-LD in a copy-approved SEO phase. |
| Stakeholder | YES for wording |

### ROUTE-01 — Unknown URLs 404 on Vercel document load

| | |
|--|--|
| Severity | **INFO** (intentional) |
| Confidence | **CONFIRMED** |
| Files | `vercel.json` |
| Evidence | Only `/team` rewritten. Vite `*` → NotFoundPage for client navigations. |
| Later fix | Add exact rewrites per new route; avoid `/(.*)` unless you want all 404s to become the SPA. |
| Stakeholder | NO |

### CSS-01 — `user-select: none` on marketing text

| | |
|--|--|
| Severity | **INFO** / recommended revisit |
| Confidence | **CONFIRMED** |
| Files | `src/index.css` |
| Evidence | Intentional Phase 6. Forms and footer email restore selection. |
| Classification | **acceptable for now**, revisit if partners need to copy hero/use-case text. |
| Stakeholder | NO |

### QUAL-01 — Unused motion exports

| | |
|--|--|
| Severity | **P3** |
| Confidence | **CONFIRMED** |
| Files | `src/lib/animations.js` — `cardHover`, `sectionTransition` |
| Later fix | Remove in a cleanup phase. |
| Stakeholder | NO |

### ASSET-01 — Unused logo files

| | |
|--|--|
| Severity | **P3** |
| Confidence | **CONFIRMED** |
| Files | `public/images/logo-light.png`, `logo-dark.webp`, `logo-dark.png` |
| Later fix | Delete after confirming no off-repo use. |
| Stakeholder | NO |

### TOOL-01 — No lint/tests

| | |
|--|--|
| Severity | **P3** |
| Confidence | **CONFIRMED** |
| Files | `package.json` |
| Later fix | ESLint + a handful of Playwright smokes. Not a deploy blocker. |
| Stakeholder | NO |

---

## P0 Findings

None.

## P1 Findings

None.

## P2 Findings

A11Y-01, A11Y-02, A11Y-03, A11Y-04, A11Y-05, RESP-01, RESP-02, PERF-01, PERF-02, SEO-01

## P3 Findings

A11Y-06, A11Y-07, A11Y-08, PERF-03, PERF-04, SEO-02, QUAL-01, ASSET-01, TOOL-01

## Informational Findings

ROUTE-01, CSS-01, npm audit 0 (npmjs.org), npmmirror audit API unavailable, Lighthouse not run, Firefox/Safari not verified.

---

## Top 10 Engineering Actions

1. Compress/resize the two large leadership photos (PERF-01).
2. Lazy-load homepage leadership images (PERF-02).
3. Remove invisible Back-to-Top from tab order (A11Y-01).
4. Fix dark-header active nav contrast (A11Y-03).
5. Add skip link (A11Y-02).
6. Mobile menu Escape + `aria-controls` (A11Y-04).
7. Align 768px navbar token with `md` (RESP-01).
8. Darken form placeholders (A11Y-05).
9. Short-landscape Hero CTA visibility (RESP-02).
10. `/team` sitemap/canonical plan before/with production deploy (SEO-01).

---

## Low-Risk Quick Wins

- JPEG compress Chakravarthy + Dharanidhar (keep art direction).
- `loading="lazy"` on homepage cards.
- `hidden` until Back-to-Top `.visible`.
- Skip link.
- Delete unused logo PNG/WebP if unused off-repo.
- Remove unused `cardHover` / `sectionTransition`.
- HTML `width`/`height` on logos/photos matching CSS box.

---

## Recommended Implementation Phases

See `docs/PHASE_7_ENGINEERING_ROADMAP.md`.

Derived from this audit (not a generic template): **7B accessibility → 7C 768/landscape → 7D images → 7E dead code/assets → 7F tiny tests → 7G technical SEO**.

---

## Files Inspected

`src/App.jsx`, `src/main.jsx`, `src/pages/*`, `src/components/{Header,Hero,Applications,Founders,TeamMemberCard,Contact,Footer,ScrollToTopButton,ScrollProgressBar,RouteScrollManager,SectionHeading,NeuralNetworkBackground,ElectricalCursorOverlay}.jsx`, `src/data/{siteContent,teamContent}.js`, `src/lib/{animations,navHrefs,neuralEffects,activeNavEvent}.js`, `src/index.css`, `index.html`, `package.json`, `package-lock.json`, `vercel.json`, `public/**`, listed Phase 3/5.5/6 docs, `SPANDANAI_PROJECT_STATE.md`, `SPANDANAI_FILE_MAP.md`.

---

## Commands Run

```
git status / fetch / rev-parse
npm run build
npm audit --registry=https://registry.npmjs.org --omit=dev
Chromium headless CDP overflow / a11y / routing / reduced-motion probes
file public/images/wave-background.png
```

Firefox headless screenshot: **hung, aborted**. Lighthouse: **not installed, not run**.

---

## Limitations

- Headless Chromium is not a substitute for human Tab-through or VoiceOver/TalkBack.
- Contrast ratios for overlay/gradient Hero backgrounds are approximate except where both colors were known hex values.
- No 30s CPU profile traces were captured.
- No production network waterfall (local Vite only).
- Zoom levels not tested.
- Safari not tested.
- Do not use these notes as field Core Web Vitals.

---

## Post-Audit Implementation Status

Addressed in Phase 7B (human-approved, feature commit `bc97490`):

- A11Y-01
- A11Y-02
- A11Y-03
- A11Y-04
- A11Y-05
- A11Y-06
- A11Y-08

Deferred:

- A11Y-07 (footer Framer Motion vs focus)

Audit findings for responsive, images, performance, testing, and technical SEO remain pending their planned phases. Original finding evidence above is unchanged historical record.
