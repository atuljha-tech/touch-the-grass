import { NextRequest, NextResponse } from 'next/server'
import { generateAIResponse } from '@/lib/groq'

function safeParseJSON(raw: string) {
  try { return JSON.parse(raw) } catch {}
  const match = raw.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('No valid JSON in AI response')
  return JSON.parse(match[0])
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, description, tech_stack, commit_count, github_stars } = body

    if (!title || !description) {
      return NextResponse.json({ success: false, error: 'title and description are required' }, { status: 400 })
    }

    const prompt = `You are an expert hackathon judge. Evaluate this project and respond ONLY with valid JSON — no markdown, no explanation.

Project: ${title}
Description: ${description}
Tech Stack: ${Array.isArray(tech_stack) ? tech_stack.join(', ') : 'Not specified'}
GitHub Stars: ${github_stars ?? 0}
Commit Count: ${commit_count ?? 0}

Respond with ONLY this JSON (use actual numbers, not placeholders):
{
  "innovation": 7,
  "technical_complexity": 6,
  "completeness": 8,
  "final_score": 7,
  "reasoning": "One sentence explaining the overall score"
}`

    const raw = await generateAIResponse(prompt)
    const result = safeParseJSON(raw)

    if (typeof result.final_score !== 'number') {
      throw new Error('AI returned unexpected score structure')
    }

    // Clamp all scores to 1-10
    const clamp = (n: number) => Math.min(10, Math.max(1, Math.round(n * 10) / 10))
    result.innovation = clamp(result.innovation)
    result.technical_complexity = clamp(result.technical_complexity)
    result.completeness = clamp(result.completeness)
    result.final_score = clamp(result.final_score)

    return NextResponse.json({ success: true, data: result })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
