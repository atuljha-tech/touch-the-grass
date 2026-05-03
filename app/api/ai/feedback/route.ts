import { NextRequest, NextResponse } from 'next/server'
import { generateAIResponse } from '@/lib/groq'

export async function POST(req: NextRequest) {
  try {
    const { title, description, tech_stack, scores } = await req.json()

    const prompt = `You are a senior engineer giving constructive feedback to a hackathon team. Respond ONLY with valid JSON.

Project: ${title}
Description: ${description}
Tech Stack: ${tech_stack?.join(', ')}
Scores — Innovation: ${scores?.innovation}/10, Execution: ${scores?.execution}/10, Impact: ${scores?.impact}/10

Respond with this exact JSON:
{
  "strengths": ["specific strength 1", "specific strength 2"],
  "weaknesses": ["specific weakness 1", "specific weakness 2"],
  "suggestions": ["actionable suggestion 1", "actionable suggestion 2", "actionable suggestion 3"],
  "closing": "One encouraging sentence for the team"
}`

    const raw = await generateAIResponse(prompt)
    const match = raw.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('No JSON in response')
    const result = JSON.parse(match[0])

    return NextResponse.json({ success: true, data: result })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
