export type SceneKind = 'bars' | 'documents' | 'pipeline' | 'gateway' | 'boxes' | 'outlier'

export interface ProjectGroup {
  title: string
  items: string[]
}

export interface ProjectSection {
  heading: string
  paragraphs?: string[]
  groups?: ProjectGroup[]
  items?: string[]
  links?: string[]
  tags?: string[]
}

export interface Project {
  slug: string
  title: string
  summary: string
  cover: string
  sections: ProjectSection[]
  scene: SceneKind
  stack: string[]
  accent: string
  /** paid client work (shows a badge) */
  client?: boolean
  /** public URL of the live product */
  liveUrl?: string
}

export interface Experience {
  period: string
  role: string
  org: string
  description: string
}

export interface Profile {
  name: string
  firstName: string
  roles: string[]
  tagline: string
  intro: string
  values: string[]
  currentRole: string
  email: string
  github: string
  linkedin: string
}
