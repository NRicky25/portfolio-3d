import { describe, it, expect } from 'vitest'
import { projects, getProjectBySlug } from '../data/projects'

describe('projects data', () => {
  it('has the 6 live-site slugs in order', () => {
    expect(projects.map((p) => p.slug)).toEqual([
      'monogate-consulting',
      'financeflow-personal-finance-tracker',
      'invoice-saas',
      'retail-data-platform',
      'ecommerce-website',
      'anomaly-detector',
    ])
  })

  it('finds a project by slug', () => {
    expect(getProjectBySlug('monogate-consulting')?.title).toBe('MONOGATE Consulting Website')
  })

  it('marks client work with a live URL', () => {
    const p = getProjectBySlug('monogate-consulting')
    expect(p?.client).toBe(true)
    expect(p?.liveUrl).toBe('https://www.monogateconsulting.com.kh/en')
  })

  it('returns undefined for unknown slug', () => {
    expect(getProjectBySlug('nope')).toBeUndefined()
  })

  it('has typos fixed', () => {
    expect(getProjectBySlug('ecommerce-website')?.title).toBe('E-commerce Website')
  })
})
