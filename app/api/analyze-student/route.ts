import { NextRequest, NextResponse } from 'next/server'
import { analyzeGitHubUser } from '@/lib/githubAnalyzer'
import { generateVerdict } from '@/lib/verdictGenerator'

export async function POST(req: NextRequest) {
  try {
    const { username, context } = await req.json()

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ success: false, error: 'GitHub username is required' }, { status: 400 })
    }

    const clean = username.trim().replace(/^@/, '').replace(/https?:\/\/github\.com\//i, '')

    // Step 1: Fetch GitHub data
    const analysis = await analyzeGitHubUser(clean)

    // Step 2: Generate AI verdict
    const verdict = await generateVerdict(clean, analysis, context)

    return NextResponse.json({
      success: true,
      data: {
        username: clean,
        profile: {
          name: analysis.profile.name,
          bio: analysis.profile.bio,
          avatar_url: analysis.profile.avatar_url,
          html_url: analysis.profile.html_url,
          public_repos: analysis.profile.public_repos,
          followers: analysis.profile.followers,
          location: analysis.profile.location,
          account_age_years: analysis.account_age_years,
          total_stars: analysis.total_stars,
          active_days_estimate: analysis.active_days_estimate,
        },
        top_repos: analysis.top_repos.map((r) => ({
          name: r.name,
          description: r.description,
          language: r.language,
          stars: r.stargazers_count,
          forks: r.forks_count,
          url: r.html_url,
        })),
        languages: analysis.languages,
        verdict,
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
