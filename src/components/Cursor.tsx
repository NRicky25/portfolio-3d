import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

// Glowing dot + trailing ring. Only on fine pointers (mouse/trackpad).
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || !window.matchMedia('(pointer: fine)').matches) return
    document.body.classList.add('has-cursor')

    const pos = { x: -100, y: -100 }
    const trail = { x: -100, y: -100 }
    let hovering = false
    let raf = 0

    const onMove = (e: PointerEvent) => {
      pos.x = e.clientX
      pos.y = e.clientY
      hovering = !!(e.target as Element | null)?.closest?.('a, button, [data-cursor]')
    }
    const loop = () => {
      trail.x += (pos.x - trail.x) * 0.16
      trail.y += (pos.y - trail.y) * 0.16
      if (dot.current) dot.current.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`
      if (ring.current) {
        const s = hovering ? 1.9 : 1
        ring.current.style.transform = `translate(${trail.x}px, ${trail.y}px) translate(-50%, -50%) scale(${s})`
        ring.current.style.borderColor = hovering ? 'rgba(34,211,238,0.9)' : 'rgba(167,139,250,0.6)'
      }
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('pointermove', onMove)
    raf = requestAnimationFrame(loop)
    return () => {
      document.body.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [reduced])

  if (reduced) return null

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[80] hidden [@media(pointer:fine)]:block">
      <div ref={dot} className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_12px_3px_rgba(34,211,238,0.8)]" />
      <div
        ref={ring}
        className="absolute left-0 top-0 h-9 w-9 rounded-full border transition-[border-color] duration-200"
      />
    </div>
  )
}
