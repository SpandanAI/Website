# SpandanAI — Requirements

**Date recorded:** 31 August 2026  
**Status:** Recorded only. **Nothing in this file has been implemented in this phase.**

This document keeps stakeholder requests separate from auditor suggestions.

---

# STAKEHOLDER-REQUESTED REQUIREMENTS

These five items were explicitly requested. They are the implementation backlog for later phases.

---

## REQUIREMENT 1 — New use case

**Title (stakeholder wording, do not rewrite yet):**  
Cryo-CMOS for AI assisted Quantum circuits

**Description (stakeholder wording, do not rewrite yet):**  
Addressing the tight power budget in cryogenic refrigerators requires unique IC design

### Current state

- Use Cases section exists on the homepage (`#use-cases`).
- Four cards, data-driven from `applicationTabs` in `src/data/siteContent.js`.
- Cards are text-only (uppercase label + description). No icons, no images, no hover animation.
- Desktop: 4-column grid. Tablet: 2-column. Mobile: 1-column.
- The Cryo-CMOS item is **not** in the data.

### Relevant files

- `src/data/siteContent.js`
- `src/components/Applications.jsx`

### Complexity

**Low** (data add). **Low–Medium** if the 5-card grid is adjusted so a fifth card does not sit alone on a leftover row.

### Risks

- Visual imbalance if a fifth card wraps under a 4-column grid.
- Wording/capitalization is inconsistent with existing title case / short labels.

### Dependencies

- Stakeholder confirmation that the provided wording should appear as-is, or approval to lightly standardize capitalization (see suggestions below — **not** part of this requirement unless they ask).

### Recommended implementation strategy (later)

1. Append a fifth object to `applicationTabs`.
2. Keep the same `{ id, label, description }` shape.
3. Revisit `lg:grid-cols-4` in `Applications.jsx` (likely `lg:grid-cols-3` or two rows) so five cards still look intentional.
4. Do not add icons unless all cards get icons.

### Tests required afterward

- Desktop / tablet / mobile: fifth card visible, no overflow, no orphaned layout.
- Nav still scrolls to `#use-cases`.
- Copy matches the approved wording.

---

## REQUIREMENT 2 — GitHub

**Request:** Prepare / upload the code on GitHub.

**This phase:** inspect only. Do not `git init`, commit, or push.

### Current state

- This folder is **not a Git repository**.
- No remotes, no commits, no branches.
- `.gitignore` contains only `.vercel`.
- README exists and is short. No LICENSE.
- `package.json` name is `neutral-ai-landing-page`.
- No `.env` secrets found. Contact email is a Gmail address in source (not a secret, but informal).

### Relevant files

- `.gitignore`
- `README.md`
- `package.json`
- (future) `.git/`, GitHub remote — none today

### Complexity

**Medium** (process + hygiene, not feature code). First-time `git init` with the current `.gitignore` would be dangerous.

### Risks

- Accidentally committing `node_modules/` (~105 MB) and `dist/`.
- Committing `.vercel/project.json` if gitignore is bypassed.
- Public repo would expose the Gmail address (already public on the live site).
- No license chosen.

### Dependencies

- Decision: public vs private GitHub repo.
- Decision: GitHub org/user and repo name.
- Expand `.gitignore` **before** the first `git add`.
- Optional: LICENSE, richer README, pin `"latest"` dependencies.

### Recommended implementation strategy (later)

1. Expand `.gitignore` (`node_modules`, `dist`, `.env*`, OS junk, `.vercel`).
2. `git init`, first commit of source only.
3. Create GitHub repo (private recommended until cleanup is reviewed).
4. Push. Do not force-push `main`.

### Tests required afterward

- `git status` clean.
- `node_modules/` and `dist/` untracked.
- Clone-from-GitHub smoke: `npm install && npm run build`.

---

## REQUIREMENT 3 — LinkedIn on team photos

**Request:** Each team member’s photo should be clickable and open that person’s LinkedIn. The whole card may be clickable if that is better for UX/accessibility.

### Current state

- Four members in `src/components/Founders.jsx`.
- Photos, names, roles. **No bios. No LinkedIn URLs. Cards are not links.**
- `whileHover` lift exists on the card; it is visual only.
- No `target="_blank"` anywhere in `src/`.

### Team as stored today

| Name | Role | Photo | LinkedIn in repo |
|------|------|-------|------------------|
| N.R. Rohan | Chief Executive Officer | `/images/N.R. Rohan.jpg` | **Missing** |
| K. Dharanidhar G | Chief Technology Officer | `/images/K. Dharanidhar G.jpg` | **Missing** |
| S. Aniruddhan | Director | `/images/S. Aniruddhan.jpg` | **Missing** |
| V. S. Chakravarthy | Director | `/images/V. S. Chakravarthy.jpg` | **Missing** |

### Relevant files

- `src/components/Founders.jsx`
- Team JPEGs in `public/images/`
- Ideally later: `src/data/siteContent.js`

### Complexity

**Low** once URLs are provided. **Blocked** until URLs exist.

### Risks

- Guessing LinkedIn URLs would be wrong and unprofessional.
- Whole-card `<a>` wrapping a heading + image needs a single accessible name.
- Missing `rel="noopener noreferrer"` on `target="_blank"`.
- Hover animation + link focus styles must still work on keyboard and mobile.

### Dependencies

- **Stakeholder must supply four LinkedIn URLs.** They are not in this repository.

### Recommended implementation strategy (later)

1. Move the `founders` array into `src/data/siteContent.js`.
2. Add `linkedinUrl` (or `null` if someone has none).
3. Prefer **whole-card link** (`<a>` wrapping the article contents) with `aria-label` like “N.R. Rohan on LinkedIn”.
4. `target="_blank"` + `rel="noopener noreferrer"`.
5. If a member has no LinkedIn, keep the card static (do not fake a link).
6. Show a small “LinkedIn” affordance so the click target is obvious.

### Tests required afterward

- Each provided URL opens the correct profile in a new tab.
- Keyboard: Tab to card, Enter/Space activates.
- Screen reader announces destination, not just the name twice.
- Members without a URL remain non-clickable.

---

## REQUIREMENT 4 — Landing animation (neuron network)

**Request:** Evolve the landing into an interactive network resembling neurons firing:

- random firing
- different firing intervals
- cursor-driven stimulation
- signal propagation if appropriate
- subtle idle activity
- mobile fallback

**Do not implement in this phase.**

### Current state

A Canvas 2D node-link animation already exists (`NeuralNetworkBackground.jsx`):

- 80 drifting nodes, distance-based lines (not a fixed synapse graph)
- Cursor repulsion + glow; nearby nodes brighten
- Idle sine drift + occasional random radial ripple (8–10 s)
- **No per-node firing, no pulse along edges, no fire-probability model**
- **No touch handlers**
- `prefers-reduced-motion` only disables ripples; the rAF loop still runs
- Animation does **not** pause when the hero is off-screen

This is a solid base to **extend**, not a reason to replace the stack.

### Relevant files

- `src/components/NeuralNetworkBackground.jsx` (primary)
- `src/components/Hero.jsx`
- `src/index.css` (global reduced-motion)

### Complexity

**High**

### Risks

- Already O(n²) connection checks every frame (~80 nodes).
- Full-DPR canvas on mobile = GPU/CPU cost.
- Over-animating will look gimmicky for a semiconductor brand.
- Breaking reduced-motion / battery life.

### Dependencies

- Visual direction (subtle vs dramatic).
- Decision on mobile: tap-to-stimulate vs ambient-only.
- Performance budget (pause off-screen, fewer nodes on small screens, cap DPR).

### Recommended implementation strategy (later)

See the hero section of `SPANDANAI_PROJECT_AUDIT.md`. Short version: keep Canvas 2D; add a sparse fixed graph; per-node timers; pulse along edges; cursor raises fire probability; pause when off-screen; static/ambient fallback for reduced-motion and low-end mobile.

### Tests required afterward

- Desktop: idle firing + cursor stimulation + propagation.
- Mobile: no jank; touch or ambient fallback works.
- `prefers-reduced-motion: reduce` → no continuous motion.
- Animation pauses when hero is off-screen.
- CTA / nav still clickable (z-index / pointer-events).
- Production build + spot-check on a low-end phone.

---

## REQUIREMENT 5 — Team group photograph

**Request:** “one page for our team photo if possible”

### Current state

- Homepage Team section with four individual cards only.
- **No group photo asset in `public/`.**
- No `/team` route. The site is a hash-based SPA.

### Relevant files

- `src/components/Founders.jsx`
- `src/App.jsx`
- `public/images/` (future asset)
- `src/data/siteContent.js` (nav, if a new section/page is linked)

### Complexity

**Low–Medium** for a homepage section. **Medium–High** for a real `/team` URL (requires new routing or a second HTML entry).

### Risks

- Building a dedicated page for one image is thin and easy to look unfinished.
- Large unoptimized photo will hurt LCP on mobile.
- Photo style currently inconsistent across headshots; a group shot needs its own art direction.

### Dependencies

- The actual photograph (does not exist in the repo).
- Crop / alt text / people named in the caption.

### Recommended implementation strategy (later)

**Best fit for this architecture:** add a group-photo block **inside the existing Team section** (above the four cards), not a new route.

- Store as `public/images/team-group.webp` (plus a compressed JPEG fallback if needed).
- `srcset` / `sizes`, `loading="lazy"`, explicit width/height, descriptive `alt`.
- On mobile: full-width, `object-cover` with a sensible focal point; do not force a tiny crop that cuts faces.
- Add a nav item only if the section becomes long enough to need it; otherwise the existing “Team” link is enough.

A dedicated `/team` page is justified later if bios, publications, or a gallery appear. It is not justified for a single image today.

### Tests required afterward

- Photo loads on production paths (spaces/encoding not an issue if the filename is slug-safe).
- Desktop and mobile: faces visible, no overflow.
- Alt text present.
- Existing four cards unchanged in behavior except any agreed LinkedIn work.

---

# SUGGESTED IMPROVEMENTS

These are **not** stakeholder requirements. Do not treat them as committed work.

They are expanded and prioritized in `SPANDANAI_PROJECT_AUDIT.md`.

## MUST DO (suggested)

- Expand `.gitignore` before any GitHub upload.
- Collect LinkedIn URLs before coding Requirement 3.
- Collect the group photo before coding Requirement 5.
- Strengthen the page title and unique H1/value proposition for SEO.
- Pause or simplify the hero canvas off-screen and under reduced motion.
- Confirm `spandanai.sard@gmail.com` is the intended public address (or replace with a domain mailbox).

## STRONGLY RECOMMENDED (suggested)

- Pin `react` / `react-dom` / `vite` away from `"latest"`.
- Add Organization JSON-LD.
- Move team data into `src/data/siteContent.js`.
- Add a short “what we build” block (the site currently has no About/Technology section).
- Lazy-load team images; compress the two large director JPEGs.
- Accessible 44px tap targets for hamburger and nav links.
- `rel="noopener noreferrer"` whenever LinkedIn tabs are added.

## OPTIONAL (suggested)

- Form backend instead of `mailto:`.
- Schema `ContactPoint`.
- Dedicated `/team` page (only if content grows).
- Code-splitting / lazy-loading the canvas chunk.
- LICENSE file.
- Rename package from `neutral-ai-landing-page`.

## AVOID FOR NOW (suggested)

- Redesign / visual rebrand.
- Introducing Next.js, React Router, or Three.js without a clear need.
- Adding many new pages.
- Rewriting Framer Motion usage globally.
- Inventing LinkedIn URLs or technical claims not provided by the company.
- Implementing the neuron hero before GitHub hygiene and the low-risk content items.

---

## Wording suggestions (Requirement 1 only — not approved copy)

Stakeholder text should ship as given unless they ask to edit. Optional professional standardization:

| Field | Stakeholder | Optional suggestion |
|-------|-------------|---------------------|
| Title | Cryo-CMOS for AI assisted Quantum circuits | Cryo-CMOS for AI-Assisted Quantum Circuits |
| Card label (to match existing short labels) | (none given) | Cryo-CMOS |
| Description | Addressing the tight power budget in cryogenic refrigerators requires unique IC design | Addressing the tight power budget of cryogenic refrigerators requires purpose-built IC design. |

Do not apply these unless the stakeholder agrees.
