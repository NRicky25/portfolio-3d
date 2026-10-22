import '@testing-library/jest-dom/vitest'

// jsdom lacks matchMedia; tests can override window.matchMedia per case.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList
}
window.scrollTo = () => {}

// jsdom lacks IntersectionObserver (used by framer-motion whileInView and our in-view hook).
class IO {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(window as any).IntersectionObserver = IO

// jsdom lacks ResizeObserver (used by Lenis).
class RO {
  observe() {}
  unobserve() {}
  disconnect() {}
}
;(window as any).ResizeObserver = RO
