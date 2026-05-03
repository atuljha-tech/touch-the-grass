// Mock AI generator — used in demo mode to avoid API calls

export interface MockAIOutput {
  summary: string
  ai_score: {
    innovation: number
    technical_complexity: number
    completeness: number
    final_score: number
    reasoning: string
  }
  effort_score: number
}

const summaryTemplates = [
  (title: string, desc: string) =>
    `${title} tackles a real-world problem with a focused, well-executed approach. ${desc.slice(0, 80)}... The team demonstrates strong technical depth and clear product thinking.`,
  (title: string, desc: string) =>
    `${title} is a technically ambitious submission that shows genuine domain expertise. ${desc.slice(0, 80)}... Clean architecture and thoughtful UX set it apart from the cohort.`,
  (title: string, desc: string) =>
    `${title} addresses an underserved problem with a pragmatic solution. ${desc.slice(0, 80)}... The implementation is complete and the scope is appropriately constrained for a hackathon.`,
]

function seededRandom(seed: number, min: number, max: number): number {
  const x = Math.sin(seed) * 10000
  const r = x - Math.floor(x)
  return Math.round(min + r * (max - min))
}

export function generateMockAI(project: {
  id: number
  title: string
  description: string
  commit_count?: number
  contributors?: number
  github_stars?: number
}): MockAIOutput {
  const seed = project.id * 137

  const innovation = seededRandom(seed + 1, 6, 10)
  const complexity = seededRandom(seed + 2, 6, 10)
  const completeness = seededRandom(seed + 3, 6, 10)
  const final_score = Math.round(((innovation + complexity + completeness) / 3) * 10) / 10

  const commits = project.commit_count ?? seededRandom(seed + 4, 40, 200)
  const contributors = project.contributors ?? seededRandom(seed + 5, 1, 4)
  const stars = project.github_stars ?? seededRandom(seed + 6, 10, 100)

  const commitScore = Math.min(10, (commits / 20) * 10)
  const balanceScore = contributors >= 3 ? 10 : contributors === 2 ? 7 : 4
  const communityScore = Math.min(10, (stars / 50) * 10)
  const effort_score = Math.min(10, Math.max(1,
    Math.round(commitScore * 0.5 + balanceScore * 0.3 + communityScore * 0.2)
  ))

  const templateIdx = seed % summaryTemplates.length
  const summary = summaryTemplates[templateIdx](project.title, project.description)

  const reasonings = [
    'Strong execution with clear real-world applicability and solid technical depth.',
    'Innovative approach with good completeness. Minor gaps in documentation.',
    'Well-scoped project with clean implementation. Demonstrates solid engineering judgment.',
    'High technical complexity balanced with practical usability. Impressive for a hackathon.',
  ]

  return {
    summary,
    ai_score: {
      innovation,
      technical_complexity: complexity,
      completeness,
      final_score,
      reasoning: reasonings[seed % reasonings.length],
    },
    effort_score,
  }
}

export function rankScore(ai_score: number, effort_score: number): number {
  return Math.round((ai_score * 0.7 + effort_score * 0.3) * 10) / 10
}
