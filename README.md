# SpandanAI Website

Official frontend for [SpandanAI](https://spandanai.com/), a fabless semiconductor company building analog-native silicon for AI inference and next-generation communication systems.

This repository is a client-rendered single-page application with a dedicated Team route, contact actions, and a Canvas 2D electrical visual system.

## Tech stack

- React 19.2.5
- Vite 8.0.16
- Tailwind CSS 3.4.19
- Framer Motion 12.38.0
- React Router 7.18.3
- Canvas 2D
- Playwright 1.63.0 (dev)
- Vercel (static hosting)

No environment variables are required.

## Getting started

Node.js 22 is recommended (matches CI).

```bash
npm ci
npm run dev
```

`npm install` also works if you are not using the lockfile.

## Build

```bash
npm run build
npm run preview
```

Output is written to `dist/`.

## Testing

Chromium Playwright smokes cover routing, Use Cases, leadership/`/team`, contact controls, mobile navigation, the 767/768/769 navbar boundary, Back-to-Top, skip link, and metadata.

```bash
npx playwright install --with-deps chromium
npm run test:e2e
```

Optional:

```bash
npm run test:e2e:headed
npm run test:e2e:ui
```

Visual electrical aesthetics, exact hover feel, and Firefox/Safari appearance remain human-reviewed. This suite does not claim WCAG certification.

## Project structure

```
src/                   Application source
public/                Static assets, robots.txt, sitemap, images
tests/                 Playwright smoke tests
.github/workflows/     CI
playwright.config.js
vercel.json
```

Navigation and Use Case copy live in `src/data/siteContent.js`. Leadership and future team-member data live in `src/data/teamContent.js`.

## Routes

| Path | Purpose |
|------|---------|
| `/` | Homepage (Hero, Use Cases, Leadership, Contact) |
| `/#use-cases` | Use Cases section |
| `/#team` | Homepage leadership section |
| `/#contact` | Contact section |
| `/team` | Dedicated team page |

Direct load of `/team` is supported in production via a Vercel rewrite.

## Content updates

Do not invent names, photos, or LinkedIn URLs.

- Use Cases: `src/data/siteContent.js` (`applicationTabs`)
- Leadership (homepage and `/team`): `src/data/teamContent.js` (`leadershipMembers`)
- Additional people: add real photos under `public/images/` and entries to `teamMembers` (currently empty)
- Group photo: set `teamGroupPhoto` only when a real asset exists

The homepage Leadership section always shows the four founding leaders. Extra members appear only on `/team`.

## Deployment

Production is a static Vite build on Vercel (`npm run build`, output `dist/`). See `vercel.json` for the build command, `/team` rewrite, and security headers.

GitHub Actions runs install, build, and Playwright on push to `main` and on pull requests. It does not deploy. Production deploys are explicit.

Intended production URL: https://spandanai.com/

## Accessibility and quality

- Responsive desktop/mobile navigation, including a keyboard-accessible mobile menu
- Skip to main content
- Reduced-motion support for motion and electrical effects
- Playwright smoke coverage of the main flows

## License

A license has not been added yet. Until the company publishes one, this source is not licensed for reuse by others.
