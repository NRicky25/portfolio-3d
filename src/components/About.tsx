import { useLayoutEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { profile } from '../data/profile'
import { skills } from '../data/skills'
import { useReducedMotion } from '../hooks/useReducedMotion'
import SkillSphere from '../three/SkillSphere'
import SectionHeading from './SectionHeading'

gsap.registerPlugin(ScrollTrigger)

const icons = ['💬', '🌏', '🌱']

export default function About() {
  const statement = useRef<HTMLParagraphElement>(null)
  const reduced = useReducedMotion()

  // words light up one by one as the statement scrolls through the viewport
  useLayoutEffect(() => {
    if (reduced || !statement.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.word',
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: 'none',
          scrollTrigger: { trigger: statement.current, start: 'top 85%', end: 'bottom 45%', scrub: true },
        },
      )
    }, statement)
    return () => ctx.revert()
  }, [reduced])

  const words = `${profile.tagline}.`.split(' ')

  return (
    <section id="about" className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-28 md:px-8 md:py-40">
      <SectionHeading index="01" label="about" title={<>Curious technologist, <span className="text-gradient">always building.</span></>} />

      <p ref={statement} className="max-w-4xl font-display text-3xl font-medium leading-snug text-white md:text-5xl">
        {words.map((w, i) => (
          <span key={i} className="word">
            {w}{' '}
          </span>
        ))}
      </p>

      <div className="mt-20 grid items-center gap-14 lg:grid-cols-2">
        <div className="space-y-4">
          <p className="font-mono text-sm text-cyan-300">
            <span className="text-violet-400">$</span> {profile.currentRole}
          </p>
          {profile.values.map((v, i) => (
            <motion.div
              key={v}
              className="glass flex items-center gap-4 rounded-2xl p-5"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.12, duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-violet-500/15 text-xl" aria-hidden>
                {icons[i]}
              </span>
              <span className="text-zinc-200">{v}</span>
            </motion.div>
          ))}
        </div>

        <div>
          <h3 className="mb-2 text-center font-mono text-xs uppercase tracking-[0.25em] text-zinc-500">
            My expertise <span className="text-zinc-600">— drag to spin</span>
          </h3>
          <ul className="sr-only">
            {skills.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <SkillSphere skills={skills} still={reduced} />
        </div>
      </div>
    </section>
  )
}
