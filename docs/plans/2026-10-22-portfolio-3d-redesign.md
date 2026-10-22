# Portfolio 3D Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local-only, animated "immersive neural" portfolio for Ricky Kang per `docs/specs/2026-10-22-portfolio-3d-redesign-design.md`.

**Architecture:** Vite + React SPA. Content lives in typed `src/data/*` modules; pages read data and pass it to presentational components. 3D (react-three-fiber) is lazy-loaded behind Suspense with CSS fallbacks; motion is gated by `useReducedMotion` and `useDeviceTier`.

**Tech Stack:** Vite, React 18, TypeScript, Tailwind CSS 3, @react-three/fiber 8, @react-three/drei 9, three, GSAP 3 (ScrollTrigger), lenis, framer-motion, react-router-dom 6, Vitest + React Testing Library + jsdom.

---

## File map

| File | Responsibility |
|---|---|
| `src/data/types.ts` | `Project`, `ProjectSection`, `Experience`, `Profile` types |
| `src/data/profile.ts` | name, roles, intro, value statements, links, email |
| `src/data/skills.ts` | skill name list |
| `src/data/experience.ts` | 4 timeline entries |
| `src/data/projects.ts` | 6 projects (content scraped from live site, typos fixed) + `getProjectBySlug` |
| `src/hooks/useReducedMotion.ts` | media query hook |
| `src/hooks/useDeviceTier.ts` | `'low' \| 'high'` |
| `src/hooks/useLenis.ts` | smooth scroll + GSAP ticker sync |
| `src/three/NeuralNetwork.tsx` | hero/contact network (points, lines, pulses, mouse warp) |
| `src/three/SkillSphere.tsx` | draggable 3D tag sphere |
| `src/three/CardScene.tsx` | per-project hover mini-scenes (6 variants by `kind`) |
| `src/components/*` | Loader, Nav, Cursor, Hero, About, Projects, ProjectCard, Experience, Contact, Footer, SceneFallback |
| `src/pages/Home.tsx`, `ProjectDetail.tsx`, `NotFound.tsx` | routes |
| `src/App.tsx` | router + animated route transitions |
| `src/test/*.test.tsx` | Vitest specs |
| `public/projects/<slug>.png` | cover images downloaded from live site |

## Tasks

### Task 1: Scaffold
- [ ] `npm create vite@latest . -- --template react-ts`, install deps listed in Tech Stack.
- [ ] Tailwind config with theme tokens (`bg #05050f`, `violet #8b5cf6`, `cyan #22d3ee`), Google Fonts (Space Grotesk, Inter, JetBrains Mono) in `index.html`.
- [ ] Vitest config (`environment: 'jsdom'`, setup file with `@testing-library/jest-dom` and `matchMedia` stub).
- [ ] `npm run build` passes. Commit `chore: scaffold vite react ts app`.

### Task 2: Data layer (TDD)
- [ ] Write `src/test/projects.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { projects, getProjectBySlug } from '../data/projects'

describe('projects data', () => {
  it('has the 6 live-site slugs in order', () => {
    expect(projects.map(p => p.slug)).toEqual([
      'financeflow-personal-finance-tracker', 'invoice-saas', 'retail-data-platform',
      'kafka-pipeline', 'ecommerce-website', 'anomaly-detector',
    ])
  })
  it('finds a project by slug', () => {
    expect(getProjectBySlug('kafka-pipeline')?.title).toBe('Kafka Streaming Pipeline')
  })
  it('returns undefined for unknown slug', () => {
    expect(getProjectBySlug('nope')).toBeUndefined()
  })
  it('has typos fixed', () => {
    expect(getProjectBySlug('ecommerce-website')?.title).toBe('E-commerce Website')
  })
})
```
- [ ] Run `npx vitest run src/test/projects.test.ts` → FAIL (module missing).
- [ ] Implement `types.ts`, `projects.ts` (sections: `{heading, paragraphs?, groups?, items?, links?, tags?}`), `profile.ts`, `skills.ts`, `experience.ts`.
- [ ] Re-run → PASS. Commit `feat: add typed portfolio content data`.

### Task 3: Hooks
- [ ] `useReducedMotion` (matchMedia `(prefers-reduced-motion: reduce)` with change listener).
- [ ] `useDeviceTier` (`low` if `(pointer: coarse)` or `hardwareConcurrency <= 4`).
- [ ] `useLenis` (skip when reduced motion; drive via `gsap.ticker`; `ScrollTrigger.update` on scroll).
- [ ] Commit `feat: add motion and device hooks`.

### Task 4: Routing + pages (TDD)
- [ ] Write `src/test/routing.test.tsx`: render `<AppRoutes/>` in `MemoryRouter` at `/` → heading "Ricky Kang"; at `/projects/kafka-pipeline` → heading "Kafka Streaming Pipeline"; at `/projects/nope` → text "Page not found"; Home renders 6 links with `href` `/projects/<slug>`. 3D modules mocked with `vi.mock('../three/...', () => ({ default: () => null }))`.
- [ ] Run → FAIL. Implement `App.tsx` (`AppRoutes` exported separately), pages, and components with static markup.
- [ ] Run → PASS. Commit `feat: pages, routing and section components`.

### Task 5: Reduced-motion loader (TDD)
- [ ] Test: with `matchMedia` returning `matches: true` for reduced motion, `<App/>` does not render `data-testid="loader"`.
- [ ] Implement Loader (SVG nodes forming "RK", 1.5s, then unmount). PASS. Commit.

### Task 6: NeuralNetwork 3D
- [ ] Points on a fibonacci-sphere-ish cloud, k-nearest line segments, pulses moving along random edges (instanced spheres), slow rotation, pointer-driven displacement (high tier only), DPR `[1, tier==='low'?1.5:2]`, node count 60/150.
- [ ] Hero uses it via `React.lazy` + `Suspense fallback={<SceneFallback/>}`; reduced motion → `frameloop="demand"`.
- [ ] Visual check in browser. Commit.

### Task 7: Hero/About/Experience animations
- [ ] Hero: glitch name reveal (CSS keyframes), rotating role (framer-motion AnimatePresence).
- [ ] About: GSAP ScrollTrigger scrub word opacity; SkillSphere (drei `Text`, OrbitControls-free drag via pointer rotation).
- [ ] Experience: SVG line `scaleY` scrub + entries `x` slide-in.
- [ ] Commit.

### Task 8: Project cards
- [ ] ProjectCard: pointer tilt (rotateX/Y ±12°), holographic gradient following pointer, cover image, hover reveals lazy `CardScene kind=...` canvas (high tier only).
- [ ] Commit.

### Task 9: Contact, Nav, Cursor, Detail page styling, route transitions
- [ ] Magnetic button, glass pill nav, glow cursor (hidden on coarse pointer), ProjectDetail styled sections, framer-motion fade+blur transitions, scroll to top on route change.
- [ ] Commit.

### Task 10: Verify
- [ ] `npx vitest run` all pass; `npm run build` passes.
- [ ] `npm run dev`, browser check desktop + 375px, no console errors, no horizontal scroll.
- [ ] Commit any fixes.
