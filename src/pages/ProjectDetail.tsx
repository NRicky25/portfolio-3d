import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getProjectBySlug, projects } from '../data/projects'
import type { ProjectSection } from '../data/types'
import PageTransition from '../components/PageTransition'
import Footer from '../components/Footer'
import NotFound from './NotFound'

const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1] },
}

// "Label: description" → bold label
function LabelledItem({ text }: { text: string }) {
  const i = text.indexOf(': ')
  if (i <= 0 || i > 40) return <>{text}</>
  return (
    <>
      <strong className="font-semibold text-white">{text.slice(0, i)}</strong>
      <span className="text-zinc-400"> — {text.slice(i + 2)}</span>
    </>
  )
}

function linkify(text: string, links: string[] = []) {
  const url = links.find((l) => text.includes(l))
  if (!url) return <LabelledItem text={text} />
  const label = text.slice(0, text.indexOf(':'))
  return (
    <a href={url} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-4">
      <span>
        <span className="block font-mono text-xs uppercase tracking-widest text-cyan-300/80">{label}</span>
        <span className="break-all text-zinc-200 group-hover:text-white">{url.replace(/^https?:\/\//, '')}</span>
      </span>
      <span aria-hidden className="text-violet-300 transition group-hover:translate-x-1">↗</span>
    </a>
  )
}

function Section({ s, accent }: { s: ProjectSection; accent: string }) {
  const isRepo = s.heading === 'Repositories'
  return (
    <motion.section {...reveal} className="mt-16">
      <h2 className="mb-6 flex items-center gap-3 font-display text-2xl font-semibold text-white md:text-3xl">
        <span className="h-px w-8" style={{ background: accent }} aria-hidden />
        {s.heading}
      </h2>

      {s.paragraphs?.map((p) => (
        <p key={p} className="max-w-3xl text-lg leading-relaxed text-zinc-300">
          {p}
        </p>
      ))}

      {s.items && (
        <ul className={isRepo ? 'grid gap-3 md:grid-cols-2' : 'grid gap-3 md:grid-cols-2'}>
          {s.items.map((it) => (
            <li key={it} className="glass rounded-2xl p-5 text-sm leading-relaxed text-zinc-300">
              {isRepo ? linkify(it, s.links) : <LabelledItem text={it} />}
            </li>
          ))}
        </ul>
      )}

      {s.groups && (
        <ol className="grid gap-4 md:grid-cols-2">
          {s.groups.map((g, i) => (
            <li key={g.title} className="glass rounded-2xl p-6 transition hover:border-violet-400/40">
              <p className="font-mono text-xs" style={{ color: accent }}>
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="mt-1 font-display text-lg font-semibold text-white">{g.title}</h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-zinc-400">
                {g.items.map((it) => (
                  <li key={it} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-violet-400" aria-hidden />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      )}

      {s.tags && (
        <div className="flex flex-wrap gap-2">
          {s.tags.map((t) => (
            <span key={t} className="rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1.5 font-mono text-sm text-violet-100">
              {t}
            </span>
          ))}
        </div>
      )}
    </motion.section>
  )
}

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = getProjectBySlug(slug)

  useEffect(() => {
    window.scrollTo(0, 0)
    if (project) document.title = `${project.title} — Ricky Kang`
  }, [project])

  if (!project) return <NotFound />

  const idx = projects.indexOf(project)
  const next = projects[(idx + 1) % projects.length]

  return (
    <PageTransition>
      <article className="relative mx-auto max-w-5xl px-5 pb-24 pt-32 md:px-8 md:pt-40">
        <div
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[500px] w-[900px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
          style={{ background: `radial-gradient(ellipse, ${project.accent}, transparent 65%)` }}
          aria-hidden
        />
        <nav aria-label="Breadcrumb" className="font-mono text-xs text-zinc-500">
          <Link to="/" className="hover:text-white">
            Home
          </Link>{' '}
          /{' '}
          <Link to="/" state={{ scrollTo: '#projects' }} className="hover:text-white">
            Projects
          </Link>{' '}
          / <span className="text-zinc-300">{project.title}</span>
        </nav>

        <motion.h1
          className="mt-6 font-display text-4xl font-bold leading-[1.02] tracking-tight text-white md:text-7xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {project.title}
        </motion.h1>
        <motion.p
          className="mt-6 max-w-3xl text-lg leading-relaxed text-zinc-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          {project.summary}
        </motion.p>

        <motion.div
          className="mt-12 overflow-hidden rounded-3xl border border-white/10"
          style={{ boxShadow: `0 40px 120px -40px ${project.accent}` }}
          initial={{ opacity: 0, y: 60, rotateX: 12 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.45, duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <img src={project.cover} alt={`${project.title} screenshot`} className="w-full" />
        </motion.div>

        {project.sections.map((s) => (
          <Section key={s.heading} s={s} accent={project.accent} />
        ))}

        <Link
          to={`/projects/${next.slug}`}
          className="group mt-24 block rounded-3xl border border-white/10 p-8 transition hover:border-violet-400/40 md:p-12"
        >
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-500">Next project</p>
          <p className="mt-3 flex items-center justify-between gap-4 font-display text-3xl font-semibold text-white md:text-5xl">
            {next.title}
            <span aria-hidden className="transition group-hover:translate-x-2" style={{ color: next.accent }}>
              →
            </span>
          </p>
        </Link>
      </article>
      <Footer />
    </PageTransition>
  )
}
