import { useRef } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

// Wraps a child so it drifts toward the pointer while hovered.
export default function Magnetic({ children, strength = 0.3 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const onMove = (e: React.PointerEvent) => {
    if (reduced || e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - (r.left + r.width / 2)) * strength
    const y = (e.clientY - (r.top + r.height / 2)) * strength
    ref.current.style.transform = `translate(${x}px, ${y}px)`
  }
  const reset = () => {
    if (ref.current) ref.current.style.transform = ''
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className="inline-block transition-transform duration-300 ease-out"
    >
      {children}
    </div>
  )
}
