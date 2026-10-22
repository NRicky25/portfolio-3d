import { motion } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { scrollToTarget } from '../hooks/useLenis'

const items = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
]

export default function Nav() {
  const location = useLocation()
  const navigate = useNavigate()

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    if (location.pathname === '/') scrollToTarget(`#${id}`)
    else navigate('/', { state: { scrollTo: `#${id}` } })
  }

  return (
    <motion.header
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.9, duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <nav aria-label="Main" className="glass flex items-center gap-1 rounded-full p-1.5 shadow-[0_10px_40px_-10px_rgba(139,92,246,0.5)]">
        <Link
          to="/"
          onClick={(e) => {
            if (location.pathname === '/') {
              e.preventDefault()
              scrollToTarget(0)
            }
          }}
          className="mr-1 grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 font-display text-xs font-bold text-space"
          aria-label="Home"
        >
          RK
        </Link>
        {items.map((it) => (
          <a
            key={it.id}
            href={`/#${it.id}`}
            onClick={go(it.id)}
            className="rounded-full px-2.5 py-1.5 text-xs font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white sm:px-4 sm:text-sm"
          >
            {it.label}
          </a>
        ))}
      </nav>
    </motion.header>
  )
}
