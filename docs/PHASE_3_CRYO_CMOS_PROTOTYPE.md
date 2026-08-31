# SpandanAI Phase 3 — Cryo-CMOS Use Case Prototype

## Status

HUMAN APPROVED  
FEATURE COMMITTED  
GITHUB PUSHED  
PRODUCTION NOT DEPLOYED

**Date:** 1 September 2026

Phase 6 remains committed/pushed and not production-deployed. Phase 2B remains paused.

This report preserves the local prototype and polish history. See **Phase 3 Final Acceptance** at the end for the landed GitHub state.

---

## Stakeholder Request

Title:

Cryo-CMOS for AI assisted Quantum circuits

Description:

Addressing the tight power budget in cryogenic refrigerators requires unique IC design

No extra technical claims were added. Wording was not hyphenated or recapitalized beyond the existing card `uppercase` CSS.

---

## Previous Use Case Layout

Four data-driven cards in `applicationTabs`, rendered as:

`grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4`

That is a 2-column tablet row and a 4-column desktop row. Appending a fifth card to that grid would leave a leftover 4+1 (desktop) or 2+2+1 left-aligned (tablet) hole.

---

## New Use Case

Added as the fifth `applicationTabs` entry in `src/data/siteContent.js`:

```js
{
  id: "cryo-cmos",
  label: "Cryo-CMOS for AI assisted Quantum circuits",
  description: "Addressing the tight power budget in cryogenic refrigerators requires unique IC design"
}
```

Existing four entries were not reordered or rewritten.

Section heading copy is unchanged:

- Use Cases
- Deployment surfaces for analog-native AI silicon.
- Target environments where edge inference and wireless acceleration deliver measurable impact.

---

## Five-Card Layout Strategy

CSS Grid / Tailwind only. No absolute positioning, no JS layout.

**Mobile (`< 768px`):** one column, full container width. Order 1→5.

**Tablet (`md`, 768px+):** 4-column grid; each card spans 2 columns. Card 5 starts at column 2 so it is centered:

```
[1] [2]
[3] [4]
   [5]
```

**Laptop / desktop (`lg`, 1024px+):** 6-column grid; each card spans 2 columns. Card 4 starts at column 2, card 5 at column 4:

```
[ 1 ] [ 2 ] [ 3 ]

   [ 4 ] [ 5 ]
```

Five equal columns at 1920px were **not** used. At ~230px a card would crush the Cryo-CMOS title. The 3+2 composition stays inside `max-w-7xl`, so cards do not stretch on a 1920 display.

---

## Why This Layout Was Chosen

- Reads as a designed five-item set, not four plus a leftover.
- Card widths stay close to the previous four-up cards (comfortably wider, not cramped).
- Second row is centered under the first on both tablet and desktop.
- Same card chrome and typography as Phase 6.

---

## Files Modified

| File | Change |
|------|--------|
| `src/data/siteContent.js` | Fifth `cryo-cmos` entry |
| `src/components/Applications.jsx` | 3+2 / 2+2+1 / 1-col grid; `h-full`; title `leading-[1.45]` |
| `src/components/ScrollToTopButton.jsx` | `md:hidden`; viewport-relative threshold `innerHeight * 1.1`; `aria-label="Back to top"` |
| `src/index.css` | 44×44; safe-area offsets; `:focus-visible` |
| `docs/PHASE_3_CRYO_CMOS_PROTOTYPE.md` | This report |
| `docs/SPANDANAI_PROJECT_STATE.md` | Phase 3 status (local prototype, then final GitHub landing) |
| `docs/SPANDANAI_FILE_MAP.md` | Five-card layout + scroll-to-top note |

---

## Typography

- Card descriptions remain `text-base` / **16px**, `leading-[1.7]` (computed 27.2px).
- Card titles remain `text-xs`, `uppercase`, `tracking-[0.14em]`.
- All titles now use `leading-[1.45]` so a wrapped Cryo-CMOS label is readable. No Cryo-only shrink.

Manrope Variable, H1/H2, and section eyebrow were not retuned.

---

## Responsive Testing

| Viewport | Overflow | Arrangement | Cryo-CMOS title |
|----------|----------|-------------|-----------------|
| 390 | none | 1 column | ~2 lines, fully visible |
| 768 | none | 2+2+1 centered | ~2 lines |
| 1366 | none | 3+2 centered | ~2 lines |
| 1440 | none | 3+2 centered | ~2 lines |
| 1920 | none | 3+2, not stretched | ~2 lines |

Title height measured 35px vs 17px for one-line labels (≈ two lines with `leading-[1.45]`).

---

## Build Result

`npm run build` passed. No errors. No warnings. No new dependencies.

```
dist/assets/manrope-latin-wght-normal-DHIcAJRg.woff2   24.83 kB
dist/assets/index-taNihnMX.css                         18.02 kB
dist/assets/index-CvWVfMzr.js                         352.70 kB
```

---

## Regression Checks

| Area | Result |
|------|--------|
| Hero H1 / copy | Unchanged (`SpandanAI`) |
| Home active at top | Yes |
| Email Us / Copy | Present |
| Team cards | 4, unchanged |
| Electrical overlay still mounted | Yes |
| Section heading wording | Unchanged |
| Form selection / marketing `user-select` | Untouched |

---

## Mobile Review — Scroll-to-Top Polish

### Human Finding

The five-card mobile layout was approved, but the floating Back-to-Top control was reviewed for redundancy/overlap. On desktop/tablet, Home is already in the sticky header. On mobile, Home lives inside the hamburger, so a compact after-scroll control remains useful.

### Existing Behavior Audit

Recorded from source before the change:

| Item | Actual |
|------|--------|
| Component | `src/components/ScrollToTopButton.jsx` + `.scroll-top-button` in `src/index.css` |
| Scroll threshold | `window.scrollY > 600` |
| Responsive visibility | All viewports (no breakpoint hide) |
| Header switches to desktop nav | Tailwind **`md`** (`min-width: 768px`): links `hidden md:flex`, hamburger `md:hidden` |
| Button size | 48×48 px |
| Bottom / right | `24px` / `24px` (no safe-area insets) |
| z-index | 60 |
| Reduced motion | Already: `behavior: "auto"` when `prefers-reduced-motion: reduce`; otherwise `"smooth"` |
| ARIA | `type="button"`, `aria-label="Scroll to top"` |
| Scroll method | `window.scrollTo({ top: 0, … })` |

### Decision

The button remains only where **Home is hidden inside mobile navigation**.

When Home is directly visible in the sticky desktop/tablet header (`md` and up), the floating control is hidden with the **same** `md:hidden` breakpoint as the hamburger.

The 600 px threshold is kept. It is already far enough that the control does not appear at the top or after a tiny scroll.

### Final Behavior (after 3.1)

- **&lt; 768 px (hamburger):** hidden at top; appears after `scrollY > 600`; tap scrolls to `top: 0` (true Home); button hides again.
- **≥ 768 px (Home in header):** never shown, even after a long scroll.
- Size **44×44** (was 48; still a comfortable touch target).
- Position `calc(1rem + env(safe-area-inset-*))` → 16 px plus device safe area.
- `aria-label="Back to top"`; `:focus-visible` outline.
- Electrical overlay still suppresses sparks over `button`.

### Responsive Tests

| Viewport | Home in header? | Button after scroll |
|----------|-----------------|---------------------|
| 390 | No (hamburger) | Allowed; click returned `scrollY` 0 and Home active |
| 767 | No (hamburger) | Allowed (`display: block` + `.visible`) |
| 768 | Yes | `display: none` |
| 1366 / 1440 / 1920 | Yes | `display: none` |

No horizontal overflow. Five Use Case cards and 16 px descriptions unchanged.

### Build

`npm run build` passed. No new dependencies.

```
dist/assets/manrope-latin-wght-normal-DHIcAJRg.woff2   24.83 kB
dist/assets/index-qxWK6X7a.css                         18.17 kB
dist/assets/index-BHIe6m1L.js                         352.71 kB
```

---

## Phase 3.2 — Viewport-relative appearance threshold

Human review on 390×844 found the 600 px threshold made ↑ appear around the start of the Use Cases list — slightly too early.

### Before

```js
setIsVisible(window.scrollY > 600);
```

### After

```js
setIsVisible(window.scrollY > window.innerHeight * 1.1);
```

A `resize` listener re-evaluates with the current `innerHeight` (rotation / DevTools).

Example: 390×844 → threshold ≈ **928 px**.

This adapts across phone heights and delays the control until the user has moved about one full viewport plus a small margin.

Unchanged:

- Color: `var(--primary)` / `#2563eb`
- Size: 44×44
- Safe-area offsets
- `md:hidden` (hamburger mode only)
- Reduced motion
- `aria-label="Back to top"`

Landscape: a short viewport lowers the pixel threshold by design. At 667×375 (hamburger still), threshold ≈ 413 px. At 844×390, width is ≥ `md` so Home is in the header and the button stays hidden. No extra landscape rule was added.

### Build (3.2)

```
dist/assets/manrope-latin-wght-normal-DHIcAJRg.woff2   24.83 kB
dist/assets/index-qxWK6X7a.css                         18.17 kB
dist/assets/index-t7tdd00u.js                         352.81 kB
```

---

# Phase 3 Final Acceptance

**Human approved:** YES

Human review confirmed:

- five Use Case cards look good on desktop
- 3+2 desktop arrangement
- 2+2+1 tablet arrangement
- one-column mobile arrangement
- Cryo-CMOS title wrapping is acceptable
- 16px card descriptions are readable
- mobile Back-to-Top is useful
- Back-to-Top is hidden on desktop/tablet where Home is visible
- button appears later on mobile using the viewport-relative threshold
- Back-to-Top returns to true Home/top state
- button color, size, and position are approved
- Cryo-CMOS layout remains unchanged after mobile polish

**Feature commit:** `410d66e82c0b03045693e11c6121e7b8b156dc20`  
**Message:** `feat: add Cryo-CMOS use case and responsive card layout`  
**Author / committer:** Korak Das `<198821971+korakdas1@users.noreply.github.com>`  
**Co-authored-by trailer:** none

**GitHub pushed:** YES (normal fast-forward `6808462..410d66e  main -> main`; no force)

**Production deployed:** NO

No `vercel` / `vercel --prod` command was run. GitHub is not connected to Vercel for automatic deployment. `https://spandanai.com/` remains on the previously deployed build.

## Final approved feature set

- Cryo-CMOS fifth Use Case
- 3+2 desktop
- 2+2+1 tablet
- 1-column mobile
- 16px descriptions
- wrapped title line-height
- mobile-only Back-to-Top
- 44×44 button
- brand-blue button (`#2563eb` / `var(--primary)`)
- safe-area position
- viewport-relative threshold (`window.scrollY > window.innerHeight * 1.1`)
- reduced-motion handling (`auto` vs `smooth`)

## Final build

`npm run build` passed. No errors. No warnings. No new dependencies.

```
dist/assets/manrope-latin-wght-normal-DHIcAJRg.woff2   24.83 kB
dist/assets/index-qxWK6X7a.css                         18.17 kB
dist/assets/index-t7tdd00u.js                         352.81 kB
```
