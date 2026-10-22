# Ricky Kang Portfolio — 3D Redesign Design Spec

Date: 2026-10-22
Replaces (visually): https://ricky-portfolioo.netlify.app/
Scope: run locally only. No deployment in this phase.

## Goal

Redesign the portfolio into a creative, animated, "immersive neural" site: a 3D interactive
neural-network hero plus 3D tilt project cards, while keeping all existing content.

## Visual direction

- Theme: deep space near-black `#05050f`, violet → cyan glow (`#8b5cf6` → `#22d3ee`).
- Fonts: Space Grotesk (headings), Inter (body), JetBrains Mono (labels/code accents).
- Custom glow cursor (desktop only; hidden on touch devices).

## Sections (Home page, in order)

1. **Loader** — nodes connect forming "RK", dissolve into hero (~1.5s). Skipped under reduced motion.
2. **Nav** — floating glass pill: About, Projects, Experience, Contact (smooth scroll anchors).
3. **Hero** — full-screen R3F neural network: drifting nodes, connections, signal pulses travelling
   along edges, network bends toward mouse. Name reveal with glitch effect; rotating role line
   (Full Stack Developer → ML Engineer → Backend Architect). Intro paragraph + "View my work" CTA.
4. **About / Expertise** — scroll-scrubbed word-by-word text reveal of the three value statements;
   draggable 3D tag sphere of skills (Python, Java, JavaScript, TypeScript, NoSQL, ReactJS, NuxtJS,
   Machine Learning, FastAPI, Docker). Current role line: Full Stack Developer at Millionyse.
5. **Projects** — 6 cards with cursor-driven 3D tilt + holographic shine. Each card has a cover
   visual and, on hover, a small themed animated mini-scene:
   - FinanceFlow: rising bars/coins
   - Invoice SaaS: stacking documents
   - Retail Data Platform: data flowing through pipeline stages
   - Kafka Streaming Pipeline: particle stream
   - E-commerce Website: floating product boxes
   - Anomaly Detection: scatter of points with one red outlier pulsing
   Card click → `/projects/:slug`.
6. **Experience** — vertical timeline; glowing line draws on scroll, entries slide in.
7. **Contact** — reprise of network visual, magnetic "Let's talk" button → `mailto:` link,
   GitHub + LinkedIn icon links. Footer: "© 2024–2026 Ricky Kang".

## Project detail page (`/projects/:slug`)

Same content structure as current site: breadcrumb, title, summary, Project Brief, Duration,
Repositories (links), Approach (subsections with bullet lists), Features, Tools & Technologies.
Restyled to new theme. Route transitions: fade + blur (Framer Motion). Unknown slug → 404 page with
link home. Slugs kept identical to current site:
`financeflow-personal-finance-tracker`, `invoice-saas`, `retail-data-platform`, `kafka-pipeline`,
`ecommerce-website`, `anomaly-detector`.

## Content

- All text copied from the live site into `src/data/` (projects, experience, skills, profile).
- Typo fixes: "Augest" → "August", "E-commernce" → "E-commerce", "platform architecture built to
  simulate a retail environment.It" spacing.
- Links (from live site): GitHub `https://github.com/NRicky25`, LinkedIn
  `https://www.linkedin.com/in/kengeang-kang/`, email `kengeangkang@gmail.com`; stored in
  `src/data/profile.ts`.
- Project cover art: generated images stored in `public/projects/<slug>.webp`; replaceable with
  real screenshots by overwriting the files.

## Architecture

Stack: Vite + React 18 + TypeScript, Tailwind CSS, @react-three/fiber + @react-three/drei, GSAP
(ScrollTrigger), Lenis, Framer Motion, React Router.

```
src/
  data/        profile.ts, projects.ts, experience.ts, skills.ts
  three/       NeuralNetwork.tsx, SkillSphere.tsx, cardScenes/*.tsx
  components/  Loader, Nav, Cursor, Hero, About, Projects, ProjectCard, Experience, Contact, Footer
  pages/       Home.tsx, ProjectDetail.tsx, NotFound.tsx
  hooks/       useReducedMotion.ts, useDeviceTier.ts, useLenis.ts
```

- Data flows one way: `data/` → pages → components. Components never hardcode content.
- `getProjectBySlug(slug)` in `data/projects.ts`; returns `undefined` for unknown slugs.
- 3D components are `React.lazy` loaded inside `Suspense` with a static CSS gradient fallback.
  If WebGL is unavailable, the fallback stays; the site remains fully usable.

## Performance & accessibility

- `useDeviceTier`: mobile/low-end (touch or `hardwareConcurrency <= 4`) → fewer nodes (~60 vs ~150),
  no mouse warp, DPR capped at 1.5.
- `prefers-reduced-motion`: no loader, no Lenis, no scroll scrubbing, static network frame,
  card tilt disabled.
- Text content renders immediately; 3D never blocks first paint.
- Semantic headings, focusable cards/links, visible focus rings, alt text on images.
- Responsive down to 360px width, no horizontal scroll.

## Testing

- Vitest + React Testing Library:
  - routing: `/` renders hero name; `/projects/kafka-pipeline` renders that project; unknown slug → 404
  - `getProjectBySlug` lookup
  - reduced-motion: loader not rendered when `prefers-reduced-motion: reduce`
  - all 6 projects render a card linking to the correct slug
- Manual: run `npm run dev`, check desktop + 375px mobile widths, console free of errors.
- `npm run build` succeeds.

## Out of scope

Deployment, blog, CMS, working contact form (mailto only), analytics.
