# SpandanAI Phase 7E — Dead Code / Dead Asset Cleanup Prototype

## A. Phase 7E result

**HUMAN APPROVED / COMPLETE**  
See `docs/PHASE_7E_COMPLETION_REPORT.md` for GitHub landing.

**NOT DEPLOYED**

**Date:** 6 September 2026  
**Base:** `b3a8e59` (`docs: record Phase 7D.1 completion`) after Phase 7D.1 push.

Conservative product cleanup only. No visual redesign. Phase docs were not deleted.

---

## B. Starting git state

| Item | Value |
|------|--------|
| Branch | `main` |
| HEAD / origin/main | `b3a8e59` |
| Working tree before 7E | clean |
| Phase 7D.1 | COMPLETE / PUSHED |

---

## C. Dead code audit

| Symbol | Location | Product references | Docs-only | Decision |
|--------|----------|--------------------|-----------|----------|
| `cardHover` | `src/lib/animations.js` | **None** in `src/` | File map / 7A | **DELETE** |
| `sectionTransition` | `src/lib/animations.js` | **None** in `src/` | 7A / roadmap | **DELETE** |
| `buttonHover` | same | Header, Contact | — | **KEEP** |
| `heroFadeIn` | same | Hero | — | **KEEP** |
| `fadeInOnScroll` | same | Footer, Founders, TeamPage, Contact, Applications | — | **KEEP** |
| `staggerContainer` / `staggerItem` / `viewportOnce` | same | multiple | — | **KEEP** |

---

## D. Dead asset audit

| File | Bytes | Product refs | Decision |
|------|-------|--------------|----------|
| `public/images/logo-light.png` | 24,143 | None in `src/`, `index.html`, CSS | **DELETE** |
| `public/images/logo-dark.webp` | 4,924 | None | **DELETE** |
| `public/images/logo-dark.png` | 34,619 | None | **DELETE** |
| `public/images/logo-light.webp` | 11,270 | Header, Footer | **KEEP** |
| Leadership JPEGs | (7D) | `teamContent.js` | **KEEP** |
| `wave-background.png` | 55,721 | Hero CSS `url()` | **KEEP** (no rename) |
| `og-image.png` | 85,597 | `index.html` OG/Twitter | **KEEP** |

Historical July reports still mention old PNG logos; those are snapshots, not runtime.

---

## E. Code removed

From `src/lib/animations.js`: unused exports `cardHover` and `sectionTransition`.

---

## F. Assets removed

- `public/images/logo-light.png`
- `public/images/logo-dark.webp`
- `public/images/logo-dark.png`

---

## G. Bytes removed

**63,686** bytes of unused logo files (24,143 + 4,924 + 34,619).

JS/CSS production hashes **unchanged** vs 7D.1 (unused JS exports were already tree-shaken).

---

## H. Dependency audit

Direct deps: React, react-dom, react-router-dom, framer-motion, `@fontsource-variable/manrope`, Tailwind, Vite — all in use.

**Default: dependency removal DEFERRED.** None removed.

---

## I. Unused imports

No additional unused product imports removed. Diff kept to confirmed dead exports + unused logos.

---

## J. CSS status

No CSS deleted. Deleted logos had no selectors.

---

## K. Hero / electricity regression

Electrical files and Hero not edited. Wave file not renamed/converted.

---

## L. Image performance regression

7D JPEGs, loading, decoding, dimensions **unchanged**.

---

## M. Team hover regression

`TeamMemberCard.jsx` **not edited**. Approved 150ms / −4px tween remains.

---

## N. Responsive regression

767 hamburger / 768 desktop / 769 desktop still measured. Short-landscape CTA still in view at 390/667 checks. No overflow.

---

## O. Accessibility regression

Skip link, hamburger, menu, BTT not edited.

---

## P. Routing regression

`/`, `#home`, `#use-cases`, `#team`, `#contact`, `/team` resolve. Direct `/team` works on preview.

---

## Q. Build result

`npm run build` **PASS**. No errors. No new warnings.

Before (7D.1 landing) and after (this prototype):

```
dist/assets/index-DCdKucgy.js                         407.96 kB │ gzip: 130.48 kB
dist/assets/index-D5ihWw1E.css                         19.85 kB │ gzip:   5.30 kB
dist/assets/manrope-latin-wght-normal-DHIcAJRg.woff2   24.83 kB
```

Identical hashes. Cleanup is repository hygiene, not a JS win.

---

## R. Console result

Chromium preview: **no Network 4xx/5xx** for page assets. Header logo `logo-light.webp` loads (`naturalWidth` > 0). Lazy photos below the fold may report `complete === false` until scrolled; not 404s. Deleted dark/PNG logos were **not requested**.

---

## S. Files modified

- `src/lib/animations.js`
- tracking docs (this phase)

---

## T. Files deleted

- `public/images/logo-light.png`
- `public/images/logo-dark.webp`
- `public/images/logo-dark.png`

---

## U. Items deferred

- Wave `.png` filename vs JPEG bytes (PERF-03)
- `src/assets/` empty directory (Git does not track empty dirs; no `.gitkeep`)
- Dependency removals (none justified)
- Internal `docs/PHASE_*` cleanup (later public-repo hygiene)
- A11Y-07, 7F, 7G

---

## V. Human test instructions

Expected: **no visible change**.

1. Homepage appearance  
2. Hero / electricity  
3. Use Cases including Cryo-CMOS  
4. Leadership cards and 150ms hover  
5. Meet the Team → `/team`  
6. `/team` page  
7. Contact  
8. Mobile 390px  
9. 767 / 768 / 769  
10. Refresh `/team` directly  
11. Browser console — no missing assets

Human review: **PASS** (normal browser + Firefox Console).

---

## W. Next step

Phase 7F — Lightweight Automated Smoke Testing.

See `docs/PHASE_7E_COMPLETION_REPORT.md`.
