"use client"

import { useState } from 'react'
import { GlassCard } from '@/components/GlassCard'
import { CTAButton } from '@/components/CTAButton'

interface AIFeedback {
  strengths: string[]
  weaknesses: string[]
  suggestions: string[]
  closing: string
}

interface FeedbackGeneratorProps {
  project: {
    title: string
    description: string
    tech_stack: string[]
  }
  scores: { innovation: number; execution: number; impact: number }
  preloaded?: AIFeedback
}

export function FeedbackGenerator({ project, scores, preloaded }: FeedbackGeneratorProps) {
  const [feedback, setFeedback] = useState<AIFeedback | null>(preloaded ?? null)
  const [loading, setLoading] = useState(false)

  async function generate() {
    if (preloaded) {
      setFeedback(preloaded)
      return
    }
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
        <div className="flex items-center gap-2">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">AI Feedback</p>
          <span className="text-xs text-muted-foreground border border-white/10 rounded-full px-2 py-0.5 bg-white/5">
            AI Generated
          </span>
        </div>
        {!feedback && (
          <CTAButton size="sm" onClick={generate} disabled={loading}>
            {loading ? 'Generating...' : 'Generate Feedback'}
          </CTAButton>
        )}
      </div>

      {loading && (
        <div className="flex flex-col gap-3 animate-pulse">
          {[80, 60, 70, 50].map((w, i) => (
            <div key={i} className="h-3 bg-white/10 rounded-full" style={{ width: `${w}%` }} />
          ))}
        </div>
      )}

      {feedback && !loading && (
        <div className="flex flex-col gap-5 animate-fade-rise">
          <FeedbackSection label="Strengths" items={feedback.strengths} color="text-emerald-400" />
          <FeedbackSection label="Weaknesses" items={feedback.weaknesses} color="text-yellow-400" />
          <FeedbackSection label="Suggestions" items={feedback.suggestions} color="text-foreground/90" />
          <p className="text-sm text-muted-foreground italic border-t border-white/10 pt-4">
            {feedback.closing}
          </p>
        </div>
      )}
    </GlassCard>
  )
}

function FeedbackSection({ label, items, color }: { label: string; items: string[]; color: string }) {
  if (!items?.length) return null
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
