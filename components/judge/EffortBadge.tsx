"use client"

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface EffortBadgeProps {
  commit_count: number
  contributors: number
  github_stars: number
}

export function EffortBadge({ commit_count, contributors, github_stars }: EffortBadgeProps) {
  const [score, setScore] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/ai/effort', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commit_count, contributors, github_stars }),
    })
      .then((r) => r.json())
      .then((json) => { if (json.success) setScore(json.data.effort_score) })
  }, [commit_count, contributors, github_stars])

  if (score === null) return null

  const label = score >= 8 ? 'High Effort' : score >= 5 ? 'Solid Effort' : 'Light Effort'
  const color = score >= 8 ? 'text-emerald-400 border-emerald-400/30' : score >= 5 ? 'text-yellow-400 border-yellow-400/30' : 'text-muted-foreground border-border'

  return (
    <span className={cn('text-xs border rounded-full px-3 py-0.5', color)}>
      ⚡ {label} {score}/10
    </span>
  )
}
