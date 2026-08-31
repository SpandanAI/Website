# SpandanAI Phase 2A — Messaging & SEO Proposal

**Status:** PROPOSAL ONLY — not implemented.  
**Date:** 31 August 2026  
**Authority:** Current source in this repository (not older audits).  
**Production:** https://spandanai.com/ (unchanged by this phase)

Every proposed phrase is tagged:

- **VERIFIED** — appears in current website/repository source
- **SAFE REPHRASING** — same facts, different wording; no new claim
- **NEEDS STAKEHOLDER CONFIRMATION** — do not ship without approval

---

## 1. Current State

Verified from `index.html`, `src/components/Hero.jsx`, `src/components/Applications.jsx`, `src/components/Founders.jsx`, `src/components/Contact.jsx`, `src/components/SectionHeading.jsx`, `src/components/Header.jsx`, `src/components/Footer.jsx`.

### Title

```
SpandanAI
```

Source: `index.html` `<title>`

### Meta description

```
SpandanAI is a fabless semiconductor company building hybrid analog-digital silicon for AI inference and next-generation communication systems.
```

Source: `index.html` `name="description"` (also used for `og:description` and `twitter:description`)

### Hero eyebrow

```
Analog-Native AI and Communication Silicon
```

Source: `src/components/Hero.jsx` — a `<p>` badge, not a heading

### H1

```
SpandanAI
```

Source: `src/components/Hero.jsx` — the only `<h1>` on the page

### Hero supporting text

```
Analog-native AI silicon for edge inference and wireless systems.
```

### Primary CTA

```
Explore Use Cases
```

Target: `#use-cases`. Header/footer also expose **Partner With Us** → `#contact` (not in the hero).

### Heading hierarchy (actual)

| Level | Count | Content |
|-------|-------|---------|
| h1 | 1 | SpandanAI |
| h2 | 3 | Deployment surfaces for analog-native AI silicon. / Founding engineering and product leadership. / Engage with SpandanAI. |
| h3 | 0 | — |

Eyebrows (“Use Cases”, “Leadership Team”, “Contact”) and use-case card labels are `<p>`, not headings. Correct.

### Other current positioning (not hero, but relevant)

- Nav: Use Cases, Team, Contact; CTA “Partner With Us”
- Use-case lede: “Target environments where edge inference and wireless acceleration deliver measurable impact.”
- Contact focus areas: “Edge AI inference silicon” / “Analog wireless communication”
- Open Graph / Twitter titles: `SpandanAI`
- Canonical / OG URL: `https://spandanai.com/`
- OG/Twitter image: `https://spandanai.com/images/og-image.png`
- `robots.txt`: allow all; sitemap URL present
- `sitemap.xml`: one URL; `lastmod` **2026-07-04**

---

## 2. Main Problems

Ranked.

1. **The only H1 is the brand name.** Search engines and first-time visitors get “SpandanAI” as the primary statement. Category lives in a small badge and a supporting line.
2. **Visible hero is weaker than the meta description.** Meta already says “fabless semiconductor company” and “hybrid analog-digital silicon.” The large on-page type does not.
3. **Two technical self-descriptions sit side by side without reconciliation.** Hero: “analog-native.” Meta: “hybrid analog-digital.” They may be compatible, but they are not the same phrase and should not be silently merged.
4. **Logo `alt="SpandanAI"` next to visible “SpandanAI”** in header and footer. Screen readers hear the name twice. Not a ranking emergency; it is an accessibility duplication.
5. **Sitemap `lastmod` is stale** (2026-07-04) relative to later deploys.
6. **No Organization JSON-LD.** Optional, but a small verified object would help identity without adding pages.
7. **Indexed slogan “Innovating AI with Semiconductors”** is still not in this source (Phase 0). Fixing H1/title is the right response; do not invent that slogan back into the site.

---

## 3. What Already Works

Do not rewrite these without cause.

- Meta description already states company category (fabless semiconductor) and two work areas (AI inference, communication systems).
- Hero visual system (dark field, canvas network, pill CTA) is on-brand; Phase 2B should keep layout.
- Single H1, three H2s via `SectionHeading` — structurally valid.
- Canonical, robots, favicons, OG image (1200×630), Twitter large image card — already in place.
- One-page SPA sitemap with a single `/` URL is correct.
- CTA “Explore Use Cases” matches the next section; no need for a second hero CTA.
- Use-case cards, team, contact, and animation are out of scope and already functional.
- Brand wordmark in the header is useful visible branding and should stay.

---

## 4. Positioning Constraints

### A. VERIFIED FROM CURRENT WEBSITE/REPOSITORY

These may be used in Phase 2B without inventing new facts:

| Fact | Where |
|------|--------|
| Company name SpandanAI | title, H1, header, footer, copyright |
| “Analog-Native AI and Communication Silicon” | hero eyebrow |
| “Analog-native AI silicon” | hero supporting text; Use Cases H2 |
| Edge inference | hero supporting text; use-case lede |
| Wireless systems | hero supporting text |
| Wireless infrastructure / analog signal-path / demodulation | use-case card |
| Edge vision (UAVs, CCTV, traffic sensing) | use-case card |
| Traffic systems | use-case card |
| Embedded inference | use-case card |
| Fabless semiconductor company | `index.html` meta / OG / Twitter description |
| Hybrid analog-digital silicon | same meta |
| AI inference | meta; contact “Edge AI inference silicon” |
| Next-generation communication systems | meta |
| Analog wireless communication | Contact focus areas |
| Silicon architecture (as a leadership responsibility) | Team section description |
| Public email `spandanai.sard@gmail.com` | Contact, Footer |
| Production URL https://spandanai.com/ | canonical, sitemap, README |
| Logo files under `/images/logo-light.webp` etc. | Header, Footer |
| Four named leaders and titles | `Founders.jsx` |

### B. REASONABLE MARKETING WORDING BASED ON VERIFIED FACTS

Examples (still not shipped):

- Putting the **brand in the eyebrow** and a **descriptive sentence in the H1** (layout of information, not a new claim)
- “&” instead of “and” in a title tag
- “wireless communication” as a tightening of “wireless systems” + “communication systems” already on the site
- Decorative `alt=""` when the wordmark text is adjacent

### C. REQUIRES STAKEHOLDER CONFIRMATION

Do **not** assert in Phase 2B:

- Mixed-signal, analog ASIC, AI accelerator, hardware accelerator, communication IC as official labels (not in current site copy)
- That “analog-native” **equals** “hybrid analog-digital” or “mixed-signal”
- Tape-outs, process nodes, customers, funding, patents, deployments, benchmarks, foundry names
- Founding date, legal entity name, address, phone, LinkedIn `sameAs` URLs
- Cryo-CMOS (stakeholder requested later; not on the site yet)
- Any healthcare/scribe product (not in this repository)

---

## 5. Hero Copy Options

Primary CTA stays **Explore Use Cases** in all options (**VERIFIED**). No second hero CTA.

### OPTION 1 — Conservative / closest to current language

**Eyebrow:** SpandanAI  
**H1:** Analog-native AI and communication silicon  
**Supporting:** Analog-native AI silicon for edge inference and wireless systems.  
**CTA:** Explore Use Cases  

| Phrase | Tag |
|--------|-----|
| SpandanAI | VERIFIED |
| Analog-native AI and communication silicon | VERIFIED (current eyebrow, sentence case for H1) |
| Analog-native AI silicon for edge inference and wireless systems. | VERIFIED (current supporting line, unchanged) |
| Explore Use Cases | VERIFIED |

### OPTION 2 — Deep-tech / engineering-led

**Eyebrow:** Analog-native AI and communication silicon  
**H1:** Silicon for edge inference and wireless systems  
**Supporting:** SpandanAI builds analog-native AI silicon for on-device inference and analog signal-path communication workloads.  
**CTA:** Explore Use Cases  

| Phrase | Tag |
|--------|-----|
| Analog-native AI and communication silicon | VERIFIED |
| Silicon for edge inference and wireless systems | SAFE REPHRASING of current supporting line |
| SpandanAI builds analog-native AI silicon | SAFE REPHRASING |
| on-device inference | SAFE REPHRASING of Edge Vision “On-device vision inference” |
| analog signal-path communication workloads | SAFE REPHRASING of wireless card + “communication silicon” |
| “builds” as present-tense productization | **NEEDS STAKEHOLDER CONFIRMATION** (site never says shipping vs design) |

### OPTION 3 — Strong company positioning

**Eyebrow:** Fabless semiconductor company  
**H1:** Analog-native silicon for AI inference and wireless systems  
**Supporting:** SpandanAI builds hybrid analog-digital silicon for edge inference and next-generation communication systems.  
**CTA:** Explore Use Cases  

| Phrase | Tag |
|--------|-----|
| Fabless semiconductor company | VERIFIED (meta description) |
| Analog-native silicon for AI inference and wireless systems | SAFE REPHRASING combining verified hero + meta terms |
| hybrid analog-digital silicon | VERIFIED (meta) |
| edge inference / next-generation communication systems | VERIFIED |
| Using analog-native **and** hybrid analog-digital in one hero | **NEEDS STAKEHOLDER CONFIRMATION** that both may appear together |
| “builds” | **NEEDS STAKEHOLDER CONFIRMATION** (same as Option 2) |

### OPTION 4 — Investor / industry clarity

**Eyebrow:** Fabless semiconductor company  
**H1:** AI inference and communication silicon  
**Supporting:** SpandanAI is a fabless semiconductor company working on analog-native silicon for edge inference and wireless systems.  
**CTA:** Explore Use Cases  

| Phrase | Tag |
|--------|-----|
| Fabless semiconductor company | VERIFIED |
| AI inference and communication silicon | SAFE REPHRASING of meta + eyebrow |
| SpandanAI is a fabless semiconductor company | VERIFIED (meta opening) |
| analog-native silicon for edge inference and wireless systems | VERIFIED / SAFE REPHRASING |
| Dropping “hybrid analog-digital” from the hero | SAFE as omission, not a new claim |

### OPTION 5 — Minimal premium semiconductor-brand style

**Eyebrow:** SpandanAI  
**H1:** Analog-native AI silicon  
**Supporting:** For edge inference and wireless systems.  
**CTA:** Explore Use Cases  

| Phrase | Tag |
|--------|-----|
| All lines | VERIFIED fragments of current hero |
| Omitting “communication” from H1 | SAFE omission; communication remains in use cases / meta |

### Ranking

1. **Option 4** — clearest company category in 5 seconds; stays inside verified vocabulary; does not force analog-native and hybrid analog-digital into the same sentence  
2. Option 1 — safest visually/verbally; H1 still somewhat jargon-first  
3. Option 3 — strong if stakeholders confirm dual terminology and “builds”  
4. Option 5 — elegant, slightly too thin for partners/investors  
5. Option 2 — best for engineers, highest confirmation load (“builds”, “workloads”)

---

## 6. Recommended Hero Direction

**RECOMMENDED: Option 4**

**PROPOSAL ONLY — NOT IMPLEMENTED**

| Element | Proposed |
|---------|----------|
| Eyebrow | Fabless semiconductor company |
| H1 | AI inference and communication silicon |
| Supporting | SpandanAI is a fabless semiconductor company working on analog-native silicon for edge inference and wireless systems. |
| CTA | Explore Use Cases |

### Why

- Header already shows **SpandanAI**; the H1 can carry category, not the logo again.
- “Fabless semiconductor company” is **already published** in metadata; moving it on-page closes the 5-second gap for investors and general visitors.
- H1 names the two work areas already in the meta description (AI inference, communication) without introducing ASIC / mixed-signal / accelerator language.
- Supporting line keeps **analog-native** (current public technical identity) and **edge / wireless** (current hero).
- Avoids asserting that analog-native = hybrid analog-digital.
- Uses “working on” rather than “builds/shipping” (**SAFE REPHRASING** of “building” in the existing meta). If stakeholders prefer the meta’s “building,” that word can be reused as **VERIFIED**.

### Hero hierarchy type

This is **Option Type B** from the analysis:

- Eyebrow = company category  
- H1 = technical value / work area  
- Supporting = name + analog-native + applications  

**UX:** Category is readable before the large type; brand remains in the nav.  
**SEO:** H1 is descriptive, not a duplicate of the title-only brand.  
**Brand:** Wordmark stays in the header; hero does not abandon SpandanAI (it appears in the supporting sentence).  
**Downside:** Eyebrow is no longer the current “Analog-Native…” badge; that phrase moves into the supporting line. If the badge is considered a locked brand lockup, use Option 1 instead.

Longer H1 will wrap inside existing `max-w-4xl` / `text-5xl sm:text-6xl lg:text-7xl`. Phase 2B should **not** restyle the hero; wrapping is acceptable.

---

## 7. Title Tag Options

Current: `SpandanAI` — verified, too generic.

| # | Proposed title | Clarity | Keywords | Accuracy | Brand | Length | Overclaim risk |
|---|----------------|---------|----------|----------|-------|--------|----------------|
| T1 | SpandanAI \| Analog-Native AI and Communication Silicon | High | High (site’s own phrase) | VERIFIED eyebrow | Strong | ~54 chars | Low |
| T2 | SpandanAI \| Fabless Semiconductor Company | High for category | Medium | VERIFIED meta | Strong | ~42 chars | Low |
| T3 | SpandanAI \| AI Inference and Communication Silicon | High | High | SAFE REPHRASING of meta | Strong | ~52 chars | Low |
| T4 | SpandanAI \| Analog-Native AI Silicon | Medium (drops comms) | Medium | VERIFIED fragment | Strong | ~36 chars | Low but incomplete |
| T5 | SpandanAI — Analog-native silicon for edge inference and wireless systems | Very high | High | VERIFIED supporting line | Name first | Long (~78; may truncate) | Low |

**Recommended title: T3** — `SpandanAI | AI Inference and Communication Silicon`

**PROPOSAL ONLY**

Aligns with recommended H1. Keeps the brand first for search snippets. Does not require resolving analog-native vs hybrid analog-digital in the tab title. T1 is the fallback if stakeholders want the exact current eyebrow in SERPs.

---

## 8. Meta Description Options

Current description is already the strongest category sentence on the site. Improvements should be light.

**M1 — Keep current (recommended if no alignment work)**  
`SpandanAI is a fabless semiconductor company building hybrid analog-digital silicon for AI inference and next-generation communication systems.`  
**VERIFIED.** ~148 characters.

**M2 — Align with analog-native (recommended if Option 4 hero ships)**  
`SpandanAI is a fabless semiconductor company working on analog-native silicon for AI inference and wireless communication systems.`  
Tags: fabless / analog-native / AI inference **VERIFIED**; “working on” **SAFE REPHRASING** of “building”; “wireless communication systems” **SAFE REPHRASING** of hero “wireless systems” + meta “communication systems”.  
**Drops “hybrid analog-digital”** unless stakeholders want both sentences (then do not use M2).

**M3 — Maximum category + applications**  
`SpandanAI is a fabless semiconductor company developing analog-native silicon for edge AI inference and wireless systems, including vision, traffic, and communication infrastructure.`  
“developing” **NEEDS STAKEHOLDER CONFIRMATION**. Listing use cases is **VERIFIED** but crowded for a snippet.

**Recommended meta: M2** if Option 4 is approved; otherwise **keep M1**.

**PROPOSAL ONLY**

Do not keyword-stuff “AI semiconductor” twice.

---

## 9. Open Graph / Twitter Proposal

| Field | Current | Proposal |
|-------|---------|----------|
| `og:title` | SpandanAI | **CHANGE** to match recommended `<title>` (T3) |
| `og:description` | same as meta | **CHANGE** to match recommended meta (M1 or M2) |
| `og:image` | https://spandanai.com/images/og-image.png | **KEEP** (file exists, 1200×630) |
| `og:url` | https://spandanai.com/ | **KEEP** |
| `og:type` | website | **KEEP** |
| `twitter:card` | summary_large_image | **KEEP** |
| `twitter:title` | SpandanAI | **CHANGE** with `og:title` |
| `twitter:description` | same as meta | **CHANGE** with `og:description` |
| `twitter:image` | same OG image | **KEEP** |

Social previews should use the **same** title/description as SEO metadata for this one-page site. Do not write a separate “punchier” OG line that introduces new claims.

Optional later (not Phase 2B required): `og:site_name` = SpandanAI, `og:locale` = en. Low value.

---

## 10. Heading Hierarchy Proposal

**Current:** 1× h1 (brand) + 3× h2 (use cases, team, contact). Eyebrows stay `<p>`. Card titles stay `<p>`.

**Proposed for Phase 2B (hero only unless stakeholders expand scope):**

```
h1  AI inference and communication silicon     (Option 4)
h2  Deployment surfaces for analog-native AI silicon.
h2  Founding engineering and product leadership.
h2  Engage with SpandanAI.
```

Do **not** promote card labels to h3 in Phase 2B (would create four extra headings without new pages; optional later).

Do **not** add a second h1.

Visual badge/eyebrow remains `<p>` even if copy changes.

**Out of scope:** rewriting the three H2 sentences (“Deployment surfaces…”, “Engage with SpandanAI.”) — they are jargon-heavy but not this phase’s hero/SEO title job unless stakeholders ask.

---

## 11. Alt-Text / Brand Semantics

Do **not** remove visible “SpandanAI” in the header or footer.

| Image | Current alt | Recommendation | Why |
|-------|-------------|----------------|-----|
| Header logo (`Header.jsx`) next to visible span “SpandanAI” | `SpandanAI` | `alt=""` | Decorative; adjacent text is the accessible name of the home link |
| Footer logo (`Footer.jsx`) above visible “SpandanAI” | `SpandanAI` | `alt=""` | Same; avoid double announcement |
| Team photos | person’s name | **KEEP** | Informative |
| OG image | n/a (meta) | **KEEP** | Not an `<img>` |

The home link should still have an accessible name via the visible wordmark (and may add `aria-label="SpandanAI home"` **only if** testing shows the empty alt + text combo is insufficient). Prefer empty alt first; do not stack `alt="SpandanAI"` **and** aria-label.

This is **accessibility cleanup**, not an SEO trick. Visible brand repetition in nav/footer is **good brand repetition**.

---

## 12. Organization JSON-LD Proposal

**Do not insert into production in Phase 2A.**

Proposed object — only fields we can defend:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "SpandanAI",
  "url": "https://spandanai.com/",
  "logo": "https://spandanai.com/images/og-image.png",
  "email": "spandanai.sard@gmail.com",
  "description": "SpandanAI is a fabless semiconductor company building hybrid analog-digital silicon for AI inference and next-generation communication systems."
}
```

| Field | Decision | Tag |
|-------|----------|-----|
| `@context` / `@type` | Include | standard |
| `name` | Include | VERIFIED |
| `url` | Include | VERIFIED canonical |
| `logo` | Include | VERIFIED asset; **og-image.png** is a safer absolute logo URL for crawlers than the small header WebP. Alternative `/images/logo-light.webp` is also VERIFIED if stakeholders prefer the mark-only file. |
| `email` | Include | VERIFIED public contact |
| `description` | Include | VERIFIED current meta (or M2 if approved) |
| `sameAs` | **OMIT FOR NOW** | LinkedIn URLs not in repo — **NEEDS STAKEHOLDER INPUT** later |
| `foundingDate` | **OMIT FOR NOW** | not in source |
| `founders` | **OMIT FOR NOW** | names on page ≠ confirmed schema founders |
| `address` / `telephone` / `legalName` | **OMIT FOR NOW** | not in source |
| `identifier` / tax / funding | **OMIT FOR NOW** | not in source |

Implementation note for Phase 2B: one `<script type="application/ld+json">` in `index.html`. Current CSP allows `'self'` scripts; JSON-LD as inline script in HTML is typically fine (not an external script). Confirm at implementation time that Vercel CSP `script-src 'self'` still allows this inline JSON-LD; if not, that is a **Phase 2B engineering check**, not a reason to skip the proposal. (If CSP blocked it, JSON-LD would need a `'unsafe-inline'` exception for that tag or a file on-origin — decide then, do not widen CSP in this proposal.)

Correction: JSON-LD in a script tag is inline script. Current CSP is `script-src 'self'` **without** `'unsafe-inline'`. **JSON-LD may not execute as a script** (crawlers parse it as data in HTML). Google reads JSON-LD from the HTML; browsers do not “run” it. CSP still applies to script elements. **NEEDS Phase 2B check:** if CSP strips or blocks the tag, use a same-origin `.json` linked somehow, or a documented CSP exception limited to this snippet. Do not guess a CSP change now.

Safer Phase 2B approach: add JSON-LD in `index.html` and verify with `curl` that the tag is present in the **built** HTML (it will be, because `index.html` is static). CSP on Vercel applies to browser execution; Googlebot reads the HTML. Proceed with inline JSON-LD; do not change CSP unless a real browser console error appears (unlikely to matter for SEO).

---

## 13. Sitemap / Robots / Canonical Review

### Sitemap (`public/sitemap.xml`)

- **One URL is correct** for this SPA.
- **Do not** add `#use-cases`, `#team`, `#contact` as sitemap URLs (not separate documents).
- **`lastmod` 2026-07-04 is stale.** Update to the date of the next **content** deploy (Phase 2B), not today, and not for docs-only Git commits.
- `changefreq` / `priority` are **unnecessary**; omit.

### Robots (`public/robots.txt`)

```
User-agent: *
Allow: /

Sitemap: https://spandanai.com/sitemap.xml
```

**Appropriate. KEEP.** No Phase 2B change unless a new reason appears.

### Canonical

`https://spandanai.com/` in `index.html` matches `og:url` and sitemap `<loc>` (HTTPS, host without `www`, trailing slash). **KEEP.** No www/http variants in source. Vercel host aliases are a dashboard concern, not an `index.html` change.

---

## 14. Terminology Consistency

| Term | On site today? | Notes |
|------|----------------|-------|
| analog-native | Yes (hero, Use Cases H2) | Treat as **official visible** phrasing until told otherwise |
| analog-native AI silicon | Yes | |
| Analog-Native AI and Communication Silicon | Yes (eyebrow) | Title-case badge |
| hybrid analog-digital silicon | Yes (meta only) | Not on visible hero |
| fabless semiconductor company | Yes (meta, README) | Not on visible hero |
| AI inference | Yes (meta, contact) | |
| edge inference | Yes (hero, use-case lede) | |
| Edge AI inference silicon | Yes (contact) | |
| wireless systems | Yes (hero) | |
| wireless communication | Yes (contact: Analog wireless communication) | |
| communication silicon / communication systems | Yes (eyebrow / meta) | |
| next-generation communication systems | Yes (meta) | Mildly promotional adjective; already published |
| analog signal-path | Yes (one use case) | |
| silicon architecture | Yes (team blurb) | Role description, not a product name |
| semiconductor | Yes (meta, README) | |
| mixed-signal | **No** | DO NOT USE WITHOUT STAKEHOLDER CONFIRMATION |
| analog ASIC / mixed-signal ASIC | **No** | DO NOT USE |
| AI accelerator / hardware accelerator | **No** | DO NOT USE |
| communication IC | **No** | DO NOT USE |
| ASIC / IC | **No** on the live page (Cryo-CMOS requirement text is not shipped) | DO NOT USE in Phase 2B hero/meta |

**Material distinction:** “analog-native,” “hybrid analog-digital,” and “mixed-signal” are not interchangeable. Phase 2B should **not** normalize them. Option 4 keeps analog-native on-page and leaves hybrid analog-digital in meta unless stakeholders pick M1 (keep meta) or explicitly allow both in one view.

README currently mixes “fabless semiconductor company” + “analog-native silicon” — documentation, not the live hero.

---

## 15. Stakeholder Confirmation Needed

Only questions that change correctness:

1. Is **“fabless semiconductor company”** the preferred **on-page** category (it is already in the meta description)?
2. Should public technical language stay **“analog-native”**, stay **“hybrid analog-digital”**, or may **both** appear (hero vs meta)?
3. Prefer **“building”** (current meta) or **“working on”** (more conservative) for what the company does?
4. Confirm **AI inference** (not training) is the intended public AI scope — the site already says inference, but saying so in the H1 makes it more prominent.
5. Optional: provide a company **LinkedIn URL** for future `sameAs` (not required for Phase 2B JSON-LD).

Do not block Phase 2B on question 5.

If (1) is “no,” implement **Option 1** instead of Option 4.  
If (2) is “keep both phrases as-is,” use **M1** meta and do not introduce hybrid analog-digital into the hero.

---

## 16. Exact Proposed Phase 2B Changes

Application files only after written approval. No Cryo-CMOS, LinkedIn, photo, or animation work.

### `index.html`

- `<title>` → recommended T3 (or T1 if requested)
- `meta name="description"` → M2 or keep M1
- `og:title` / `twitter:title` → same as title
- `og:description` / `twitter:description` → same as meta description
- **KEEP** canonical, og:url, og:image, og:type, twitter:card, twitter:image, favicons
- Add Organization JSON-LD script with only approved fields (section 12)

### `src/components/Hero.jsx`

- Eyebrow, H1, supporting sentence → Option 4 (or Option 1 if fabless-on-page is rejected)
- **KEEP** CTA, canvas, layout, classes

### `src/components/Header.jsx`

- Logo `alt=""` if approved (section 11)
- **KEEP** visible “SpandanAI” text

### `src/components/Footer.jsx`

- Logo `alt=""` if approved
- **KEEP** visible “SpandanAI” text

### `public/sitemap.xml`

- Update `lastmod` **only when Phase 2B content actually deploys**
- Do not add hash URLs

### `public/robots.txt`

- No change

### Files Phase 2B should not need

`src/data/siteContent.js`, `Applications.jsx`, `Founders.jsx`, `Contact.jsx`, `NeuralNetworkBackground.jsx`, `vercel.json`, `package.json`, Tailwind/PostCSS.

---

## 17. Things Phase 2B Must NOT Touch

- Neuron / canvas animation behavior (`NeuralNetworkBackground.jsx`)
- Use Cases card content (`siteContent.js` / `Applications.jsx`)
- Cryo-CMOS use case
- Team cards, names, photos, bios
- LinkedIn links
- Team group photograph
- Contact form / mailto behavior / email address
- Overall layout, color system, Framer Motion section reveals
- Vercel deployment source, headers (except a later documented CSP discussion **only if** JSON-LD is blocked — default: do not touch `vercel.json`)
- New routes or a move off the SPA
- Hidden keywords, fake FAQ, extra pages for SEO

---

## Appendix — 5-second test (analysis)

| Visitor | Semiconductor company? | What kind of work? | AI = silicon? | Applications? | Distinctive? | Biggest ambiguity |
|---------|------------------------|--------------------|---------------|---------------|--------------|-------------------|
| Semiconductor engineer | Weak on-page (clearer in meta) | Analog-native silicon, incomplete | Mostly yes | After scroll | “Analog-native” unexplained | Analog-native vs mixed-signal vs analog compute |
| Customer / partner | Partial | Edge + wireless if they read the subtitle | Possible confusion with an AI software shop | Use cases help after scroll | Unclear | Product vs research vs services |
| Investor | Weak | Two markets named quietly | Unclear until subtitle | Weak in 5s | Weak | Is this a chip company? Meta says yes; H1 does not |
| Researcher | Partial | Thin | Yes-ish | Partial | No pubs/architecture | Academic vs startup vs IP |
| Potential employee | Weak | Titles later | Unclear | Weak | Weak | What would I work on day one? |
| General tech visitor | No | “AI” in the badge | Likely thinks software | No | No | Brand-only H1 |

---

## Appendix — H1 structure types (not implemented)

| Type | UX | SEO | Brand | Downside | Verdict |
|------|----|-----|-------|----------|---------|
| A: Eyebrow = SpandanAI, H1 = positioning | Strong if nav already brands | Strong | Name still in nav + eyebrow | Duplicate name in eyebrow + header | Good (Option 1 / 5) |
| B: Eyebrow = category, H1 = work statement | Best 5-second category | Strong | Name in nav + supporting line | Badge copy changes | **Recommended (Option 4)** |
| C: H1 = “SpandanAI — …” | Familiar | OK; long | Name in H1 | Restates header; awkward at text-7xl | Acceptable fallback (T5-like), not preferred |

---

## Appendix — Term-by-term public-language policy

| Term | Policy |
|------|--------|
| fabless semiconductor company | CURRENTLY SUPPORTED BY SOURCE (meta). On-page use: **LIKELY SAFE BUT SHOULD BE APPROVED** (question 1) |
| semiconductor company | Supported as subset of fabless phrase; weaker |
| analog-native AI silicon | CURRENTLY SUPPORTED (hero) |
| hybrid analog-digital silicon | CURRENTLY SUPPORTED (meta only). Do not treat as synonym |
| mixed-signal silicon | **DO NOT USE WITHOUT STAKEHOLDER CONFIRMATION** |
| AI inference silicon | CURRENTLY SUPPORTED |
| edge AI silicon | CURRENTLY SUPPORTED (contact) |
| wireless communication silicon | LIKELY SAFE (compose verified fragments) — still confirm if used as a product name |
| analog ASIC / mixed-signal ASIC / AI accelerator / hardware accelerator / communication IC / semiconductor architecture (as a product class) | **DO NOT USE WITHOUT STAKEHOLDER CONFIRMATION** |

---

*End of Phase 2A proposal. No production source was modified.*
