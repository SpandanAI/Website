# SpandanAI Phase 5.5 — Meet the Team Page Prototype

## Status

HUMAN APPROVED  
FEATURE COMMITTED  
GITHUB PUSHED  
PRODUCTION NOT DEPLOYED

**Date:** 1 September 2026

Phase 3 remains approved, committed, and pushed (`410d66e`). Phase 6 remains approved, committed, and pushed (`5b8bf35`). Production is **not** deployed. Phase 2B remains paused. Phase 4 LinkedIn remains blocked on real URLs.

This report preserves the local prototype history. See **Phase 5.5 Final Acceptance** at the end for the landed GitHub state.

---

## Reason Phase Was Pulled Forward

The original roadmap placed a full Team page after LinkedIn and group-photo work. LinkedIn URLs have not been supplied. Wider-team photographs and details will arrive later.

Rather than wait, this phase builds the Team page **architecture**:

- homepage still shows only the current four leadership members
- additional members are **not** invented or shown on the homepage
- a “Meet the Team” control opens `/team`
- `/team` is ready to render real additional members, LinkedIn, and a group photo **when data exists**

---

## Previous Architecture

- Single-page hash navigation (`#home`, `#use-cases`, `#team`, `#contact`)
- No routing library
- No `/team` URL
- Leadership array hard-coded inside `src/components/Founders.jsx`

---

## New Routing Architecture

React Router `BrowserRouter` wraps the app in `src/main.jsx`.

`src/App.jsx` is the shared shell:

- `RouteScrollManager`
- `ScrollProgressBar`
- `Header`
- `ScrollToTopButton`
- `Routes` (`/` → `HomePage`, `/team` → `TeamPage`, unmatched → small client fallback)
- `Footer`
- `ElectricalCursorOverlay`

Homepage section order and IDs are unchanged.

---

## Router Dependency

`react-router-dom` **7.18.3** (exact pin). Compatible with React 19.2.5.

Transitive: `react-router` 7.18.3.

No other direct dependencies added. React, Vite, Tailwind, Framer Motion, and Manrope versions were not upgraded.

---

## Routes

| Route | Meaning |
|-------|---------|
| `/` | Homepage |
| `/#home` | Hero |
| `/#use-cases` | Use Cases |
| `/#team` | Homepage leadership section |
| `/#contact` | Contact |
| `/team` | Dedicated Team page |

Direct load of `/team` in Vite dev: Team page. Refresh: Team page.

---

## Homepage Changes

Leadership copy is unchanged:

- LEADERSHIP TEAM
- Founding engineering and product leadership.
- Core team responsible for silicon architecture, program execution, and company direction.

Added a secondary outlined `Link` to `/team`:

**Meet the Team →**

It is visually quieter than Partner With Us / Explore Use Cases. Keyboard accessible. Same tab (no `window.open`).

Homepage still renders **only** `leadershipMembers` (four people). `teamMembers` is not used on the homepage.

---

## Team Data Architecture

`src/data/teamContent.js`

- `leadershipMembers` — four existing leaders (names, roles, image paths preserved)
- `teamMembers` — `[]`
- `teamGroupPhoto` — `null`

Schema: `id`, `name`, `role`, `image`, `linkedin`.

`linkedin` is `null` on every current member. Cards are not links. No LinkedIn icons.

---

## Current Leadership

| Name | Role | Image |
|------|------|-------|
| N.R. Rohan | Chief Executive Officer | `/images/N.R. Rohan.jpg` |
| K. Dharanidhar G | Chief Technology Officer | `/images/K. Dharanidhar G.jpg` |
| S. Aniruddhan | Director | `/images/S. Aniruddhan.jpg` |
| V. S. Chakravarthy | Director | `/images/V. S. Chakravarthy.jpg` |

Reusable card: `src/components/TeamMemberCard.jsx` (homepage and `/team`).

---

## Additional Team Members

Current count: **0**

No fake members added. No stock photos. No placeholder people.

If `teamMembers.length === 0`, the Team Members section is **not rendered**.

---

## Team Page Layout

Compact dark intro (not a second Hero, no `NeuralNetworkBackground`):

- Eyebrow: TEAM
- H1: Meet the Team
- Support: Leadership and team at SpandanAI.

Leadership: same card language as the homepage.

Desktop: 4 columns (`lg:grid-cols-4`)  
Tablet (`md` / 768): 2×2  
Mobile: 1 column

Group photo and extra members render only when real data exists.

Document title on `/team`: `Team | SpandanAI`. Homepage remains `SpandanAI`. No new meta description.

---

## Team Page Mobile

390: one-column cards, hamburger, Back-to-Top may appear after `1.1 × innerHeight`, tap returns to top of `/team` (not Home).

---

## Route-Aware Header

On `/`:

- Home → `#home` / top
- Use Cases → `#use-cases`
- Team → `#team`
- Contact → `#contact`
- Partner With Us → `#contact`
- Logo → `#home`

On `/team`:

- Home → `/`
- Use Cases → `/#use-cases`
- Team → `/team`
- Contact → `/#contact`
- Partner With Us → `/#contact`
- Logo → `/`

Mobile menu uses the same destinations and still closes on click.

---

## Hash Navigation From /team

`HomePage` scrolls the hash target after mount (`scrollIntoView`, reduced-motion aware).

Verified locally:

- `/team` → `/#use-cases` lands on Use Cases
- `/team` → `/#contact` lands on Contact

---

## Team Nav Active State

`/team`: Team is active with `aria-current="page"`.

Homepage: existing IntersectionObserver section highlighting with `aria-current="location"`.

Observer is disabled off the homepage so `/team` does not falsely mark Home active.

---

## Footer

Existing Footer reused. No Team-specific footer. Email mailto unchanged.

---

## Electrical Overlay Compatibility

`ElectricalCursorOverlay` already treats a missing `#home` as “not in Hero” (`pointInHero` returns false). `/team` does not crash. Site-wide micro-sparks remain enabled. Hero canvas is **not** mounted on `/team`. Electrical timing was not retuned.

---

## Back-to-Top Behavior

Unchanged Phase 3 control: `md:hidden`, 44×44, brand blue, safe-area offsets, threshold `innerHeight * 1.1`, reduced motion.

On `/team` it scrolls the **Team page** to top. It does not navigate Home.

---

## Vercel Route Fallback

`vercel.json` now includes an exact rewrite:

`/team` → `/index.html`

`buildCommand`, `outputDirectory`, and security headers are unchanged.

No catch-all rewrite (so `robots.txt`, images, and assets are not redirected). **Not deployed.**

---

## Accessibility

- One H1 on `/team` (`tabIndex={-1}`, focused on navigation with `preventScroll`)
- Leadership uses H2; member names use H3
- Meet the Team is a real `Link` with focus-visible ring
- LinkedIn affordances omitted while URLs are null
- Reduced motion: route hash scroll uses `auto`; card hover lift skipped

---

## Responsive Tests

| Viewport | `/team` | Homepage regression |
|----------|---------|---------------------|
| 390 | 1-col cards; hamburger; BTT after threshold | 1-col Use Cases; 4 leadership cards |
| 768 | 2×2; Home visible; BTT hidden | 2+2+1 Use Cases; BTT hidden |
| 1366 | 4 leadership cards; BTT hidden | 3+2 Use Cases |
| 1440 | 4 cards; no overflow | no overflow |
| 1920 | 4 cards, not stretched; no overflow | no overflow |

---

## Build

`npm run build` passed. No errors. No warnings.

Phase 3 (before router):

```
dist/assets/index-t7tdd00u.js                         352.81 kB
dist/assets/index-qxWK6X7a.css                         18.17 kB
```

Phase 5.5 prototype:

```
dist/assets/manrope-latin-wght-normal-DHIcAJRg.woff2   24.83 kB
dist/assets/index-DrMLXFnk.css                         18.83 kB
dist/assets/index-BD4RNRl7.js                         400.26 kB
```

JS increase is the React Router bundle plus Team page (~47 kB). No lazy split (increase is modest). Font unchanged.

---

## Files Created

- `src/pages/HomePage.jsx`
- `src/pages/TeamPage.jsx`
- `src/pages/NotFoundPage.jsx`
- `src/components/TeamMemberCard.jsx`
- `src/components/RouteScrollManager.jsx`
- `src/data/teamContent.js`
- `src/lib/navHrefs.js`
- `docs/TEAM_CONTENT_GUIDE.md`
- `docs/PHASE_5_5_TEAM_PAGE_PROTOTYPE.md`

---

## Files Modified

- `src/App.jsx`
- `src/main.jsx`
- `src/components/Header.jsx`
- `src/components/Founders.jsx`
- `src/components/SectionHeading.jsx` (omit empty description)
- `src/index.css`
- `package.json`
- `package-lock.json`
- `vercel.json`
- `docs/SPANDANAI_PROJECT_STATE.md`
- `docs/SPANDANAI_FILE_MAP.md`
- `docs/SPANDANAI_REQUIREMENTS.md`

Unchanged (intentionally): Applications / Cryo-CMOS, electrical timing files, Contact, Hero copy, ScrollToTopButton logic, leadership photos.

---

## Human Review

Human-approved. All review items in the original checklist passed.

---

# Phase 5.5 Final Acceptance

**Human approved:** YES

**Feature commit:** `c12e926e0e552bb54c7c8073d5526f1f907986a2`  
**Message:** `feat: add dedicated team page and routing`  
**Author / committer:** Korak Das `<198821971+korakdas1@users.noreply.github.com>`  
**Co-authored-by trailer:** none

**GitHub pushed:** YES (normal fast-forward `cbb56de..c12e926  main -> main`; no force)

**Production:** NOT DEPLOYED

No `vercel` / `vercel --prod` command was run. GitHub is not connected to Vercel for automatic deployment. `https://spandanai.com/` remains on the previously deployed build. `/team` exists on GitHub but is **not live**.

## Final approved architecture

- React Router BrowserRouter
- `/team` route
- centralized team data
- reusable TeamMemberCard
- Meet the Team homepage CTA
- route-aware Header
- homepage hash navigation preserved
- `/team` Back-to-Top preserved
- exact `/team` Vercel fallback
- no fake members
- LinkedIn still null
- teamMembers still empty
- teamGroupPhoto still null

## Final build

`npm run build` passed. No errors. No warnings.

```
dist/assets/manrope-latin-wght-normal-DHIcAJRg.woff2   24.83 kB
dist/assets/index-DrMLXFnk.css                         18.83 kB
dist/assets/index-BD4RNRl7.js                         400.26 kB
```
