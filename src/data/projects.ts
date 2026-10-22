import raw from './projects.json'
import type { Project, ProjectSection, SceneKind } from './types'

type RawProject = Omit<Project, 'scene' | 'stack' | 'accent'> & { sections: ProjectSection[] }

// Visual extras per project; the text content comes from projects.json (scraped from the old site).
const extras: Record<string, { scene: SceneKind; stack: string[]; accent: string }> = {
  'financeflow-personal-finance-tracker': { scene: 'bars', stack: ['FastAPI', 'Firestore', 'React', 'TypeScript', 'Docker'], accent: '#22d3ee' },
  'invoice-saas': { scene: 'documents', stack: ['Next.js', 'TypeScript', 'Tailwind', 'Supabase'], accent: '#a78bfa' },
  'retail-data-platform': { scene: 'pipeline', stack: ['Python', 'Airflow', 'dbt', 'Postgres', 'Streamlit'], accent: '#34d399' },
  'kafka-pipeline': { scene: 'stream', stack: ['Java', 'Kafka', 'PostgreSQL', 'Docker'], accent: '#f472b6' },
  'ecommerce-website': { scene: 'boxes', stack: ['React', 'Node.js', 'MongoDB', 'Stripe'], accent: '#fbbf24' },
  'anomaly-detector': { scene: 'outlier', stack: ['scikit-learn', 'pandas', 'FastAPI', 'Docker'], accent: '#f87171' },
}

export const projects: Project[] = (raw as RawProject[]).map((p) => ({ ...p, ...extras[p.slug] }))

export function getProjectBySlug(slug: string | undefined): Project | undefined {
  return projects.find((p) => p.slug === slug)
}
