"use client"

import { PageShell } from '@/components/PageShell'
import { GlassCard } from '@/components/GlassCard'
import { AnimatedHeading } from '@/components/AnimatedHeading'
import { SectionWrapper } from '@/components/SectionWrapper'
import { useAppStore } from '@/contexts/AppStoreContext'
import { useDemoAuth } from '@/contexts/DemoAuthContext'
import { DEMO_HACKERS } from '@/lib/demo/data'
import { canViewScores } from '@/lib/auth'
import { cn } from '@/lib/utils'

export default function Leaderboard() {
  const { projects, isResultPublic } = useAppStore()
  const { user } = useDemoAuth()
  const scoresVisible = canViewScores(user?.role, isResultPublic)

  return (
    <PageShell>
      <SectionWrapper className="pt-16 pb-24">
        <AnimatedHeading as="h2" className="mb-3">
          Live Leaderboard
        </AnimatedHeading>
        <p className="animate-fade-rise-delay text-muted-foreground text-sm max-w-xl mb-3">
          rank score = (AI score × 0.7) + (effort × 0.3)
        </p>

        {!scoresVisible && (
          <div className="animate-fade-rise mb-8 rounded-2xl border border-yellow-400/20 bg-yellow-400/5 px-6 py-4 max-w-xl">
            <p className="text-yellow-400/90 text-sm font-medium mb-1">⏳ Results not yet released</p>
            <p className="text-yellow-400/60 text-xs">The organizer hasn&apos;t made scores public yet. Rankings will appear here once results are announced.</p>
          </div>
        )}

        <p className="animate-fade-rise-delay text-muted-foreground text-xs max-w-xl mb-12">
          {projects.length} projects · {scoresVisible ? 'scores visible' : 'scores hidden until release'}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Ranked list */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {/* Header */}
            <div className="grid grid-cols-12 gap-3 px-4 text-xs text-muted-foreground uppercase tracking-widest mb-1">
              <span className="col-span-1">#</span>
              <span className="col-span-5">Project</span>
              <span className="col-span-2 text-center hidden sm:block">AI</span>
              <span className="col-span-2 text-center hidden sm:block">Effort</span>
              <span className="col-span-2 text-right">Rank</span>
            </div>

            {projects.map((p, i) => (
              <GlassCard key={p.id} hover={false} className="grid grid-cols-12 gap-3 items-center py-4">
                <span className={cn('col-span-1 text-lg font-light text-center',
                  i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-600' : 'text-muted-foreground'
                )}>{i + 1}</span>

                <div className="col-span-5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-foreground text-sm truncate" style={{ fontFamily: "'Instrument Serif', serif" }}>
                      {p.title}
                    </p>
                    {p.status === 'winner' && (
                      <span className="text-xs text-yellow-400 border border-yellow-400/30 rounded-full px-2 py-0.5 shrink-0">🏆</span>
                    )}
                    {i < 3 && p.status !== 'winner' && (
                      <span className="text-xs text-emerald-400 border border-emerald-400/30 rounded-full px-2 py-0.5 shrink-0">🔥</span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-xs truncate">{p.team} · {p.track}</p>
                </div>

                <div className="col-span-2 text-center hidden sm:block">
                  <span className={cn('text-sm font-light',
                    scoresVisible
                      ? p.ai_score.final_score >= 8 ? 'text-emerald-400' : 'text-yellow-400'
                      : 'text-muted-foreground'
                  )}>{scoresVisible ? p.ai_score.final_score : '—'}</span>
                </div>

                <div className="col-span-2 text-center hidden sm:block">
                  <span className={cn('text-sm font-light',
                    scoresVisible
                      ? p.effort_score >= 8 ? 'text-emerald-400' : p.effort_score >= 5 ? 'text-yellow-400' : 'text-muted-foreground'
                      : 'text-muted-foreground'
                  )}>{scoresVisible ? p.effort_score : '—'}</span>
                </div>

                <div className="col-span-2 text-right">
                  <span className={cn('text-xl font-light',
                    scoresVisible
                      ? p.rank_score >= 8 ? 'text-emerald-400' : p.rank_score >= 6 ? 'text-yellow-400' : 'text-muted-foreground'
                      : 'text-muted-foreground/40 blur-sm select-none'
                  )}>{scoresVisible ? p.rank_score : '?'}</span>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Sidebar — top hackers */}
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Top Builders</p>
              <div className="flex flex-col gap-3">
                {DEMO_HACKERS.slice(0, 5).map((h, i) => (
                  <GlassCard key={h.id} hover={false} className="flex items-center gap-3 py-4">
                    <span className={cn('text-sm font-light w-5 text-center shrink-0',
                      i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-600' : 'text-muted-foreground'
                    )}>{i + 1}</span>
                    <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs shrink-0"
                      style={{ fontFamily: "'Instrument Serif', serif" }}>
                      {h.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground text-sm truncate">{h.name}</p>
                      <p className="text-muted-foreground text-xs truncate">{h.college}</p>
                    </div>
                    <span className={cn('text-sm font-light shrink-0',
                      scoresVisible
                        ? h.avg_score >= 8 ? 'text-emerald-400' : 'text-yellow-400'
                        : 'text-muted-foreground/40 blur-sm select-none'
                    )}>{scoresVisible ? h.avg_score : '?'}</span>
                  </GlassCard>
                ))}
              </div>
            </div>

            {/* Formula explainer */}
            <GlassCard hover={false} className="bg-white/[0.03]">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Ranking Formula</p>
              <div className="flex flex-col gap-3">
                <div className="liquid-glass rounded-xl p-3 bg-white/[0.03] text-center">
                  <p className="text-xs text-muted-foreground mb-1">Rank Score</p>
                  <p className="text-foreground text-sm font-mono">(AI × 0.7) + (Effort × 0.3)</p>
                </div>
                <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                  <p>— AI score: innovation + complexity + completeness</p>
                  <p>— Effort: commits + contributors + stars</p>
                  <p>— All scores 1–10, formula is public</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </SectionWrapper>
    </PageShell>
  )
}
