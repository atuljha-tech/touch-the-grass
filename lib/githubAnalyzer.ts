export interface GitHubProfile {
  login: string
  name: string | null
  bio: string | null
  public_repos: number
  followers: number
  following: number
  created_at: string
  avatar_url: string
  html_url: string
  location: string | null
  company: string | null
  blog: string | null
}

export interface GitHubRepo {
  name: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
  html_url: string
  topics: string[]
  size: number
  open_issues_count: number
}

export interface GitHubAnalysis {
  profile: GitHubProfile
  top_repos: GitHubRepo[]
  languages: Record<string, number>   // language → repo count
  total_stars: number
  total_forks: number
  active_days_estimate: number        // rough activity signal
  top_topics: string[]
  account_age_years: number
}

const GH_API = 'https://api.github.com'

async function ghFetch(path: string): Promise<Response> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  // Use token if available to raise rate limit
  const token = process.env.GITHUB_TOKEN
  if (token) headers['Authorization'] = `Bearer ${token}`

  return fetch(`${GH_API}${path}`, { headers, next: { revalidate: 300 } })
}

export async function analyzeGitHubUser(username: string): Promise<GitHubAnalysis> {
  // Fetch profile and repos in parallel
  const [profileRes, reposRes] = await Promise.all([
    ghFetch(`/users/${username}`),
    ghFetch(`/users/${username}/repos?sort=updated&per_page=30`),
  ])

  if (!profileRes.ok) {
    if (profileRes.status === 404) throw new Error(`GitHub user "${username}" not found`)
    if (profileRes.status === 403) throw new Error('GitHub API rate limit hit. Try again in a minute.')
    throw new Error(`GitHub API error: ${profileRes.status}`)
  }

  const profile: GitHubProfile = await profileRes.json()
  const repos: GitHubRepo[] = reposRes.ok ? await reposRes.json() : []

  // Aggregate language counts
  const languages: Record<string, number> = {}
  for (const repo of repos) {
    if (repo.language) {
      languages[repo.language] = (languages[repo.language] ?? 0) + 1
    }
  }

  // Aggregate topics
  const topicCounts: Record<string, number> = {}
  for (const repo of repos) {
    for (const topic of repo.topics ?? []) {
      topicCounts[topic] = (topicCounts[topic] ?? 0) + 1
    }
  }
  const top_topics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([t]) => t)

  const total_stars = repos.reduce((s, r) => s + r.stargazers_count, 0)
  const total_forks = repos.reduce((s, r) => s + r.forks_count, 0)

  // Sort repos by stars for top picks
  const top_repos = [...repos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6)

  // Account age
  const created = new Date(profile.created_at)
  const account_age_years = Math.round(
    (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24 * 365)
  )

  // Rough activity estimate: repos updated in last 90 days
  const cutoff = Date.now() - 90 * 24 * 60 * 60 * 1000
  const active_days_estimate = repos.filter(
    (r) => new Date(r.updated_at).getTime() > cutoff
  ).length

  return {
    profile,
    top_repos,
    languages,
    total_stars,
    total_forks,
    active_days_estimate,
    top_topics,
    account_age_years,
  }
}
