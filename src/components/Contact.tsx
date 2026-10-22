import { Suspense, lazy, useRef } from 'react'
import { motion } from 'framer-motion'
import { profile } from '../data/profile'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useDeviceTier } from '../hooks/useDeviceTier'
import { useInView } from '../hooks/useInView'
import { hasWebGL } from '../hooks/useWebGL'
import Magnetic from './Magnetic'
import SceneFallback from './SceneFallback'

const NeuralNetwork = lazy(() => import('../three/NeuralNetwork'))

export default function Contact() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, '0px')
  const reduced = useReducedMotion()
  const tier = useDeviceTier()

  return (
    <section ref={ref} id="contact" className="relative flex min-h-[90svh] scroll-mt-24 items-center overflow-hidden">
      <SceneFallback />
      {hasWebGL() && inView && (
        <Suspense fallback={null}>
          <div className="absolute inset-0 opacity-60">
            <NeuralNetwork low still={reduced || tier === 'low'} />
          </div>
        </Suspense>
      )}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#05050f_75%)]" />

      <motion.div
        className="relative z-10 mx-auto max-w-4xl px-5 text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-cyan-300/80">
          <span className="text-violet-400">04</span> // contact
        </p>
        <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-7xl">
          Let&apos;s build something <span className="text-gradient">intelligent</span> together.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-zinc-200 [text-shadow:0_1px_12px_rgba(5,5,15,0.9)]">
          Let&apos;s connect to explore tailored solutions that drive your success and transform your ideas into reality.
        </p>
        <div className="mt-10 flex justify-center">
          <Magnetic strength={0.45}>
            <a
              href={`mailto:${profile.email}`}
              className="group relative grid h-40 w-40 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 font-display text-lg font-semibold text-space shadow-[0_0_80px_-10px_rgba(139,92,246,0.9)] transition-transform duration-300 hover:scale-105 md:h-48 md:w-48"
            >
              <span className="absolute inset-0 animate-ping rounded-full bg-violet-400/20 [animation-duration:2.5s]" aria-hidden />
              <span className="relative">Let&apos;s talk ↗</span>
            </a>
          </Magnetic>
        </div>
        <p className="mt-8 font-mono text-sm text-zinc-400">{profile.email}</p>
      </motion.div>
    </section>
  )
}
