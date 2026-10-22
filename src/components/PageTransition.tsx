import { motion } from 'framer-motion'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.main
      id="main"
      initial={{ opacity: 0, filter: 'blur(12px)', y: 20 }}
      animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
      exit={{ opacity: 0, filter: 'blur(12px)', y: -20 }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.main>
  )
}
