import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

vi.mock('../three/NeuralNetwork', () => ({ default: () => null }))
vi.mock('../three/SkillSphere', () => ({ default: () => null }))
vi.mock('../three/CardScene', () => ({ default: () => null }))

const original = window.matchMedia

function mockMatchMedia(reduce: boolean) {
  window.matchMedia = (query: string) =>
    ({
      matches: query.includes('reduce') ? reduce : false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList
}

afterEach(() => {
  window.matchMedia = original
})

describe('loader', () => {
  it('shows the intro loader normally', () => {
    mockMatchMedia(false)
    render(<App />)
    expect(screen.getByTestId('loader')).toBeInTheDocument()
  })

  it('skips the loader under prefers-reduced-motion', () => {
    mockMatchMedia(true)
    render(<App />)
    expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
  })
})
