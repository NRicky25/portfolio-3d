# Ricky Kang — 3D Portfolio

Immersive neural-network portfolio built with Vite, React, Three.js (react-three-fiber), GSAP, Lenis and Framer Motion.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests
npm run build      # production build into dist/
```

## Editing content

All text lives in `src/data/`:

- `profile.ts` — name, roles, intro, links, email
- `skills.ts` — skill sphere tags
- `experience.ts` — timeline entries
- `projects.json` — project detail content; `projects.ts` adds card colour, stack chips and hover-scene type

Project cover images are in `public/projects/` — replace a file to change its cover.
