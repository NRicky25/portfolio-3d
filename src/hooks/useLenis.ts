import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null

export function scrollToTarget(target: string | number) {
  if (lenis) lenis.scrollTo(target, { offset: -40 })
  else if (typeof target === 'number') window.scrollTo({ top: target })
  else document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
}

export function useLenis(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return
    lenis = new Lenis({ duration: 1.15, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis?.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis?.destroy()
      lenis = null
    }
  }, [enabled])
}
