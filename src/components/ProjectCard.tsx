import { Suspense, lazy, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Project } from '../data/types'
import { hasWebGL } from '../hooks/useWebGL'

const CardScene = lazy(() => import('../three/CardScene'))

interface Props {
  project: Project
  index: number
  /** allow tilt + hover 3D scene (desktop, motion allowed) */
  rich: boolean
}

export default function ProjectCard({ project, index, rich }: Props) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [hover, setHover] = useState(false)

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current
    if (!rich || !el || e.pointerType !== 'mouse') return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    el.style.setProperty('--ry', `${(px - 0.5) * 14}deg`)
    el.style.setProperty('--rx', `${(0.5 - py) * 12}deg`)
    el.style.setProperty('--mx', `${px * 100}%`)
    el.style.setProperty('--my', `${py * 100}%`)
  }
  const onLeave = () => {
    const el = ref.current
    setHover(false)
    if (!el) return
    el.classList.remove('is-active')
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: (index % 2) * 0.12, duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <Link
        ref={ref}
        to={`/projects/${project.slug}`}
        onPointerEnter={() => {
          setHover(true)
          ref.current?.classList.add('is-active')
        }}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="tilt group relative block overflow-hidden rounded-3xl border border-white/10 bg-panel/80"
        style={{ boxShadow: hover ? `0 30px 80px -30px ${project.accent}aa` : undefined }}
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={project.cover}
            alt={`${project.title} screenshot`}
            loading="lazy"
            className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-105 group-hover:opacity-25 group-hover:blur-[2px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-panel via-panel/20 to-transparent" />
          {rich && hover && hasWebGL() && (
            <div className="absolute inset-0 animate-[fadeIn_.4s_ease-out]">
              <Suspense fallback={null}>
                <CardScene kind={project.scene} color={project.accent} />
              </Suspense>
            </div>
          )}
          <span className="pop absolute left-5 top-4 font-mono text-xs text-white/60">{String(index + 1).padStart(2, '0')}</span>
        </div>

        <div className="relative p-6 md:p-7">
          <h3 className="font-display text-2xl font-semibold text-white">{project.title}</h3>
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-zinc-400">{project.summary}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <span key={s} className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[11px] text-zinc-300">
                {s}
              </span>
            ))}
          </div>
          <span
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium transition-[gap] group-hover:gap-3"
            style={{ color: project.accent }}
          >
            View case study <span aria-hidden>→</span>
          </span>
        </div>
        <span className="holo" aria-hidden />
      </Link>
    </motion.div>
  )
}
