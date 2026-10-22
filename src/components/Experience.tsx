import { useLayoutEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { experience } from '../data/experience'
import { useReducedMotion } from '../hooks/useReducedMotion'
import SectionHeading from './SectionHeading'

gsap.registerPlugin(ScrollTrigger)

export default function Experience() {
  const list = useRef<HTMLOListElement>(null)
  const line = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  // the glowing line draws itself as you scroll through the timeline
  useLayoutEffect(() => {
    if (reduced || !line.current || !list.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        line.current,
        { scaleY: 0 },
        { scaleY: 1, ease: 'none', scrollTrigger: { trigger: list.current, start: 'top 70%', end: 'bottom 60%', scrub: true } },
      )
    })
    return () => ctx.revert()
  }, [reduced])

  return (
    <section id="experience" className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-28 md:px-8 md:py-40">
      <SectionHeading index="03" label="experience" title={<>My journey as a <span className="text-gradient">software engineer</span></>} />

      <ol ref={list} className="relative">
        <div className="absolute bottom-0 left-[11px] top-0 w-px bg-white/10 md:left-1/2" aria-hidden />
        <div
          ref={line}
          className="absolute bottom-0 left-[11px] top-0 w-[2px] origin-top -translate-x-[0.5px] bg-gradient-to-b from-violet-500 via-fuchsia-400 to-cyan-400 shadow-[0_0_16px_2px_rgba(139,92,246,0.7)] md:left-1/2"
          aria-hidden
        />
        {experience.map((e, i) => {
          const right = i % 2 === 1
          return (
            <li key={e.period} className="relative mb-14 pl-12 last:mb-0 md:grid md:grid-cols-2 md:gap-16 md:pl-0">
              <span
                className="absolute left-[4px] top-2 h-4 w-4 rounded-full border-2 border-violet-400 bg-space shadow-[0_0_14px_3px_rgba(139,92,246,0.7)] md:left-1/2 md:-translate-x-1/2"
                aria-hidden
              />
              <motion.div
                className={right ? 'md:col-start-2' : 'md:text-right'}
                initial={{ opacity: 0, x: right ? 60 : -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <p className="font-mono text-xs uppercase tracking-widest text-cyan-300/80">{e.period}</p>
                <div className="glass mt-3 rounded-2xl p-6 text-left transition hover:border-violet-400/40">
                  <h3 className="font-display text-xl font-semibold text-white">{e.role}</h3>
                  <p className="text-sm text-violet-300">{e.org}</p>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">{e.description}</p>
                </div>
              </motion.div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
