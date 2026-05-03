import { NextRequest, NextResponse } from 'next/server'
import { generateAIResponse } from '@/lib/groq'

export async function POST(req: NextRequest) {
  try {
    const { title, description, tech_stack, commit_count, github_stars } = await req.json()

    const prompt = `You are an expert hackathon judge. Evaluate this project and respond ONLY with valid JSON.

Project: ${title}
Description: ${description}
Tech Stack: ${tech_stack?.join(', ')}
GitHub Stars: ${github_stars}
Commit Count: ${commit_count}

Score each dimension 1-10 based on:
- innovation: originality and creative problem-solving
- technical_complexity: depth of engineering and architecture
- completeness: how finished and polished the project is

Respond with this exact JSON:
{
  "innovation": <1-10>,
  "technical_complexity": <1-10>,
  "completeness": <1-10>,
  "final_score": <weighted average, 1-10>,
  "reasoning": "One sentence explaining the score"
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
