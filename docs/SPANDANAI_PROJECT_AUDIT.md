# SpandanAI Website — Phase 0 Full Project Audit

**Audit date:** 31 August 2026  
**Production site:** https://spandanai.com/  
**Repository:** local website workspace (absolute filesystem path omitted for the public GitHub repository)  

**Auditor rule followed:** reconnaissance only. No application source was modified. No packages installed. No GitHub push. No deploy.

**Related documents**

- `docs/SPANDANAI_PROJECT_STATE.md` — concise factual snapshot
- `docs/SPANDANAI_REQUIREMENTS.md` — five stakeholder requests vs suggestions
- `docs/SPANDANAI_FILE_MAP.md` — feature → file map

**Prior reports in the repo root (July 2026)** — read first, then treated as historical:

- `PRE_LAUNCH_AUDIT_REPORT.md` — many SEO/header/favicon items are **now done**
- `PRE_LAUNCH_IMPLEMENTATION_REPORT.md`
- `TYPOGRAPHY_REVIEW_REPORT.md`

This audit is the current source of truth.

Live production is serving the same bundle as this workspace (`/assets/index-DKRU34Cm.js`).

---

# 1. How this audit was done

Allowed inspections performed:

- Full source tree (excluding `node_modules`)
- Git commands (repository does not exist)
- `package.json` / `package-lock.json` / `vercel.json`
- Production `npm run build`
- Live `curl` of `https://spandanai.com/` (headers, robots, sitemap, OG image, favicon)
- Chromium headless screenshots and layout metrics at 320 / 375 / 390 / 430 / 768 / 1024 / 1366 / 1440 / 1920 px, plus mobile menu, scrolled header, Use Cases, Team, Contact

Not performed:

- Lighthouse (no project script; not installed)
- `npm audit` / aggressive vulnerability scanners (out of scope)
- Any edit to `src/`, `public/` product files, `package.json`, or Vercel

`npm run build` regenerated `dist/` as a side effect of the allowed production-build check. Hashes matched the already-deployed files.

---

# 2. Repository understanding

## Stack (verified)

| Layer | Reality |
|-------|---------|
| Framework | **React 19.2.5** SPA — **not** Next.js |
| Bundler | **Vite 8.0.10** — no `vite.config.*` |
| Language | **JavaScript / JSX** — no TypeScript |
| Package manager | **npm** (`package-lock.json`) |
| CSS | **Tailwind CSS 3.4.19** + `src/index.css` |
| Motion | **Framer Motion 12.38.0** for section/UI motion; **Canvas 2D** for hero network |
| Icons | **None** (no lucide, font-awesome, heroicons). Hamburger is CSS bars. Scroll-to-top is the `↑` character. |
| Images | Files in `public/images/` via ordinary `<img>` and CSS `background-image`. No `next/image`, no CDN. |
| Fonts | Tailwind/system stack. No `@font-face`, no Google Fonts. |
| Routing | **None.** Hash links `#home` `#use-cases` `#team` `#contact` |
| Rendering | **Client-side only.** Crawlers that execute JS see the React tree; the raw `index.html` has metadata but an empty `#root`. |
| Deployment | **Vercel** static (`dist/`) |
| Analytics | **None** |
| Forms | Client `mailto:` only |
| External APIs | **None** (`fetch` unused in `src/`) |

`package.json` scripts: `dev` / `build` / `preview` only. No `lint`, `test`, or `typecheck`.

## Tailwind

`tailwind.config.js` extends:

- Colors: `ink #0B1220`, `muted #64748B`, `panel #0F172A`, `surface #F7F9FC`
- Shadow: `soft`

Breakpoints used in components: default / `sm` / `md` / `lg`. No custom screens. `md` (768px) is the desktop-nav cutoff.

## Environment variables

None. No `.env*`. No `import.meta.env` / `process.env` in `src/`.

---

# 3. Project structure

Meaningful tree (generated dirs omitted: `node_modules`, `dist`):

```
.
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.cjs
├── tailwind.config.js
├── vercel.json
├── .gitignore                 # currently only ".vercel"
├── README.md
├── PRE_LAUNCH_AUDIT_REPORT.md
├── PRE_LAUNCH_IMPLEMENTATION_REPORT.md
├── TYPOGRAPHY_REVIEW_REPORT.md
├── public/
│   ├── apple-touch-icon.png
│   ├── favicon-32x32.png
│   ├── favicon.ico
│   ├── robots.txt
│   ├── sitemap.xml
│   └── images/                # logos, OG, hero bg, four headshots
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── assets/                # EMPTY
│   ├── components/            # one file per UI area
│   ├── data/siteContent.js    # nav + use cases only
│   └── lib/                   # animation variants + nav event name
└── docs/                      # this Phase 0 documentation set
```

`.vercel/` exists locally (gitignored) and links the folder to Vercel project `spandanai`.

### Directory roles

| Directory | Responsibility |
|-----------|----------------|
| `public/` | Static files copied as-is to site root (images, favicons, robots, sitemap) |
| `src/components/` | All visible UI |
| `src/data/` | Editable marketing content (incomplete: team not here) |
| `src/lib/` | Shared animation presets and one custom-event constant |
| `src/assets/` | Unused empty folder |
| `docs/` | Audit documentation (this phase) |

### Major files

| File | What it does |
|------|----------------|
| `src/App.jsx` | Composes the single page |
| `src/components/Hero.jsx` | Landing copy + background stack + CTA |
| `src/components/NeuralNetworkBackground.jsx` | Canvas particle/network loop |
| `src/components/Header.jsx` | Sticky nav, IntersectionObserver active state, mobile menu |
| `src/components/Applications.jsx` | Use-case cards |
| `src/components/Founders.jsx` | Team cards + local data |
| `src/components/Contact.jsx` | mailto form |
| `src/components/Footer.jsx` | Brand + copyright + email |
| `src/data/siteContent.js` | `navigationLinks`, `applicationTabs` |

---

# 4. Current website structure

Verified from `App.jsx` and live screenshots. **All of these are homepage sections, not separate routes.**

## 4.1 Header (global)

- **File:** `src/components/Header.jsx`
- **Content:** Logo + wordmark “SpandanAI”; links Use Cases / Team / Contact; CTA “Partner With Us”; mobile hamburger
- **Animations:** Framer `whileHover` scale on CTA; CSS header background transition when `scrolled`
- **Assets:** `/images/logo-light.webp` always (never `logo-dark`)
- **Links:** `#home`, `#use-cases`, `#team`, `#contact`
- **Responsive:** `< md` hamburger + overlay + stacked menu; `md+` inline links. Measured header height ~73px vs CSS `--navbar-height` 80/96px (mismatch).
- **Route:** global chrome

## 4.2 Hero / landing (`#home`)

- **File:** `src/components/Hero.jsx` + `NeuralNetworkBackground.jsx`
- **Content:** Badge “Analog-Native AI and Communication Silicon”; H1 “SpandanAI”; subtitle “Analog-native AI silicon for edge inference and wireless systems.”; one button “Explore Use Cases”
- **Animations:** Framer fade/stagger; scroll parallax 0.1×; canvas network
- **Assets:** `wave-background.png` + multiple CSS gradients
- **Buttons:** Explore Use Cases → smooth-scroll `#use-cases` + custom nav event
- **Responsive:** Left-aligned from `sm` up; stacks on small screens; `min-h-[110vh]` makes a tall first screen. No horizontal overflow at 320–1920px.
- **Route:** homepage section

A source comment says “CTA pair”; only **one** CTA exists.

## 4.3 Use Cases (`#use-cases`)

- **File:** `src/components/Applications.jsx`
- **Content:** See section 6
- **Animations:** fade-in + stagger on enter (`viewportOnce`). **No hover**
- **Assets:** none
- **Route:** homepage section

## 4.4 Leadership Team (`#team`)

- **File:** `src/components/Founders.jsx`
- **Content:** See section 7
- **Animations:** fade/stagger; card `whileHover` lift + deeper shadow
- **Assets:** four JPEGs
- **Route:** homepage section

## 4.5 Contact (`#contact`)

- **File:** `src/components/Contact.jsx`
- **Content:** See section 18
- **Animations:** fade/stagger; button hover scale
- **Route:** homepage section

## 4.6 Footer

- **File:** `src/components/Footer.jsx`
- **Content:** logo, “SpandanAI”, “© 2026 SpandanAI. All rights reserved.”, Email + mailto
- **Route:** global

## 4.7 Utility chrome

- `ScrollProgressBar` — 3px blue bar, `aria-hidden`
- `ScrollToTopButton` — appears after ~600px scroll

**Absent sections:** About, Technology, Products, Use-case detail pages, Careers, Research/publications, News, legal, social icon bar, team gallery page.

---

# 5. Hero / landing animation — deep audit

## What exists

| Item | Detail |
|------|--------|
| Component | `NeuralNetworkBackground` |
| File | `src/components/NeuralNetworkBackground.jsx` (~414 lines) |
| Host | `Hero.jsx` (absolute full-bleed layer under copy) |
| Implementation | **Canvas 2D** (`getContext("2d")`). Not WebGL, not SVG, not DOM particles |
| Library | None for the canvas. Framer Motion only animates the surrounding Hero content |
| Node count | `NODE_COUNT = 80`, clustered into ~10 spatial groups |
| Connections | **Distance-based**, `CONNECTION_DISTANCE = 140`. Recomputed every frame. Not a stored graph |
| Cursor | Window `mousemove`. Nearby nodes brighten/enlarge; nodes are **repelled**; midpoint lines brighten; radial glow with `blur(14px)` |
| Idle | Nodes drift; tiny sine/cosine wander when cursor is slow |
| Extra effect | Random “signal ripple” every 8–10s (`scheduleSignalRipple`) — a radial gradient, **not** edge-following spikes |
| Loop | Continuous `requestAnimationFrame` (`step`) |
| DPR | `canvas.width = width * devicePixelRatio` — full DPR, uncapped |
| Cleanup | rAF cancelled; timeout cleared; `resize` / `mousemove` / `mouseleave` removed. **Good.** |
| Touch | **None** |
| Reduced motion | Reads `prefers-reduced-motion` once. **Only skips ripples.** Loop, drift, and mouse still run. Global CSS in `index.css` kills CSS animations/transitions but **cannot stop canvas**. |
| Off-screen | **Not paused.** Metrics show the canvas still sized and in DOM on Team/Contact views |
| Pointer events | Wrapper is `pointer-events-auto` at `z-0`; copy is `z-[1]`, so CTAs remain clickable |
| Text in canvas | **None.** This animation cannot be the source of indexed slogan duplicates |

Hero also runs its own scroll-linked parallax rAF (`translateY(scrollY * 0.1)`), properly gated on `useReducedMotion()` and cleaned up.

## FPS / cost (from code, not a profiler)

- Inner loop: for each pair of 80 nodes, `Math.hypot` + possible `stroke` → ~3,160 distance checks/frame plus up to thousands of line draws
- Cursor glow uses `context.filter = blur(14px)` (relatively expensive)
- On a 3× DPR phone the backing store is 3× CSS pixels; headless test used `dpr: 1` so production phones will be heavier than the audit screenshots

## Can it be replaced or extended?

**Extend. Do not replace the renderer.**

The desired “neurons firing” idea matches this file’s data model (nodes + connections + cursor field). Missing pieces are:

1. A **sparse fixed adjacency list** (synapses), instead of all pairs within 140px
2. Per-node **next-fire timestamp** / period (desynchronized)
3. On fire: node flash + **pulse along edges** to neighbors (queue, not global ripple)
4. Cursor as a **probability boost**, not only repulsion
5. Mobile: `pointerdown`/`pointermove` or ambient-only
6. `IntersectionObserver` to pause when `#home` is off-screen
7. Cap DPR (e.g. `Math.min(dpr, 1.5)`), fewer nodes below `md`
8. Reduced motion: draw one static frame, no rAF

**Recommended architecture (later):** stay on Canvas 2D. Do not add Three.js/WebGL for ~80–120 nodes. Do not use SVG for per-frame line updates.

**Likely files:** `NeuralNetworkBackground.jsx` (almost all of it); `Hero.jsx` only if overlay/z-index/copy must change.

**Performance concerns:** do graph+firing work **before** adding more visual effects; pause off-screen or the Team/Contact pages will keep paying GPU cost; test a mid-range Android phone.

**Visual caution:** the live hero already reads as a neural/constellation field. The upgrade should feel like the same language with occasional sparks — not a game.

---

# 6. Use Cases section audit

## Data

Lives in `src/data/siteContent.js` as `applicationTabs`. **Data-driven**, not JSX-hard-coded.

Current four items:

| id | label | description |
|----|-------|-------------|
| `edge-vision` | Edge Vision | On-device vision inference for UAVs, CCTV, and traffic sensing. |
| `traffic-systems` | Traffic Systems | Continuous vehicle and flow analysis at constrained edge nodes. |
| `wireless-infrastructure` | Wireless Infrastructure | Analog signal-path acceleration for high-throughput demodulation pipelines. |
| `embedded-inference` | Embedded Inference | Low-latency inference pathways for power-limited deployed systems. |

## Presentation

- `Applications.jsx` maps tabs to `<motion.article>`
- Title format: **uppercase, tracking, blue, `text-xs`**
- Description: 15px, `text-muted`, `leading-7`
- Layout: `grid gap-4 sm:grid-cols-2 lg:grid-cols-4`, `max-w-5xl`, rounded-2xl, slate-50 fill, slate-200 border
- Hover: **none** (`cardHover` in `animations.js` is unused)
- Images/icons: **none**
- Responsive: 1 / 2 / 4 columns. At 390px the fourth card sits below the fold (expected). No overflow.

## Where to add Cryo-CMOS later

Add a fifth object in `applicationTabs`. Suggested `id`: `cryo-cmos`.

**Layout note:** `lg:grid-cols-4` + 5 items leaves a single card on row two. Prefer changing to `lg:grid-cols-3` (3+2) or two rows of equal visual weight. Do not invent an icon for only this card.

Wording suggestions are listed only in `SPANDANAI_REQUIREMENTS.md` and are **not** approved copy.

---

# 7. Team section deep audit

## Count and storage

**Four** people. Array is **inside** `Founders.jsx`, not in `siteContent.js`.

| Name | Role | Photo path | File size | Pixel size |
|------|------|------------|-----------|------------|
| N.R. Rohan | Chief Executive Officer | `/images/N.R. Rohan.jpg` | 20 KB | 507×389 |
| K. Dharanidhar G | Chief Technology Officer | `/images/K. Dharanidhar G.jpg` | 156 KB | 1520×1600 |
| S. Aniruddhan | Director | `/images/S. Aniruddhan.jpg` | 52 KB | 391×422 |
| V. S. Chakravarthy | Director | `/images/V. S. Chakravarthy.jpg` | 265 KB | 1439×1600 |

Display: `h-44 w-44` (176×176 CSS px), `object-cover`, `rounded-3xl`. Landscape CEO photo is cropped. Two director originals are far larger than display size (not srcset’d, not lazy-loaded).

## Content gaps

- Bios: **none**
- LinkedIn: **none in source**
- Clickable photos/cards: **no**
- `target="_blank"`: **n/a** (no external links)

## Accessibility

- `alt={founder.name}` — good
- Card is a non-interactive `<article>` — fine today; when linking, do not nest interactive elements
- Inconsistent photo style (studio vs selfie vs colored backdrop) is a visual/trust issue, not an a11y bug
- Filenames contain spaces; they work but are fragile

## Responsive

- `sm:grid-cols-2` `lg:grid-cols-4`
- Mobile: single column, Team section ~1696px tall at 390px — long but not broken
- Hover lift is a no-op on most phones (`hover: hover` media not used here; Framer still attaches hover)

## Best architecture for LinkedIn later

1. Move array to `siteContent.js` with `linkedinUrl`.
2. Make the **entire card** one `<a>` when a URL exists (`aria-label="{name}, {role}, LinkedIn profile"`).
3. `target="_blank"` `rel="noopener noreferrer"`.
4. Visible “LinkedIn” hint (text or small SVG) so clickability is not a secret.
5. **Do not invent URLs.** Implementation is blocked on stakeholder-provided links.

---

# 8. Team group photo — fit analysis

**No group image exists** in `public/` or `src/`.

Options evaluated against the actual SPA:

| Option | Fit | Verdict |
|--------|-----|---------|
| Dedicated `/team` route | Requires React Router or a second Vite HTML entry. Heavy for one image. SEO benefit only if the page has real copy. | Poor **now** |
| Expand Team section | Matches hash nav, existing `#team`, no new architecture | **Recommended** |
| Separate “Team Gallery” page | Same cost as `/team`, even thinner | Avoid |
| Modal/lightbox | Extra JS, worse SEO, worse mobile | Avoid for a single photo |

**Recommendation:** place a full-width group photograph **above** the four cards in `Founders.jsx` (or a thin sibling component imported there). Keep the existing “Team” nav item.

**Storage:** `public/images/team/` or `public/images/team-group.webp` — slug filename, no spaces.

**Optimization:** export a ~1600–2000px-wide WebP (and JPEG fallback if needed), `<img>` with `width`/`height`, `srcset`, `sizes="(min-width: 1024px) 1152px, 100vw"`, `loading="lazy"`, `decoding="async"`.

**Mobile:** full bleed within `px-5` container; `object-cover` with `object-position` chosen after seeing faces; do not lock a landscape crop that decapitates people at 320px. Optional caption naming the people (helps a11y and SEO).

**SEO:** a caption + the existing Team H2 is enough. A dedicated URL is optional later if bios/news grow.

---

# 9. GitHub / version control audit

Commands run:

```
git status
git branch
git remote -v
git log --oneline -n 10
```

All returned: `fatal: not a git repository` (workspace was not a Git repo at Phase 0).

| Question | Answer |
|----------|--------|
| Already a Git repo? | **No** |
| Current branch | N/A |
| Commits | None |
| GitHub remote | None |
| Working tree | N/A |
| Uncommitted changes | N/A (no git) |
| README | Yes, short |
| LICENSE | **No** |

### `.gitignore`

File contents: a single line, `.vercel`.

If someone runs `git init && git add .` today they would stage **`node_modules/` (~105 MB)** and **`dist/`**. This is the highest GitHub-readiness risk.

### Secrets search (values not printed)

Searched `src/`, config, and public files for API keys, tokens, passwords, `AKIA`, `sk_`, Bearer, `.env`, `import.meta.env`.

| Finding | Location (no values) |
|---------|----------------------|
| No API keys / tokens / passwords | — |
| No `.env` files | — |
| Vercel project/org IDs (not credentials, still internal) | `.vercel/project.json` (already gitignored) |
| Public contact mailbox | `src/components/Contact.jsx`, `src/components/Footer.jsx` — Gmail address, already on the live site |

**Potential secret found in:** none of the typical credential classes.

**GitHub readiness class:** **REQUIRES CLEANUP** (see final summary). Not SAFE. Not a leaked-secret MAJOR ISSUE, but **not uploadable as-is**.

Suitable as a **private** GitHub repo after gitignore + init. A **public** repo additionally needs a license decision, README that matches the product, and acceptance that the Gmail address is already public.

---

# 10. UI / visual design audit

## Design tokens (from code + screenshots)

| Token | Value / pattern |
|-------|-----------------|
| Primary | `#2563eb` (`--primary`, Tailwind `blue-600`) |
| Ink | `#0B1220` / `#0b1020` |
| Muted | `#64748B` |
| Surface | `#F7F9FC` |
| Hero | Navy overlays + cyan canvas `rgba(56, 189, 248, …)` |
| Radius | Pills (`rounded-full`) for buttons; `rounded-2xl` use-case cards; `rounded-[2rem]` / `rounded-3xl` team/contact |
| Shadow | Soft slate shadows; team `0 10px 25px rgba(0,0,0,0.08)` |
| Type | System sans, semibold headings, wide-tracking uppercase eyebrows |
| Section padding | `py-20 sm:py-24`, container `max-w-7xl` + `px-5 sm:px-6 lg:px-8` |
| Motifs | Pulse/wave logo, constellation/neural nodes, blue-on-white cards |

Buttons: bright blue pills, white type, Framer scale 1.03 hover / 0.98 tap.

Nav: transparent over hero → frosted white when scrolled. Active link turns `--primary` + font-weight 600.

Animation consistency: section reveals all use the same `fadeInOnScroll` / stagger. Hero canvas is a different language (continuous). Use-case cards do not hover; team cards do — small inconsistency.

Desktop hierarchy is clear: dark cinematic hero, then quiet white/gray content. Mobile hierarchy is the same stack; Team becomes a long scroll of large photos.

## Persona: 5–10 second test

**A. Semiconductor engineer — Partial.**  
Badge + subtitle say “analog-native AI silicon” and “edge inference and wireless.” Use-case cards mention demodulation, UAVs, constrained nodes. Missing: process node, analog compute vs digital, ASIC vs platform, Cryo-CMOS (not on site yet), publications, architecture diagram. Credible *direction*, thin *specificity*.

**B. Potential customer / partner — Partial.**  
They can guess “chips for edge AI and wireless.” They cannot tell product status (research / design win / tapeout), who buys, or how to start a program beyond a Gmail form.

**C. Investor — Weak-to-partial.**  
Brand-forward H1 (“SpandanAI”) does not state the company. No traction, market, founding story, or differentiation vs digital accelerators. Leadership photos help. Gmail + no company LinkedIn on-page hurts.

**D. Potential employee / researcher — Weak.**  
No culture, no open roles, no research agenda, no advisor network beyond four names/titles. Photos are clickable in the future sense only.

**Why the 5–10s read is incomplete:** the largest type on the page is the brand name, repeated. The actual category line is a small badge and a one-line subtitle that repeats “analog-native.”

---

# 11. Responsive design audit

Chromium metrics: **no horizontal overflow** at 320, 375, 390, 430, 768, 1024, 1366, 1440, 1920.

| Viewport | Notes |
|----------|--------|
| 320 | H1 48px; badge + subtitle wrap cleanly; hamburger 40×40 (below 44px target); hero ~800px tall (`110vh`) |
| 375–430 | Same pattern; Use Cases stacked; Team photos large and clear |
| 768 | Desktop nav appears (`md`); H1 60px; 2-col use cases and team |
| 1024+ | 4-col use cases and team; H1 72px; contact becomes 2-col |
| 1440 / 1920 | Comfortable max-width; unused side space is by design (`max-w-7xl`) |

### Issues found (not fixed)

- **Hamburger 40×40** and desktop nav links ~20px tall — below 44×44 tap/click guidance.
- **Email links 24px tall.**
- **Mobile menu at top of page:** opening the drawer introduces a white panel under a still-transparent header with **white wordmark** — contrast risk at the seam (screenshot `menu-390`).
- **Hamburger does not become an X** when open (`aria-expanded` is set).
- **Team photos** crop inconsistently in the 176px square (CEO landscape).
- **Hero `110vh`** on short phones wastes a lot of first paint below the CTA (user must scroll for Use Cases).
- `--navbar-height` 80/96 vs measured ~73px → extra `scroll-margin` when jumping to sections.
- **Scroll-to-top** can overlap the contact form on mobile (visible in contact-390).
- No layout jumping / broken grids observed in screenshots.
- Canvas does not adapt node count for small screens.

---

# 12. Performance audit

## Commands

| Command | Result |
|---------|--------|
| `npm run build` | **Pass** (exit 0, ~510ms, no warnings) |
| Lint | **No script** — not run |
| Typecheck | **N/A** (JS) |
| Tests | **None** |
| Lighthouse | **Not available** in this environment |

Build output:

```
dist/index.html                   1.73 kB │ gzip: 0.56 kB
dist/assets/index-Ht0_vUWf.css   16.61 kB │ gzip: 4.46 kB
dist/assets/index-DKRU34Cm.js   336.30 kB │ gzip: 106.29 kB
```

Total `dist/` ~1.1 MB (images dominate). JS is a **single chunk** (React 19 + Framer Motion + app). No `React.lazy`.

## Observations

| Topic | Finding |
|-------|---------|
| Hero rAF | Always on, including when scrolled to Team/Contact |
| Particle count | 80, O(n²) lines |
| High DPR | Uncapped |
| React re-renders | Header scroll sets state (`isScrolled`) on rAF — acceptable. ScrollToTop toggles state at 600px. Progress bar uses ref/transform (good). |
| Listener leaks | Cleanups present on reviewed effects |
| Images | Two team JPEGs 156 KB and 265 KB for 176px display; no `srcset`; team images missing `loading="lazy"` |
| Fonts | System fonts — positive |
| Third-party scripts | **None** — positive |
| Code splitting | **None** |
| Preload | No hero image preload (`wave-background.png` is CSS, so not discoverable as `<img>`) |
| CLS | Generally low; images have CSS size. Canvas/fonts not a CLS source |
| Mobile GPU | Canvas blur + full-bleed animation is the main risk |

July 2026 audit’s “2.1 MB logos” problem is **fixed** in current assets (WebP ~12 KB). Do not treat that old finding as current.

---

# 13. Accessibility audit

| Area | Status |
|------|--------|
| Landmarks | `header` > `nav aria-label="Primary navigation"`; `main`; `footer`; sections with ids |
| H1 | One H1: “SpandanAI” |
| H2 | Section titles via `SectionHeading` |
| H3 | Unused (flat but valid) |
| Alt | Logos `alt="SpandanAI"` **duplicate** the adjacent visible wordmark (header + footer) — screen readers hear the name twice per logo |
| Canvas | `aria-hidden="true"` — correct, not a text duplicate source |
| Keyboard | Links/buttons are real `<a>`/`<button>`. Cards are not in tab order (OK until LinkedIn). Focus rings exist on nav (`focus-visible`) and inputs |
| Skip link | **Missing** |
| Reduced motion | CSS blanket `animation/transition: none`; Framer `useReducedMotion` on several controls; **canvas largely ignores it**; `scroll-behavior` disabled |
| ARIA | Hamburger `aria-expanded` + `aria-label` **and** `sr-only` “Menu” — redundant announcement |
| Forms | Labels wrap inputs; `required` on name/email/message; `autoComplete` set |
| Contrast | White-on-navy hero is strong. Muted gray `#64748B` on white is a possible WCAG fail for small text (not instrumented here). Mobile menu/header seam: white text on light panel risk |
| Clickable cards | Team cards look lift-able but are not links — when LinkedIn is added, make the affordance explicit |

**Duplicated text for animations:** the canvas draws **no text**. Framer does not clone heading strings. Duplicated “SpandanAI” is from **real DOM nodes** (title, H1, header text, footer text, two alts), not from animation sprites.

---

# 14. SEO audit

| Item | Current |
|------|---------|
| Title | `SpandanAI` (generic) |
| Meta description | Fabless semiconductor / hybrid analog-digital / AI inference / communications — present in `index.html` |
| Canonical | `https://spandanai.com/` |
| OG title/description/url/type | Present |
| OG image | `https://spandanai.com/images/og-image.png` (1200×630, live 200) |
| Twitter card | `summary_large_image` + matching fields |
| H1 | Brand name only |
| robots.txt | `Allow: /` + sitemap URL — live 200 |
| sitemap.xml | Single URL, `lastmod` **2026-07-04** (stale vs 2026-08-31 deploy) |
| Manifest | **None** |
| Favicon | ico + 32png + apple-touch — live 200 |
| JSON-LD | **None** |
| Social profile links | **None** on page |
| Indexability | Allowed |
| Client-rendered body | Yes — Google generally executes JS; raw HTML `#root` is empty |

Live headers include CSP, `X-Frame-Options: DENY`, `nosniff`, Referrer-Policy, Permissions-Policy, HSTS.

### Duplicated “SpandanAI”

Verified occurrences a crawler/screen reader can collect:

1. `<title>`
2. `og:title` / `twitter:title`
3. Header `<img alt="SpandanAI">`
4. Header visible span “SpandanAI”
5. Hero `<h1>` “SpandanAI”
6. Footer `<img alt="SpandanAI">`
7. Footer visible “SpandanAI”
8. Copyright line “© 2026 SpandanAI…”

That is enough for Google to treat the brand string as repetitious, especially because the H1 is not a descriptive phrase.

### “Innovating AI with Semiconductors”

**Not in this repository. Not in the live homepage HTML. Not in the JS bundle text for UI copy. Not drawn by the canvas.**

Likely explanations, in order of evidence:

1. **Older deployed copy** that Google still shows in sitelinks/snippets
2. A **Google-generated** name/slogan (Search/Knowledge), not page copy
3. Confusion with another entity (search also surfaces unrelated “semiconductor + AI” pages)

This Phase 0 cannot prove the historical source because **there is no Git history**. The current animation is **not** the duplicate-text mechanism.

**Do not “fix” the canvas for this SEO issue.** Fix unique title/H1/alt pairing and request recrawl after copy exists.

---

# 15. Messaging / copy audit

## Copy currently shown (main strings)

- Nav: Use Cases, Team, Contact, Partner With Us
- Hero badge: Analog-Native AI and Communication Silicon
- H1: SpandanAI
- Hero body: Analog-native AI silicon for edge inference and wireless systems.
- CTA: Explore Use Cases
- Use Cases H2: Deployment surfaces for analog-native AI silicon.
- Use Cases lede: Target environments where edge inference and wireless acceleration deliver measurable impact.
- Four use-case blurbs (section 6)
- Team H2: Founding engineering and product leadership.
- Team lede: Core team responsible for silicon architecture, program execution, and company direction.
- Contact H2: Engage with SpandanAI.
- Contact lede: Connect with the team for partnerships, technical collaboration, and program discussions.
- Response: We typically respond within 1-2 business days.
- Focus areas: Edge AI inference silicon / Analog wireless communication
- Form placeholder: Tell us about your partnership or investment interest
- Privacy note on the form
- Footer copyright 2026

## Can a new visitor answer…

| Question | Verdict |
|----------|---------|
| 1. What is SpandanAI? | Weak — a name plus “analog-native silicon” |
| 2. What does it build? | Partial — edge inference + wireless silicon, no product names |
| 3. Semiconductor / AI / lab? | Implied fabless semiconductor (meta description is clearer than the H1) |
| 4. Core technologies? | Vague: analog-native, edge, wireless. No analog compute / ASIC / Cryo-CMOS on page |
| 5. Who uses it? | Partial — UAV/CCTV/traffic/wireless operators via use cases |
| 6. Why different? | Not stated beyond the adjective “analog-native” |
| 7. Who is behind it? | Four names and titles, no bios |
| 8. How to contact? | Yes — form + Gmail |

### Wording flags (do not rewrite in this phase)

| Phrase | Flag |
|--------|------|
| H1 “SpandanAI” | Repetitive; not a value proposition |
| “Analog-native” twice in the hero | Repetitive |
| “Deployment surfaces” | Unnecessarily complicated for a first H2 |
| “program execution” | Generic corporate |
| “Engage with SpandanAI.” | Soft / vague CTA heading |
| Use-case body copy | Technically flavored but still generic (no numbers, no named products) |
| Meta description “fabless semiconductor… hybrid analog-digital” | Stronger than visible hero — inconsistency |

**Suggested direction (not copy):** lead with a sentence a chip engineer and a partner can both parse, e.g. category (fabless analog/mixed-signal AI + comms silicon) + job-to-be-done (power/latency at the edge) + proof later. Keep the current visual system.

---

# 16. Technical credibility audit

**Where it sounds credible**

- “Analog-native,” “signal-path,” “demodulation pipelines,” “constrained edge nodes,” “power-limited deployed systems”
- Use cases in vision / traffic / wireless / embedded inference are plausible analog-compute markets
- Team titles (CEO, CTO, Director) + “silicon architecture”
- Meta description: fabless, hybrid analog-digital

**Where it sounds generic**

- No mention of IC / ASIC / CMOS / mixed-signal / in-memory / compute-in-memory / tapeout / PDK / foundry
- No block diagram, no architecture claim, no performance envelope
- “AI silicon” without saying inference-only vs training, analog vs digital MAC, etc.
- Healthcare AI is **not** on this website (a LinkedIn third-party snippet about “Berta AI Scribe” appeared in web search for the company name — **that claim is not in this repo and should not be added without stakeholder confirmation**)

**Missing identity**

- Semiconductor company proof (fabless statement is in meta, not in the H1/body)
- Analog compute story
- Cryo-CMOS / quantum (requested, not shipped)
- Research or academic signal (directors may be faculty — not said)
- Product vs IP vs services

---

# 17. Security / production hygiene

| Check | Result |
|-------|--------|
| Exposed secrets | None found in source |
| `target="_blank"` without `noopener` | **No `target="_blank"` in `src/` today.** Will become relevant for LinkedIn |
| External scripts | None |
| `dangerouslySetInnerHTML` / `innerHTML` / `eval` | Not in `src/` |
| Client credentials | None |
| Form validation | HTML5 `required` + `type="email"`; no server-side (mailto) |
| Anti-spam | **None** (acceptable for mailto; bots can still spawn mail clients) |
| Outdated packages | React/Vite resolved to 19.2.5 / 8.0.10 via lockfile but declared `"latest"`. July report mentioned Vite dev-server advisories — **dev-only**, not re-verified with `npm audit` this phase |
| Debug / `console.log` | None in `src/` |
| Source maps in `dist/` | None |
| localhost URLs in product | None in `src/` |
| Test/placeholder comments | Contact: “placeholder business details.” Hero: “CTA pair” (stale) |
| Unused files | Empty `src/assets/`; unused logo PNG/WebP dark+light PNG; unused `cardHover` |
| Internal IDs | `.vercel/project.json` project/org IDs |

CSP on Vercel is relatively strict (`script-src 'self'`). Adding analytics or a form SaaS later **will require a CSP change**.

---

# 18. Contact section audit

| Item | Detail |
|------|--------|
| Email | `spandanai.sard@gmail.com` (Contact + Footer) |
| mailto | Direct link + form builds `mailto:?subject&body` via `encodeURIComponent` |
| Form destination | User’s local mail client — **nothing is stored** |
| Validation | `required` on name, email, message; org optional |
| Anti-spam | None |
| Social | None |
| CTA | “Contact Team” / “Partner With Us” |
| a11y | Label wrapping is good; no error summary |
| Mobile | Fields stack; scroll-to-top overlaps; 1-col form |

**Credibility:** mixed. The layout looks like a real company page. A **Gmail** address, no office/location, no company LinkedIn, and a comment in source calling details “placeholder” make it feel early-stage rather than institutional. `mailto:` fails for users without a mail client (mobile PWA/in-app browsers).

---

# 19. Deployment / Vercel audit

`vercel.json` (source of truth in repo):

- `buildCommand`: `npm run build`
- `outputDirectory`: `dist`
- Security headers on `/(.*)`

No redirects, rewrites, or env in repo.

**Expected deploy:** Vercel Git integration or CLI `vercel --prod` after Git exists. Today the project is already linked (`.vercel/project.json`) and **https://spandanai.com/** is live.

**Build:** `vite build` → `dist/`. Straightforward static hosting.

**Custom domain:** visible in `index.html` canonical and live DNS. Not configured inside application code (dashboard-side).

**502s:** this architecture is static files on Vercel’s CDN (`x-vercel-cache: HIT` observed). There are **no serverless functions** whose cold start or crash would 502. This audit **does not have evidence** of a 502 cause in the app. Sporadic 502s, if they occur, would more likely be platform/DNS/deploy-window issues than React/Vite logic. Do not invent a canvas-related 502 story.

Unknown unknown URL `/does-not-exist` correctly returns **404** (`x-vercel-error: NOT_FOUND`) — no SPA fallback rewrite, which is correct for this one-page site.

---

# 20. Code quality audit

| Finding | Severity |
|---------|----------|
| Not a Git repository; `.gitignore` unsafe for a first commit | **Critical** (process) |
| Hero canvas ignores reduced-motion and off-screen pause | **High** |
| `"latest"` React/Vite in `package.json` | **High** (reproducibility) |
| Team/LinkedIn data missing; team data not in `siteContent.js` | **High** (for upcoming reqs) |
| SEO title + H1 are brand-only; duplicate alts | **High** (discoverability) |
| Gmail-only contact / mailto-only | **Medium** |
| Unused assets + empty `src/assets/` + unused `cardHover` | **Medium** |
| `--navbar-height` vs real header height | **Medium** |
| Magic numbers in canvas (80, 140, 180, …) undocumented except constants (constants exist — good) | **Low** |
| `Founders` key `${role}-${index}` | **Low** |
| Filenames with spaces | **Low** |
| No TypeScript | **Low** (size of project) |
| No tests | **Medium** for future regression, **Low** for current static marketing page |
| Header is large (~260 lines) with several effects | **Low** — still readable |
| Package name `neutral-ai-landing-page` | **Low** |
| Inconsistent hover (team yes, use cases no) | **Nice-to-have** |
| No error boundary | **Nice-to-have** |

Maintainability is **good for a 10-component landing page**. Future updates to use cases are easy; future updates to team currently require editing a component. Naming is consistent. Effects generally clean up.

---

# 21. What already works well

- Clear, small component tree — easy to onboard
- Content already partly data-driven (`siteContent.js`)
- Tailwind + a short `index.css` — coherent visual system, not a CSS mess
- Framer Motion used with `viewportOnce` and several `useReducedMotion` branches
- Canvas hero is **already on-brand** (nodes/synapses) and has proper listener cleanup
- Sticky header with IntersectionObserver + CTA intent event is thoughtful
- Contact labels, `required`, and `encodeURIComponent` mailto are done correctly
- Vercel security headers are live
- Favicons, canonical, OG, Twitter, robots, sitemap exist
- System fonts — no font-loading jank
- No third-party trackers
- Responsive grids do not overflow from 320–1920
- Production build is fast and warning-free
- Live site matches this source (safe to plan against this tree)

**Do not unnecessarily change:** overall layout, color system, card language, Framer section reveals, Canvas 2D choice, hash-nav SPA structure, or the decision to stay off Next.js unless a real multi-page IA appears.

---

# 22. Stakeholder requirements map

Full table lives in `docs/SPANDANAI_REQUIREMENTS.md`. Summary:

| # | Request | Current | Complexity | Blocker |
|---|---------|---------|------------|---------|
| 1 | Cryo-CMOS use case | 4 data-driven cards | Low | Optional grid tweak |
| 2 | GitHub | Not a git repo | Medium | `.gitignore` first |
| 3 | LinkedIn photos | No URLs, not clickable | Low | **Need 4 URLs** |
| 4 | Neuron firing hero | Canvas network without firing/propagation | High | Performance/a11y design |
| 5 | Team group photo | No asset, no page | Low–Medium | **Need the photo** |

---

# 23. Other improvements (not stakeholder requirements)

## MUST DO

- Safe `.gitignore` + git init before any GitHub upload
- Unique `<title>` and a descriptive H1 or visually primary sentence that is not only the brand
- Logo `alt=""` (decorative) when the wordmark text is beside it
- Pause/simplify canvas off-screen + honor reduced motion for real
- Confirm public email identity

## STRONGLY RECOMMENDED

- Pin dependencies
- Organization JSON-LD
- Short About / “what we build” band (still on the homepage)
- Lazy-load + compress large headshots
- 44px tap targets
- Move team into `siteContent.js`
- sitemap `lastmod` on real releases
- Visible LinkedIn affordance when Requirement 3 ships

## OPTIONAL

- Form backend
- LICENSE
- Package rename
- Lazy-load canvas chunk
- `/team` only if content grows
- Autoprefixer (Tailwind 3 default docs still mention it; site works without it in current browsers)

## AVOID FOR NOW

- Redesign
- Next.js migration
- Three.js
- Blog/CMS
- Invented metrics, invented LinkedIn, invented healthcare-scribe claims from third-party search noise

---

# 24. Documentation created

See section K of the Phase 0 response. Files are under `docs/`.

---

# 25. Proposed roadmap (do not start)

Adjusted from the template because: Git does not exist; SEO duplicate-text is not a canvas bug; neuron work should not precede hygiene and blocked assets; logo megabyte issue is already gone.

| Phase | Objective | Likely files | Risk | Depends on | Verification |
|-------|-----------|--------------|------|------------|--------------|
| **0** | Audit (this document) | `docs/*` | None | — | Stakeholder accepts snapshot |
| **1** | Safety / GitHub baseline | `.gitignore`, `README.md`, `package.json` (pin), git init | Medium if gitignore wrong | Decision: private vs public | `git status` clean; clone build |
| **2** | Messaging + SEO foundation | `index.html`, `Hero.jsx`, `SectionHeading` consumers, JSON-LD | Medium (copy) | Approved one-sentence positioning | Unique title/H1; Recrawl; alts not doubling |
| **3** | Use case expansion | `siteContent.js`, `Applications.jsx` | Low | Approved Cryo-CMOS wording | 5th card, responsive grid |
| **4** | Team LinkedIn + data move | `Founders.jsx`, `siteContent.js` | Low | **LinkedIn URLs** | New-tab links, keyboard, rel |
| **5** | Team group photo in `#team` | `Founders.jsx`, `public/images/*` | Low | **Photo file** | Mobile crop, alt, lazy load |
| **6** | Neuron-firing canvas | `NeuralNetworkBackground.jsx` (+ maybe Hero) | **High** | Visual sign-off; perf budget | Idle fire, cursor, mobile, reduced-motion, off-screen pause |
| **7** | Responsive / a11y polish | `Header.jsx`, `index.css`, tap targets, menu contrast | Low–Medium | Phase 6 not required | 320–1920 pass, keyboard, contrast |
| **8** | SEO leftover | sitemap lastmod, schema, maybe FAQ — only if copy is ready | Low | Phase 2 | Search Console after deploy |
| **9** | Performance | lazy images, DPR cap, optional canvas code-split | Medium | Best after Phase 6 so work isn’t done twice | Build sizes; phone smoke test |
| **10** | QA + production deploy | — | Medium (it’s live) | All intended phases | Preview URL, then production; headers; forms; hashes |

Phase 1 should happen before any parallel feature work that multiple people will touch.

---

*End of Phase 0 audit. No implementation was started.*
