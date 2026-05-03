"use client"

import { useState } from 'react'
import { GlassCard } from '@/components/GlassCard'
import { CTAButton } from '@/components/CTAButton'
import { cn } from '@/lib/utils'

interface AIScore {
  innovation: number
  technical_complexity: number
  completeness: number
  final_score: number
  reasoning: string
}

interface ScorePanelProps {
  projectId: number
  project: {
    title: string
    description: string
    tech_stack: string[]
    commit_count: number
    github_stars: number
  }
  preloadedScore?: AIScore
  onScoreSubmit?: (scores: ScoreData) => void
}

export interface ScoreData {
  innovation: number
  execution: number
  impact: number
  ai_score: number | null
  human_score: number
  feedback: string
}

export function ScorePanel({ project, preloadedScore, onScoreSubmit }: ScorePanelProps) {
  const [scores, setScores] = useState({
    innovation: preloadedScore?.innovation ?? 5,
    execution: preloadedScore?.technical_complexity ?? 5,
    impact: preloadedScore?.completeness ?? 5,
  })
  const [feedback, setFeedback] = useState('')
  const [aiScore, setAiScore] = useState<AIScore | null>(preloadedScore ?? null)
  const [loadingAI, setLoadingAI] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const humanScore = Math.round(((scores.innovation + scores.execution + scores.impact) / 3) * 10) / 10

  async function fetchAIScore() {
    if (preloadedScore) {
      setAiScore(preloadedScore)
      return
    }
    setLoadingAI(true)
    try {
      const res = await fetch('/api/ai/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      })
      const json = await res.json()
      if (json.success) setAiScore(json.data)
    } finally {
      setLoadingAI(false)
    }
  }

  function submit() {
    onScoreSubmit?.({
      innovation: scores.innovation,
      execution: scores.execution,
      impact: scores.impact,
      ai_score: aiScore?.final_score ?? null,
      human_score: humanScore,
      feedback,
    })
    setSubmitted(true)
  }

  return (
    <GlassCard hover={false} className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Score</p>
          <span className="text-xs text-muted-foreground border border-white/10 rounded-full px-2 py-0.5 bg-white/5">
            Smart Score
          </span>
        </div>
        <CTAButton size="sm" onClick={fetchAIScore} disabled={loadingAI || !!aiScore}>
          {loadingAI ? 'Analyzing...' : aiScore ? 'AI Score Loaded' : 'AI Suggest Score'}
        </CTAButton>
      </div>

      {/* AI suggested score */}
      {aiScore && (
        <div className="liquid-glass rounded-xl p-4 animate-fade-rise bg-white/[0.03]">
          <p className="text-xs text-muted-foreground mb-2">AI Suggested Score</p>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-light text-foreground">{aiScore.final_score}</span>
            <span className="text-xs text-muted-foreground">/10</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{aiScore.reasoning}</p>
        </div>
      )}

      {/* Sliders */}
      {(['innovation', 'execution', 'impact'] as const).map((field) => (
        <div key={field}>
          <div className="flex justify-between mb-2">
            <label className="text-xs text-muted-foreground capitalize">{field}</label>
            <span className="text-xs text-foreground">{scores[field]}/10</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={scores[field]}
            onChange={(e) => setScores((p) => ({ ...p, [field]: Number(e.target.value) }))}
            className="w-full accent-white h-0.5 bg-border rounded-full appearance-none cursor-pointer"
          />
        </div>
      ))}

      {/* Human total */}
      <div className="flex items-center justify-between pt-3 border-t border-white/10">
        <p className="text-xs text-muted-foreground">Your Score</p>
        <p className={cn('text-2xl font-light',
          humanScore >= 7 ? 'text-emerald-400' : humanScore >= 5 ? 'text-yellow-400' : 'text-red-400'
        )}>
          {humanScore}<span className="text-xs text-muted-foreground">/10</span>
        </p>
      </div>

      {/* Notes */}
      <textarea
        rows={3}
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Notes for the team..."
        className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-white/30 transition-colors resize-none"
      />

      <CTAButton size="md" onClick={submit} disabled={submitted} className="w-full justify-center">
        {submitted ? 'Score Submitted ✓' : 'Submit Score'}
      </CTAButton>
    </GlassCard>
  )
}
