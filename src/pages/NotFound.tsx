import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageTransition from '../components/PageTransition'

export default function NotFound() {
  useEffect(() => {
    document.title = 'Page not found — Ricky Kang'
  }, [])

  return (
    <PageTransition>
      <section className="grid min-h-[100svh] place-items-center px-5 text-center">
        <div>
          <p className="font-display text-[clamp(6rem,25vw,14rem)] font-bold leading-none text-gradient">404</p>
          <p className="mt-2 font-mono text-sm uppercase tracking-[0.25em] text-zinc-400">Page not found — this node isn&apos;t connected</p>
          <Link
            to="/"
            className="mt-10 inline-block rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-6 py-3 font-medium text-space"
          >
            ← Back home
          </Link>
        </div>
      </section>
    </PageTransition>
  )
}
