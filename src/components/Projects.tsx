import { projects } from '../data/projects'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useDeviceTier } from '../hooks/useDeviceTier'
import ProjectCard from './ProjectCard'
import SectionHeading from './SectionHeading'

export default function Projects() {
  const reduced = useReducedMotion()
  const tier = useDeviceTier()
  const rich = !reduced && tier === 'high'

  return (
    <section id="projects" className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-28 md:px-8 md:py-40">
      <div className="pointer-events-none absolute -right-40 top-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" aria-hidden />
      <SectionHeading index="02" label="projects" title={<>Highlights from my <span className="text-gradient">recent projects</span></>} />
      <div className="grid gap-8 md:grid-cols-2">
        {projects.map((p, i) => (
          <div key={p.slug} className={i % 2 === 1 ? 'md:translate-y-16' : ''}>
            <ProjectCard project={p} index={i} rich={rich} />
          </div>
        ))}
      </div>
    </section>
  )
}
