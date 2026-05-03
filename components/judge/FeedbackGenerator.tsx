"use client"

import { useState } from 'react'
import { GlassCard } from '@/components/GlassCard'
import { CTAButton } from '@/components/CTAButton'

interface FeedbackGeneratorProps {
  project: {
    title: string
    description: string
    tech_stack: string[]
  }
  scores: { innovation: number; execution: number; impact: number }
}

interface AIFeedback {
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
  closing: string
}

export function FeedbackGenerator({ project, scores }: FeedbackGeneratorProps) {
  const [feedback, setFeedback] = useState<AIFeedback | null>(null)
  const [loading, setLoading] = useState(false)

  async function generate() {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...project, scores }),
      })
      const json = await res.json()
      if (json.success) setFeedback(json.data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <GlassCard hover={false} className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">AI Feedback</p>
        <CTAButton size="sm" onClick={generate} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Feedback'}
        </CTAButton>
      </div>

      {feedback && (
        <div className="flex flex-col gap-5 animate-fade-rise">
          <FeedbackSection label="Strengths" items={feedback.strengths} color="text-emerald-400" />
          <FeedbackSection label="Weaknesses" items={feedback.weaknesses} color="text-yellow-400" />
          <FeedbackSection label="Suggestions" items={feedback.suggestions} color="text-foreground" />
          <p className="text-sm text-muted-foreground italic border-t border-border pt-4">{feedback.closing}</p>
        </div>
      )}
    </GlassCard>
  )
}

function FeedbackSection({ label, items, color }: { label: string; items: string[]; color: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-2">{label}</p>
      <ul className="flex flex-col gap-1.5">
        {items.map((item, i) => (
          <li key={i} className={`text-sm ${color}`}>— {item}</li>
        ))}
      </ul>
    </div>
  )
}
