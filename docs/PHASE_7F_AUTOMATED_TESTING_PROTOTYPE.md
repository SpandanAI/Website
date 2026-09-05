# SpandanAI Phase 7F — Automated Testing Prototype

## A. Phase 7F result

**HUMAN APPROVED / COMPLETE**  
See `docs/PHASE_7F_COMPLETION_REPORT.md` for GitHub landing.

**NOT DEPLOYED**

**Date:** 6 September 2026  
**Base:** `2b0c5a2` (`docs: record Phase 7E completion`) after Phase 7E push.

Small Playwright Chromium smoke suite for already-approved product flows. No TypeScript migration. No ESLint. No unit-test framework. No CI. No production deploy.

---

## B. Starting testing state

Inspected `package.json`, `package-lock.json`, `src/`, `vercel.json`. No `vite.config.*`. No `.github/workflows`.

| Item | Before Phase 7F |
|------|-----------------|
| End-to-end framework | **No** |
| Unit framework (Vitest/Jest/RTL) | **No** |
| ESLint | **No** |
| Test files | **None** |
| CI | **None** |
| npm scripts | `dev`, `build`, `preview` |

Phase 7A’s “no tests” finding was still current.

---

## C. Framework decision

**Playwright** (`@playwright/test`).

Why:

- One small browser smoke suite matches this SPA.
- Can launch Vite itself (`webServer`).
- Accessible selectors (`getByRole` / `getByLabel` / `getByText`).
- Viewport / reduced-motion / clipboard APIs without extra stacks.

Not added: Vitest, Jest, React Testing Library, Cypress, Storybook, visual-regression SaaS, GitHub Actions.

---

## D. Dependency added

Dev only:

| Package | Version | Role |
|---------|---------|------|
| `@playwright/test` | **1.63.0** (exact) | Test runner / API |
| `playwright` | 1.63.0 | Transitive |
| `playwright-core` | 1.63.0 | Transitive |

Runtime `dependencies` unchanged.

---

## E. Playwright version

**1.63.0** — current stable version resolved by `npm install -D @playwright/test --save-exact`.

---

## F. Browser configuration

- Project: **Chromium only**
- Local install: `npx playwright install chromium` (binaries in user cache, **not** committed)
- Firefox / WebKit: **not** installed; remain human QA
- Isolated Vite port: **4176**
- `webServer` starts `npx vite --host 127.0.0.1 --port 4176 --strictPort`
- Retries: **0**
- Screenshots / traces: **on failure only**
- Video: **off**

---

## G. npm scripts

Existing scripts unchanged (`dev`, `build`, `preview`).

Added:

```
npm run test:e2e
npm run test:e2e:headed
npm run test:e2e:ui
```

---

## H. Test file structure

Directory: `tests/` (JS, not TypeScript).

| File | Purpose |
|------|---------|
| `tests/helpers.js` | Leadership names, contact email, `pageerror` / console-error collector |
| `tests/homepage.spec.js` | Homepage smoke |
| `tests/use-cases.spec.js` | Five cards + Cryo-CMOS |
| `tests/team.spec.js` | Homepage leadership + `/team` page |
| `tests/routing.spec.js` | Representative routing + history |
| `tests/contact.spec.js` | Form / email actions; no real send |
| `tests/responsive.spec.js` | 390×844 menu, Back-to-Top, 767/768/769 |
| `tests/accessibility.spec.js` | Landmarks, skip link, reduced motion |

Config: `playwright.config.js`

**11 tests.** No skipped tests.

---

## I. Homepage test

Open `/`. Confirms one H1 containing SpandanAI, header/banner, primary nav, Explore Use Cases, two canvases mount, no `pageerror` / console error.

---

## J. Use Case test

Explore Use Cases → `#use-cases`. Exactly **five** articles. Cryo-CMOS title: `Cryo-CMOS for AI assisted Quantum circuits`. No grid-column assertions.

---

## K. Leadership test

Homepage `#team` shows exactly the four approved names:

- N.R. Rohan
- K. Dharanidhar G
- S. Aniruddhan
- V. S. Chakravarthy

Meet the Team → `/team`. Hover timing is **not** asserted (150ms / −4px remains human-approved).

---

## L. Team page test

Direct `/team`. One H1 containing Meet the Team. Four leadership articles. No “Team Members” heading. Team nav `aria-current="page"`. Footer (`contentinfo`) present.

---

## M. Routing test

Homepage → `/team` → Home; `/team` → Use Cases (`/#use-cases`); `/team` → Contact (`/#contact`); direct `/team`; back/forward between `/#contact` and `/team`.

---

## N. Contact test

Name, Email, Organization / Company, Message, Contact Team, Email Us, Copy.

Does **not** click Contact Team or Email Us (no real mailto send).

Copy: Chromium `clipboard-read` / `clipboard-write` granted. Asserts **Copied ✓** and clipboard text `spandanai.sard@gmail.com`. Stable in this environment.

---

## O. Mobile nav test

Viewport **390×844**. Hamburger visible; desktop primary nav not exposed. Open menu: Home, Use Cases, Team, Contact, Partner With Us. Escape closes. Contact link activation works.

---

## P. 767 / 768 / 769 test

| Width | Expected |
|-------|----------|
| 767 | hamburger / mobile mode |
| 768 | desktop nav |
| 769 | desktop nav |

Confirms mobile panel is not open at the same time as desktop nav. Does not assert 77px/80px heights.

---

## Q. Back-to-Top test

Mobile viewport only. Hidden at top (`inert` / not in accessibility tree). After `scrollY > 1.1 × innerHeight`, available. Click returns near top. On `/team`, URL stays `/team`.

---

## R. Accessibility smoke

Native semantics only. **axe-core not added.** Does not replace Phase 7B human a11y review.

Checks: one H1 per page, `main`, primary nav, skip link, logo accessible name via visible “SpandanAI” text, form labels, mobile `aria-expanded` / `aria-controls`.

---

## S. Skip link test

Tab focuses “Skip to main content”. Enter focuses `#main-content`. URL hash is **not** required to become `#main-content` (click handler `preventDefault`).

---

## T. Reduced-motion status

Playwright `emulateMedia({ reducedMotion: "reduce" })`. Homepage renders. No `pageerror`. Canvases still mount.

Electrical freeze under reduced motion remains **human-covered**. No test-only hooks were added to `NeuralNetworkBackground.jsx` / `ElectricalCursorOverlay.jsx` / `neuralEffects.js`.

Framer Motion logs a **console.warn** (`motion()` deprecated; reduced-motion notice). Tests fail on `pageerror` and `console.error` only, not warnings.

---

## U. Electrical testing policy

No pixel / screenshot assertions for the network, sparks, or discharges.

Automated coverage: canvases mount on homepage; no uncaught page error.

No `data-testid` added to electrical code. Those files were **not** modified.

---

## V. Test run #1

`npm run test:e2e` after clipboard assertion:

- Total: **11**
- Passed: **11**
- Failed: **0**
- Skipped: **0**
- Runtime: **7.5s**

---

## W. Test run #2

Immediate second `npm run test:e2e`:

- Total: **11**
- Passed: **11**
- Failed: **0**
- Skipped: **0**
- Runtime: **7.2s**

No retries. No obvious flakiness in these two runs.

---

## X. Headed test result

`npm run test:e2e:headed` with `DISPLAY=:0`:

- Total: **11**
- Passed: **11**
- Failed: **0**
- Runtime: **7.5s**

---

## Y. Build result

`npm run build` **PASS** after adding Playwright. No errors. No new warnings.

```
dist/assets/index-DCdKucgy.js                         407.96 kB │ gzip: 130.48 kB
dist/assets/index-D5ihWw1E.css                         19.85 kB │ gzip:   5.30 kB
dist/assets/manrope-latin-wght-normal-DHIcAJRg.woff2   24.83 kB
```

---

## Z. Production bundle impact

**NONE.** Same hashes as Phase 7D.1 / 7E. `@playwright/test` is dev-only and is not in the production bundle. Font unchanged.

---

## AA. npm audit result

Default `npm audit` against the configured npmmirror registry **failed** (`/-/npm/v1/security/* not implemented`).

`npm audit --registry=https://registry.npmjs.org` (no `audit fix`):

| Advisory | Severity | Notes |
|----------|----------|--------|
| `nanoid` ≤3.3.17 | high | Transitive (existing Vite/tooling tree) |
| `postcss` ≤8.5.22 | high | Transitive |
| `postcss-selector-parser` 6.1.0–6.1.2 | (DoS) | Transitive |
| `vite` 8.0.0–8.0.15 | high | Direct pin **8.0.10**; `audit fix --force` would jump to 8.2.2 |

**4 vulnerabilities (1 low, 3 high)** reported. **Not auto-fixed.** Not a Playwright-specific production-bundle issue. Broad upgrades are out of scope for Phase 7F.

---

## AB. ESLint status

**DEFERRED / OPTIONAL**

Not installed. Adding ESLint to this mature JS/JSX tree would create an unrelated cleanup diff.

---

## AC. Unit test framework status

**NOT ADDED**

No Vitest, Jest, or React Testing Library.

---

## AD. CI status

**NOT ADDED YET**

No `.github/workflows/*`. Prove local stability before any workflow.

---

## AE. Files created

- `playwright.config.js`
- `tests/helpers.js`
- `tests/homepage.spec.js`
- `tests/use-cases.spec.js`
- `tests/team.spec.js`
- `tests/routing.spec.js`
- `tests/contact.spec.js`
- `tests/responsive.spec.js`
- `tests/accessibility.spec.js`
- `docs/PHASE_7F_AUTOMATED_TESTING_PROTOTYPE.md`

---

## AF. Files modified

- `package.json` (devDependency + scripts)
- `package-lock.json`
- `.gitignore` (`test-results/`, `playwright-report/`, `blob-report/`, `playwright/.cache/`)
- tracking docs (`SPANDANAI_PROJECT_STATE.md`, `SPANDANAI_FILE_MAP.md`, `PHASE_7_ENGINEERING_ROADMAP.md`)

---

## AG. Product source changes

**NONE.**

No edits to `src/`, `public/`, `index.html`, or electrical / hover / routing product code.

---

## AH. Git status

Working tree **dirty** with Phase 7F only.

**NOT STAGED. NOT COMMITTED. NOT PUSHED. NOT DEPLOYED.**

---

## AI. Human review instructions

Please inspect:

1. `tests/` file structure
2. Test names (11 tests)
3. Both `npm run test:e2e` results
4. Headed run
5. No skipped tests
6. Production bundle unchanged
7. `@playwright/test` 1.63.0 only as a dev dependency
8. npm audit (existing Vite/PostCSS/nanoid advisories; not auto-fixed)
9. Confirm no product-code changes

Commands:

```
npm run test:e2e
npm run test:e2e:headed
```

Optional UI mode: `npm run test:e2e:ui`

Human review: **PASS**.

---

## AJ. Next step

Phase 7G — Final Engineering / SEO / Security Hardening.

See `docs/PHASE_7F_COMPLETION_REPORT.md`.
