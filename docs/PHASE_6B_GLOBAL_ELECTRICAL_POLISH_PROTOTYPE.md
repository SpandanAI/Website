# SpandanAI Phase 6B — Global Electrical Polish Prototype

## Status

**COMPLETE**  
**HUMAN MOTION REVIEW: PASS**  
**HUMAN VISUAL REVIEW: APPROVED**

Feature commit: `7e13358` (`feat: polish global electrical interactions`)  
GitHub: **PUSHED** to `origin/main` as part of this finalization  
Production: **NOT DEPLOYED**

No Phase 6B.3 required.

---

## Final approval note

Phase 6B added a dedicated compact click/tap electrical discharge outside the Hero, richer than ambient random sparks, with viewport-aware direction, a tiny ignition flash, and a mobile compact variant.

Phase 6B.1 made the primary path more jagged and the forks asymmetric, with different branch lifetimes, so the geometry felt less like a mirrored Y.

Phase 6B.2 introduced explicit primary / secondary / tertiary visual hierarchy so the primary bolt dominates and quieter forks support it. Most normal clicks use about one meaningful secondary. Overall scale, brightness, color, and timing stayed the same.

Human screen-recording review approved this final motion. Hero remains richer and was not retuned. Ambient random sparks were not changed. Production deployment is intentionally deferred.

**Date:** 1 September 2026  
**Pre-finalization HEAD:** `8a4e4b8` (`docs: record Phase 7 accessibility completion`)

---

## A. Phase result

**COMPLETE** — human motion review passed. The 6B / 6B.1 / 6B.2 implementation is the approved global click/tap discharge.

Hero neural/electrical files were not retuned. Random global sparks keep the previous geometry. Click and tap events outside the Hero now use a dedicated branching discharge.

---

## B. Original global electrical implementation audit

Inspected `ElectricalCursorOverlay.jsx` and `neuralEffects.js` before changing click geometry.

**A. Click spark creator:** `fireSpark(now, { source: "click" })` from `pointerdown` (desktop). Mobile uses `{ source: "tap" }` from `pointerup` after tap-vs-scroll checks. Geometry used `generateMicroSparkBranches`.

**B. Previous click vs random numbers:**

| | Random | Click (old) | Tap (old) |
|--|--------|-------------|-----------|
| Branch count | 1–3 (11% flash-only) | 2–3, never flash-only | 1–2 |
| Radius | 14–34 px | ×1.15 ≈ 16–39 px | 14–28 px |
| Line width | outer 2.35, core 1.05 | same | same |
| Opacity | outer 0.34 / core 0.88 × envelope × 0.55 | same strokes × 0.72 | × 0.60 |
| Duration | 130–220 ms | 160–240 ms | 140–220 ms |
| Jitter | 2.6 px | same helper | same |
| Colors | brand blue outer, dark cyan core | identical | identical |
| Glow | radial flash `8 + radius*0.32` for full life | same style | same |
| Fade | `dischargeEnvelope` | same | same |
| Max sparks | 2 | 2 | 2 |
| Cooldown | n/a | 300 ms | 300 ms |
| Origin jitter | ±8 px | ±4 px | ±3 px |

**C.** Click and random used **the same** `generateMicroSparkBranches` fan (evenly offset angles from one origin). Click only scaled radius/intensity/duration.

**D.** Combination: small radial flash + 1–3 short polylines, two stroke layers. No tertiary forks, no endpoint fragments, no viewport bias.

**E.** Origin = pointer + jitter, clamped to canvas. Branch endpoints = origin + angle × length.

**F.** Yes — branches could run off-screen near edges.

**G.** Mobile: no random sparks. Tap requires move ≤10 px, duration ≤600 ms, not over controls/header/Hero.

**H.** `INTERACTIVE_SELECTOR = "a, button, input, textarea, select, label"` plus `header`. Overlay canvas is `pointer-events-none`. No `preventDefault`.

**I.** `prefers-reduced-motion: reduce` clears sparks, skips `fireSpark`, stops rAF.

**J.** No idle rAF. Loop starts only when a spark is pushed; stops when the array is empty.

---

## C. Exact visual problem

Clicks reused the tiny ambient branch helper, so the interaction often looked like one small curved blue stroke rather than a discharge from the pointer.

---

## D. Design implemented

New helper `generateClickDischarge` (Hero still uses `generateElectricalArcPoints` / `generateLocalSparkPoints` / `generateMicroSparkBranches` unchanged).

Click/tap:

- 1 irregular primary arc (4 heading steps)
- 1–3 secondaries typically (sometimes 0 or 4)
- occasional short tertiary fork
- 0–3 tiny endpoint fragments
- three-layer strokes (blue glow, dark cyan main, pale core)
- tiny origin flash 55–95 ms, radius ~3.5–7.5 px
- direction biased into remaining viewport space
- variants: normal / directional / compact crack / rare slightly stronger energy

Random global sparks: **unchanged** helper and stroke recipe.

---

## E. Click discharge geometry

Primary length: desktop ~30–55 px (directional up to ~65); tap ~24–45. Secondaries ~10–30 px from mixed positions along the primary (not a starburst). Origin jitter ±2 px (click) / ±1.6 px (tap).

---

## F. Random vs click difference

| | Random | Click | Tap |
|--|--------|-------|-----|
| Geometry | `generateMicroSparkBranches` | `generateClickDischarge` | same, `compact: true` |
| Intensity | 0.55 | 0.86 (energy ×1.12) | 0.76 |
| Duration | 130–220 ms | 180–250 ms | 160–220 ms |
| Strokes | 2 | 3 + fragments | 3 + fragments |
| Flash | larger, full life | 3.5–7.5 px, 55–95 ms | same as click |

---

## G. Desktop behavior

Fine hover pointer: random ambient sparks unchanged. Empty-space click: richer discharge. Pointer move still does not spark. Cooldown 300 ms. Max 2 concurrent global sparks.

---

## H. Mobile behavior

No random overlay sparks. Intentional tap: compact discharge. Scroll/drag still cancelled by 10 px / 600 ms rules.

---

## I. Tap-vs-scroll behavior

Unchanged thresholds. `pointermove` still invalidates a pending touch if it travels more than 10 px.

---

## J. Reduced-motion behavior

Unchanged: no random, click, tap, flash, or fragments when `prefers-reduced-motion: reduce`.

---

## K. Interactive-target suppression

Unchanged selector + header + Hero `#home`. Skip link, hamburger, Back-to-Top, form controls, Partner/Explore/Meet/Email/Copy remain `a`/`button`/`input`/`textarea`/`label`.

---

## L. Performance architecture

Unchanged: rAF only while `activeSparks.length > 0`. DPR cap 2. Max 2 sparks. No new dependencies. Canvas 2D only.

---

## M. Viewport-edge handling

`pickInwardAngle` samples 12 directions and prefers those with remaining canvas reach. Primary/secondary lengths are clamped to that reach. Tiny clipping still allowed.

Node check: origin (4, 400) produced a primary ending around x ≈ 35 (inward).

---

## N. Hero regression check

`NeuralNetworkBackground.jsx` not modified. Shared Hero helpers `generateElectricalArcPoints`, `generateLocalSparkPoints`, `generateMicroSparkBranches` source for Hero paths is unchanged (`generateMicroSparkBranches` body identical; overlay random still uses it). Human must still compare Hero vs lower page visually.

---

## O. Phase 7 accessibility regression

No edits to Header, skip link, Back-to-Top, Contact placeholders, or active-nav CSS. Overlay remains `pointer-events-none` / `aria-hidden`.

---

## P. Responsive checks

This phase does not fix RESP-01 (768 token) or RESP-02 (landscape Hero CTA). Overlay is full-viewport canvas; no layout change expected at 390, 430, 667×375, 768, 820, 1366, 1440, 1920.

---

## Q. Build result

`npm run build` **PASS**. No warnings. No errors.

```
JS   index-DkIg1Iej.js   405.43 kB │ gzip: 129.48 kB
CSS  index-DwcHyqYN.css   19.43 kB │ gzip:   5.19 kB
Font manrope …            24.83 kB
```

Phase 7B JS was 401.86 kB. Increase is the new click helper.

---

## R. Files modified

Product:

- `src/components/ElectricalCursorOverlay.jsx`
- `src/lib/neuralEffects.js`

Docs:

- `docs/PHASE_6B_GLOBAL_ELECTRICAL_POLISH_PROTOTYPE.md`
- `docs/SPANDANAI_PROJECT_STATE.md`
- `docs/SPANDANAI_FILE_MAP.md`
- `docs/PHASE_7_ENGINEERING_ROADMAP.md`
- `docs/PHASE_7B_COMPLETION_REPORT.md` (documentation-commit placeholder only)

---

## S. Git status (prototype era)

This section recorded the prototype working tree. Finalization later committed the product as `7e13358` and documentation as the following `docs: record Phase 6B completion` commit. Production remained **NOT DEPLOYED**.

---

## T. Human visual test instructions

1. **Use Cases** — click empty white area with pauses. Expect a richer branching discharge than the old tiny stroke.  
2. **Cards** — click gaps between cards. Visible, not covering content heavily.  
3. **Team** — click pale-blue empty area. Contrast should hold.  
4. **Contact** — click around the form, not on fields.  
5. **Controls** — links, buttons, Email Us, Copy, inputs, hamburger, skip, Back-to-Top: **no** spark.  
6. **Rapid clicking** — 300 ms cooldown; at most two overlapping events.  
7. **Hero** — still clearly more sophisticated than lower-page clicks.  
8. **Mobile** — tap empty lower page: compact spark. Drag/scroll: none.  
9. **Reduced motion** — all global decorative electricity off.  
10. **Edges** — click near all four edges; most of the arc should stay on screen.

---

## U. Feedback questions

1. Does clicking now feel satisfying?  
2. Does it look more like electricity than the old small curved stroke?  
3. Visible enough on white?  
4. Too bright?  
5. Too large?  
6. Too many branches?  
7. Fast enough?  
8. Gimmicky?  
9. Does the Hero still feel clearly more sophisticated?  
10. Click intensity: increase, decrease, or keep?  
11. Should random global sparks stay exactly as they are?  
12. Does mobile tap feel natural?

---

## V. Next step

Human visual review. Do not commit, push, or deploy until approved. **Later: approved and finalized. See the status block at the top of this document.**

---

## PHASE 6B.1 — MICRO-POLISH

**Status:** COMPLETE. Human motion review PASS. Included in feature commit `7e13358`.

### Reason

Human review of a screen recording found that many Phase 6B click discharges still read as a clean Y-shaped twig / branching icon rather than an unstable electrical arc.

### Observed Y / twig issue

Secondary forks used `index % 2` to alternate sides with similar spread, often from nearby primary points, and used `generateElectricalArcPoints` (smooth sine-envelope jitter). Together that produced a repeated `------<` Y.

### Geometry changes

- New internal helpers: `generateJaggedPath`, `pickSecondaryCount`, `pickBranchAnchors`, `pickAsymmetricSides`, `distinctBranchLengths`, `generateSecondaryBranch`.
- Click/tap geometry is still generated once per event. No per-frame random geometry.
- Hero helpers `generateElectricalArcPoints`, `generateLocalSparkPoints`, and `generateMicroSparkBranches` were not rewritten.
- Scale unchanged: desktop primary ~30–55 px (directional up to ~65); mobile compact ~24–45.

### Branch distribution

- Directional: 1–2 secondaries.
- Crack: 2–3 (occasionally 4 on desktop).
- Energy: 2–3 plus one tiny tertiary.
- Normal: mix of 0 / 1 / 2 / 3, rarely 4.
- Mobile compact caps at 2 except crack may use 3.

### Jaggedness

Primary uses 4–6 non-uniform heading steps with angular kinks and occasional correction toward the chosen direction. Secondaries are 3–4 point jagged forks with aggressively different lengths, not mirrored spokes.

### Y-shape reduction

- Do not alternate sides by index.
- Two-fork events prefer the same side (~64%) rather than a mirrored split.
- Anchors keep a minimum gap along the primary.
- Lengths are taken from different slots of the 10–30 px range and shuffled.
- Sample of 400 events: obvious same-origin mirrored Y ≈ 0.5%.

### Decay / flicker

Option A only. Primary life = 1. Secondaries 0.78–1.0. Tertiary 0.62–0.88. Fragments 0.48–0.72. Envelope is compressed into each branch’s lifetime. No per-frame `Math.random()`, no strobe, no jumping bolt.

### Ignition

Flash radius unchanged (3.5–7.5 px). Manual flash no longer expands. Holds crisp for the first ~half of flash life, then decays quickly. Manual draws are no longer skipped when the shared branch envelope is still at 0, so the origin point can appear immediately.

### Desktop / mobile

Desktop click path and mobile compact path share the jagged/asymmetric helpers. Mobile stays smaller. Tap-vs-scroll, cooldown 300 ms, max 2 sparks, control suppression, and reduced motion are unchanged.

### Hero / random spark regression

`NeuralNetworkBackground.jsx` not edited. Random overlay constants and `generateMicroSparkBranches` drawing recipe not retuned.

### Performance

Geometry still created once in `fireSpark`. rAF still runs only while sparks exist. DPR cap 2. Max 2 sparks.

### Build result (6B.1)

`npm run build` **PASS**. No warnings. No errors. No dependency changes.

```
JS   index-tP9IoUwr.js   407.22 kB │ gzip: 130.17 kB
CSS  index-DwcHyqYN.css   19.43 kB │ gzip:   5.19 kB
Font manrope …            24.83 kB
```

Phase 6B baseline was JS 405.43 kB (gzip 129.48 kB). CSS and font hashes unchanged.

### Files modified in 6B.1

- `src/lib/neuralEffects.js`
- `src/components/ElectricalCursorOverlay.jsx`
- `docs/PHASE_6B_GLOBAL_ELECTRICAL_POLISH_PROTOTYPE.md`
- `docs/SPANDANAI_PROJECT_STATE.md`
- `docs/SPANDANAI_FILE_MAP.md`

### Human review required

YES. Judge from motion (screen recording), not only screenshots.

---

---

## PHASE 6B.2 — FINAL HIERARCHY MICRO-POLISH

**Status:** COMPLETE. Human motion review PASS. Included in feature commit `7e13358`.

### Visual problem

6B.1 reduced mirrored Y geometry, but human recording review still saw a twig / Y-shaped icon. Two forks can look like a symbol even when they are not mathematically mirrored, if they have similar visual weight, similar length, or leave from nearby points, and if every stroke is drawn as strongly as the primary.

### Implementation changes

- Click paths now carry `branchLevels` (`primary` / `secondary` / `tertiary`) and `branchWeights`.
- Overlay stroke width and alpha scale by level. Primary stays at the previous strength. Lead secondary ~72–80% width; support secondary quieter; tertiary quieter still.
- Normal events now usually have **one** secondary. Two substantial forks still happen. Three+ is mostly crack/energy.
- Two-fork events use early vs late anchors, a longer lead fork and a shorter quieter support fork.
- Tertiary only on energy, or rarely on a single-secondary event (not on two-fork trees).
- Fragments slightly fewer and shorter-lived.
- Primary jagged generator, scale, colors, cooldown, random sparks, and Hero helpers unchanged.

### Primary / secondary / tertiary hierarchy

| Level | Width vs primary | Life | Role |
|-------|------------------|------|------|
| Primary | 100% | 100% | The discharge |
| Lead secondary | ~72–80% | 70–88% | One clear irregular fork |
| Support secondary | ~56–66% | 54–72% | Quieter extra activity |
| Extra 3rd/4th secondary | ~48–58% | 48–64% | Crack/energy only |
| Tertiary | ~46–56% | 46–64% | Tiny fork off the lead secondary |
| Fragments | existing quiet strokes | 36–54% | Endpoint ticks |

### Branch-count distribution

Target: normal clicks = primary + 1 fork, sometimes 2.

800-event sanity sample (not a visual pass):

- 0 secondaries: 4.8%
- 1 secondary: **59.4%**
- 2 secondaries: 26.9%
- 3+: 9.0% (mostly crack)

Follow-up sample after tightening two-fork anchors: 1 secondary 57.6%, 2 secondaries 27.1%, 3+ 10.9%.

### Geometric sanity-test results

800 events, 800×800 canvas, origin (400,400):

- Same-origin two-forks (origins < 8 px): 4.6% of two-secondary events
- Near-symmetrical equal-weight opposite forks: 0.0%
- Older mirrored-Y heuristic: 2.6% of all events (geometry only; hierarchy should further reduce the *look*)
- Average two-fork length ratio: 1.80
- Average support/lead weight ratio: 0.80
- Primary length avg 44.9 px (min 28.2, max 65.0)
- Compact primary avg 35.8 (max 47.6)
- Major off-screen: 0
- Left-edge origin end x ≈ 47 (inward)

Do **not** treat this as visual success. Human motion review is the judge.

### Build result (6B.2)

`npm run build` **PASS**. No warnings. No errors.

```
JS   index-Uk72Fn2K.js   407.82 kB │ gzip: 130.41 kB
CSS  index-DwcHyqYN.css   19.43 kB │ gzip:   5.19 kB
Font manrope …            24.83 kB
```

Phase 6B.1 was JS 407.22 kB (gzip 130.17 kB). CSS and font hashes unchanged.

### Performance / accessibility regression

rAF-on-sparks-only, DPR 2, max 2 sparks, no per-frame geometry, no new deps. Overlay still `pointer-events-none` / `aria-hidden`. Reduced motion still disables all decorative electricity. Header, skip, Back-to-Top, menu, form, and routes were not edited.

### Human test instructions

See the Phase 6B.2 report: Tests A–H plus a motion screen recording.

---

## PHASE 6B FINALIZATION

**STATUS:** COMPLETE  
**HUMAN MOTION REVIEW:** PASS  
**HUMAN VISUAL REVIEW:** APPROVED

### Feature commit

- Hash: `7e13358c9ceefd982532e0cb49f06a5ff11f37cd`
- Message: `feat: polish global electrical interactions`
- Author: Korak Das `<198821971+korakdas1@users.noreply.github.com>`
- Committer: Korak Das `<198821971+korakdas1@users.noreply.github.com>`
- Co-authored-by: **NO**
- Files: `src/components/ElectricalCursorOverlay.jsx`, `src/lib/neuralEffects.js`

### Documentation commit

Follows the feature commit on `main` with message `docs: record Phase 6B completion`. Author/committer Korak Das. Full hash is the Git object for that commit (a commit cannot contain its own hash in its tree).

### Build (unchanged from 6B.2)

`npm run build` **PASS**. No warnings. No errors. No dependency changes.

```
JS   index-Uk72Fn2K.js   407.82 kB │ gzip: 130.41 kB
CSS  index-DwcHyqYN.css   19.43 kB │ gzip:   5.19 kB
Font manrope …            24.83 kB
```

### Production

**NOT DEPLOYED.** No Vercel command was run.

### Next engineering objective (not started)

Phase 7C — responsive / short-viewport hardening.
