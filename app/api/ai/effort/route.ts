import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { commit_count, contributors, github_stars } = await req.json()

    // Effort score algorithm:
    // - commit frequency weight: 50%
    // - contribution balance weight: 30%
    // - community signal weight: 20%
    const commitScore = Math.min(10, (commit_count / 20) * 10)
    const balanceScore = contributors >= 3 ? 10 : contributors === 2 ? 7 : 4
    const communityScore = Math.min(10, (github_stars / 50) * 10)

    const effort_score = Math.round(
      commitScore * 0.5 + balanceScore * 0.3 + communityScore * 0.2
    )

    return NextResponse.json({
      success: true,
      data: {
        effort_score: Math.min(10, Math.max(1, effort_score)),
        breakdown: {
          commit_score: Math.round(commitScore * 10) / 10,
          balance_score: balanceScore,
          community_score: Math.round(communityScore * 10) / 10,
        },
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
