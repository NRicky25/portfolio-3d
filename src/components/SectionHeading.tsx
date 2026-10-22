import { motion } from 'framer-motion'

export default function SectionHeading({ index, label, title }: { index: string; label: string; title: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
      className="mb-12 md:mb-16"
    >
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-cyan-300/80">
        <span className="text-violet-400">{index}</span> // {label}
      </p>
      <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-6xl">{title}</h2>
    </motion.div>
  )
}
