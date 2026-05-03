import { type GitHubAnalysis } from './githubAnalyzer'
import { generateAIResponse } from './groq'

export interface StudentVerdict {
  overall_verdict: 'Strong Hire' | 'Hire' | 'Maybe' | 'Pass'
  verdict_score: number          // 1–10
  confidence: 'High' | 'Medium' | 'Low'
  summary: string                // 2–3 sentence overview
  strengths: string[]
  concerns: string[]
  standout_projects: string[]    // repo names worth noting
  skill_profile: {
    primary_languages: string[]
    domains: string[]            // e.g. "AI/ML", "Web", "Systems"
    depth_signal: string         // e.g. "Broad generalist" or "Deep specialist"
  }
  hackathon_readiness: number    // 1–10
  recommendation: string         // one actionable sentence
}

function buildPrompt(username: string, analysis: GitHubAnalysis, context?: string): string {
  const { profile, top_repos, languages, total_stars, total_forks, active_days_estimate, top_topics, account_age_years } = analysis

  const langList = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([lang, count]) => `${lang} (${count} repos)`)
    .join(', ')

  const repoList = top_repos.map((r) =>
    `- ${r.name}: ${r.description ?? 'no description'} | ⭐${r.stargazers_count} | ${r.language ?? 'unknown'}`
  ).join('\n')

  return `You are an expert technical recruiter and hackathon judge evaluating a developer's GitHub profile for selection.

DEVELOPER PROFILE:
- Username: ${username}
- Name: ${profile.name ?? 'Not provided'}
- Bio: ${profile.bio ?? 'Not provided'}
- Account age: ${account_age_years} years
- Public repos: ${profile.public_repos}
- Followers: ${profile.followers}
- Location: ${profile.location ?? 'Unknown'}
- Total stars earned: ${total_stars}
- Total forks: ${total_forks}
- Repos active in last 90 days: ${active_days_estimate}

LANGUAGES USED:
${langList || 'None detected'}

TOP REPOSITORIES:
${repoList || 'No public repos'}

TOPICS/INTERESTS:
${top_topics.join(', ') || 'None'}

${context ? `ADDITIONAL CONTEXT FROM EVALUATOR:\n${context}\n` : ''}

Analyze this developer and respond ONLY with valid JSON matching this exact structure:
{
  "overall_verdict": "<one of: Strong Hire, Hire, Maybe, Pass>",
  "verdict_score": <integer 1-10>,
  "confidence": "<one of: High, Medium, Low>",
  "summary": "<2-3 sentences summarizing this developer's profile and potential>",
  "strengths": ["<specific strength 1>", "<specific strength 2>", "<specific strength 3>"],
  "concerns": ["<specific concern 1>", "<specific concern 2>"],
  "standout_projects": ["<repo name>", "<repo name>"],
  "skill_profile": {
    "primary_languages": ["<lang1>", "<lang2>"],
    "domains": ["<domain1>", "<domain2>"],
    "depth_signal": "<one sentence characterizing their technical depth>"
  },
  "hackathon_readiness": <integer 1-10>,
  "recommendation": "<one specific, actionable sentence for the evaluator>"
}`
}

export async function generateVerdict(
  username: string,
  analysis: GitHubAnalysis,
  context?: string,
): Promise<StudentVerdict> {
  const prompt = buildPrompt(username, analysis, context)
  const raw = await generateAIResponse(prompt)

  // Extract JSON robustly
  const match = raw.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('AI returned invalid response — no JSON found')

  const parsed = JSON.parse(match[0]) as StudentVerdict

  // Validate required fields
  if (!parsed.overall_verdict || !parsed.verdict_score) {
    throw new Error('AI response missing required verdict fields')
  }

  return parsed
}
