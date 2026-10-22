import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AppRoutes } from '../App'
import { projects } from '../data/projects'

// WebGL is unavailable in jsdom; 3D scenes are covered by manual browser checks.
vi.mock('../three/NeuralNetwork', () => ({ default: () => null }))
vi.mock('../three/SkillSphere', () => ({ default: () => null }))
vi.mock('../three/CardScene', () => ({ default: () => null }))

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  )
}

describe('routing', () => {
  it('renders the home hero', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { level: 1, name: /ricky kang/i })).toBeInTheDocument()
  })

  it('links every project card to its detail page', () => {
    renderAt('/')
    for (const p of projects) {
      const link = screen.getByRole('link', { name: new RegExp(p.title.split(' ')[0], 'i') })
      expect(link).toHaveAttribute('href', `/projects/${p.slug}`)
    }
  })

  it('renders a project detail page', () => {
    renderAt('/projects/kafka-pipeline')
    expect(screen.getByRole('heading', { level: 1, name: 'Kafka Streaming Pipeline' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Features' })).toBeInTheDocument()
  })

  it('renders 404 for unknown slug', () => {
    renderAt('/projects/nope')
    expect(screen.getByText(/page not found/i)).toBeInTheDocument()
  })
})
