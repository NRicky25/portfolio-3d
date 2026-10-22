import raw from './projects.json'
import type { Project, ProjectSection } from './types'

type Extras = Pick<Project, 'scene' | 'stack' | 'accent' | 'client' | 'liveUrl'>
type RawProject = Omit<Project, keyof Extras> & { sections: ProjectSection[] }

// Visual extras per project; the text content comes from projects.json.
const extras: Record<string, Extras> = {
  'monogate-consulting': {
    scene: 'gateway',
    stack: ['Next.js', 'React', 'Tailwind', 'i18n'],
    accent: '#e8dcc4',
    client: true,
    liveUrl: 'https://www.monogateconsulting.com.kh/en',
  },
  'financeflow-personal-finance-tracker': { scene: 'bars', stack: ['FastAPI', 'Firestore', 'React', 'TypeScript', 'Docker'], accent: '#22d3ee' },
  'invoice-saas': { scene: 'documents', stack: ['Next.js', 'TypeScript', 'Tailwind', 'Supabase'], accent: '#a78bfa' },
  'retail-data-platform': { scene: 'pipeline', stack: ['Python', 'Airflow', 'dbt', 'Postgres', 'Streamlit'], accent: '#34d399' },
  'ecommerce-website': { scene: 'boxes', stack: ['React', 'Node.js', 'MongoDB', 'Stripe'], accent: '#fbbf24' },
  'anomaly-detector': { scene: 'outlier', stack: ['scikit-learn', 'pandas', 'FastAPI', 'Docker'], accent: '#f87171' },
}

export const projects: Project[] = (raw as RawProject[]).map((p) => ({ ...p, ...extras[p.slug] }))

export function getProjectBySlug(slug: string | undefined): Project | undefined {
  return projects.find((p) => p.slug === slug)
}
