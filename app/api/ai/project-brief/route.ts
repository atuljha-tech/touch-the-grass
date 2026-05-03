import { NextRequest, NextResponse } from 'next/server'
import { generateAIResponse } from '@/lib/groq'

function safeParseJSON(raw: string) {
  // Try direct parse first, then extract JSON block
  try { return JSON.parse(raw) } catch {}
  const match = raw.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('No valid JSON in AI response')
  return JSON.parse(match[0])
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, description, tech_stack, github_url, demo_url } = body

    if (!title || !description) {
      return NextResponse.json({ success: false, error: 'title and description are required' }, { status: 400 })
    }

    const prompt = `You are a hackathon judge assistant. Analyze this project and respond ONLY with valid JSON — no markdown, no explanation, just the JSON object.

Project: ${title}
Description: ${description}
Tech Stack: ${Array.isArray(tech_stack) ? tech_stack.join(', ') : 'Not specified'}
GitHub: ${github_url ?? 'Not provided'}
Demo: ${demo_url ?? 'Not provided'}

Respond with ONLY this JSON (no other text):
{
  "summary": "One paragraph under 80 words summarizing the project idea and value",
  "innovation_level": 7,
  "complexity_level": 6,
  "key_strengths": ["strength 1", "strength 2", "strength 3"]
}`

    const raw = await generateAIResponse(prompt)
    const result = safeParseJSON(raw)

    // Validate shape
    if (!result.summary || typeof result.innovation_level !== 'number') {
      throw new Error('AI returned unexpected response structure')
    }

    return NextResponse.json({ success: true, data: result })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
