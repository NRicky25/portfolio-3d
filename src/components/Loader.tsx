import { useEffect } from 'react'
import { motion } from 'framer-motion'

// Node coordinates tracing the letters "R" and "K" on a 100x60 grid.
const R = [[10, 50], [10, 10], [30, 10], [36, 20], [30, 30], [10, 30], [36, 50]]
const K = [[56, 10], [56, 50], [56, 30], [82, 10], [56, 30], [82, 50]]

function toPath(pts: number[][]) {
  return pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ')
}

export default function Loader({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const id = window.setTimeout(onDone, 1700)
    return () => window.clearTimeout(id)
  }, [onDone])

  const nodes = [...R, ...K]

  return (
    <motion.div
      data-testid="loader"
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-space"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.08, filter: 'blur(10px)' }}
      transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      aria-label="Loading"
      role="status"
    >
      <svg viewBox="0 0 92 60" className="w-48 md:w-64" aria-hidden>
        <defs>
          <linearGradient id="lg" x1="0" x2="1">
            <stop offset="0" stopColor="#8b5cf6" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        {[R, K].map((pts, i) => (
          <path
            key={i}
            d={toPath(pts)}
            fill="none"
            stroke="url(#lg)"
            strokeWidth="1.2"
            strokeLinejoin="round"
            strokeDasharray="200"
            strokeDashoffset="200"
            style={{ animation: `draw 1.1s ${0.15 + i * 0.25}s ease-out forwards` }}
          />
        ))}
        {nodes.map(([x, y], i) => (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r="2.2"
            fill={i < R.length ? '#a78bfa' : '#67e8f9'}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.06, type: 'spring', stiffness: 300, damping: 14 }}
          />
        ))}
      </svg>
      <motion.p
        className="mt-6 font-mono text-xs uppercase tracking-[0.3em] text-violet-300/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        initializing network
      </motion.p>
    </motion.div>
  )
}
