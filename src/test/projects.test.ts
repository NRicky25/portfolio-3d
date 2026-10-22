import { describe, it, expect } from 'vitest'
import { projects, getProjectBySlug } from '../data/projects'

describe('projects data', () => {
  it('has the 6 live-site slugs in order', () => {
    expect(projects.map((p) => p.slug)).toEqual([
      'financeflow-personal-finance-tracker',
      'invoice-saas',
      'retail-data-platform',
      'kafka-pipeline',
      'ecommerce-website',
      'anomaly-detector',
    ])
  })

  it('finds a project by slug', () => {
    expect(getProjectBySlug('kafka-pipeline')?.title).toBe('Kafka Streaming Pipeline')
  })

  it('returns undefined for unknown slug', () => {
    expect(getProjectBySlug('nope')).toBeUndefined()
  })

  it('has typos fixed', () => {
    expect(getProjectBySlug('ecommerce-website')?.title).toBe('E-commerce Website')
    expect(getProjectBySlug('kafka-pipeline')?.summary).not.toMatch(/topic\.A/)
  })
})
