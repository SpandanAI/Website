# Phase 6A Cursor Electrical Discharge Prototype

**Date:** 31 August 2026  
**Status:** Local visual prototype. **Not committed. Not pushed. Not deployed.**  
**Phase 2B:** Still paused. No hero copy, metadata, or SEO changes.

## Stakeholder Request

> "Where your cursor is - an electrical discharge happens at random intervals"

The cursor should feel like a temporary electrical stimulus source on the existing neural/silicon network, not like a particle trail.

## Previous Behavior

The hero Canvas 2D network already had:

- about 80 clustered nodes and distance-based connections (`CONNECTION_DISTANCE = 140`)
- window cursor tracking with smoothing and a large cyan glow
- nearby node repulsion, idle drift, and occasional random ripples (~8–10 s)
- a continuous `requestAnimationFrame` loop
- reduced-motion handling that only skipped ripples
- uncapped `devicePixelRatio`
- mouse-only listeners (`mousemove` / `mouseleave`)
- no off-screen pause
- no electrical arcs, node excitation, or signal propagation

## New Behavior

### Discharge timing

While a mouse/pen cursor is inside the hero (and not over the navbar):

1. schedule a discharge after a **new** random delay
2. fire one electrical event at the current smoothed cursor region
3. immediately schedule the next delay independently

Range: `DISCHARGE_INTERVAL_MIN_MS` **900** to `DISCHARGE_INTERVAL_MAX_MS` **2200**.

This is a slightly conservative tune of the suggested 700–2400 ms range so events stay irregular without approaching a strobe.

Leaving the hero cancels the timer. Returning starts a fresh random delay. The last cursor location is not used after leave.

Mouse movement still repels nearby nodes. Movement itself does **not** spawn sparks.

### Origin

Each event starts near the smoothed cursor with a random offset of up to `DISCHARGE_OFFSET_PX` **±18 px**.

### Node targeting

Nearby nodes inside `CURSOR_RADIUS` **180** are ranked by distance and picked with inverse-distance weights (`pickNearbyNodeIds`). The prototype chooses 1–3 destinations and does not always take the nearest node.

If no suitable nearby node exists, a short local spark is drawn instead of a long-distance bolt.

### Electrical arcs

Short polylines from origin → 4–6 perturbed midpoints → target node.

- cyan / ice-blue family (`rgba(56, 189, 248)` glow stroke + `rgba(186, 230, 253)` core)
- faint outer stroke + thin bright inner stroke
- lifetime `DISCHARGE_DURATION_MIN_MS` **140** to `DISCHARGE_DURATION_MAX_MS` **240**
- envelope: ignition 0–20%, bright 20–60%, fade 60–100% (`dischargeEnvelope`)
- jitter `ARC_JITTER_PX` **7**, reduced near endpoints by a sine envelope

Arcs live in `activeDischarges`, separate from graph edges.

### Cursor flash

A small radial flash (`FLASH_DURATION_MS` **180**) complements the existing large cursor glow. The existing glow is unchanged and is not boosted into a full-screen burst.

### Target node excitation

Fired nodes store `node.excitation` in the Canvas runtime (not React state). Radius, fill, and a small halo increase, then decay with `NODE_EXCITATION_DECAY` **0.9** per frame.

### Edge activation

A fired node briefly highlights 1–3 **existing** connections (same `CONNECTION_DISTANCE` relationship). Highlight intensity decays.

### Propagation

After the first target:

- **~70%:** no extra hop
- **`PROPAGATION_ONE_HOP_CHANCE` 0.25:** one traveling pulse to a connected neighbor
- **`PROPAGATION_TWO_HOP_CHANCE` 0.05:** two hops

Pulses move along real edges as a small bright point (`EDGE_PULSE_DURATION_MS` **280**) and excite the arrival node. Depth is capped at 2 hops after the initial target.

### Ambient activity

Independent of the cursor, one subtle node fire + optional one-edge pulse is scheduled every `AMBIENT_INTERVAL_MIN_MS` **4000** to `AMBIENT_INTERVAL_MAX_MS` **7000**. This is much rarer than cursor discharges. Remove it during review if the hero feels busy.

### Mobile behavior

No fake persistent cursor. Touch `pointermove` is ignored.

A tap on the hero (not on links/buttons) creates **one** localized discharge at the touch point, with at most one hop. Dragging does not stream sparks. Repeat taps are debounced at 280 ms.

### Reduced motion

`prefers-reduced-motion: reduce` is handled in Canvas logic (not CSS-only):

- no arcs, flashes, pulses, ambient firing, or ripples
- no animation loop
- a static network is drawn
- the preference is observed live via `matchMedia` `change`

### Off-screen / hidden tab

- `IntersectionObserver` on the hero wrapper (`HERO_VISIBILITY_THRESHOLD` **0.12**)
- `document.visibilityState`

When the hero is substantially off-screen or the tab is hidden:

- cancel `requestAnimationFrame` (no duplicate loops on resume)
- cancel discharge / ambient / ripple timers
- clear transient effects and freeze a clean network frame

Resume starts a fresh loop and fresh random timers (no burst of queued events).

### Pointer / CTA layering

Listeners moved to Pointer Events (`pointermove`, `pointerdown`, `pointerleave`, `pointercancel`).

The canvas wrapper is `pointer-events-none`. Hero overlays and the text column wrapper also pass clicks through except for the actual copy/CTA block (`pointer-events-auto`). Navbar remains `z-50`.

## Files Modified

| File | Why |
|------|-----|
| `src/components/NeuralNetworkBackground.jsx` | Discharge scheduler, arcs, excitation, pulses, pause/resume, pointer events, DPR cap |
| `src/lib/neuralEffects.js` | Pure helpers for arcs, targeting, envelope, neighbor lookup |
| `src/components/Hero.jsx` | Click-through layering only. **Copy unchanged.** |
| `docs/PHASE_6A_CURSOR_DISCHARGE_PROTOTYPE.md` | This report |
| `docs/SPANDANAI_FILE_MAP.md` | Map the new helper and this report |
| `docs/SPANDANAI_PROJECT_STATE.md` | Record the local prototype |

No dependency, Vercel, metadata, Use Cases, Team, Contact, or Footer changes.

## Performance Safeguards

- `MAX_ACTIVE_DISCHARGES` **4**
- `MAX_ACTIVE_EDGE_PULSES` **8**
- `MAX_SIMULTANEOUS_EXCITED_NODES` **12**
- `MAX_ACTIVE_FLASHES` **4**
- expired events removed each frame
- neighbor search is O(N) per event, not a second per-frame O(N²) graph
- no blur filter on arcs (existing cursor glow still uses one blur)
- `MAX_DPR` **2** (`Math.min(devicePixelRatio || 1, 2)`)
- animation and timers suspend off-screen and in hidden tabs

## Accessibility Safeguards

- reduced-motion disables all rapid electrical effects
- events are localized, not full-screen
- cursor interval floor is 900 ms (not multiple flashes per second)
- navbar hover does not keep firing at a leftover hero location
- CTA and nav remain clickable

## Build Result

`npm run build` **passed** (Vite 8.0.10).

```
dist/index.html                   1.73 kB
dist/assets/index-Ht0_vUWf.css   16.61 kB
dist/assets/index-DRuY3qC8.js   343.18 kB
```

CSS hash unchanged (`index-Ht0_vUWf.css`). JS hash changed because the canvas bundle changed: `index-DRuY3qC8.js`.

## Browser / Viewport Testing

Automated Chromium (headless CDP) against local Vite `http://localhost:5173/`:

| Viewport | Overflow | Notes |
|----------|----------|--------|
| 1366×768 | none | hero + network render |
| 1440×900 | none | hover region + CTA click |
| 1920×1080 | none | hero render |
| 768×1024 | none | DPR cap 2 confirmed (`canvas.width / cssWidth = 2`) |
| 390×844 | none | mobile hero; no fake cursor |

Additional checks:

- **Explore Use Cases** click at 1440 scrolled to `#use-cases` (Use Cases heading near the sticky nav).
- Canvas parent `pointer-events: none`; CTA `pointer-events: auto`.
- Scrolled to Contact: two canvas snapshots 600 ms apart were **identical** (loop suspended).
- `prefers-reduced-motion: reduce`: canvas data URL length stable over time (no electrical animation).

Transient 140–240 ms arcs are hard to photograph in headless captures. Human review of live hover/tap is required for spark quality.

## Known Limitations

- This is not a biological neuron model. Ambient firing is a light independent timer, not per-node spike trains.
- Propagation is at most two hops and uses the nearest-ish connected neighbor, not a learned path.
- Headless screenshots often miss the spark itself because it fades in under 300 ms.
- Reduced motion now freezes the network entirely (stricter than the old “skip ripples only” behavior).
- Canvas still uses the existing O(N²) connection pass for 80 nodes.
- GitHub / Vercel were intentionally not updated.

## Tuning Parameters

Actual names and values in `src/components/NeuralNetworkBackground.jsx`:

| Constant | Value | Role |
|----------|-------|------|
| `DISCHARGE_INTERVAL_MIN_MS` | 900 | shortest wait between cursor sparks |
| `DISCHARGE_INTERVAL_MAX_MS` | 2200 | longest wait between cursor sparks |
| `DISCHARGE_OFFSET_PX` | 18 | origin jitter around smoothed cursor |
| `DISCHARGE_DURATION_MIN_MS` | 140 | shortest arc lifetime |
| `DISCHARGE_DURATION_MAX_MS` | 240 | longest arc lifetime |
| `ARC_JITTER_PX` | 7 | perpendicular path irregularity |
| `ARC_SEGMENTS_MIN` / `ARC_SEGMENTS_MAX` | 4 / 6 | polyline density |
| `FLASH_DURATION_MS` | 180 | origin flash lifetime |
| `NODE_EXCITATION_DECAY` | 0.9 | per-frame excitation falloff |
| `EDGE_PULSE_DURATION_MS` | 280 | traveling pulse duration |
| `PROPAGATION_ONE_HOP_CHANCE` | 0.25 | chance of A → B |
| `PROPAGATION_TWO_HOP_CHANCE` | 0.05 | chance of A → B → C |
| `AMBIENT_INTERVAL_MIN_MS` | 4000 | rare ambient fire floor |
| `AMBIENT_INTERVAL_MAX_MS` | 7000 | rare ambient fire ceiling |
| `CURSOR_RADIUS` | 180 | targeting / cursor influence (existing) |
| `CONNECTION_DISTANCE` | 140 | real graph edges (existing) |
| `MAX_ACTIVE_DISCHARGES` | 4 | arc cap |
| `MAX_ACTIVE_EDGE_PULSES` | 8 | pulse cap |
| `MAX_SIMULTANEOUS_EXCITED_NODES` | 12 | excitation cap |
| `MAX_ACTIVE_FLASHES` | 4 | flash cap |
| `MAX_DPR` | 2 | retina canvas cap |
| `HERO_VISIBILITY_THRESHOLD` | 0.12 | off-screen pause |

## Human Review Needed

Please evaluate live (not from a still screenshot):

1. Does the discharge feel electrical?
2. Is it too frequent or too rare?
3. Is it too bright?
4. Does it feel neural rather than like a generic particle effect?
5. Is signal propagation visible enough?
6. Does cursor interaction (repulsion + glow) still feel natural?
7. Does it distract from the hero text?

Suggested first knobs if something feels off: interval min/max, `ARC_JITTER_PX`, arc duration, flash alpha (in `drawNetwork`), and `PROPAGATION_ONE_HOP_CHANCE`.

---

## Phase 6A.1 — Site-Wide Electrical Cursor

**Date:** 1 September 2026  
**Status:** Local visual prototype extension. **Not committed. Not pushed. Not deployed.**

### Why Hero-only was intentional

Phase 6A mounted electricity inside `NeuralNetworkBackground`, which only exists in the Hero. That is the special environment: cursor meets a neural/silicon graph. The rest of the site is reading and conversion UI. It should not inherit 80 nodes, repulsion, or propagation.

### Why a global micro-layer was added

The stakeholder request is about the cursor itself feeling electrically alive. After the Hero, a much quieter desktop-only crackle keeps that identity without turning Use Cases / Team / Contact into a second network.

### Two-level interaction model

| Level | Where | What | Intensity |
|-------|--------|------|-----------|
| 1 | `#home` Hero | Existing Phase 6A neural Canvas: glow, repulsion, randomized arcs, node excitation, edge pulses, ambient firing | 100% |
| 2 | Rest of desktop site | Tiny localized crackle near the cursor, then fade | ~30–40% |

The global overlay never draws a network, never propagates, never uses a persistent cursor halo, and never trails pointer movement.

### Global timing

`GLOBAL_DISCHARGE_INTERVAL_MIN_MS` **2200** to `GLOBAL_DISCHARGE_INTERVAL_MAX_MS` **5000**, re-rolled after every event. Much sparser than Hero 900–2200 ms.

Leaving the window, hiding the tab, entering the Hero, hovering the header, or hovering `a / button / input / textarea / select / label` cancels the timer. Returning starts a **fresh** random delay (no burst).

### Spark dimensions

- extent `GLOBAL_SPARK_RADIUS_MIN` **10** to `GLOBAL_SPARK_RADIUS_MAX` **26** px
- duration `GLOBAL_SPARK_DURATION_MIN_MS` **100** to `GLOBAL_SPARK_DURATION_MAX_MS` **180**
- origin jitter `GLOBAL_SPARK_OFFSET_PX` **±7**
- `GLOBAL_FLASH_ONLY_CHANCE` **0.22** → flash with almost no arc
- otherwise 1–3 short irregular branches (`GLOBAL_SPARK_BRANCH_COUNT_MIN/MAX`, `GLOBAL_SPARK_JITTER` **2.4**)
- cap `MAX_GLOBAL_SPARKS` **2** (normally one)

### Color strategy

Lower sections are white. Near-white Hero cores would vanish or look harsh.

- outer stroke: `rgba(37, 99, 235, …)` (`--primary` / blue-600)
- core: `rgba(14, 116, 144, …)` (cyan-700)
- envelope scaled to **0.38** so brightness stays well below Hero arcs

No unrelated hues. No large glow.

### Hero suppression / handoff

Window pointer coordinates are tested against `document.getElementById("home")`’s bounding rect. Scroll also refreshes geometry via `elementFromPoint`.

- pointer inside `#home` → global scheduler **off** (Hero Canvas owns electricity)
- pointer outside `#home` → global scheduler eligible
- header / navbar → global **off** (matches Hero’s header suppression)

The two systems must not spark at the same cursor position.

### Desktop-only behavior

Enabled only when:

`(pointer: fine) and (hover: hover)`  
**or**  
`(any-pointer: fine) and (any-hover: hover)`

Ordinary touch-only phones fail this check. Touch `pointermove` is ignored. Hero tap discharge is unchanged. No fake global cursor on mobile.

### Interactive-control suppression

While the latest pointer target matches `a, button, input, textarea, select, label`, global events are not scheduled. Controls themselves are not modified. Overlay is `pointer-events: none` at `z-[45]` (below header `z-50`, below scroll-to-top `z-60`).

### Reduced motion

`prefers-reduced-motion: reduce` disables the overlay completely: no arcs, flashes, timers, or animation loop. Observed live via `matchMedia`.

### Performance architecture

- fixed viewport Canvas (not document-height)
- `MAX_DPR` **2**
- **no 60 fps idle loop**
- `requestAnimationFrame` runs **only while active sparks exist**, then stops and clears
- randomized `setTimeout` schedules the next event
- no nodes, no graph, no O(N²)

### Tuning constants

Actual names in `src/components/ElectricalCursorOverlay.jsx`:

| Constant | Value |
|----------|-------|
| `GLOBAL_DISCHARGE_INTERVAL_MIN_MS` | 2200 |
| `GLOBAL_DISCHARGE_INTERVAL_MAX_MS` | 5000 |
| `GLOBAL_SPARK_DURATION_MIN_MS` | 100 |
| `GLOBAL_SPARK_DURATION_MAX_MS` | 180 |
| `GLOBAL_SPARK_RADIUS_MIN` | 10 |
| `GLOBAL_SPARK_RADIUS_MAX` | 26 |
| `GLOBAL_SPARK_BRANCH_COUNT_MIN` | 1 |
| `GLOBAL_SPARK_BRANCH_COUNT_MAX` | 3 |
| `GLOBAL_SPARK_JITTER` | 2.4 |
| `GLOBAL_SPARK_OFFSET_PX` | 7 |
| `GLOBAL_FLASH_ONLY_CHANCE` | 0.22 |
| `MAX_GLOBAL_SPARKS` | 2 |
| `MAX_DPR` | 2 |

### Files added / touched for 6A.1

| File | Why |
|------|-----|
| `src/components/ElectricalCursorOverlay.jsx` | New global overlay |
| `src/App.jsx` | Mount overlay |
| `src/lib/neuralEffects.js` | Added `generateMicroSparkBranches` (generic geometry; no graph) |
| `docs/PHASE_6A_CURSOR_DISCHARGE_PROTOTYPE.md` | This section |
| `docs/SPANDANAI_FILE_MAP.md` | Map overlay |
| `docs/SPANDANAI_PROJECT_STATE.md` | Record local prototype |

`NeuralNetworkBackground.jsx` was **not** simplified or replaced.

### 6A.1 automated checks

`npm run build` passed. Local Chromium against `http://localhost:5173/`:

- no horizontal overflow at 1366 / 1440 / 1920 / 390
- overlay Canvas: `pointer-events: none`, `z-index: 45`, viewport-sized, DPR cap 2 on mobile
- **Explore Use Cases** still scrolls to Use Cases
- contact `<input>` still focuses
- Use Cases layout unchanged (cards, copy)

Headless Chrome in this environment does **not** expose `(pointer: fine)` / `(hover: hover)`, so the overlay correctly stayed idle there. Spark visibility, Hero vs global handoff, and frequency **must be judged on a real desktop mouse**.

---

## Phase 6A.2 — Electricity Balance + Typography Prototype

**Date:** 1 September 2026  
**Status:** Local visual prototype. **Not committed. Not pushed. Not deployed.**  
**Phase 2B:** Still paused. Copy unchanged.

### Human Feedback

- Global sparks were too subtle and too infrequent to notice comfortably.
- Global electricity should **stay site-wide**.
- Typography felt generic (system UI stack, wide uppercase tracking, bulky headings).

### Global Electricity Tuning

Two-level model unchanged: Hero owns the neural Canvas; the rest of the desktop site uses the overlay only.

| Parameter | 6A.1 | 6A.2 |
|-----------|------|------|
| `GLOBAL_DISCHARGE_INTERVAL_MIN_MS` | 2200 | **1500** |
| `GLOBAL_DISCHARGE_INTERVAL_MAX_MS` | 5000 | **3200** |
| `GLOBAL_SPARK_DURATION_MIN_MS` | 100 | **130** |
| `GLOBAL_SPARK_DURATION_MAX_MS` | 180 | **220** |
| `GLOBAL_SPARK_RADIUS_MIN` | 10 | **14** |
| `GLOBAL_SPARK_RADIUS_MAX` | 26 | **34** |
| `GLOBAL_FLASH_ONLY_CHANCE` | 0.22 | **0.11** |
| Envelope / `GLOBAL_SPARK_INTENSITY` | 0.38 | **0.55** |
| Outer stroke alpha | 0.26 × envelope | `GLOBAL_SPARK_OUTER_ALPHA` **0.34** × envelope |
| Core stroke alpha | 0.70 × envelope | `GLOBAL_SPARK_CORE_ALPHA` **0.88** × envelope |
| Core color | `rgba(14, 116, 144)` | `rgba(8, 110, 140)` (slightly darker/more saturated) |
| Outer color | `rgba(37, 99, 235)` | unchanged |
| `GLOBAL_SPARK_JITTER` | 2.4 | 2.6 |
| Flash-only vs branches | more flash-only | most events have ≥1 branch |

Hero constants were **not** increased. Hero arcs still use envelope up to ~0.9 plus node excitation and propagation, so Hero remains clearly stronger.

Preserved: no trail, control/header suppression, `#home` handoff, desktop-only overlay, rAF only while sparks exist, `MAX_DPR` 2, `MAX_GLOBAL_SPARKS` 2.

### Typography

| Item | Before | After |
|------|--------|-------|
| Family | Tailwind / system UI (`ui-sans-serif`, `system-ui`) | **Manrope Variable** (`200–800` axis) |
| Loading | none | Self-hosted `@font-face` from `@fontsource-variable/manrope@5.3.0`; **Latin-only** WOFF2; **no** Google Fonts CDN |
| Body | inherited 400, default line-height | 400, line-height **1.65** |
| Nav | `font-medium` (500) | 500, tracking `0.01em`; active 600 |
| Buttons | `font-semibold` (600) | 600 (unchanged shapes/colors) |
| Section eyebrow | `tracking-[0.28em]`, 600 | `tracking-[0.18em]`, 600 |
| Footer “Email” eyebrow | `tracking-[0.24em]` | `tracking-[0.18em]` |
| H1 | `font-semibold` (600) | **650** (`font-[650]`), tracking `-0.03em` |
| H2 | `text-3xl/4xl/5xl`, `tracking-tight`, default leading | 600, `lg:text-[2.65rem]`, `leading-[1.2–1.22]`, tracking `-0.02em`, centered max-width 36rem |
| Card titles | `tracking-[0.22em]`, 600 | `tracking-[0.14em]`, 600 |
| Body / cards / contact | mixed `leading-6/7/8` | ~**1.65–1.7** |
| Footer wordmark | `font-bold` (700) | `font-semibold` (600) |

Copy, card count, navigation labels, and layout architecture are unchanged.

### Performance

- One variable Latin WOFF2: **24.83 kB** (`dist/assets/manrope-latin-wght-normal-DHIcAJRg.woff2`)
- Cyrillic / Greek / Vietnamese / Latin-ext subsets are **not** bundled
- `font-display: swap`
- Production CSS has **no** `fonts.googleapis.com` / `fonts.gstatic.com`

### Build

`npm run build` passed (Vite 8.0.10).

```
dist/assets/manrope-latin-wght-normal-DHIcAJRg.woff2   24.83 kB
dist/assets/index-a3bgzvmI.css                         17.37 kB
dist/assets/index-bFETouuW.js                         347.98 kB
```

### Responsive checks

Chromium against `http://localhost:5173/`: **no horizontal overflow** at 390 / 768 / 1366 / 1440 / 1920. Computed at 1440: H1 Manrope 650 / 72px; H2 600 / 42.4px / line-height 51.7px; eyebrow tracking 0.18em; card-label tracking 0.14em.

### Human Review Needed

1. Are global sparks visible enough now?
2. Are they too frequent?
3. Are they distracting while reading?
4. Does Hero still feel more special?
5. Does Manrope look better than the old system font?
6. Are headings too large/small/heavy?
7. Do card titles look cleaner?
8. Should this typography direction be kept?

---

## Phase 6A.3 — Intentional Pointer/Tap Interaction Polish

**Date:** 1 September 2026  
**Status:** Local visual prototype. **Not committed. Not pushed. Not deployed.**

### Human Feedback

- Use Case card body copy felt slightly small (15px).
- Mouse click should create an electrical response.
- Mobile needs a tap equivalent outside the Hero.
- Do not spam; do not fire on controls; do not fire on scroll.

### Use Case Typography

Card **description** only: `text-[15px]` → `text-base` (**16px**). Line-height remains **1.7**. Labels, tracking, card count, and wording unchanged.

### Desktop Hero Click

Eligible mouse/pen `pointerdown` on empty Hero space (not `a / button / input / textarea / select / label`, not header):

- immediate `firePointerStimulus`
- 1–2 nearby nodes
- excitation **0.95**
- ~**45%** one-hop propagation
- flash scale 1.2
- then **restarts** the random cursor discharge delay if the cursor is still active

Random Hero interval remains **900–2200 ms**.

### Desktop Global Click

Eligible mouse/pen `pointerdown` outside `#home`:

- one overlay spark at `source: "click"`
- intensity **0.72** (random remains **0.55**)
- radius **1.15×**
- duration **160–240 ms**
- **2–3** branches, never flash-only
- then **fresh** random global delay (1500–3200 ms unchanged)

### Mobile Tap

Random global electricity remains **desktop-only**.

Outside Hero: a genuine tap (see below) creates one overlay spark (`source: "tap"`): intensity **0.60**, radius **14–28 px**, duration **140–220 ms**, **1–2** branches. No random timer is started.

Hero: tap still fires neural stimulus (1 node, excitation 0.9, ~40% one hop). Stronger than lower-page tap.

### Tap-vs-Scroll Protection

Touch does **not** spark on `pointerdown`.

Record start x/y/time. On `pointerup`, spark only if:

- movement ≤ `TAP_MAX_MOVE_PX` **10**
- duration ≤ `TAP_MAX_DURATION_MS` **600**
- same `pointerId`
- still eligible

Movement beyond 10 px during the gesture cancels the pending tap. Scroll drags do not spark.

### Interactive Suppression

No decorative spark over: `a, button, input, textarea, select, label`, or `header`. Overlay remains `pointer-events: none`. No `preventDefault`.

### Cooldown

`CLICK_DISCHARGE_COOLDOWN_MS` **300** on both Hero and overlay (decorative only).

### Random Timing

Unchanged from 6A.2:

- Hero random: 900–2200 ms
- Global random: 1500–3200 ms, intensity 0.55, radius 14–34, duration 130–220, flash-only 0.11

### Files Modified

| File | Why |
|------|-----|
| `src/components/Applications.jsx` | Card description 16px |
| `src/components/NeuralNetworkBackground.jsx` | Desktop click stimulus; tap-vs-scroll; cooldown |
| `src/components/ElectricalCursorOverlay.jsx` | Desktop click spark; mobile tap spark; per-spark intensity |
| `docs/PHASE_6A_CURSOR_DISCHARGE_PROTOTYPE.md` | This section |
| `docs/SPANDANAI_FILE_MAP.md` / `docs/SPANDANAI_PROJECT_STATE.md` | Local prototype record |

### Build

`npm run build` passed.

```
dist/assets/manrope-latin-wght-normal-DHIcAJRg.woff2   24.83 kB
dist/assets/index-a3bgzvmI.css                         17.37 kB
dist/assets/index-DkNNpEvD.js                         350.36 kB
```

No Google Fonts URLs. Font asset size unchanged from 6A.2.

### Human Review Needed

1. Is 16px card text better?
2. Does Hero click feel satisfying?
3. Is global click spark strong enough?
4. Does clicking ever feel gimmicky?
5. Does mobile tap feel natural?
6. Does scrolling remain completely clean?
7. Do controls remain distraction-free?
8. Are random sparks still balanced?

---

## Phase 6A.4 — Selection Polish & Final Acceptance

**Date:** 1 September 2026  
**Status:** Local visual prototype. **Not committed. Not pushed. Not deployed.**

### Human Feedback

Browser text selection was intentionally retained, but the existing solid brand-blue (`#2563eb`) highlight with forced white text looked too aggressive on both the dark Hero and light sections.

### Before

```css
::selection {
  color: #ffffff;
  background: #2563eb;
}
```

### After

```css
::selection {
  background: rgba(37, 99, 235, 0.2);
}

::-moz-selection {
  background: rgba(37, 99, 235, 0.2);
}
```

Text `color` is **not** forcibly replaced. Dark body text stays dark; Hero light text stays light. Opacity **0.20**.

No global `user-select: none`. No extra `select-none` utilities (canvas/buttons already do not present a real selection problem).

Electrical click/tap logic was left unchanged: a single decorative spark on pointerdown before a drag-select is visually harmless; browser selection still wins for the drag.

### Rationale

- Selectable, copyable content is standard website usability.
- Globally disabling selection would be the wrong fix.
- A translucent brand-blue wash is visible enough to mark a range without becoming a solid block.

### Final Phase 6A Acceptance Tests

| Check | Result |
|-------|--------|
| `::selection` in live CSS | `background: rgba(37, 99, 235, 0.2)` only (no `color`) |
| `body` / headings `user-select` | `auto` |
| Hero H1 / subtitle selectable | YES (`SpandanAI`; supporting sentence) |
| Use Case heading + 16px card body selectable | YES; card body remains `rgb(100, 116, 139)` |
| Team name selectable | YES (`N.R. Rohan`) |
| Selection string / copy source | Card description present on `window.getSelection()` |
| Contact input focus | `INPUT` |
| Explore Use Cases CTA | scrolls to Use Cases |
| Manrope | YES |
| Card body | 16px / 1.7 (27.2px) at 390–1920 |
| Overflow 390 / 768 / 1366 / 1440 / 1920 | none |
| Mobile lower-page tap vs drag | tap changes overlay; drag does not |
| Google Fonts URLs | none |
| Hero random / click, global random / click, tap-vs-scroll, reduced motion | unchanged from 6A.3 (no interaction code edits this phase) |

### Files Modified

| File | Why |
|------|-----|
| `src/index.css` | Soften `::selection` |
| `docs/PHASE_6A_CURSOR_DISCHARGE_PROTOTYPE.md` | This section |
| `docs/SPANDANAI_PROJECT_STATE.md` | Record 6A.4 as local prototype |

### Build

`npm run build` passed.

```
dist/assets/manrope-latin-wght-normal-DHIcAJRg.woff2   24.83 kB
dist/assets/index-mAyy8n-K.css                         17.40 kB
dist/assets/index-CgDk-cUe.js                         350.36 kB
```

---

## Phase 6A.5 — Selection UX + Email Actions + Context Menu

**Date:** 1 September 2026  
**Status:** Local visual prototype. **Not committed. Not pushed. Not deployed.**

Phase 6A.4 kept ordinary marketing text selectable with a softer highlight. After human review, that product preference changed.

### Human Preference

Static marketing/display text on this company landing page is **intentionally non-selectable** on desktop and mobile. Accidental drag-selection looked messy against the electrical interaction.

This is a presentation choice, not content protection. Images remain right-clickable. No anti-save / anti-copy campaign.

### Rationale

The site is an interactive marketing page. Drag-selecting Hero, nav, Use Cases, Team, and Contact headings produced a messy highlight. Form fields still need native selection. Email copy is provided as an explicit **Copy** control rather than depending on selecting the address.

### Selectable Exceptions

Applied at `body`:

```css
user-select: none;
-webkit-user-select: none;
```

Restored explicitly for:

```css
input,
textarea,
[contenteditable="true"] {
  user-select: text;
  -webkit-user-select: text;
}
```

Phase 6A.4 `::selection` (`rgba(37, 99, 235, 0.20)`, no forced white text) is kept. It now mainly affects form fields and any other explicitly selectable text (footer mailto).

Footer email remains a normal `mailto:` link. It uses Tailwind `select-text` so visitors can still select/copy that one address without duplicating the Contact Copy UI.

### Contact Email Actions

Visible address stays `spandanai.sard@gmail.com` (display text, non-selectable).

| Control | Behavior |
|---------|----------|
| **Email Us** | Real `<a href="mailto:spandanai.sard@gmail.com">`. Provider-neutral. |
| **Copy** | `type="button"`, keyboard-accessible, min 44px height. `navigator.clipboard.writeText` when available; otherwise a temporary textarea + `document.execCommand("copy")`. On success the label becomes **Copied ✓** for 1500 ms, then **Copy**. On failure it briefly shows **Copy failed**. `aria-live="polite"` announces the result. |

Contact form mailto submit is unchanged.

Electrical suppression over `a, button, input, textarea, select, label, header` is unchanged, so Email Us / Copy do not draw decorative sparks.

### Gmail Decision

A provider-specific “Open Gmail” action was **not** added. Visitors may use Gmail, Outlook, Apple Mail, or a corporate client. `mailto:` remains the interoperable default. A Gmail shortcut can be a later secondary action if the stakeholder asks for it.

### Context Menu Investigation

Repository search for `contextmenu`, `onContextMenu`, `button === 2`, and related handlers:

**No project source intentionally suppresses the browser context menu.**

The only `preventDefault` calls are:

- `Hero.jsx` — in-page “Explore Use Cases” click (prevents jumping to `#use-cases` so smooth scroll can run)
- `Contact.jsx` — form `onSubmit` (builds a mailto URL instead of a native POST)

The electrical overlay remains `pointer-events: none` and does not listen for `contextmenu`.

No `document.addEventListener("contextmenu", …)` and no `onContextMenu={preventDefault}` were added.

### Browser Test Result

Automated Chromium (headless CDP) against `http://localhost:5173/`:

- `body` computed `user-select` / `-webkit-user-select`: `none`
- `input` / `textarea` computed `user-select`: `text`
- Hero H1 / Use Case heading: non-selectable via CSS
- Email Us `href`: `mailto:spandanai.sard@gmail.com`
- Copy click: button becomes **Copied ✓**, then returns to **Copy** after 1500 ms (success path). Headless Chromium denied `clipboard.readText()` (`NotAllowedError`); write success is inferred from UI state. Human should confirm the clipboard contains `spandanai.sard@gmail.com`.
- Dispatched `contextmenu` on heading / Partner With Us / Email Us: `defaultPrevented === false`. No `oncontextmenu` handlers on DOM nodes.
- Viewports 390 / 768 / 1366 / 1440 / 1920: no horizontal overflow. Email Us / Copy height 44px. Form `input` focus works. Manrope Variable unchanged.

**Limitation:** headless Chromium cannot render native OS/browser chrome. A human must confirm the real right-click menu appears in a windowed browser. If it still fails there despite no source suppression, treat it as browser/environment-specific — do not invent a JS “fix.”

### Files Modified

| File | Why |
|------|-----|
| `src/index.css` | Body `user-select: none`; restore selection on `input`, `textarea`, `[contenteditable="true"]`; keep 6A.4 translucent `::selection` |
| `src/components/Contact.jsx` | Email display + Email Us (`mailto:`) + Copy with clipboard fallback and Copied ✓ feedback |
| `src/components/Footer.jsx` | Footer mailto stays a simple link; `select-text` so that one address remains copyable |
| `docs/PHASE_6A_CURSOR_DISCHARGE_PROTOTYPE.md` | This section |
| `docs/SPANDANAI_PROJECT_STATE.md` | Record 6A.5 as local prototype |
| `docs/SPANDANAI_FILE_MAP.md` | Contact Copy/Email Us + selection CSS mapping |

Electrical overlay, Hero canvas, Manrope, and Use Case 16px body copy were not retuned.

### Build Result

`npm run build` passed.

```
dist/assets/manrope-latin-wght-normal-DHIcAJRg.woff2   24.83 kB
dist/assets/index-Ip3RGWFO.css                         17.59 kB
dist/assets/index-Dxrhlcqc.js                         351.79 kB
```

---

## Phase 6A.6 — Home Navigation & Active State Correction

**Date:** 1 September 2026  
**Status:** Local visual prototype. **Not committed. Not pushed. Not deployed.**

### Human Finding

While the user was visibly in the Hero / Home region at the top of the page, **Use Cases** could appear active (brand blue) in the primary nav.

### Root Cause

`NAV_SECTION_IDS` in `Header.jsx` is derived from `navigationLinks` in `src/data/siteContent.js`. That array was only:

`#use-cases`, `#team`, `#contact`

`#home` existed as a section (`Hero.jsx` `id="home"`) and as the logo/wordmark target, but it was **not a navigation candidate**. The IntersectionObserver therefore never recorded a Home ratio.

`computeActiveSectionFromIntersection` picks the observed section with the highest ratio ≥ `ACTIVE_RATIO_MIN` (0.45). With Home absent:

- The observer could never return `"home"`.
- Initial React state was `null`, not Home.
- As soon as the tall Hero (`min-h-[110vh]`) allowed `#use-cases` to reach 45% intersection — while Hero content was still the dominant visual — Use Cases became the only eligible winner and turned blue.
- `pendingNavSectionRef` treated “section `top <= navbar offset`” as arrival. That works when scrolling **down**. Home is already above the viewport when the user is on a lower section, so a logo/Home click could drop the pending intent immediately and let the still-visible lower section stay active.

This was an incomplete section model, not a CSS color bug. The blue active style was left unchanged.

### Navigation Before

Use Cases · Team · Contact · Partner With Us  
Logo/wordmark → `#home` (no Home nav item)

### Navigation After

Home · Use Cases · Team · Contact · Partner With Us  
Logo/wordmark still → `#home`

Desktop and mobile both map `navigationLinks`. No duplicate Home item.

### Logo Behavior

The header logo + “SpandanAI” wordmark remain an `#home` link. Clicking them marks Home as nav intent and returns to the Hero.

### Active State

- `navigationLinks` now starts with `{ label: "Home", href: "#home" }`, so `#home` is observed.
- Initial state is `"home"`, or the hash section when loading `#use-cases` / `#team` / `#contact`.
- If no section meets 0.45 and `scrollY < 80`, the resolver returns `"home"` (not `null`).
- Pending intent stays until the intended section occupies the nav line (`top <= offset && bottom > offset`), the observer agrees, or Home arrives (`scrollY < 80`).
- `ACTIVE_RATIO_MIN` (0.45), thresholds, and rootMargin were **not** retuned; they were not the primary defect.

Observed sequence (1440×900, slow scroll):

`Home → Use Cases → Team → Contact`  
and reverse `Contact → Team → Use Cases → Home`.

Fast Home→Contact and Contact→Home settled correctly. Resize at top stayed Home.

### Mobile

Hamburger menu order: Home, Use Cases, Team, Contact, Partner With Us. Home click closes the menu and returns to the Hero with Home active.

### Accessibility

Active desktop and mobile nav links set `aria-current="location"`. Inactive links do not.

### Tests

| Check | Result |
|-------|--------|
| `/` and `#home` at top | Home active; Use Cases inactive |
| Direct `#use-cases` / `#team` / `#contact` | matching item active after settle |
| Click Home / Use Cases / Team / Contact | corresponding section + active item |
| Partner With Us | Contact section + Contact active |
| Logo click from Contact | Home, scrollY ~ 0 |
| Explore Use Cases CTA | Use Cases active; `SET_ACTIVE_NAV_EVENT` kept |
| Slow + reverse scroll | home → use-cases → team → contact and reverse |
| Fast scroll both directions | final section correct |
| Resize at top | Home remains |
| 390 / 768 / 1366 / 1440 / 1920 overflow | none |
| `aria-current` | `location` on the active item only |
| Phase 6A.5 selection / Email Us / Copy | unchanged |
| Context-menu suppression | none added; `defaultPrevented === false` |

Native OS/browser right-click chrome still requires a human check in a windowed browser (same 6A.5 limitation).

### Files Modified

| File | Why |
|------|-----|
| `src/data/siteContent.js` | Home as first `navigationLinks` item |
| `src/components/Header.jsx` | Observe `#home`; default/top fallback `home`; pending-intent arrival for upward Home; `aria-current="location"`; logo/nav/Partner intent |
| `docs/PHASE_6A_CURSOR_DISCHARGE_PROTOTYPE.md` | This section |
| `docs/SPANDANAI_PROJECT_STATE.md` | Record 6A.6 as local prototype |
| `docs/SPANDANAI_FILE_MAP.md` | Nav data now includes Home |

Electrical files, typography, and Phase 6A.5 selection/email UI were not modified.

### Build

`npm run build` passed.

```
dist/assets/manrope-latin-wght-normal-DHIcAJRg.woff2   24.83 kB
dist/assets/index-hclAQGFl.css                         17.61 kB
dist/assets/index-Ce7nfKzN.js                         352.25 kB
```

---

# Phase 6A Final Acceptance

**Date:** 1 September 2026  
**Status:** Human-approved. Landed on GitHub `main` in the Phase 6 milestone commit. **Not deployed to production.**

## Human Approval

Phase 6A through 6A.7 were manually reviewed and approved.

Final Home / header checks passed:

- Scrolling down → white/scrolled header
- Clicking Home → true Home state (dark/transparent header at the Hero)
- Clicking the SpandanAI logo → the same correct Home state

## Final Feature Set

- Hero Canvas 2D electrical/neural network (random cursor discharge, nearby-node excitation, limited real-edge hops, ambient firing, click/tap stimulus, tap-vs-scroll protection)
- Off-screen / hidden-tab Canvas suspension, DPR cap 2, reduced-motion freeze
- Site-wide desktop micro-sparks; desktop click sparks outside Hero; mobile tap sparks outside Hero (no random fake-cursor electricity on ordinary phones)
- Interactive-control suppression (`a, button, input, textarea, select, label`, `header`)
- Manrope Variable site-wide (self-hosted Latin WOFF2, no Google Fonts CDN)
- Typography hierarchy refinements; Use Case descriptions 16px
- Non-selectable static marketing text; selectable/editable form fields
- Contact Email Us (`mailto:`) + Copy with clipboard fallback; no Gmail lock-in
- Home as a first-class nav item; corrected active-section highlighting; `aria-current="location"`
- Header Home-state consistency (logo and Home return to the transparent Hero header)

## Final Build

`npm run build` passed (no errors, no warnings).

```
dist/assets/manrope-latin-wght-normal-DHIcAJRg.woff2   24.83 kB
dist/assets/index-hclAQGFl.css                         17.61 kB
dist/assets/index-Ce7nfKzN.js                         352.25 kB
```

## Final Responsive Check

Human visual review plus local checks at 390 / 768 / 1366 / 1440 / 1920. No horizontal overflow in those viewports during prototype testing.

## Git Acceptance Status

This feature milestone is **approved for GitHub commit and push**.

It is **not** a production deployment. `https://spandanai.com/` stays on the previously deployed build until a later dedicated deploy phase.




