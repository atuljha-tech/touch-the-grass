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
    const { title, description, tech_stack, scores } = body

    if (!title || !description) {
      return NextResponse.json({ success: false, error: 'title and description are required' }, { status: 400 })
    }

    const innovation = scores?.innovation ?? 5
    const execution = scores?.execution ?? 5
    const impact = scores?.impact ?? 5

    const prompt = `You are a senior engineer giving constructive feedback to a hackathon team. Respond ONLY with valid JSON — no markdown, no explanation.

Project: ${title}
Description: ${description}
Tech Stack: ${Array.isArray(tech_stack) ? tech_stack.join(', ') : 'Not specified'}
Scores — Innovation: ${innovation}/10, Execution: ${execution}/10, Impact: ${impact}/10

Respond with ONLY this JSON:
{
  "strengths": ["specific strength about the project", "another specific strength"],
  "weaknesses": ["specific weakness or gap", "another weakness"],
  "suggestions": ["concrete actionable improvement", "another suggestion", "third suggestion"],
  "closing": "One encouraging sentence for the team"
}`

    const raw = await generateAIResponse(prompt)
    const result = safeParseJSON(raw)

    if (!Array.isArray(result.strengths) || !Array.isArray(result.weaknesses)) {
      throw new Error('AI returned unexpected feedback structure')
    }

    return NextResponse.json({ success: true, data: result })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
