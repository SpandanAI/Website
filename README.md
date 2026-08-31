# SpandanAI Website

Public marketing website for SpandanAI, a fabless semiconductor company building analog-native silicon for AI inference and next-generation communication systems.

**Production site:** https://spandanai.com/

This repository is the source for that site. It is a client-rendered single-page application with in-page sections (Home, Use Cases, Team, Contact).

## Technology stack

- React
- Vite
- Tailwind CSS
- Framer Motion
- Canvas 2D (hero network animation)
- Vercel (static hosting)

No environment variables are currently required.

## Project structure

```
index.html                 Site document and SEO metadata
src/main.jsx               React entry
src/App.jsx                Page composition
src/index.css              Global styles
src/components/            Page sections and shared UI
src/data/siteContent.js    Navigation links and use-case content
src/lib/                   Shared animation and navigation helpers
public/                    Favicons, robots.txt, sitemap, images
vercel.json                Vercel build output and security headers
docs/                      Project audit and planning notes
```

Editable navigation and use-case copy live in `src/data/siteContent.js`. Section UI lives under `src/components/`.

## Development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

Output is written to `dist/`.

## Preview

```bash
npm run preview
```

## Deployment

The site is deployed to Vercel as a static Vite build (`npm run build`, output directory `dist`). See `vercel.json` for the build command, output directory, and security headers.

## License

A license has not been added yet. Until the company publishes one, this source is not licensed for reuse by others.
