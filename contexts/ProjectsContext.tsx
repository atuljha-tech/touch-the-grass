"use client"

import { createContext, useContext, useState, type ReactNode } from 'react'
import { type DemoProject, DEMO_PROJECTS } from '@/lib/demo/data'
import { generateMockAI, rankScore } from '@/lib/demo/mockAI'

interface ProjectsContextValue {
  projects: DemoProject[]
  addProject: (draft: NewProjectDraft, hacker_id: string, author_name: string, author_college: string) => DemoProject
}

export interface NewProjectDraft {
  title: string
  description: string
  github_url: string
  demo_url: string
  tech_stack: string[]
  track: string
}

const ProjectsContext = createContext<ProjectsContextValue>({
  projects: DEMO_PROJECTS,
  addProject: () => { throw new Error('ProjectsContext not mounted') },
})

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<DemoProject[]>(DEMO_PROJECTS)

  function addProject(
    draft: NewProjectDraft,
    hacker_id: string,
    author_name: string,
    author_college: string,
  ): DemoProject {
    const id = Date.now()
    const mock = generateMockAI({ id, title: draft.title, description: draft.description })

    const project: DemoProject = {
      id,
      title: draft.title,
      team: author_name,
      track: draft.track,
      description: draft.description,
      github_url: draft.github_url || 'https://github.com/example/project',
      demo_url: draft.demo_url || null,
      tech_stack: draft.tech_stack,
      github_stars: 0,
      commit_count: 12,
      contributors: 1,
      author_name,
      author_college,
      hacker_id,
      status: 'submitted',
      problem: 'Problem statement to be added.',
      solution: draft.description,
      impact: '0 stars · 12 commits · 1 contributor',
      ai_brief: {
        summary: mock.summary,
        innovation_level: mock.ai_score.innovation,
        complexity_level: mock.ai_score.technical_complexity,
        key_strengths: ['Fresh submission — AI analysis complete', 'Technical stack shows solid choices', 'Clear problem-solution framing'],
      },
      ai_score: mock.ai_score,
      ai_feedback: {
        strengths: ['Clear problem definition', 'Solid technical foundation'],
        weaknesses: ['Early stage — needs more validation', 'Documentation could be expanded'],
        suggestions: ['Add a live demo', 'Write a clear README', 'Gather early user feedback'],
        closing: 'Strong start — keep building.',
      },
      effort_score: mock.effort_score,
      rank_score: rankScore(mock.ai_score.final_score, mock.effort_score),
    }

    setProjects((prev) =>
      [...prev, project].sort((a, b) => b.rank_score - a.rank_score)
    )
    return project
  }

  return (
    <ProjectsContext.Provider value={{ projects, addProject }}>
      {children}
    </ProjectsContext.Provider>
  )
}

export function useProjects() {
  return useContext(ProjectsContext)
}
