"use client"

import { createContext, useContext, useState, type ReactNode } from 'react'
import {
  DEMO_PROJECTS, DEMO_HACKERS, DEMO_SPONSORS,
  type DemoProject, type DemoHacker, type DemoSponsor,
} from '@/lib/demo/data'
import { generateMockAI, rankScore } from '@/lib/demo/mockAI'

interface AppStoreContextValue {
  projects: DemoProject[]
  hackers: DemoHacker[]
  sponsors: DemoSponsor[]
  addProject: (draft: NewProjectDraft) => DemoProject
  addSponsor: (s: Omit<DemoSponsor, 'id'>) => void
}

export interface NewProjectDraft {
  title: string
  description: string
  github_url: string
  demo_url: string
  tech_stack: string[]
  hacker_id: string
  author_name: string
  track: string
}

const AppStoreContext = createContext<AppStoreContextValue>({
  projects: DEMO_PROJECTS,
  hackers: DEMO_HACKERS,
  sponsors: DEMO_SPONSORS,
  addProject: () => { throw new Error('not mounted') },
  addSponsor: () => {},
})

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<DemoProject[]>(DEMO_PROJECTS)
  const [hackers] = useState<DemoHacker[]>(DEMO_HACKERS)
  const [sponsors, setSponsors] = useState<DemoSponsor[]>(DEMO_SPONSORS)

  function addProject(draft: NewProjectDraft): DemoProject {
    const id = Date.now()
    const mock = generateMockAI({
      id,
      title: draft.title,
      description: draft.description,
      commit_count: 40,
      contributors: 1,
      github_stars: 0,
    })

    const project: DemoProject = {
      id,
      title: draft.title,
      team: draft.author_name,
      track: draft.track,
      description: draft.description,
      github_url: draft.github_url || `https://github.com/example/${draft.title.toLowerCase().replace(/\s+/g, '-')}`,
      demo_url: draft.demo_url || null,
      tech_stack: draft.tech_stack,
      github_stars: 0,
      commit_count: 40,
      contributors: 1,
      author_name: draft.author_name,
      author_college: '',
      hacker_id: draft.hacker_id,
      status: 'submitted',
      problem: draft.description,
      solution: draft.description,
      impact: '0 stars · 40 commits · 1 contributor',
      ai_brief: {
        summary: mock.summary,
        innovation_level: mock.ai_score.innovation,
        complexity_level: mock.ai_score.technical_complexity,
        key_strengths: ['Fresh submission — AI analysis complete', 'Scope is well-defined', 'Technical stack is appropriate'],
      },
      ai_score: mock.ai_score,
      ai_feedback: {
        strengths: ['Clear problem statement', 'Appropriate technology choices'],
        weaknesses: ['Early stage — needs more validation', 'Documentation could be expanded'],
        suggestions: ['Add a live demo', 'Write a clear README', 'Include benchmark results'],
        closing: 'Strong start — keep building.',
      },
      effort_score: mock.effort_score,
      rank_score: rankScore(mock.ai_score.final_score, mock.effort_score),
    }

    setProjects((prev) => [...prev, project].sort((a, b) => b.rank_score - a.rank_score))
    return project
  }

  function addSponsor(s: Omit<DemoSponsor, 'id'>) {
    setSponsors((prev) => [...prev, { ...s, id: Date.now() }])
  }

  return (
    <AppStoreContext.Provider value={{ projects, hackers, sponsors, addProject, addSponsor }}>
      {children}
    </AppStoreContext.Provider>
  )
}

export function useAppStore() {
  return useContext(AppStoreContext)
}
