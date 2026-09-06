# SpandanAI Phase 7G — Final Engineering Prototype

## A. Phase 7G result

**HUMAN APPROVED / COMPLETE**  
See `docs/PHASE_7G_COMPLETION_REPORT.md` for GitHub landing.

**NOT DEPLOYED**

**Date:** 6 September 2026  
**Base:** `b4d5795` (`docs: record Phase 7F completion`) after Phase 7F push.

Technical SEO, safe dependency remediation, Organization JSON-LD from known facts only, and a minimal GitHub Actions CI workflow. No visual redesign. No stakeholder-content invention. Electrical, hover, and image work not retuned.

---

## B. Starting git state

| Item | Value |
|------|--------|
| Branch | `main` |
| HEAD / origin/main | `b4d5795` |
| Working tree before 7G | clean |
| Phase 7F | COMPLETE / PUSHED (`4545cde`) |

---

## C. Technical SEO audit (current before 7G)

| Item | Before |
|------|--------|
| Homepage `<title>` | `SpandanAI` in `index.html` + JS |
| `/team` title | JS only: `Team \| SpandanAI` |
| Meta description | Homepage copy in `index.html` only |
| Canonical | Always `https://spandanai.com/` |
| OG / Twitter | Homepage-only in `index.html` |
| sitemap.xml | Homepage only (`lastmod` 2026-07-04) |
| robots.txt | Present: `Allow: /` + sitemap URL |
| JSON-LD | Absent |
| `/team` rewrite | `vercel.json` `/team` → `/index.html` |

---

## D. Homepage title

**SpandanAI** — kept. Matches H1 and existing approved title.

---

## E. Team page title

**Meet the Team | SpandanAI**

Derived from the existing `/team` H1. Replaces the previous JS title `Team | SpandanAI`. Not keyword-stuffed.

---

## F. Meta description

Homepage (unchanged approved copy):

> SpandanAI is a fabless semiconductor company building hybrid analog-digital silicon for AI inference and next-generation communication systems.

`/team` (from existing page copy):

> Leadership and team at SpandanAI.

No invented marketing claims.

---

## G. Canonical result

After client hydration:

| Route | Canonical |
|-------|-----------|
| `/` | `https://spandanai.com/` |
| `/team` | `https://spandanai.com/team` |
| unmatched client route | `https://spandanai.com/` (not an indexable document) |

Implemented in `src/components/DocumentMeta.jsx` without react-helmet.

**Static HTML limitation:** the first HTML payload (including Vercel `/team` rewrite) still contains the homepage canonical until JavaScript runs.

---

## H. Open Graph / Twitter result

Homepage `index.html` tags **kept**:

- `og:title` / `twitter:title`: SpandanAI
- `og:description` / `twitter:description`: same as homepage meta description
- `og:url`: `https://spandanai.com/`
- `og:image` / `twitter:image`: `https://spandanai.com/images/og-image.png`
- `twitter:card`: `summary_large_image`

**Not** made route-specific. Social crawlers typically do not execute the SPA. A correct homepage preview is preferred over prerender/SSR infrastructure.

---

## I. SPA metadata limitation

This is a Vite client-rendered SPA.

- Google may execute JS and then see route titles/canonicals.
- Many social/preview crawlers read only `index.html`.
- No Next.js, Remix, or prerender was added.

Document this honestly at release time.

---

## J. Sitemap result

`public/sitemap.xml` now lists:

- `https://spandanai.com/` (`lastmod` 2026-07-04 unchanged)
- `https://spandanai.com/team` (`lastmod` 2026-09-06)

No hash URLs. No invented routes.

---

## K. robots.txt result

**KEPT** existing `public/robots.txt`:

```
User-agent: *
Allow: /
Sitemap: https://spandanai.com/sitemap.xml
```

Correct for this public corporate site. No crawl-delay. Site not blocked.

---

## L. Structured data decision

**ADDED** minimal Organization JSON-LD in `index.html` from known site facts only:

- name: SpandanAI
- url: `https://spandanai.com/`
- logo: `https://spandanai.com/images/logo-light.webp`

**Not invented:** address, founding date, social profiles, employee count, phone, legal identifiers.

---

## M. Not found / routing result

`NotFoundPage` UI **unchanged**. Title is now `Page not found | SpandanAI`. Back to Home remains. `/team` rewrite unchanged. No wildcard rewrite added.

---

## N. Security audit before

`npm audit --registry=https://registry.npmjs.org` on the 7F tree:

| Package | Severity | Installed | Notes |
|---------|----------|-----------|--------|
| `vite` | high | 8.0.10 | Advisory range 8.0.0–8.0.15 |
| `postcss` | high | 8.5.12 | Transitive |
| `nanoid` | high | 3.3.11 | Transitive via PostCSS |
| `postcss-selector-parser` | low/DoS | 6.1.2 | Transitive via Tailwind |

**4 vulnerabilities (1 low, 3 high).** No `npm audit fix --force`.

---

## O. Dependency tree investigation

| Advisory | Direct parent |
|----------|----------------|
| `vite` | direct devDependency |
| `postcss` / `nanoid` | `vite` and `tailwindcss@3.4.19` |
| `postcss-selector-parser` | `tailwindcss@3.4.19` (`^6.1.2`) |

Tailwind **3.4.19** is already the latest 3.4 / 3.x line. No Tailwind v4 migration.

Vite **8.0.16** is the first 8.0 release outside the advisory range. **8.2.2** is latest 8.x but would jump Rolldown 1.0 → 1.2; not taken.

No direct install of `postcss` / `nanoid` solely to silence audit.

---

## P. Dependencies updated

| Package | From | To | How |
|---------|------|----|-----|
| `vite` (direct, exact) | 8.0.10 | **8.0.16** | deliberate same-minor patch |
| `postcss` (transitive) | 8.5.12 | **8.5.28** | lockfile refresh within parent ranges |
| `nanoid` (transitive) | 3.3.11 | **3.3.18** | via updated PostCSS |
| `postcss-selector-parser` (transitive) | 6.1.2 | **6.1.4** | within Tailwind `^6.1.2` |

Runtime unchanged: `react` 19.2.5, `react-dom` 19.2.5, `react-router-dom` 7.18.3, `framer-motion` 12.38.0, `@fontsource-variable/manrope` 5.3.0.

---

## Q. Security audit after

`npm audit --registry=https://registry.npmjs.org`:

**found 0 vulnerabilities**

This does **not** mean the site is “secure” in an absolute sense. It means the previously reported npm advisories in this tree are no longer present at the installed versions.

---

## R. Runtime dependency security

No npm advisories on production runtime packages (`react`, `react-dom`, `react-router-dom`, `framer-motion`). Prior findings were **dev/build-tool** (Vite/PostCSS), not demonstrated user-facing production exploits.

---

## S. Security header audit

`vercel.json` **unchanged**:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- CSP: `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self' mailto:`

Existing CSP already covers more than `frame-ancestors`. Not expanded. `mailto:` remains required for Contact. `unsafe-inline` styles remain required for inline component styles.

---

## T. HSTS decision

**NOT ADDED** in this local prototype.

HSTS is a production-domain policy with persistent browser effects. Recommend considering `Strict-Transport-Security` at **production release**, not as a casual local experiment.

---

## U. External resource result

Product resources remain **local**:

- Manrope self-hosted via `@fontsource-variable/manrope`
- No Google Fonts
- No analytics
- No remote scripts/images/CDNs in product source

---

## V. Secrets audit

No API keys, tokens, passwords, private keys, or `.env` files in source. Public contact email is not a secret. `.vercel/` remains gitignored.

---

## W. Code quality result

`src/`: no `console.log`, `debugger`, `TODO`/`FIXME`, `innerHTML`, `eval`, or `dangerouslySetInnerHTML`. No test-only hooks in electrical files. Duplicate page-title `useEffect`s were centralized into `DocumentMeta`.

Framer Motion `motion()` deprecation **console.warn** remains. Not changed (behavior-risk vs a warning).

---

## X. ESLint decision

**DEFERRED / NOT REQUIRED FOR RELEASE**

Playwright now covers main flows. Introducing ESLint would create a large unrelated cleanup diff.

---

## Y. CI decision

**CI ADDED** (local prototype). Playwright passed repeatedly; a single-job GitHub Actions workflow is proportionate.

---

## Z. CI configuration if added

`.github/workflows/ci.yml`

- on: push to `main`, pull_request
- `actions/checkout@v7`
- `actions/setup-node@v7` with Node **22** and npm cache
- `npm ci`
- `npx playwright install chromium --with-deps`
- `npm run build`
- `npm run test:e2e`

No deploy job. No secrets. No Firefox/WebKit matrix.

---

## AA. Build result

`npm run build` **PASS** (Vite 8.0.16). No errors. No new warnings.

```
dist/index.html                                         2.00 kB │ gzip:   0.66 kB
dist/assets/manrope-latin-wght-normal-DHIcAJRg.woff2   24.83 kB
dist/assets/index-D5ihWw1E.css                         19.85 kB │ gzip:   5.30 kB
dist/assets/index-DLcZJEDz.js                         408.71 kB │ gzip: 130.77 kB
```

---

## AB. Test run #1

`npm run test:e2e`: **13 passed / 0 failed / 0 skipped / 8.0s**

---

## AC. Test run #2

`npm run test:e2e`: **13 passed / 0 failed / 0 skipped / 8.0s**

---

## AD. Test count

**13** (previous 11 + 2 SEO metadata smokes). Existing tests were not removed.

---

## AE. Console result

No `pageerror` or `console.error` on `/` or `/team` in the suite.

Known harmless **console.warn**: Framer Motion `motion()` is deprecated; reduced-motion notice when emulated.

---

## AF. Production bundle impact

| Asset | 7F / 7E | 7G | Delta |
|-------|---------|----|-------|
| JS | 407.96 kB / gzip 130.48 | 408.71 kB / gzip 130.77 | +0.75 kB / +0.29 kB gzip |
| CSS | 19.85 kB / gzip 5.30 | **unchanged** hash `index-D5ihWw1E.css` | none |
| Font | 24.83 kB | 24.83 kB | none |
| `index.html` | 1.73 kB | 2.00 kB | JSON-LD |

JS growth is `DocumentMeta` (expected, negligible). Playwright remains dev-only.

---

## AG. Electrical regression

**UNCHANGED.** `NeuralNetworkBackground.jsx`, `ElectricalCursorOverlay.jsx`, `neuralEffects.js` not edited.

---

## AH. Hover regression

**UNCHANGED.** `TeamMemberCard.jsx` not edited (150ms / −4px).

---

## AI. Image regression

**UNCHANGED.** Leadership JPEGs, logo, wave, OG not retuned.

---

## AJ. Responsive regression

**UNCHANGED.** 7C 767/768/769 tests still pass.

---

## AK. Accessibility regression

**UNCHANGED.** Skip link, landmarks, labels, mobile ARIA tests still pass. Title handling moved to `DocumentMeta`; `/team` still focuses its H1.

---

## AL. Routing regression

**UNCHANGED.** `/`, hashes, `/team`, NotFound UI, Vercel `/team` rewrite.

---

## AM. Files created

- `src/components/DocumentMeta.jsx`
- `tests/seo.spec.js`
- `.github/workflows/ci.yml`
- `docs/PHASE_7G_FINAL_ENGINEERING_PROTOTYPE.md`

---

## AN. Files modified

- `index.html`
- `src/App.jsx`
- `src/pages/HomePage.jsx`
- `src/pages/TeamPage.jsx`
- `src/pages/NotFoundPage.jsx`
- `public/sitemap.xml`
- `package.json`
- `package-lock.json`
- tracking docs

`public/robots.txt` and `vercel.json` **not** modified.

---

## AO. Dependencies modified

Direct: `vite` 8.0.10 → 8.0.16.  
Transitive lockfile: `postcss` 8.5.28, `nanoid` 3.3.18, `postcss-selector-parser` 6.1.4.

---

## AP. Git status

Working tree **dirty** with Phase 7G only.

**NOT STAGED. NOT COMMITTED. NOT PUSHED. NOT DEPLOYED.**

---

## AQ. Production status

**NOT DEPLOYED**

---

## AR. Items deferred

- HSTS until production release decision
- Route-specific Open Graph (would need prerender/SSR)
- ESLint
- Unit tests
- Tailwind v4 / React majors / Vite 8.2.2
- A11Y-07 footer focus
- Stakeholder LinkedIn / extra members / group photo / Phase 2B wording
- Internal phase-doc hygiene (dedicated later pass)

---

## AS. Human review items

Short visual check only:

1. homepage still looks identical
2. `/team` still looks identical
3. navigation works
4. mobile menu works
5. electricity still looks correct
6. leadership hover still feels correct
7. browser console has no new errors

Engineering evidence is in this report (build, two Playwright runs, audit before/after, metadata, sitemap, robots, CI).

---

## AT. Next step

Final public repository hygiene + release candidate preparation.

See `docs/PHASE_7G_COMPLETION_REPORT.md`.
