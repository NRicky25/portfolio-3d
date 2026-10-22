import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { profile } from '../data/profile'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useDeviceTier } from '../hooks/useDeviceTier'
import { useInView } from '../hooks/useInView'
import { hasWebGL } from '../hooks/useWebGL'
import { scrollToTarget } from '../hooks/useLenis'
import SceneFallback from './SceneFallback'
import Magnetic from './Magnetic'

const NeuralNetwork = lazy(() => import('../three/NeuralNetwork'))

// delay so the name reveal starts as the loader fades
const INTRO = 1.6

function RoleRotator({ roles, still }: { roles: string[]; still: boolean }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (still) return
    const id = window.setInterval(() => setI((n) => (n + 1) % roles.length), 2600)
    return () => window.clearInterval(id)
  }, [roles.length, still])

  return (
    <span className="relative inline-flex h-[1.3em] overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={roles[i]}
          className="text-gradient inline-block"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export default function Hero() {
  const reduced = useReducedMotion()
  const tier = useDeviceTier()
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref)
  const webgl = hasWebGL()
  const delay = reduced ? 0 : INTRO

  return (
    <section ref={ref} id="top" className="relative flex min-h-[100svh] items-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,#1a1240_0%,#05050f_65%)]" />
      <SceneFallback />
      {webgl && (
        <Suspense fallback={null}>
          <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: delay * 0.6, duration: 1.6 }}>
            <NeuralNetwork active={inView} low={tier === 'low'} still={reduced} />
          </motion.div>
        </Suspense>
      )}
      {/* fade the network into the next section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-space" />

      <div className="pointer-events-none relative z-10 mx-auto w-full max-w-6xl px-5 pt-24 md:px-8">
        <motion.p
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1 font-mono text-xs text-emerald-300"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.6 }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Open to new opportunities
        </motion.p>

        <h1
          aria-label={profile.name}
          data-text={profile.name}
          className="glitch font-display text-[clamp(3.2rem,12vw,9.5rem)] font-bold leading-[0.9] tracking-tighter text-white"
        >
          {profile.name.split('').map((c, i) => (
            <span key={i} aria-hidden className="char" style={{ animationDelay: `${delay + i * 0.05}s` }}>
              {c === ' ' ? ' ' : c}
            </span>
          ))}
        </h1>

        <motion.p
          className="mt-5 font-display text-2xl font-medium text-zinc-300 md:text-4xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.7 }}
        >
          <RoleRotator roles={profile.roles} still={reduced} />
        </motion.p>

        <motion.p
          className="mt-6 max-w-xl text-base leading-relaxed text-zinc-400 md:text-lg"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.9, duration: 0.8 }}
        >
          {profile.intro}
        </motion.p>

        <motion.div
          className="pointer-events-auto mt-9 flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 1.05, duration: 0.8 }}
        >
          <Magnetic>
            <button
              onClick={() => scrollToTarget('#projects')}
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-6 py-3 font-medium text-space shadow-[0_0_40px_-6px_rgba(139,92,246,0.9)]"
            >
              <span className="relative z-10">View my work →</span>
              <span className="absolute inset-0 -translate-x-full bg-white/40 transition-transform duration-500 group-hover:translate-x-0" />
            </button>
          </Magnetic>
          <Magnetic>
            <button
              onClick={() => scrollToTarget('#contact')}
              className="glass rounded-full px-6 py-3 font-medium text-zinc-200 transition hover:text-white"
            >
              Get in touch
            </button>
          </Magnetic>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 md:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 1.6 }}
        aria-hidden
      >
        scroll
        <span className="relative h-10 w-px overflow-hidden bg-white/10">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-transparent to-cyan-300"
            animate={reduced ? undefined : { y: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          />
        </span>
      </motion.div>
    </section>
  )
}
