# SpandanAI Phase 7C — Responsive + Short-Viewport Hardening Prototype

Human review (6 September 2026): **PASS.** GitHub landing status is in `docs/PHASE_7C_COMPLETION_REPORT.md`. The body below is the prototype snapshot from 2 September 2026.

## Status (prototype snapshot)

**LOCAL PROTOTYPE / HUMAN REVIEW REQUIRED**  
**NOT COMPLETE**  
**NOT COMMITTED**  
**NOT PUSHED**  
**NOT DEPLOYED**

**Date:** 2 September 2026  
**Starting HEAD:** `6c8f4f9` (`docs: record Phase 6B completion`) — `main` matched `origin/main` before this work.

This is an internal development working document. It records engineering decisions for RESP-01 and RESP-02 only.

---

## A. Phase result

**PASS** as a local prototype (pending human visual review).

Findings addressed:

| ID | Result |
|----|--------|
| RESP-01 | Implemented — `--navbar-height` now uses the inverse of Tailwind `md` (`min-width: 768px`) |
| RESP-02 | Implemented — height-aware Hero spacing only; no type shrink, no scale, no CTA hide |

Production remains the older Vercel deployment. Do not treat this phase as complete until human review and an explicit commit/push/deploy request.

---

## Objective

Close the one-pixel 768px navbar-token mismatch and keep the Hero statement + “Explore Use Cases” CTA in the first view on short landscape viewports.

This is not a redesign. Copy, team data, electrical appearance, Phase 2B proposals, and Phase 7B accessibility source were not changed.

---

## Starting git state (verified)

| Item | Value |
|------|--------|
| Branch | `main` |
| Tracking | `main...origin/main` (no ahead/behind) |
| HEAD | `6c8f4f9` `docs: record Phase 6B completion` |
| Working tree before edits | clean |
| Phase 6B | complete / pushed / not production-deployed |
| Phase 7B | complete / pushed / not production-deployed |
| Phase 7C | had not started |

---

## C. RESP-01 root cause

Tailwind in this project has **no custom `screens`**. Default `md` is:

```css
@media (min-width: 768px)
```

Header chrome already followed that rule:

| Control | Tailwind class | Width `< 768` | Width `>= 768` |
|---------|----------------|---------------|----------------|
| Hamburger | `md:hidden` | visible | hidden |
| Desktop nav | `hidden md:flex` | hidden | visible |
| Partner With Us (header button) | `hidden md:inline-flex` | hidden (lives in the mobile drawer) | visible |
| Back-to-Top | `md:hidden` | available | `display: none` |

`--navbar-height` did **not**. `:root` default is `96px`. The compact token used:

```css
@media (max-width: 768px) {
  :root { --navbar-height: 80px; }
}
```

`max-width: 768px` **includes** exactly 768px. Tailwind `md:` **starts at** 768px.

| Width | Header chrome (Tailwind `md`) | `--navbar-height` (old CSS) |
|-------|-------------------------------|-----------------------------|
| 767px | hamburger / mobile | 80px — agreed |
| **768px** | **desktop nav** | **80px — mismatch** |
| 769px | desktop nav | 96px — agreed |

Hero and Team offset use `-mt-[var(--navbar-height)]` / `pt-[var(--navbar-height)]`. `section { scroll-margin-top: var(--navbar-height); }` uses the same token. At exactly 768px the chrome was desktop while the offset token was still mobile.

Semantic difference: CSS `max-width` is inclusive of the bound; Tailwind `min-width` `md:` is inclusive of 768 in the **desktop** direction. One CSS pixel sat in both systems at once.

---

## D. RESP-01 fix

Keep Tailwind `md` as the site breakpoint. Align the custom token to the **exact inverse**:

```css
@media not all and (min-width: 768px) {
  :root {
    --navbar-height: 80px;
  }
}
```

This is “not `md`”: width `< 768` → 80px; width `>= 768` → 96px (`:root` default).

No 768-only hack. `Header.jsx` and `ScrollToTopButton.jsx` were not edited; they already used `md:`.

The token remains slightly taller than the measured header box (~77px mobile / ~73px desktop). That slack existed before this phase and is used as scroll-margin padding. RESP-01 was the 768 disagreement, not that slack.

---

## E. Before / after header behavior

**Before (Phase 7A):**

| Width | Token | Hamburger | Desktop nav | Partner (header) | Back-to-Top display |
|-------|-------|-----------|-------------|------------------|---------------------|
| 767 | 80px | yes | no | in drawer | `block` |
| 768 | **80px** | **no** | **yes** | **yes** | **none** |
| 769 | 96px | no | yes | yes | none |

**After (this prototype, Chromium, 800px tall):**

| Width | Token | Hamburger | Desktop nav | Partner (header) | Back-to-Top display | Overflow |
|-------|-------|-----------|-------------|------------------|---------------------|----------|
| 767 | 80px | `flex` | `none` | in drawer | `block` | none |
| 768 | **96px** | `none` | `flex` | `inline-flex` | `none` | none |
| 769 | 96px | `none` | `flex` | `inline-flex` | `none` | none |

No duplicate desktop + hamburger chrome. `/team` at 768 uses the same desktop header.

---

## F. RESP-02 root cause

Hero stacked several **vertical** costs on top of each other:

1. Section `min-h-[110vh]` plus `pt-[var(--navbar-height)]`.
2. Copy wrapper `min-h-screen items-center py-20` (80px vertical padding) — a full-viewport-tall box **already offset** by the header padding.
3. Inner gaps: eyebrow, `mt-8` H1, `mt-6` lede, `mt-10` CTA.

On a short landscape viewport the copy block was centered in a screen-tall column that started below the header. The CTA therefore sat below the first view. Phase 7A measured 667×375 with `ctaInView: false` and hero height ~517px vs 375px viewport.

Width was not the cause. Portrait phones with the same widths but tall heights already showed the CTA.

---

## G. RESP-02 fix

CSS height queries only. Class hooks on existing nodes (`hero-section`, `hero-copy`, `hero-lede`, `hero-cta-row`). Copy text unchanged. Type sizes unchanged.

**`max-height: 540px`**

- Section min-height: `100vh` / `100dvh` (replaces `110vh` only in this band).
- Copy: `min-height: 0`, `align-items: flex-start`, reduced padding.
- Tighter H1 / lede / CTA **margins only**.

**`max-height: 340px`**

- Extra compact padding/margins so 320-tall landscape (e.g. 568×320) can still show the CTA.

Not used: `transform: scale()`, hiding the CTA, shrinking type, removing electrical background, per-device rules, or `window.innerWidth` styling.

Normal portrait and desktop (height `> 540px`) keep the approved Hero spacing.

---

## H. Short-landscape results

Chromium headless, local Vite. CTA “in view” = Explore Use Cases fully inside the layout viewport.

| Viewport | Token | Header | CTA in first view | CTA bottom | Overflow |
|----------|-------|--------|-------------------|------------|----------|
| 568×320 | 80px / hamburger | mobile | **yes** (was ~16px short before the 340px tier) | 315 | none |
| 640×360 | 80px / hamburger | mobile | yes | 318 | none |
| 667×375 | 80px / hamburger | mobile | **yes** (Phase 7A failure case) | 318 | none |
| 740×360 | 80px / hamburger | mobile | yes | 318 | none |
| 844×390 | 96px / desktop nav | desktop (`844 >= 768`) | yes | 314 | none |
| 1024×600 | 96px / desktop | desktop; height `> 540` so compact Hero **off** | yes | 517 | none |

568×320 is tight (~5px spare). Header stays usable. Content is still readable; type was not reduced.

---

## I. Portrait results

| Viewport | Token / chrome | CTA in first view | Overflow |
|----------|----------------|-------------------|----------|
| 360×800 | 80px / hamburger | yes | none |
| 390×844 | 80px / hamburger | yes | none |
| 430×932 | 80px / hamburger | yes | none |
| 768×1024 | 96px / desktop nav | yes | none |

Portrait spacing is unchanged (heights `> 540px`). Compact Hero CSS does not apply.

---

## J. Normal desktop / tablet results

| Width (× height used) | Token | Hamburger | Desktop nav | CTA in first view | Overflow |
|-----------------------|-------|-----------|-------------|-------------------|----------|
| 320×800 | 80px | yes | no | yes | none |
| 767×800 | 80px | yes | no | yes | none |
| 768×800 | 96px | no | yes | yes | none |
| 769×800 | 96px | no | yes | yes | none |
| 820×800 | 96px | no | yes | yes | none |
| 1024×768 | 96px | no | yes | yes | none |
| 1366×768 | 96px | no | yes | yes | none |
| 1440×900 | 96px | no | yes | yes | none |
| 1920×1080 | 96px | no | yes | yes | none |

---

## K. Zoom results

Practical check: Chromium `document.documentElement.style.zoom` on a 1366×768 homepage. This is not identical to Chrome UI zoom, but it is a usable overflow / first-view probe.

| Zoom | Horizontal overflow | First-view notes |
|------|---------------------|------------------|
| 100% | none | Hero + CTA in view |
| 125% | none | Hero + CTA in view |
| 150% | none | H1/lede in view; CTA below the first screen — scroll to reach |
| 200% | none | Eyebrow in view; H1/lede/CTA below the first screen — scroll to reach |

Requirement was usability, not pixel-perfect 200%. Navigation remains desktop chrome at this width. Content stays horizontally reachable.

Human review should still try real browser zoom at 150% or 200%.

---

## L. Accessibility regression

`Header.jsx`, `ScrollToTopButton.jsx`, `App.jsx`, and `Contact.jsx` were **not** modified.

Still present in source / measured:

- Skip link `href="#main-content"` (hash not set on activate — existing 7B behavior).
- `#main-content` on homepage and `/team`.
- Header logo `alt=""`.
- Hamburger `aria-expanded`, `aria-controls="mobile-navigation"`.
- Mobile menu still a `<nav id="mobile-navigation">` when open (still conditionally rendered; unchanged from 7B).
- Hidden Back-to-Top: `inert`, `tabIndex={-1}`.
- Back-to-Top still `md:hidden` — now agrees with Header mode at 768.
- Placeholders still `placeholder:text-slate-500`.
- Dark-header active nav `#60a5fa` CSS untouched.

A11Y-07 was not reopened.

Keyboard Escape / Tab cycle was not re-implemented; it remains the Phase 7B Header logic. Human keyboard check is still required.

---

## M. Electrical regression

**Not edited:**

- `src/components/NeuralNetworkBackground.jsx`
- `src/components/ElectricalCursorOverlay.jsx`
- `src/lib/neuralEffects.js`

Layout CSS only. Overlay remains a full-viewport canvas. No retune of neural network, cursor interaction, random discharge, ambient sparks, click/tap discharge, reduced-motion suppression, or cooldown.

Human motion check is still required after the Hero spacing change on short landscape.

---

## N. Routing regression

Measured on local Vite:

| URL | Path | Hash | Title |
|-----|------|------|-------|
| `/` | `/` | (empty) | SpandanAI |
| `/#home` | `/` | `#home` | SpandanAI |
| `/#use-cases` | `/` | `#use-cases` | SpandanAI |
| `/#team` | `/` | `#team` | SpandanAI |
| `/#contact` | `/` | `#contact` | SpandanAI |
| `/team` | `/team` | (empty) | Team \| SpandanAI |

No new routes. `vercel.json` `/team` rewrite untouched. Direct `/team` refresh still depends on the existing local/Vercel SPA rewrite.

Nav href helpers (`src/lib/navHrefs.js`) were not edited.

---

## O. Use Case / Cryo-CMOS regression

`src/data/siteContent.js` and `src/components/Applications.jsx` were not edited. Five cards remain, including **Cryo-CMOS for AI assisted Quantum circuits**. Grid classes (`1` / `2+2+1` / `3+2`) unchanged.

No horizontal overflow measured at 320–1920.

---

## P. Team page regression

`TeamPage.jsx` / `teamContent.js` / leadership data were not edited.

| Viewport | Token / chrome | Overflow | Title |
|----------|----------------|----------|-------|
| 320×800 | 80px / hamburger | none | Team \| SpandanAI |
| 390×844 | 80px / hamburger | none | Team \| SpandanAI |
| 768×800 | 96px / desktop | none | Team \| SpandanAI |

Skip target and header mode match the homepage at the same widths.

---

## Q. Contact regression

`Contact.jsx` not edited. Form, mailto, placeholder contrast classes, and section `id="contact"` unchanged. No overflow measured on homepage viewports that include the page.

---

## R. Build result

`npm run build` completed with no errors and no new warnings.

| Asset | Phase 6B baseline (on `main`) | Phase 7C local prototype |
|-------|-------------------------------|--------------------------|
| JS | `index-Uk72Fn2K.js` 407.82 kB / gzip 130.41 kB | `index-DbxJXInE.js` **407.87 kB / gzip 130.43 kB** |
| CSS | `index-DwcHyqYN.css` 19.43 kB / gzip 5.19 kB | `index-D5ihWw1E.css` **19.85 kB / gzip 5.30 kB** |
| Font | `manrope-latin-wght-normal-DHIcAJRg.woff2` 24.83 kB | unchanged 24.83 kB |

JS +0.05 kB from Hero class-name hooks. CSS +0.42 kB from the two height queries. No unexpected JS growth.

---

## S. Dependency changes

**NONE.** `package.json` / lockfile untouched.

---

## T. Files modified (product)

| File | Change |
|------|--------|
| `src/index.css` | `--navbar-height` media query inverted to match Tailwind `md`; short-height Hero spacing |
| `src/components/Hero.jsx` | Class hooks only (`hero-section`, `hero-copy`, `hero-lede`, `hero-cta-row`). Copy unchanged |

Documentation (this phase):

- `docs/PHASE_7C_RESPONSIVE_HARDENING_PROTOTYPE.md` (this file)
- `docs/SPANDANAI_PROJECT_STATE.md`
- `docs/SPANDANAI_FILE_MAP.md`
- `docs/PHASE_7_ENGINEERING_ROADMAP.md`

---

## U. Git status at prototype freeze

Expected after this documentation:

- Branch `main`
- **NO COMMIT**
- **NO PUSH**
- **NO DEPLOY**
- Dirty working tree: the files in section T

Do not commit until after human visual review and an explicit request.

---

## V. Human test instructions

Local: `npm run dev`. Production URL is **not** this prototype.

Please verify at least:

1. **767px** header — hamburger only; no desktop links.
2. **Exactly 768px** header — desktop nav + Partner With Us; no hamburger; no jump/overlap.
3. **769px** header — same as 768.
4. **390×844** portrait — Hero readable; CTA in first view; hamburger.
5. **667×375** landscape — branding, H1, lede, CTA in first view.
6. **844×390** landscape — desktop chrome (width ≥ 768); CTA in first view.
7. Hero CTA “Explore Use Cases” still scrolls to Use Cases.
8. Hamburger open/close, including Partner With Us inside the drawer on mobile.
9. Use Cases: all 5 cards; Cryo-CMOS wraps naturally.
10. `/team` layout at mobile and 768+.
11. Contact form usable.
12. Back-to-Top: hidden on `md+`; on mobile appears after scrolling past ~1.1× viewport; not tabbable when hidden.
13. Electrical: Hero network + cursor; lower-page random/click/tap; no spark on controls; reduced-motion off.
14. Keyboard: skip link; hamburger; Tab / Shift+Tab; Escape returns focus to hamburger.
15. Browser zoom 150% or 200% on homepage — usable, no serious horizontal loss.

Do **not** commit after these tests. Wait for explicit approval.

---

## W. Files for a wording/review pass

Most useful:

1. `docs/PHASE_7C_RESPONSIVE_HARDENING_PROTOTYPE.md`
2. `src/index.css` (token query + short-height Hero rules)
3. `src/components/Hero.jsx` (class hooks only)
4. `docs/PHASE_7A_ENGINEERING_QUALITY_AUDIT.md` (RESP-01 / RESP-02 original findings)
5. `docs/SPANDANAI_PROJECT_STATE.md`

Not needed for this review: electrical source, team data, Phase 2B proposal.

---

## X. Next step

**Human responsive/visual review.** Then, only if approved, an explicit request to commit (no push/deploy unless separately requested).

Do not start Phase 7D image optimization, 7E dead-asset cleanup, 7F testing, 7G technical SEO, Phase 2B, LinkedIn, extra members, group photo, or production deploy.

---

## Implementation notes

- Preferred one breakpoint model: Tailwind `md` = `min-width: 768px`. Custom CSS now uses `@media not all and (min-width: 768px)` rather than `max-width: 768px`.
- No JavaScript viewport listeners for styling.
- `100dvh` is a progressive enhancement after `100vh` in the short-height Hero rule.
- Extreme viewports shorter than ~300px tall were not targeted; 568×320 is the shortest matrix height and now fits.
