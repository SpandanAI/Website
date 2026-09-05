# SpandanAI Phase 7D — Image & Asset Performance Prototype

Human visual review (6 September 2026): **PASS.** GitHub landing status is in `docs/PHASE_7D_COMPLETION_REPORT.md`. The body below is the prototype snapshot.

## Status (prototype snapshot)

**LOCAL PROTOTYPE / HUMAN REVIEW REQUIRED**  
**NOT COMPLETE**  
**NOT COMMITTED**  
**NOT PUSHED**  
**NOT DEPLOYED**

**Date:** 6 September 2026  
**Starting HEAD:** `6f0ddb8` (`docs: record Phase 7C completion`) — `main` matched `origin/main` before this work.

This is an internal development working document. Human visual review of leadership faces is required before any commit.

---

## A. Phase 7D result

**PASS** as a local prototype (pending human visual review at the time of writing). Findings: PERF-01 (resize/recompress), PERF-02 (homepage lazy). Wave/OG unchanged.

---

## B. Starting git state

| Item | Value |
|------|--------|
| Branch | `main` |
| Tracking | `main...origin/main` (no ahead/behind) |
| HEAD | `6f0ddb8` `docs: record Phase 7C completion` |
| Working tree before edits | clean |
| Remote | `https://github.com/SpandanAI/Website.git` |
| Phase 7C | COMPLETE / HUMAN APPROVED / PUSHED |
| Phase 7D | had not started |

---

## C. Image inventory

All files under `public/images/` as measured on 6 September 2026 (before optimization).

| File | Format | Pixels | Bytes | Referenced? | Where | Displayed | Fold | Recommendation |
|------|--------|--------|-------|-------------|-------|-----------|------|----------------|
| `N.R. Rohan.jpg` | JPEG progressive | 507×389 | 19,906 | Yes | `teamContent.js` → cards | 176×176 CSS (`object-cover`) | Homepage below fold; `/team` near first screen | **Keep** — already small |
| `K. Dharanidhar G.jpg` | JPEG progressive | 1520×1600 | 159,572 | Yes | same | 176×176 | same | **Optimize now** |
| `S. Aniruddhan.jpg` | JPEG baseline | 391×422 | 52,811 | Yes | same | 176×176 | same | **Recompress now** (pixels already modest) |
| `V. S. Chakravarthy.jpg` | JPEG baseline | 1439×1600 | 270,483 | Yes | same | 176×176 | same | **Optimize now** |
| `logo-light.webp` | WebP | 320×213 | 11,270 | Yes | Header, Footer | CSS `.logo` height 40px (~60×40) | Header above fold; footer below | **Keep file**; add intrinsic `width`/`height` only |
| `logo-light.png` | PNG | 320×213 | 24,143 | **No** | — | — | — | **7E** unused |
| `logo-dark.webp` | WebP | 280×201 | 4,924 | **No** | — | — | — | **7E** unused |
| `logo-dark.png` | PNG | 280×201 | 34,619 | **No** | — | — | — | **7E** unused |
| `wave-background.png` | **JPEG bytes**, `.png` name | 1024×442 | 55,721 | Yes | `Hero.jsx` CSS `url()` | Hero full-bleed background | Above fold | **Keep unchanged** (PERF-03 rename deferred) |
| `og-image.png` | PNG | 1200×630 | 85,597 | Yes | `index.html` OG/Twitter | Social share only | Not in-page | **Keep** |

Classification:

- **A. Used:** four leadership JPEGs, `logo-light.webp`, `wave-background.png`, `og-image.png`
- **B. Unused:** `logo-light.png`, `logo-dark.webp`, `logo-dark.png`
- **C. Optimize now:** Dharanidhar, Chakravarthy, Aniruddhan (+ homepage lazy + intrinsic dimensions)
- **D. Later 7E:** unused logos (and unused JS exports, not this phase)
- **E. Untouched:** Rohan JPEG, `logo-light.webp` bytes, wave, OG

---

## D. Optimization candidates

| Finding | Decision |
|---------|----------|
| PERF-01 oversized Dharanidhar / Chakravarthy | Implemented — downscale long edge to 800px, JPEG quality 85, progressive, metadata stripped |
| Aniruddhan 52.8 kB at 391×422 | Implemented — same pixels, quality 85 recompress |
| Rohan 19.9 kB | Left unchanged (q85 trial saved ~6%) |
| PERF-02 homepage `loading="eager"` | Implemented — homepage leadership `lazy` |
| `/team` leadership loading | **Keep eager** — primary content after a short intro |
| HTML `width`/`height` | Implemented on cards (176×176) and logo (320×213) |
| WebP/AVIF for photos | **Not adopted** — would change paths for a modest extra win after JPEG resize |
| PERF-03 wave rename/convert | **Not applied** — Hero is approved; URL/cache risk |
| PERF-04 canvas | Out of scope |

No new dependencies. Compression used local Python Pillow.

---

## E. Modified image files

Same filenames (no path changes in `teamContent.js`):

- `public/images/K. Dharanidhar G.jpg`
- `public/images/V. S. Chakravarthy.jpg`
- `public/images/S. Aniruddhan.jpg`

Crop: **unchanged** (aspect ratio preserved; CSS `object-cover` still does the square card crop). No retouch, no AI enhance, no background swap.

---

## F. Before / after dimensions

| File | Before | After |
|------|--------|-------|
| `K. Dharanidhar G.jpg` | 1520×1600 | 760×800 |
| `V. S. Chakravarthy.jpg` | 1439×1600 | 720×800 |
| `S. Aniruddhan.jpg` | 391×422 | 391×422 |
| `N.R. Rohan.jpg` | 507×389 | unchanged |

Long-edge 800px is ~4.5× the 176 CSS-pixel card (covers 3× DPR with headroom).

---

## G. Before / after file sizes

| File | Before | After | Saved | % |
|------|--------|-------|-------|---|
| `K. Dharanidhar G.jpg` | 159,572 | 65,990 | 93,582 | 58.6% |
| `V. S. Chakravarthy.jpg` | 270,483 | 53,557 | 216,926 | 80.2% |
| `S. Aniruddhan.jpg` | 52,811 | 30,038 | 22,773 | 43.1% |
| `N.R. Rohan.jpg` | 19,906 | 19,906 | 0 | 0% |

---

## H. Total byte savings

Four leadership JPEGs together:

- Before: **502,772** bytes
- After: **169,491** bytes
- Saved: **333,281** bytes (**66.3%**)

Wave, logos, and OG are not in this total.

---

## I. Loading strategy

**Homepage (`Founders.jsx`):** `imageLoading="lazy"` on all four leadership photos.

Why: they sit below Hero and five Use Cases. Native `loading="lazy"` only. No observer library.

**`/team` (`TeamPage.jsx`):** leadership remains `imageLoading="eager"`.

Why: those four photos are the first real content after a short intro and should not wait for a lazy heuristic on refresh. Extra `teamMembers` (currently empty) already used `lazy`. Group photo (null) already `lazy`.

**`decoding="async"`:** already on `TeamMemberCard` and logos; kept. Not added to CSS backgrounds (not applicable).

---

## J. Width / height attributes

| Location | Attributes | Why |
|----------|------------|-----|
| `TeamMemberCard.jsx` `<img>` | `width={176}` `height={176}` | Matches CSS `h-44 w-44`. Layout reservation / CLS hint. Visual size still comes from Tailwind. |
| Header logo | `width={320}` `height={213}` | Source intrinsic ratio. CSS `.logo` still `height: 40px; width: auto` (~60×40 measured). |
| Footer logo | same | same |

Measured card box remains 176×176 at typical widths. Logo box remains 60×40.

---

## K. Visual quality

Human review is still required.

Implementation intent: no material change to crop, face detail, or backgrounds. Quality 85 + Lanczos downscale (two large files only). Aniruddhan was recompressed without resize.

Inspect: homepage `#team` and `/team` leadership cards, especially hair/beard (Dharanidhar), glasses (Chakravarthy), and plaid (Aniruddhan).

---

## L. Responsive regression

Chromium `vite preview` of the production build. No horizontal overflow at 320, 390, 430, 667×375, 767, 768, 769, 820, 1024, 1366, 1440, 1920 on `/`. `/team` checked at 390, 768, 1366.

768 still desktop nav / 96px token; 767 still hamburger / 80px. Short-landscape Hero CTA still in the first view at 667×375. Card images still square `object-cover`.

---

## M. Accessibility regression

Skip link, `#main-content`, hamburger `aria-*`, mobile `<nav>` when open, Back-to-Top `inert`, placeholders, header `alt=""`, dark active `#60a5fa` were not redesigned. Header/Footer only gained logo `width`/`height`.

---

## N. Electrical regression

**Not edited:** `NeuralNetworkBackground.jsx`, `ElectricalCursorOverlay.jsx`, `neuralEffects.js`. Human check still required.

---

## O. Build result

`npm run build` **PASS**. No errors. No new warnings.

```
dist/assets/index-pLTBtr_j.js                         407.93 kB │ gzip: 130.46 kB
dist/assets/index-D5ihWw1E.css                         19.85 kB │ gzip:   5.30 kB
dist/assets/manrope-latin-wght-normal-DHIcAJRg.woff2   24.83 kB
```

JS +0.06 kB vs Phase 7C (attribute/loading strings). CSS hash unchanged.

No Lighthouse / CWV numbers were collected. Likely effects: fewer leadership bytes transferred; homepage photos can defer; intrinsic dimensions for layout reservation.

---

## P. Dependency result

**NONE.**

---

## Q. Files modified

- `public/images/K. Dharanidhar G.jpg`
- `public/images/V. S. Chakravarthy.jpg`
- `public/images/S. Aniruddhan.jpg`
- `src/components/Founders.jsx`
- `src/components/TeamMemberCard.jsx`
- `src/components/Header.jsx`
- `src/components/Footer.jsx`
- `docs/SPANDANAI_PROJECT_STATE.md`
- `docs/SPANDANAI_FILE_MAP.md`
- `docs/PHASE_7_ENGINEERING_ROADMAP.md`

---

## R. Files not touched

Electrical source, `Hero.jsx`, `teamContent.js` (paths/people unchanged), Use Case copy, `wave-background.png`, `og-image.png`, `logo-light.webp` bytes, unused logo files, Phase 2B docs.

---

## S. Deferred to Phase 7E

- `public/images/logo-light.png`
- `public/images/logo-dark.webp`
- `public/images/logo-dark.png`
- Unused JS (`cardHover`, etc.)
- Wave filename/format (PERF-03) — separate 7D.x only if requested after this review

---

## T. Human test instructions

Local: `npm run dev` or `npm run preview`. Production URL is **not** this prototype.

1. Homepage desktop — all four faces.
2. `/team` desktop — same faces.
3. 390px homepage — sharpness and card crop.
4. 390px `/team` — sharpness and crop.
5. 768px — cards and images; header still desktop.
6. High-DPI / browser zoom — look for softness.
7. Scroll Hero → leadership — natural load, no ugly pop-in.
8. Refresh `/team` — photos render promptly (eager).
9. Electrical interactions unchanged.
10. Routes / Contact / five Use Cases including Cryo-CMOS.

**Do not commit after these tests.** Wait for explicit approval.

---

## U. Next step

Human visual review of leadership photos.

NO COMMIT. NO PUSH. NO DEPLOY. Do not start Phase 7E.
