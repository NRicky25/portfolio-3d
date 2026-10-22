import { useEffect, useState, type RefObject } from 'react'

// True while the element is (near) the viewport. Used to pause 3D canvases off-screen.
export function useInView(ref: RefObject<Element>, rootMargin = '200px'): boolean {
  const [inView, setInView] = useState(true)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, rootMargin])
  return inView
}
