"use client"

import { useState } from 'react'
import { GlassCard } from '@/components/GlassCard'
import { CTAButton } from '@/components/CTAButton'
import { cn } from '@/lib/utils'

interface Brief {
  summary: string
  innovation_level: number
  complexity_level: number
  key_strengths: string[]
}

interface AISummaryCardProps {
  project: {
    id: number
    title: string
    description: string
    tech_stack: string[]
    github_url: string
    demo_url: string | null
  }
  preloaded?: Brief
}

export function AISummaryCard({ project, preloaded }: AISummaryCardProps) {
  const [brief, setBrief] = useState<Brief | null>(preloaded ?? null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generate() {
    // If preloaded data exists, just show it instantly
    if (preloaded) {
      setBrief(preloaded)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/ai/project-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setBrief(json.data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate brief')
    } finally {
      setLoading(false)
    }
  }

  return (
    <GlassCard hover={false} className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">AI Brief</p>
          <span className="text-xs text-muted-foreground border border-white/10 rounded-full px-2 py-0.5 bg-white/5">
            AI Powered
          </span>
        </div>
        {!brief && (
          <CTAButton size="sm" onClick={generate} disabled={loading}>
            {loading ? 'Generating...' : 'Generate AI Brief'}
          </CTAButton>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-400/20 bg-red-400/5 px-4 py-3">
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}

      {loading && (
        <div className="flex flex-col gap-3 animate-pulse">
          {[90, 70, 80].map((w, i) => (
            <div key={i} className="h-3 bg-white/10 rounded-full" style={{ width: `${w}%` }} />
          ))}
        </div>
      )}

      {brief && !loading && (
        <div className="flex flex-col gap-4 animate-fade-rise">
          <p className="text-foreground/90 text-sm leading-relaxed">{brief.summary}</p>

          <div className="grid grid-cols-2 gap-3">
            <ScorePill label="Innovation" value={brief.innovation_level} />
            <ScorePill label="Complexity" value={brief.complexity_level} />
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">Key Strengths</p>
            <ul className="flex flex-col gap-1.5">
              {brief.key_strengths.map((s, i) => (
                <li key={i} className="text-sm text-foreground/90">— {s}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </GlassCard>
  )
}

function ScorePill({ label, value }: { label: string; value: number }) {
  const color = value >= 8 ? 'text-emerald-400' : value >= 5 ? 'text-yellow-400' : 'text-red-400'
  return (
    <div className="liquid-glass rounded-xl px-4 py-3 bg-white/[0.03]">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={cn('text-2xl font-light', color)}>
        {value}<span className="text-xs text-muted-foreground">/10</span>
      </p>
    </div>
  )
}
