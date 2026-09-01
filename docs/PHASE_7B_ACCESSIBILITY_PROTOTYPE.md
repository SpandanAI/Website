# SpandanAI Phase 7B — Accessibility Prototype

## Status

LOCAL PROTOTYPE  
NOT COMMITTED  
NOT PUSHED  
NOT DEPLOYED

**Date:** 1 September 2026  
**HEAD:** `ac24ca9` (`docs: record Phase 5.5 completion`)

---

## Objective

Implement the Phase 7A accessibility findings with the highest user impact and lowest visual regression risk.

This is not a redesign. Hero, electrical effects, routing, Cryo-CMOS, Team content, photo loading, SEO, and the 768px / landscape issues are unchanged.

---

## Findings Addressed

| ID | Result |
|----|--------|
| A11Y-01 | Implemented — hidden Back-to-Top is `inert`, `tabIndex={-1}`, and omitted from the accessibility tree |
| A11Y-02 | Implemented — shared skip link in `App.jsx` |
| A11Y-03 | Implemented — lighter active blue only on the transparent/dark header |
| A11Y-04 | Implemented — `aria-controls`, Escape, initial focus, restore, Tab cycle |
| A11Y-05 | Implemented — `placeholder:text-slate-500` |
| A11Y-06 | Implemented — header logo `alt=""`; visible “SpandanAI” remains the link name |
| A11Y-08 | Implemented — hamburger control is 44×44; bars unchanged |

---

## Findings Explicitly Deferred

**A11Y-07** — Footer Framer Motion opacity vs focus. Left for later; higher animation regression risk.

Also deferred (other phases): RESP-01 (768px token), RESP-02 (landscape Hero), PERF image work, technical SEO, dead assets.

---

## Back-to-Top Before

A real `<button>` with `opacity: 0` and `pointer-events: none` when below threshold. Still in the tab order on mobile.

Threshold, mobile-only (`md:hidden`), 44×44, brand blue, and safe-area position were already correct.

## Back-to-Top After

Same appearance and timing.

When **not** visible:

- `inert`
- `tabIndex={-1}`
- `aria-hidden`
- still visually faded via existing CSS (no `display: none` flicker on mobile)

When **visible**:

- normal button, `tabIndex={0}`, accessible name “Back to top”
- Chromium: `opacity: 1`, `inert: false`

If it hides while focused, it blurs so focus does not stick to an invisible control.

---

## Skip Link

Shared control in `App.jsx` (`SkipToMainContent`).

- First tab stop on `/` and `/team`
- Visually hidden until `:focus` / `:focus-visible`
- Top-left, `z-index: 80`, white chip, dark text, primary focus ring
- `href="#main-content"` with `preventDefault` so the URL hash is **not** set to `#main-content` (avoids fighting homepage section hashes)

Click/Enter focuses `#main-content` and scrolls it into view (`auto` under reduced motion).

Electrical overlay already treats `a` as interactive, so the skip link should not spark.

---

## Main Content Target

| Page | Markup |
|------|--------|
| HomePage | `<main id="main-content" tabIndex={-1}>` |
| TeamPage | same |
| NotFoundPage | same (so skip still has a target) |

One `#main-content` in the DOM at a time (single matched route).

---

## Dark Header Active Nav

**Old (dark):** color `#2563eb` (`rgb(37, 99, 235)`); contrast vs `#0B1220` **3.62:1**

**New (dark / not scrolled):** color `#60a5fa` (`rgb(96, 165, 250)`, Tailwind `blue-400`, already used on the `/team` intro eyebrow); contrast vs `#0B1220` **7.36:1**

Chosen instead of `blue-500` `#3b82f6` (5.09:1) so the ratio stays comfortably above 4.5:1 if the Hero behind the transparent header is not a perfect `#0B1220`.

**Scrolled / light header:** still `#2563eb`; contrast vs white **5.17:1**

**Mobile drawer:** links sit **outside** `nav`, so they keep `#2563eb` on the white panel even when the header is not scrolled.

Measured in Chromium:

- Homepage top, Home active: `rgb(96, 165, 250)`, header background transparent
- Homepage scrolled, active link: `rgb(37, 99, 235)`, header `rgba(255, 255, 255, 0.95)`
- `/team` top, Team `aria-current="page"`: `rgb(96, 165, 250)`
- `/team` scrolled: `rgb(37, 99, 235)`

---

## Mobile Menu

| Behavior | After |
|----------|--------|
| `aria-expanded` | yes, true/false |
| `aria-controls` | `mobile-navigation` |
| Accessible name | “Open navigation menu” / “Close navigation menu” (duplicate `sr-only` “Menu” removed) |
| Escape | closes; focus returns to hamburger; no route/scroll change |
| Initial focus | first item (Home) with `preventScroll: true` |
| Overlay click | closes; focus returns to hamburger |
| Nav item click | closes; does **not** force focus back to hamburger |
| Tab / Shift+Tab | cycles hamburger ↔ panel links (including Partner With Us) |

No focus-trap library.

---

## Form Placeholder Contrast

**Before:** `placeholder:text-slate-400` / `rgb(148, 163, 184)` on white **2.56:1**

**After:** `placeholder:text-slate-500` / `rgb(100, 116, 139)` on `rgb(255, 255, 255)` **4.76:1**

Labels unchanged. Placeholder copy unchanged. Entered text remains `text-ink` `rgb(11, 18, 32)`.

---

## Header Logo Accessibility

Header image `alt=""`. Adjacent visible text **SpandanAI** is the link name. Asset unchanged.

Footer not modified (image and heading are not the same duplicated-link pattern).

---

## Hamburger Target

**Before:** `h-10 w-10` (audit ~38×38)

**After:** `h-11 w-11` — measured **44×44**. Icon bars still `w-5`.

At 390×844 header height measured **77px** (logo 40px + `py-4`). Slightly taller than the previous logo-driven row. No horizontal overflow at 320.

---

## Keyboard Test

### Homepage (desktop, Chromium)

First tab: Skip to main content. Activate: focus `main-content`, URL stays `/` with empty hash. One `h1` (“SpandanAI”), one `main`.

### /team

Skip works; hash stays empty; pathname stays `/team`. Team `aria-current="page"`. One `h1` (“Meet the Team”).

### Mobile menu (390×844)

Open via click: `aria-expanded=true`, panel present, focus on Home. Escape: panel gone, focus on hamburger. Tab from Partner → hamburger. Shift+Tab from hamburger → Partner.

---

## Responsive Regression

Horizontal overflow (`scrollWidth > clientWidth + 1`) on `/`:

320, 390, 430, 767, 768, 820, 1024, 1366, 1440, 1920 — **none**

`/team` 320, 390, 768, 1366 — **none**

Existing 768px navbar-token overlap and 667×375 Hero CTA clipping were **not** changed (Phase 7C).

---

## Reduced Motion

Emulated `prefers-reduced-motion: reduce`: Back-to-Top returned to `scrollY = 0` immediately (auto). Skip uses `auto` scroll. Menu open/close does not require motion.

---

## Electrical Regression

`NeuralNetworkBackground.jsx`, `ElectricalCursorOverlay.jsx`, and `neuralEffects.js` were **not** edited. Skip link and menu controls are native `a`/`button` (already in `INTERACTIVE_SELECTOR`).

---

## Routing Regression

From `/team` mobile/desktop:

| Action | Result |
|--------|--------|
| Use Cases | `/#use-cases` (not `/team#use-cases`) |
| Contact | `/#contact` |
| Browser Back | `/team` |
| Browser Forward | `/#use-cases` |

Back-to-Top on `/team` stayed on `/team`.

---

## Build Result

`npm run build` **PASS**. No warnings. No errors. No new chunks.

```
dist/index.html                                         1.73 kB │ gzip:   0.56 kB
dist/assets/manrope-latin-wght-normal-DHIcAJRg.woff2   24.83 kB
dist/assets/index-CH8AD-9x.css                         19.42 kB │ gzip:   5.18 kB
dist/assets/index-DNC6tvFo.js                         401.81 kB │ gzip: 128.11 kB
```

Baseline before 7B: JS `index-BD4RNRl7.js` 400.26 kB, CSS `index-DrMLXFnk.css` 18.83 kB, font unchanged.

---

## Dependency Changes

NONE. `package.json` / lockfile untouched.

---

## Files Modified

Product:

- `src/App.jsx`
- `src/components/Header.jsx`
- `src/components/ScrollToTopButton.jsx`
- `src/components/Contact.jsx`
- `src/pages/HomePage.jsx`
- `src/pages/TeamPage.jsx`
- `src/pages/NotFoundPage.jsx`
- `src/index.css`

Docs:

- `docs/PHASE_7B_ACCESSIBILITY_PROTOTYPE.md` (this file)
- `docs/SPANDANAI_PROJECT_STATE.md`
- `docs/SPANDANAI_FILE_MAP.md`

---

## Phase 7B.1 — Mobile Navigation Semantics

**Problem:** The mobile menu links were rendered in a `<div id="mobile-navigation">` after the header `<nav>`, so the opened drawer was not a navigation landmark. The top row `<nav>` also wrapped the logo and hamburger.

**Change:**

- Top layout wrapper is a `<div>` (same flex classes as before).
- Desktop section links use `<nav className="desktop-primary-nav" aria-label="Primary navigation">`.
- Opened mobile panel is `<nav id="mobile-navigation" aria-label="Primary navigation">`.
- Hamburger `aria-controls` still targets `mobile-navigation`.
- Dark-header active selector is `.header-shell:not(.scrolled) .desktop-primary-nav .nav-link.active` so the white drawer stays `#2563eb`.

**Verified (Chromium):**

- Desktop: one visible Primary navigation landmark (Home, Use Cases, Team, Contact).
- Mobile closed: desktop nav `display: none`; hamburger is not inside a nav.
- Mobile open: drawer is a `NAV` landmark containing the four links plus Partner With Us; Home active `rgb(37, 99, 235)`.
- Desktop dark Home/Team: `rgb(96, 165, 250)`. Scrolled: `rgb(37, 99, 235)`.
- Focus, Escape, Tab cycle, `/team` → `/#use-cases` and `/#contact`, skip link, Back-to-Top inert-at-top: unchanged.

Visual change: NONE  
Focus behavior: UNCHANGED  
Routing: UNCHANGED  
Build: PASS  

Human approved. Included in feature commit `bc97490`. Production not deployed.

---

## Human Review Required

Completed. Human reviewer confirmed visual and keyboard behavior. See `docs/PHASE_7B_COMPLETION_REPORT.md`.

---

## Git Status

Feature: `bc97490` (`feat: improve website accessibility`) pushed to `origin/main`.  
Documentation commit recorded in the completion report.  
NO DEPLOY.
