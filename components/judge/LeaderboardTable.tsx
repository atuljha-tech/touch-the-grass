"use client"

import { useEffect, useState } from 'react'
import { GlassCard } from '@/components/GlassCard'
import { cn } from '@/lib/utils'

interface LeaderboardEntry {
  id: number
  title: string
  team: string
  track: string
  tech_stack: string[]
  composite_score: number
  highlight: boolean
}

export function LeaderboardTable() {
  const [data, setData] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/leaderboard')
      .then((r) => r.json())
      .then((json) => { if (json.success) setData(json.data) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="text-muted-foreground text-sm animate-pulse">Loading leaderboard...</p>
  }

  return (
    <div className="flex flex-col gap-3">
      {data.map((entry, i) => (
        <GlassCard key={entry.id} hover={false} className="flex items-center gap-5">
          {/* Rank */}
          <span className={cn(
            'text-2xl font-light w-8 shrink-0 text-center',
            i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-600' : 'text-muted-foreground'
          )}>
            {i + 1}
          </span>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-foreground text-sm" style={{ fontFamily: "'Instrument Serif', serif" }}>
                {entry.title}
              </p>
              {entry.highlight && (
                <span className="text-xs text-yellow-400 border border-yellow-400/30 rounded-full px-2 py-0.5">🔥 Top Pick</span>
              )}
            </div>
            <p className="text-muted-foreground text-xs mt-0.5">{entry.team} · {entry.track}</p>
          </div>

          {/* Stack */}
          <div className="hidden sm:flex gap-1.5 flex-wrap justify-end max-w-[180px]">
            {entry.tech_stack.slice(0, 3).map((t) => (
              <span key={t} className="text-xs text-muted-foreground border border-border rounded-full px-2 py-0.5">{t}</span>
            ))}
          </div>

          {/* Score */}
          <div className="text-right shrink-0">
            <p className={cn(
              'text-xl font-light',
              entry.composite_score >= 7 ? 'text-emerald-400' : entry.composite_score >= 5 ? 'text-yellow-400' : 'text-muted-foreground'
            )}>
              {entry.composite_score}
            </p>
            <p className="text-xs text-muted-foreground">/10</p>
          </div>
        </GlassCard>
      ))}
    </div>
  )
}
