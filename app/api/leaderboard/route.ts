import { NextResponse } from 'next/server'
import { PROJECTS } from '@/lib/data'

export async function GET() {
  // Aggregate scores: stars + commits as proxy until real DB scores exist
  const ranked = PROJECTS.map((p) => {
    const highlight_score = Math.min(10, (p.github_stars / 120) * 10)
    const effort_score = Math.min(10, (p.commit_count / 150) * 10)
    const composite = Math.round((highlight_score * 0.4 + effort_score * 0.6) * 10) / 10
    return {
      id: p.id,
      title: p.title,
      team: p.team,
      track: p.track,
      tech_stack: p.tech_stack,
      github_stars: p.github_stars,
      commit_count: p.commit_count,
      composite_score: composite,
      highlight: composite >= 5,
    }
  }).sort((a, b) => b.composite_score - a.composite_score)

  return NextResponse.json({ success: true, data: ranked })
}
