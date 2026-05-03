export interface Project {
  id: number
  title: string
  team: string
  track: string
  description: string
  github_url: string
  demo_url: string | null
  tech_stack: string[]
  github_stars: number
  commit_count: number
  contributors: number
  // blind mode hides these
  author_name: string
  author_college: string
}

export interface JudgeScore {
  project_id: number
  innovation: number
  execution: number
  impact: number
  ai_score: number | null
  human_score: number | null
  effort_score: number | null
  feedback: string
  ai_feedback: string | null
}

export interface Judge {
  id: number
  name: string
  events_judged: number
  avg_score_consistency: number
  feedback_quality_score: number
}

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Codeflow',
    team: 'Team Sigma',
    track: 'Developer Tooling',
    description: 'A minimal async code review tool built for distributed teams. Focuses on signal over noise with AI-assisted diff summaries.',
    github_url: 'https://github.com/example/codeflow',
    demo_url: 'https://codeflow.demo',
    tech_stack: ['React', 'TypeScript', 'Go', 'PostgreSQL'],
    github_stars: 42,
    commit_count: 87,
    contributors: 3,
    author_name: 'Alex Rivera',
    author_college: 'MIT',
  },
  {
    id: 2,
    title: 'NeuralNest',
    team: 'Team Apex',
    track: 'AI & Machine Learning',
    description: 'A local-first LLM orchestration layer that lets developers run and chain models without cloud dependency.',
    github_url: 'https://github.com/example/neuralnest',
    demo_url: null,
    tech_stack: ['Python', 'Rust', 'ONNX', 'FastAPI'],
    github_stars: 118,
    commit_count: 143,
    contributors: 2,
    author_name: 'Maya Chen',
    author_college: 'Stanford',
  },
  {
    id: 3,
    title: 'Patchwork',
    team: 'Team Drift',
    track: 'Open Source',
    description: 'Visual diff tool for design tokens and component libraries. Bridges the gap between design and engineering.',
    github_url: 'https://github.com/example/patchwork',
    demo_url: 'https://patchwork.demo',
    tech_stack: ['React', 'Node.js', 'CSS', 'Figma API'],
    github_stars: 29,
    commit_count: 61,
    contributors: 4,
    author_name: 'Lena Müller',
    author_college: 'TU Berlin',
  },
  {
    id: 4,
    title: 'Groundwork',
    team: 'Team Forge',
    track: 'Developer Tooling',
    description: 'Infrastructure scaffolding CLI for opinionated monorepos. One command to production-ready structure.',
    github_url: 'https://github.com/example/groundwork',
    demo_url: null,
    tech_stack: ['Go', 'Docker', 'Terraform', 'Bash'],
    github_stars: 67,
    commit_count: 112,
    contributors: 2,
    author_name: 'James Okafor',
    author_college: 'UCL',
  },
]

export const JUDGES: Judge[] = [
  { id: 1, name: 'Dr. Sarah Kim', events_judged: 12, avg_score_consistency: 9.1, feedback_quality_score: 8.7 },
  { id: 2, name: 'Raj Mehta', events_judged: 7, avg_score_consistency: 8.4, feedback_quality_score: 9.2 },
  { id: 3, name: 'Priya Nair', events_judged: 5, avg_score_consistency: 7.9, feedback_quality_score: 8.1 },
]
