let cached: boolean | null = null

export function hasWebGL(): boolean {
  if (cached !== null) return cached
  try {
    const c = document.createElement('canvas')
    cached = !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch {
    cached = false
  }
  return cached
}
