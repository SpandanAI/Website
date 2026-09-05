# SpandanAI Phase 7 — Engineering Roadmap

Derived from `docs/PHASE_7A_ENGINEERING_QUALITY_AUDIT.md`.

**Status:** Phase 7B COMPLETE / HUMAN APPROVED / PUSHED (`bc97490`). Phase 6B COMPLETE / HUMAN APPROVED / PUSHED (`7e13358`). Phase 7C COMPLETE / HUMAN APPROVED / PUSHED (`59c7e8a`). Phase 7D COMPLETE / HUMAN APPROVED / PUSHED (`09d7cac`). Phase 7D.1 is **NEXT / NOT STARTED**. Phase 7E is **NOT STARTED**.  
**Production:** NOT DEPLOYED.

This is a small semiconductor marketing SPA. Do not migrate to Next.js, Redux, Three.js, a design-system package, or a large E2E estate unless a later audit shows a concrete need.

---

## How to use this roadmap

- Phase 7B accessibility is complete and pushed. Do not reopen it unless a regression appears.
- Phase 7C responsive hardening is complete and pushed. Do not reopen it unless a regression appears.
- Phase 7D image performance is complete and pushed. Do not reopen it unless a regression appears.
- Next is **7D.1** (card hover timing). Do not start 7E until 7D.1 is reviewed if that micro-polish is in progress.
- Implement remaining phases one at a time. Re-run `npm run build` after product changes.
- Do not mix stakeholder-blocked content (LinkedIn, extra members, group photo, Phase 2B copy) into these engineering phases.
- Production remains an older Vercel deploy until a human explicitly deploys.

---

## Out of scope (blocked external input)

| Item | Why it is not an engineering phase |
|------|-------------------------------------|
| LinkedIn URLs | Need real URLs |
| Extra team members | `teamMembers` is empty by design until content exists |
| Group photo | Need a real asset |
| Phase 2B messaging / SEO wording | Stakeholder copy |

Cursor autonomy on those: **0%** until assets/copy arrive.

---

## Phase 7B — Accessibility fixes

**Status:** IMPLEMENTED / HUMAN APPROVED / COMPLETED / PUSHED (`bc97490`, `feat: improve website accessibility`). Phase 7B.1 navigation landmark polish is included.

**Objective:** Fix confirmed keyboard and contrast issues without changing approved visual design more than necessary.

**Findings addressed:** A11Y-01, A11Y-02, A11Y-03, A11Y-04, A11Y-05, A11Y-06, A11Y-08. A11Y-07 remains deferred.

**Expected files:**

- `src/components/ScrollToTopButton.jsx`
- `src/index.css` (Back-to-Top visibility / active nav on dark header)
- `src/components/Header.jsx` (skip link, Escape, `aria-controls`, optional logo alt)
- `src/components/Contact.jsx` (placeholder color)
- Possibly `src/pages/HomePage.jsx` / `src/pages/TeamPage.jsx` (`id` on `main` for skip target)

**Risk:** Medium for menu focus/Escape (must not regress hamburger or `/team` nav). Low for skip link, BTT `inert`/`hidden`, placeholder color. Active-nav color needs a visual check on Hero and `/team` intro.

**Cursor autonomy:** **85% Cursor / 15% human** (keyboard Tab-through, VoiceOver/TalkBack optional, hamburger open/close).

**Human testing required:** YES — keyboard-only homepage + `/team`; mobile drawer Escape; focus return to hamburger.

**Stakeholder involvement:** NO

**Senior required:** NO for implementation; YES for a short visual check of the new active-nav color.

---

## Phase 6B — Global Electrical Interaction Polish

**Status:** COMPLETE / HUMAN MOTION REVIEW PASS / PUSHED (`7e13358`, `feat: polish global electrical interactions`). Includes 6B.1 jagged/asymmetric polish and 6B.2 primary/secondary/tertiary hierarchy. Production: **NOT DEPLOYED.**

**Objective:** Improve the visual quality of click-triggered electrical discharges **outside the Hero**, while keeping the Hero clearly more sophisticated and preserving accessibility, reduced-motion, interactive-target suppression, and performance safeguards.

See `docs/PHASE_6B_GLOBAL_ELECTRICAL_POLISH_PROTOTYPE.md`.

Do not mix with image, SEO, or responsive work unless explicitly requested. Hero canvas was not retuned.

**Files:** `src/components/ElectricalCursorOverlay.jsx`, `src/lib/neuralEffects.js` (`generateClickDischarge`; Hero helpers unchanged).

**Risk:** Medium (approved Phase 6 look must not regress).

**Cursor autonomy:** Implemented from the written visual brief. Human motion review approved.

**Human testing required:** YES — completed. Desktop click, mobile tap, reduced motion, no sparks on controls.

**Stakeholder involvement:** NO for engineering; YES for visual approval (received).

**Senior required:** YES for look-and-feel (approved).

---

## Phase 7C — Responsive / short-viewport hardening

**Status:** COMPLETE / HUMAN APPROVED / PUSHED (`59c7e8a`, `feat: harden responsive layout`). Production: **NOT DEPLOYED.**

**Objective:** Close the 768px navbar-token overlap and make the Hero CTA reachable on short landscape phones without retuning the approved desktop Hero.

**Findings addressed:** RESP-01, RESP-02.

**Implemented files:**

- `src/index.css` (`@media not all and (min-width: 768px)` for `--navbar-height`; `max-height: 540px` / `340px` Hero spacing)
- `src/components/Hero.jsx` (class hooks only; copy unchanged)

**Risk:** Medium. Exact-768 layouts, Use Case grid, Team grid, and sticky offset must be re-checked at 767 / 768 / 820.

**Cursor autonomy:** **80% Cursor / 20% human visual verification**

**Human testing required:** YES — 390, 667×375 landscape, 768, 820, 1024. See `docs/PHASE_7C_RESPONSIVE_HARDENING_PROTOTYPE.md`.

**Stakeholder involvement:** NO

**Senior required:** NO unless Hero density on landscape looks “too tight.”

---

## Phase 7D — Image and load performance

**Status:** COMPLETE / HUMAN APPROVED / PUSHED (`09d7cac`, `perf: optimize leadership images`). Production: **NOT DEPLOYED.**

**Objective:** Cut download cost of photos that are displayed at 176×176. Do not retune canvas or add a bundle analyzer unless a later profile demands it.

**Findings addressed:** PERF-01, PERF-02, optionally PERF-03 (wave filename), HTML `width`/`height` on images.

**Expected files:**

- `public/images/V. S. Chakravarthy.jpg`
- `public/images/K. Dharanidhar G.jpg`
- `src/components/Founders.jsx` (`loading`)
- `src/components/TeamMemberCard.jsx` (dimensions attributes)
- Optionally Hero CSS + `wave-background.*` rename

**Risk:** Low for compression if faces are visually QA’d. Medium for renaming `wave-background.png` (cache + CSS URL).

**Do not:** convert the whole site to AVIF, add srcset machinery, or change Hero node counts (PERF-04 stays later/optional).

**Cursor autonomy:** **90% Cursor / 10% human** (compare before/after photos).

**Human testing required:** YES — leadership faces on homepage and `/team`.

**Stakeholder involvement:** NO (same photos, smaller files).

**Senior required:** NO

---

## Phase 7D.1 — Team card hover micro-polish

**Status:** NEXT / NOT STARTED.

**Objective:** Keep the approved −4px lift and shadow, but make hover timing crisper (~150ms ease-out) instead of floaty/slow.

**Human testing required:** YES — homepage and `/team` pointer hover, rapid card-to-card, reduced motion.

**Stakeholder involvement:** NO

---

## Phase 7E — Dead code and dead assets

**Objective:** Remove confirmed unused exports and unused logo files. No behavior change.

**Findings addressed:** QUAL-01, ASSET-01.

**Expected files:**

- `src/lib/animations.js` (`cardHover`, `sectionTransition`)
- `public/images/logo-light.png`
- `public/images/logo-dark.webp`
- `public/images/logo-dark.png`

**Risk:** Low. Confirm logos are not referenced in `index.html` or off-repo collateral first.

**Cursor autonomy:** **95% Cursor / 5% human**

**Human testing required:** Smoke: header/footer logo still `logo-light.webp`.

**Stakeholder involvement:** NO

**Senior required:** NO

---

## Phase 7F — Lightweight testing / tooling

**Objective:** Add a **small** safety net proportional to a marketing SPA. Not a full test pyramid.

**Findings addressed:** TOOL-01.

**MUST HAVE before production:** **None.** Build already passes. This is for future development, not a deploy gate.

**NICE TO HAVE:**

| Layer | What | Why |
|-------|------|-----|
| Playwright (few smokes) | `/` renders; `/team` renders; `/team` → Use Cases / Contact; five Use Cases; four leadership; no fake members; Copy email; mobile menu open/close | Catches routing regressions |
| ESLint (flat, React) | Unused vars, accidental `debugger` | Cheap |
| Vitest + RTL | Optional; only if a helper (e.g. `navHrefs`) keeps growing | Not required now |

**Do not add:** TypeScript migration, huge E2E coverage, visual regression SaaS, CI matrix of browsers, unless the team later wants it.

**Expected files:** `package.json` scripts, Playwright config, 1–2 spec files, optional ESLint config.

**Risk:** Medium (new deps — only in this phase, with human approval). Keep versions pinned.

**Cursor autonomy:** **75% Cursor / 25% human** (choose runner, review scripts).

**Human testing required:** YES — confirm `npm test` / `npx playwright test` locally.

**Stakeholder involvement:** NO

**Senior required:** NO for smokes; YES if adding ESLint rules that fight existing style.

**Minimum future test plan (no implementation now):**

- **E2E smoke:** homepage H1; `/team` H1; five Use Case titles; four names; no extra cards.
- **E2E routing:** from `/team`, Home / Use Cases / Contact land correctly.
- **E2E interaction:** hamburger at 390; Copy; Back-to-Top when scrolled (after 7B so it is not a false fail).
- **A11Y assertion (light):** one `h1` per page; `main` present; nav `aria-current` on `/team`.
- **Unit:** `navHrefs` destinations from `/` vs `/team` — only if cheap.

---

## Phase 7G — Technical SEO readiness

**Objective:** Make `/team` discoverable and shareable without changing Phase 2B stakeholder wording.

**Findings addressed:** SEO-01; optionally SEO-02 (JSON-LD) only with approved org facts.

**Expected files:**

- `public/sitemap.xml` (add `https://spandanai.com/team`)
- `index.html` (canonical limitation of Vite SPA — document honestly)
- Possibly a tiny `react-helmet`-free document-title already exists; OG/Twitter for `/team` **cannot** be truly route-specific without prerender or a host-level inject.

**Risk:** Medium. Wrong canonical strategy can confuse Google. Do not invent unique H1 copy.

**Cursor autonomy:** **80% Cursor / 20% human** (indexing intent).

**Human testing required:** YES — view-source vs client title; sitemap after deploy.

**Stakeholder involvement:** **MAYBE** — only for “should `/team` be indexed?” If yes, proceed with sitemap. If no, `noindex` is a product decision.

**Senior required:** YES for canonical/noindex choice. NO for adding `/team` to the sitemap once indexing is wanted.

**Not in 7G:** Phase 2B unique homepage H1 / meta description rewrite.

---

## Optional later (not scheduled)

| Item | Finding | Why later |
|------|---------|-----------|
| Hero node/DPR retune | PERF-04 | Approved experience; profile on a real phone first |
| Wave file rename | PERF-03 | Cache + CSS coupling |
| Footer motion vs focus | A11Y-07 | Animation regression risk |
| Autoprefixer | existing project note | Only if Safari QA finds a real prefix bug |
| Form backend | Contact mailto | Optional; not required |
| Wildcard Vercel rewrite | ROUTE-01 | Only when more SPA routes exist **and** you want SPA 404s |

---

## Suggested order after Phase 7B

1. **6B** — Global electrical click polish outside the Hero (**COMPLETE** / pushed `7e13358`; not production-deployed).
2. **7C** — 768 / landscape (**COMPLETE** / HUMAN APPROVED / pushed; not production-deployed).
3. **7D** — photos (**COMPLETE** / HUMAN APPROVED / pushed; not production-deployed).
4. **7D.1** — team card hover timing (**NEXT / NOT STARTED**).
5. **7E** — cleanup.
6. **7G** — when a production deploy of `/team` is imminent.
7. **7F** — after remaining UX work settles.

---

## Cursor vs human (summary)

| Phase | Cursor | Human | Senior |
|-------|--------|-------|--------|
| 7B Accessibility | 85% | 15% keyboard/visual | Visual check of nav color — **done** |
| 6B Global click polish | Implemented | Motion review **PASS** | Yes — **done** |
| 7C Responsive | 80% | 20% visual — **done / PASS** | Only if Hero looks wrong |
| 7D Images | 90% | 10% photo QA — **done / PASS** | No |
| 7D.1 Card hover | 90% | 10% motion feel | No |
| 7E Dead assets | 95% | 5% smoke | No |
| 7F Tests | 75% | 25% script/review | If ESLint policy |
| 7G Technical SEO | 80% | 20% | Canonical/index choice |
| Stakeholder content | 0% | 100% | Yes |

---

## What Phase 7A already ruled out

Do not open new phases for:

- Next.js / SSR migration (SPA LCP is accepted unless product strategy changes)
- Microservices / form platform **required now**
- Full observability
- Massive Playwright coverage
- Canvas rewrite
- Dependency upgrades for their own sake (`npm audit` on npmjs.org: 0 vulnerabilities for production deps)
