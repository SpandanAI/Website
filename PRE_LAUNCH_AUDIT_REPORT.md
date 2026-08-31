# Pre-Launch Audit Report — SpandanAI Landing Page

**Audit date:** July 4, 2026  
**Project path:** (local filesystem path omitted from the public repository)  

**Auditor scope:** Full codebase inspection, production build verification, preview-server HTTP checks, dependency audit (npm registry), security pattern scan. **No source code was modified.**

---

# Part 1 – Project Overview

| Item | Finding |
|------|---------|
| **Framework** | React 19.2.5 (SPA, client-rendered) |
| **Build tool** | Vite 8.0.10 |
| **CSS** | Tailwind CSS 3.4.19 + PostCSS (`postcss.config.cjs`) |
| **Animation library** | Framer Motion 12.38.0 |
| **Package manager** | npm (`package-lock.json` present) |
| **Deployment target** | Vercel (project linked: `spandanai`, see `.vercel/project.json`) |
| **Site type** | **Static SPA** — single `index.html`, hash-based in-page navigation (`#home`, `#use-cases`, `#team`, `#contact`) |
| **Backend / serverless** | **None.** No API routes, no serverless functions, no database layer. Contact form uses `mailto:` client-side redirect only. |
| **External APIs / services** | **None** at runtime. No `fetch()`, axios, analytics SDKs, fonts CDN, or third-party embeds detected. |
| **Environment variables required** | **None.** No `import.meta.env`, `process.env`, or `.env` files found. The site runs entirely from static assets and hard-coded content. |

### Application structure

- **Entry:** `index.html` → `src/main.jsx` → `src/App.jsx`
- **Content data:** `src/data/siteContent.js` (navigation links, use-case tabs)
- **Components:** 10 UI components under `src/components/`
- **Shared utilities:** `src/lib/animations.js`, `src/lib/activeNavEvent.js`
- **Static assets:** `public/images/` (logos, hero background)

### Notable metadata mismatches

- `package.json` name is `neutral-ai-landing-page` while the site brand is **SpandanAI**.
- README describes the project correctly as SpandanAI; package name was not updated.

---

# Part 2 – Production Readiness

## Build verification

| Check | Status | Details |
|-------|--------|---------|
| Production build succeeds | ✅ Pass | `npm run build` completed in ~442ms with exit code 0 |
| Build warnings | ✅ Pass | No warnings emitted during build |
| Broken imports | ✅ Pass | Build resolves 428 modules without error |
| Source maps in production output | ✅ Pass | No `.map` files in `dist/` (Vite default) |

**Build output:**

```
dist/index.html                   0.59 kB │ gzip:   0.36 kB
dist/assets/index-CWy7kr65.css   16.54 kB │ gzip:   4.44 kB
dist/assets/index-B_BEgT60.js   336.12 kB │ gzip: 106.25 kB
Total dist size: ~4.7 MB (dominated by images)
```

## Assets

| Asset | Referenced in code | Size | Status |
|-------|-------------------|------|--------|
| `/images/logo-dark.png` | `Header.jsx` (scrolled state) | 79 KB | ✅ Present |
| `/images/logo-light.png` | `Header.jsx`, `Footer.jsx` | **2.1 MB** | ⚠️ Present but oversized |
| `/images/wave-background.png` | `Hero.jsx` (CSS background) | 55 KB | ✅ Present |
| `/images/logo.png` | Not referenced | 2.1 MB | ⚠️ Unused, still deployed |
| `/images/IMG-20260501-WA0019.jpg` | Not referenced | 13 KB | ⚠️ Unused, still deployed |

All referenced assets return HTTP 200 on the Vite preview server. Unused assets are copied to `dist/images/` by Vite and will be deployed to Vercel, adding ~4.2 MB of unnecessary payload.

## Routes and links

| Check | Status | Details |
|-------|--------|---------|
| Client routes | ✅ N/A | Single-page app; no React Router or multi-page routes |
| In-page anchor links | ✅ Pass | `#home`, `#use-cases`, `#team`, `#contact` all map to section `id` attributes |
| External links | ✅ Pass | Only `mailto:contact@spandanai.com` links |
| Broken links | ✅ Pass | No dead internal or external HTTP links detected in source |

**Preview-server checks (port 4173):**

- `/` → 200
- `/images/logo-dark.png` → 200
- `/images/wave-background.png` → 200
- `/assets/index-*.js` → 200
- `/favicon.ico` → **404**
- `/robots.txt` → **200 but returns `index.html`** (SPA fallback from Vite preview; on Vercel static hosting this path will **404** unless a file is added)

## UI / UX readiness

| Check | Status | Details |
|-------|--------|---------|
| Responsive layout | ✅ Pass | Tailwind breakpoints (`sm:`, `md:`, `lg:`) used throughout; mobile nav drawer implemented |
| Favicon | ❌ Fail | No favicon file or `<link rel="icon">` in `index.html` |
| Loading behavior | ✅ Pass | No flash-of-unstyled-content issues observed; CSS bundled in `<head>` |
| Image optimization | ⚠️ Partial | Hero background is reasonably sized; logo PNGs are extremely large for display size (40px CSS height) |
| Font optimization | ✅ Pass | System font stack via Tailwind defaults; no external font requests |
| Production configuration | ⚠️ Partial | `vercel.json` defines build/output; no `vite.config.*` for production tuning; dependencies pinned as `"latest"` for React and Vite |

### Visual defect (non-blocking but user-visible)

`Footer.jsx` renders `logo-light.png` (designed for dark backgrounds) on a light `bg-surface` footer. This likely produces poor contrast or an nearly invisible logo in production.

---

# Part 3 – Security Audit

This is a **fully static, client-only marketing site** with no authentication, no user data persistence, and no server-side processing. Several server-side security categories are therefore **not applicable** (see notes below).

## Secrets and credentials

| Check | Status | Details |
|-------|--------|---------|
| API keys / tokens / passwords in source | ✅ Pass | None found |
| `.env` files committed | ✅ N/A | No `.env` files exist |
| Secrets in client bundle | ✅ Pass | No environment variables or secrets referenced |
| `.vercel/project.json` | ℹ️ Info | Contains `projectId` and `orgId` (Vercel metadata, not secrets). Vercel docs recommend not committing `.vercel/`; `.gitignore` includes `.vercel` |

## XSS and DOM injection

| Check | Status | Details |
|-------|--------|---------|
| `dangerouslySetInnerHTML` | ✅ N/A | Not used anywhere |
| `innerHTML` / `eval()` / `document.write` | ✅ N/A | Not used |
| Unsanitized user input rendered to DOM | ✅ N/A | Contact form data is encoded into a `mailto:` URL via `encodeURIComponent()` and never injected into the React tree |
| DOM injection via URL | ✅ Low risk | Hash anchors only; no URL-parameter-driven rendering |

**Contact form note:** User input is passed to `window.location.href` as a `mailto:` link. This is safe from XSS on the page itself. The only risk is a user opening their own mail client with crafted content — acceptable for a contact form.

## Network security

| Check | Status | Details |
|-------|--------|---------|
| HTTP (non-TLS) resources | ✅ Pass | No `http://` URLs in source |
| External fetch calls | ✅ N/A | No runtime network requests |
| HTTPS on Vercel | ✅ Ready | Vercel provides automatic HTTPS for custom domains and `*.vercel.app` |

## Security headers

| Header | Status | Recommendation |
|--------|--------|----------------|
| Content-Security-Policy | ❌ Missing | Not configured in `vercel.json` or meta tags. Vercel does not add CSP by default. |
| X-Frame-Options / `frame-ancestors` | ❌ Missing | Recommend `X-Frame-Options: DENY` or CSP `frame-ancestors 'none'` for clickjacking protection |
| Referrer-Policy | ❌ Missing | Recommend `strict-origin-when-cross-origin` |
| Permissions-Policy | ❌ Missing | Recommend restricting unused features: `camera=(), microphone=(), geolocation=()` |
| Strict-Transport-Security | ℹ️ Vercel-managed | HSTS is applied by Vercel on HTTPS deployments |
| X-Content-Type-Options | ℹ️ Vercel partial | Consider explicit `nosniff` via headers config |

**Suggested `vercel.json` headers block (for future implementation):**

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self' mailto:"
        }
      ]
    }
  ]
}
```

Adjust CSP if analytics or external fonts are added later.

## Dependencies

| Check | Status | Details |
|-------|--------|---------|
| `npm audit` (registry.npmjs.org) | ⚠️ 1 high | **vite@8.0.10** — two advisories affecting the **Vite dev server on Windows** (NTLM hash disclosure, `server.fs.deny` bypass). **Not a production runtime risk** because Vite is a devDependency and is not shipped to users. Fix: upgrade to vite ≥ 8.1.3. |
| Runtime dependencies | ✅ Pass | react, react-dom, framer-motion — no known production CVEs reported in this audit |
| Unpinned `"latest"` versions | ⚠️ Medium | `react`, `react-dom`, and `vite` use `"latest"` in `package.json`, reducing build reproducibility |

## Debug / observability

| Check | Status | Details |
|-------|--------|---------|
| `console.log` / debug statements | ✅ Pass | None in `src/` |
| Production source maps exposed | ✅ Pass | No `.map` files in `dist/` |
| Dev-only code in bundle | ✅ Pass | Standard Vite production tree-shaking; React StrictMode wraps app (harmless in prod) |

## Other security notes

- **No git repository** detected at project root. Version control, branch protection, and secret scanning are not yet in place.
- **`.gitignore` contains only `.vercel`**. If git is initialized, `node_modules/`, `dist/`, and OS files should be added before first commit.
- **Canvas animation (`NeuralNetworkBackground.jsx`)** runs a continuous `requestAnimationFrame` loop. Not a security issue, but increases CPU usage (see Performance).

---

# Part 4 – Vercel Deployment Review

| Item | Status | Details |
|------|--------|---------|
| **Build command** | ✅ Configured | `npm run build` (in `vercel.json` and `package.json`) |
| **Output directory** | ✅ Configured | `dist` |
| **Framework preset** | ✅ Compatible | Vite static output; Vercel auto-detects or uses explicit config |
| **SPA routing** | ✅ N/A | Single-page with hash navigation only; no client-side path routing (`/about`, etc.) |
| **Rewrites needed** | ✅ N/A | No multi-route SPA; only `/` is required |
| **Asset paths** | ✅ Pass | Absolute paths (`/assets/...`, `/images/...`) work on Vercel root deployment |
| **Environment variables** | ✅ N/A | None required in Vercel dashboard |
| **Custom domain readiness** | ⚠️ Mostly ready | Project already linked to Vercel (`spandanai`). DNS can be attached once content/SEO polish is acceptable |
| **HTTPS readiness** | ✅ Ready | Automatic TLS on Vercel; no mixed-content issues in codebase |
| **`vercel.json` completeness** | ⚠️ Minimal | Only `buildCommand` and `outputDirectory`; no security headers, redirects, or caching rules |

### Vercel project linkage

```
projectName: spandanai
projectId:   [redacted — local Vercel link metadata; not committed]
```

The site appears previously deployed to Vercel. Connecting a custom domain is primarily a DNS + Vercel dashboard step once launch criteria are met.

---

# Part 5 – SEO Review

| Item | Status | Details |
|------|--------|---------|
| `<title>` | ⚠️ Minimal | `SpandanAI` — functional but not keyword-rich (e.g., missing "Analog AI Silicon" descriptor) |
| Meta description | ✅ Present | Set in `index.html` — describes fabless semiconductor / AI inference focus |
| Favicon | ❌ Missing | No favicon file or link tag |
| `robots.txt` | ❌ Missing | No file in `public/`; will 404 on Vercel |
| `sitemap.xml` | ❌ Missing | No sitemap; acceptable for a single-page site but still recommended for crawlers |
| Canonical URL | ❌ Missing | No `<link rel="canonical">`; important once custom domain is live to avoid duplicate indexing (`*.vercel.app` vs production domain) |
| Open Graph tags | ❌ Missing | No `og:title`, `og:description`, `og:image`, `og:url` |
| Twitter Card tags | ❌ Missing | No `twitter:card`, `twitter:title`, etc. |
| Structured data (Schema.org) | ❌ Missing | No JSON-LD for `Organization`, `WebSite`, or `ContactPoint` |
| `lang` attribute | ✅ Present | `<html lang="en">` |
| Heading hierarchy | ✅ Pass | Single `<h1>` in Hero; sections use `<h2>` via `SectionHeading` |
| Semantic HTML | ✅ Good | `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<article>` used appropriately |

### Accessibility issues affecting SEO

| Issue | Impact |
|-------|--------|
| Missing favicon | Reduced brand recognition in browser tabs and search snippets |
| Footer logo contrast | Possible brand visibility issue; not a direct SEO penalty but affects perceived quality |
| Contact form inputs lack `required` | UX/accessibility; empty submissions possible |
| No skip-to-content link | Minor accessibility gap for keyboard users |
| Canvas hero animation always running | May affect performance signals (indirect SEO via Core Web Vitals) |

---

# Part 6 – Performance

## Bundle analysis

| Asset | Raw size | Gzip | Notes |
|-------|----------|------|-------|
| `index-*.js` | 336 KB | 106 KB | Single bundle; no code splitting |
| `index-*.css` | 17 KB | 4.4 KB | Tailwind purged output — reasonable |
| Images (total in dist) | ~4.3 MB | — | Dominated by two 2.1 MB logo PNGs |

## Code splitting and lazy loading

| Pattern | Status |
|---------|--------|
| `React.lazy()` / dynamic `import()` | ❌ Not used |
| Route-based splitting | ❌ N/A (single page) |
| Component lazy loading | ❌ Not used — entire app + Framer Motion loaded upfront |

Framer Motion and React 19 comprise the majority of the 336 KB JS bundle. For a landing page this is acceptable but not optimal.

## Image optimization

| Issue | Severity | Details |
|-------|----------|---------|
| Oversized logo PNGs | **High** | Logos displayed at 40px height (` .logo` class) but source files are up to 1536×1024 px and 2.1 MB each |
| Unused images deployed | Medium | `logo.png`, `IMG-20260501-WA0019.jpg` add weight without use |
| Hero background | ✅ Good | `wave-background.png` at 55 KB is reasonable |
| Modern formats (WebP/AVIF) | ❌ Not used | PNG/JPEG only |
| Responsive `srcset` | ❌ Not used | Single image URLs |

## Font loading

✅ No external fonts — uses system UI stack. Zero font-loading latency.

## Animation performance

| Component | Concern |
|-----------|---------|
| `NeuralNetworkBackground.jsx` | Runs continuous `requestAnimationFrame` with O(n²) line-drawing (~80 nodes, ~3,160 distance checks/frame). Mousemove + resize listeners active for entire hero visibility. **Primary CPU/GPU concern**, especially on mobile. |
| `Hero.jsx` parallax | Scroll-linked transform via rAF — moderate; disabled when `prefers-reduced-motion` |
| Framer Motion | Used extensively; `useReducedMotion()` respected in several components |
| `ScrollProgressBar` / `ScrollToTopButton` / `Header` | Each registers separate scroll listeners — minor duplication |

## Memory leaks

✅ Components reviewed (`NeuralNetworkBackground`, `Hero`, `Header`, `ScrollProgressBar`, `ScrollToTopButton`) properly remove event listeners and cancel animation frames in `useEffect` cleanup.

## Core Web Vitals opportunities

| Metric | Risk | Mitigation |
|--------|------|------------|
| **LCP** | Medium | Large hero background + JS hydration before paint; optimize logos, consider static hero fallback |
| **INP** | Low–Medium | Canvas mouse tracking may compete on low-end devices |
| **CLS** | Low | Fixed layout; images have explicit dimensions or CSS sizing |
| **TBT** | Medium | 336 KB JS parse/execute on main thread before interactivity |

---

# Part 7 – Code Quality

## Folder structure

```
src/
├── App.jsx              # Page composition
├── main.jsx             # React entry
├── index.css            # Global styles + Tailwind
├── components/          # 10 presentational/feature components
├── data/siteContent.js  # Editable content constants
└── lib/                 # Shared animation + event constants
public/
└── images/              # Static assets
```

**Assessment:** Clean, flat structure appropriate for a small landing page. Easy to navigate and extend.

## Maintainability

| Aspect | Rating | Notes |
|--------|--------|-------|
| Component organization | Good | One component per section; clear responsibilities |
| Content separation | Good | Nav links and use cases in `siteContent.js` |
| Naming consistency | Good | PascalCase components, camelCase utilities |
| Reusability | Good | `SectionHeading`, shared animation variants |
| Error handling | Minimal | No error boundaries; acceptable for static marketing site |
| Logging | Clean | No console noise |
| Type safety | None | Plain JSX without TypeScript |
| Tests | None | No unit, integration, or E2E tests |

## Architecture

- **Pattern:** Presentational React SPA with scroll-driven navigation state (`IntersectionObserver` in `Header.jsx`, custom event in `activeNavEvent.js`).
- **State management:** Local `useState` / refs only; no global store (appropriate for scope).
- **Styling:** Tailwind utility classes + small amount of custom CSS in `index.css`.
- **Accessibility patterns:** Good use of `aria-label`, `aria-expanded`, `aria-hidden`, nested `<label>` elements for form fields, `prefers-reduced-motion` support.

## Technical debt

1. `"latest"` dependency ranges in `package.json`
2. No `vite.config.js` for explicit production settings (chunk splitting, asset inline limits)
3. Package name / branding mismatch
4. Unused assets and dead weight in deployment
5. No version control initialized

---

# Part 8 – Final Launch Checklist

| Severity | Category | Issue | File(s) | Recommended Fix |
|----------|----------|-------|---------|-----------------|
| High | Performance | Logo images are 2.1 MB each but displayed at 40px height | `public/images/logo-light.png`, `public/images/logo.png`, `Header.jsx`, `Footer.jsx` | Resize/compress logos (target <20 KB each); convert to WebP/AVIF; use `logo-dark.png` in footer |
| High | SEO / Brand | No favicon configured | `index.html`, `public/` | Add `favicon.ico` (and/or PNG/SVG) + `<link rel="icon" href="/favicon.ico">` |
| High | SEO | No Open Graph or Twitter Card meta tags | `index.html` | Add `og:title`, `og:description`, `og:image`, `og:url`, `twitter:card` tags |
| High | SEO | No canonical URL | `index.html` | Add `<link rel="canonical" href="https://yourdomain.com/">` once domain is known |
| High | UX / Accessibility | Footer uses light logo on light background | `Footer.jsx` | Switch to `logo-dark.png` or a footer-specific asset |
| Medium | Performance | ~4.2 MB of unused images deployed | `public/images/logo.png`, `public/images/IMG-20260501-WA0019.jpg` | Remove unused files from `public/images/` |
| Medium | Performance | Single 336 KB JS bundle, no code splitting | `src/App.jsx`, build config | Lazy-load `NeuralNetworkBackground` or defer non-critical animations |
| Medium | Performance | Continuous canvas animation on hero | `NeuralNetworkBackground.jsx` | Pause animation when off-screen (`IntersectionObserver`) or on mobile; respect `prefers-reduced-motion` (currently only checks at init) |
| Medium | Security | No security headers configured | `vercel.json` | Add CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy headers |
| Medium | SEO | Missing `robots.txt` and `sitemap.xml` | `public/robots.txt`, `public/sitemap.xml` | Add both; sitemap can list single URL with lastmod |
| Medium | SEO | Page title is generic | `index.html` | Use descriptive title, e.g. `SpandanAI \| Analog-Native AI & Communication Silicon` |
| Medium | Dependencies | Unpinned `"latest"` for React and Vite | `package.json` | Pin to exact or caret versions (e.g. `"react": "^19.2.5"`) |
| Medium | Dependencies | Vite 8.0.10 has high-severity dev-server CVEs | `package.json` | Upgrade Vite to ≥ 8.1.3 (dev-only risk, but good hygiene) |
| Medium | UX | Contact form allows empty submission | `Contact.jsx` | Add `required` on name/email/message fields; basic client-side validation |
| Medium | DevOps | No git repository | Project root | Initialize git; expand `.gitignore` (`node_modules/`, `dist/`, `.env*`) |
| Low | SEO | No Schema.org structured data | `index.html` or new component | Add JSON-LD `Organization` with name, url, email, logo |
| Low | Performance | Multiple independent scroll listeners | `Header.jsx`, `ScrollProgressBar.jsx`, `ScrollToTopButton.jsx`, `Hero.jsx` | Consolidate into one scroll manager (optional optimization) |
| Low | Performance | PostCSS missing `autoprefixer` | `postcss.config.cjs` | Add autoprefixer per Tailwind docs for broader browser CSS compatibility |
| Low | Code Quality | Package name does not match brand | `package.json` | Rename to `spandanai-landing-page` or similar |
| Low | Content | Founder photos are placeholders | `Founders.jsx` | Add team photos or intentional placeholder copy |
| Low | UX | Contact relies on `mailto:` only | `Contact.jsx` | Consider Formspree, Resend, or Vercel serverless endpoint for users without mail clients |
| Informational | Vercel | Minimal `vercel.json` | `vercel.json` | Add cache headers for `/assets/*` (Vercel CDN handles this partially by default) |
| Informational | Content | Unused `logo.png` duplicate of `logo-light.png` | `public/images/logo.png` | Delete duplicate |
| Informational | Security | Static site — no backend attack surface | Entire project | No server-side auth, SQL, or API exposure to harden |
| Informational | Accessibility | No skip navigation link | `App.jsx` / `Header.jsx` | Add visually hidden "Skip to main content" link |
| Informational | SEO | Vercel preview URL may be indexed alongside production | Vercel dashboard | Set `X-Robots-Tag: noindex` on preview deployments (Vercel option) or use `robots.txt` disallow for preview |

---

# Part 9 – Overall Assessment

## Overall Launch Readiness

| Area | Score (/10) | Summary |
|------|-------------|---------|
| **Security** | **8.0** | Static site with no secrets, no XSS vectors, no backend. Missing security headers is the main gap. |
| **Performance** | **6.0** | Build is lean for JS/CSS gzip sizes, but image weight (~4.3 MB) and hero canvas animation hurt real-world load and CPU. |
| **SEO** | **5.0** | Basic title/description exist; missing favicon, OG tags, canonical, robots, sitemap, and structured data. |
| **Accessibility** | **7.0** | Good ARIA and reduced-motion support; gaps in favicon/branding, footer contrast, form validation, skip link. |
| **Code Quality** | **7.5** | Well-organized, readable React code; no tests, no TypeScript, unpinned deps. |
| **Production Readiness** | **7.0** | Build succeeds cleanly; Vercel config works; polish items remain before a professional domain launch. |

## Is this website safe to deploy to production?

**Yes.** There are no critical security vulnerabilities in the production runtime. The site is a static marketing page with no secrets, no user data storage, and no server-side code. Deploying to Vercel with HTTPS is safe from a security standpoint.

The Vite dev-server CVE is **not** exposed in production builds.

## Blockers before connecting the custom domain

**No hard blockers** that make deployment unsafe. The site will function correctly on a custom domain today.

However, the following are **strongly recommended before public launch** on a production domain (brand/SEO/performance impact):

1. Add a favicon
2. Fix footer logo (use dark variant on light background)
3. Compress/resize logo images (multi-MB → KB)
4. Add Open Graph + Twitter Card meta tags
5. Add canonical URL pointing to the production domain
6. Add `robots.txt` (and optional single-URL `sitemap.xml`)
7. Remove unused images from `public/images/`

## Recommended but not required for launch

- Security headers in `vercel.json`
- Schema.org JSON-LD structured data
- Pin dependency versions and upgrade Vite
- Pause hero canvas animation off-screen / on reduced motion
- Contact form backend alternative to `mailto:`
- Initialize git with proper `.gitignore`
- Richer page title for SEO
- Code splitting / lazy loading for animation components
- Founder photos
- Skip-to-content link
- E2E smoke test in CI

---

## Pre-Launch Checklist

Complete these tasks before connecting the production custom domain:

- [ ] Compress and resize `logo-light.png` and `logo-dark.png` to appropriate dimensions (<20 KB each recommended)
- [ ] Fix footer logo asset (`logo-dark.png` on light footer background)
- [ ] Remove unused assets: `public/images/logo.png`, `public/images/IMG-20260501-WA0019.jpg`
- [ ] Add favicon (`public/favicon.ico` or SVG) and `<link rel="icon">` in `index.html`
- [ ] Add Open Graph meta tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`)
- [ ] Add Twitter Card meta tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`)
- [ ] Add canonical URL `<link rel="canonical" href="https://<production-domain>/">`
- [ ] Improve page `<title>` with descriptive keywords
- [ ] Create `public/robots.txt` (allow crawling, reference sitemap)
- [ ] Create `public/sitemap.xml` with production domain URL
- [ ] Verify `contact@spandanai.com` is a live, monitored inbox
- [ ] Add client-side validation (`required`) to contact form fields
- [ ] Configure security headers in `vercel.json` (CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy)
- [ ] Pin dependency versions in `package.json` (replace `"latest"`)
- [ ] Upgrade Vite to ≥ 8.1.3 (dev dependency hygiene)
- [ ] Run a final production build and preview smoke test on all sections and links
- [ ] Confirm Vercel project domain DNS settings for the custom domain
- [ ] Decide whether to noindex Vercel preview URLs
- [ ] Initialize git repository with proper `.gitignore` before team collaboration
- [ ] (Optional) Add Schema.org Organization JSON-LD
- [ ] (Optional) Add founder photos or explicit placeholder messaging
- [ ] (Optional) Replace `mailto:` contact flow with a form backend service

---

*End of report. Generated by automated pre-launch audit — July 4, 2026.*
