import { useEffect, useRef } from 'react'

interface Props {
  skills: string[]
  still?: boolean
}

// A DOM-based 3D tag sphere: crisp text, no WebGL. Drag to spin; it keeps its momentum.
export default function SkillSphere({ skills, still = false }: Props) {
  const wrap = useRef<HTMLDivElement>(null)
  const tags = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const el = wrap.current
    if (!el) return
    const n = skills.length
    // fibonacci sphere distribution
    const pts = skills.map((_, i) => {
      const y = 1 - (i / (n - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const th = Math.PI * (3 - Math.sqrt(5)) * i
      return { x: Math.cos(th) * r, y, z: Math.sin(th) * r }
    })

    let ax = 0.0016
    let ay = 0.0032
    let rotX = 0
    let rotY = 0
    let dragging = false
    let last = { x: 0, y: 0 }
    let raf = 0

    const render = () => {
      const radius = el.clientWidth * 0.38
      const cx = Math.cos(rotX)
      const sx = Math.sin(rotX)
      const cy = Math.cos(rotY)
      const sy = Math.sin(rotY)
      pts.forEach((p, i) => {
        // rotate around Y then X
        const x1 = p.x * cy + p.z * sy
        const z1 = -p.x * sy + p.z * cy
        const y2 = p.y * cx - z1 * sx
        const z2 = p.y * sx + z1 * cx
        const scale = 0.65 + (z2 + 1) * 0.35
        const t = tags.current[i]
        if (!t) return
        t.style.transform = `translate(-50%, -50%) translate3d(${x1 * radius}px, ${y2 * radius}px, 0) scale(${scale})`
        t.style.opacity = String(0.25 + ((z2 + 1) / 2) * 0.75)
        t.style.zIndex = String(Math.round(z2 * 100) + 100)
        t.style.filter = z2 < -0.3 ? 'blur(1px)' : 'none'
      })
    }

    const loop = () => {
      if (!dragging) {
        ax *= 0.985
        ay *= 0.985
        ax += 0.00002
        ay += 0.00006
      }
      rotX += ax
      rotY += ay
      render()
      raf = requestAnimationFrame(loop)
    }

    const down = (e: PointerEvent) => {
      dragging = true
      last = { x: e.clientX, y: e.clientY }
      el.setPointerCapture(e.pointerId)
    }
    const move = (e: PointerEvent) => {
      if (!dragging) return
      ay = (e.clientX - last.x) * 0.0035
      ax = -(e.clientY - last.y) * 0.0035
      last = { x: e.clientX, y: e.clientY }
    }
    const up = () => {
      dragging = false
    }

    render()
    if (!still) {
      raf = requestAnimationFrame(loop)
      el.addEventListener('pointerdown', down)
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerup', up)
      el.addEventListener('pointercancel', up)
    }
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
    }
  }, [skills, still])

  return (
    <div
      ref={wrap}
      data-cursor
      className="relative mx-auto aspect-square w-full max-w-[460px] touch-none select-none active:cursor-grabbing"
      aria-hidden
    >
      <div className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.28),transparent_70%)] blur-2xl" />
      <div className="absolute inset-[6%] rounded-full border border-violet-400/10" />
      {skills.map((s, i) => (
        <span
          key={s}
          ref={(n) => {
            tags.current[i] = n
          }}
          className="absolute left-1/2 top-1/2 whitespace-nowrap rounded-full border border-violet-300/25 bg-violet-500/10 px-3 py-1.5 font-mono text-sm text-violet-100 shadow-[0_0_20px_-4px_rgba(139,92,246,0.6)] will-change-transform"
        >
          {s}
        </span>
      ))}
    </div>
  )
}
