import { NextRequest, NextResponse } from 'next/server'
import { generateAIResponse } from '@/lib/groq'

export async function POST(req: NextRequest) {
  try {
    const { title, description, tech_stack, github_url, demo_url } = await req.json()

    const prompt = `You are a hackathon judge assistant. Analyze this project and respond ONLY with valid JSON.

Project: ${title}
Description: ${description}
Tech Stack: ${tech_stack?.join(', ')}
GitHub: ${github_url}
Demo: ${demo_url ?? 'Not provided'}

Respond with this exact JSON structure:
{
  "summary": "One paragraph under 80 words summarizing the project idea and value",
  "innovation_level": <number 1-10>,
  "complexity_level": <number 1-10>,
  "key_strengths": ["strength 1", "strength 2", "strength 3"]
}`

    const raw = await generateAIResponse(prompt)

    // Extract JSON from response
    const match = raw.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('No JSON in response')
    const result = JSON.parse(match[0])

    return NextResponse.json({ success: true, data: result })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
