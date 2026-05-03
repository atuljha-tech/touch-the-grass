// Mock AI generator — used in demo mode to avoid API calls
//
// Scores are stable per project (same base from project ID) but drift
// ±0.1–0.2 on each app load via a session jitter seed. This makes the
// leaderboard feel live without breaking the relative ordering.

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

// Deterministic float in [0, 1) from a seed — same seed always same value
function seededFloat(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

// Integer in [min, max] from seed
function seededInt(seed: number, min: number, max: number): number {
  return Math.round(min + seededFloat(seed) * (max - min))
}

// Session jitter: changes every page load, but is stable within a session.
// Produces a small float in [-0.25, +0.25].
const SESSION_JITTER = (() => {
  // Use current minute as the jitter epoch — changes every 60s max
  const epoch = Math.floor(Date.now() / 60000)
  const raw = seededFloat(epoch * 7919)   // prime multiplier for spread
  return (raw - 0.5) * 0.5               // range: -0.25 to +0.25
})()

// Per-project jitter: each project gets a unique small offset so they
// don't all drift in the same direction at the same time.
function projectJitter(projectId: number): number {
  const raw = seededFloat(projectId * 3571 + 1234)
  return (raw - 0.5) * 0.4              // range: -0.2 to +0.2
}

// Clamp a score to [1, 10] with one decimal place
function clampScore(value: number): number {
  return Math.round(Math.min(10, Math.max(1, value)) * 10) / 10
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
  const jitter = SESSION_JITTER + projectJitter(project.id)

  // Base integer scores (stable per project)
  const baseInnovation   = seededInt(seed + 1, 6, 10)
  const baseComplexity   = seededInt(seed + 2, 6, 10)
  const baseCompleteness = seededInt(seed + 3, 6, 10)

  // Apply jitter — each dimension gets a slightly different drift
  const innovation   = clampScore(baseInnovation   + jitter + seededFloat(seed + 11) * 0.2 - 0.1)
  const complexity   = clampScore(baseComplexity   + jitter + seededFloat(seed + 12) * 0.2 - 0.1)
  const completeness = clampScore(baseCompleteness + jitter + seededFloat(seed + 13) * 0.2 - 0.1)

  const final_score = clampScore((innovation + complexity + completeness) / 3)

  // Effort score — also gets a small jitter so it doesn't feel frozen
  const commits      = project.commit_count      ?? seededInt(seed + 4, 40, 200)
  const contributors = project.contributors      ?? seededInt(seed + 5, 1, 4)
  const stars        = project.github_stars      ?? seededInt(seed + 6, 10, 100)

  const commitScore    = Math.min(10, (commits / 20) * 10)
  const balanceScore   = contributors >= 3 ? 10 : contributors === 2 ? 7 : 4
  const communityScore = Math.min(10, (stars / 50) * 10)

  const baseEffort = commitScore * 0.5 + balanceScore * 0.3 + communityScore * 0.2
  const effortJitter = (seededFloat(seed + 20) - 0.5) * 0.4 + SESSION_JITTER * 0.5
  const effort_score = clampScore(baseEffort + effortJitter)

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
