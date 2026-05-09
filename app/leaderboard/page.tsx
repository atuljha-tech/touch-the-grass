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

const RANK_MEDALS = ['🥇', '🥈', '🥉']

const TRACK_COLORS: Record<string, string> = {
  'AI & ML': 'text-purple-400 border-purple-400/30 bg-purple-400/5',
  'Dev Tooling': 'text-blue-400 border-blue-400/30 bg-blue-400/5',
  'Health & Wellbeing': 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5',
  'Smart Cities': 'text-yellow-400 border-yellow-400/30 bg-yellow-400/5',
  'Open Source': 'text-orange-400 border-orange-400/30 bg-orange-400/5',
  'FinTech': 'text-cyan-400 border-cyan-400/30 bg-cyan-400/5',
  'Climate': 'text-green-400 border-green-400/30 bg-green-400/5',
  'EdTech': 'text-pink-400 border-pink-400/30 bg-pink-400/5',
}

function ScoreGauge({ score, visible }: { score: number; visible: boolean }) {
  if (!visible) return <span className="text-muted-foreground/40 blur-sm select-none text-xl font-light">?</span>
  const color = score >= 8 ? 'text-emerald-400' : score >= 6 ? 'text-yellow-400' : 'text-muted-foreground'
  return <span className={cn('text-xl font-light tabular-nums', color)}>{score}</span>
}

export default function Leaderboard() {
  const { projects, isResultPublic } = useAppStore()
  const { user } = useDemoAuth()
  const scoresVisible = canViewScores(user?.role, isResultPublic)

  const top3 = projects.slice(0, 3)
  const rest = projects.slice(3)

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

        {/* Top 3 podium */}
        {scoresVisible && top3.length >= 3 && (
          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-5">Top Finishers</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {top3.map((p, i) => (
                <GlassCard
                  key={p.id}
                  hover={false}
                  className={cn(
                    'text-center relative overflow-hidden',
                    i === 0 && 'border border-yellow-400/30 bg-yellow-400/5',
                    i === 1 && 'border border-slate-400/20',
                    i === 2 && 'border border-amber-700/30',
                  )}
                >
                  {i === 0 && (
                    <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/5 to-transparent pointer-events-none" />
                  )}
                  <p className="text-3xl mb-2">{RANK_MEDALS[i]}</p>
                  <p className="text-foreground text-base mb-1" style={{ fontFamily: "'Instrument Serif', serif" }}>{p.title}</p>
                  <p className="text-muted-foreground text-xs mb-3">{p.team}</p>
                  <p className={cn(
                    'text-3xl font-light mb-1',
                    i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-300' : 'text-amber-600'
                  )}>{p.rank_score}</p>
                  <p className="text-muted-foreground text-xs">rank score</p>
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <span className={cn('text-xs border rounded-full px-2 py-0.5', TRACK_COLORS[p.track] ?? 'text-muted-foreground border-white/10')}>
                      {p.track}
                    </span>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

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
              <GlassCard
                key={p.id}
                hover={false}
                className={cn(
                  'grid grid-cols-12 gap-3 items-center py-4 transition-all',
                  i === 0 && scoresVisible && 'border border-yellow-400/20 bg-yellow-400/[0.03]',
                  i === 1 && scoresVisible && 'border border-slate-400/10',
                  i === 2 && scoresVisible && 'border border-amber-700/20',
                )}
              >
                <span className={cn('col-span-1 text-lg font-light text-center',
                  i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-600' : 'text-muted-foreground'
                )}>
                  {i < 3 && scoresVisible ? RANK_MEDALS[i] : i + 1}
                </span>

                <div className="col-span-5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-foreground text-sm truncate" style={{ fontFamily: "'Instrument Serif', serif" }}>
                      {p.title}
                    </p>
                    {p.status === 'winner' && (
                      <span className="text-xs text-yellow-400 border border-yellow-400/30 rounded-full px-2 py-0.5 shrink-0">🏆 Winner</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-muted-foreground text-xs truncate">{p.team}</p>
                    <span className={cn('text-xs border rounded-full px-1.5 py-0 hidden sm:inline-block', TRACK_COLORS[p.track] ?? 'text-muted-foreground border-white/10')}>
                      {p.track}
                    </span>
                  </div>
                </div>

                <div className="col-span-2 text-center hidden sm:block">
                  <ScoreGauge score={p.ai_score.final_score} visible={scoresVisible} />
                </div>

                <div className="col-span-2 text-center hidden sm:block">
                  <ScoreGauge score={p.effort_score} visible={scoresVisible} />
                </div>

                <div className="col-span-2 text-right">
                  <ScoreGauge score={p.rank_score} visible={scoresVisible} />
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-5">
            {/* Top hackers */}
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Top Builders</p>
              <div className="flex flex-col gap-3">
                {DEMO_HACKERS.slice(0, 5).map((h, i) => (
                  <GlassCard key={h.id} hover={false} className="flex items-center gap-3 py-4">
                    <span className={cn('text-sm font-light w-5 text-center shrink-0',
                      i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-600' : 'text-muted-foreground'
                    )}>{i < 3 && scoresVisible ? RANK_MEDALS[i] : i + 1}</span>
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

            {/* Integration badges */}
            <GlassCard hover={false} className="bg-white/[0.02]">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Powered By</p>
              <div className="flex flex-col gap-2">
                {[
                  { name: 'Zynd AI', desc: 'Multi-agent scoring', color: 'text-emerald-400 border-emerald-400/30', href: '/agents' },
                  { name: 'Apify', desc: 'Repo intelligence', color: 'text-orange-400 border-orange-400/30', href: '/deep-analysis' },
                  { name: 'Superplane', desc: 'Judging pipeline', color: 'text-blue-400 border-blue-400/30', href: '/pipeline' },
                ].map((b) => (
                  <a key={b.name} href={b.href} className="flex items-center justify-between hover:opacity-80 transition-opacity">
                    <span className="text-muted-foreground text-xs">{b.desc}</span>
                    <span className={cn('text-xs border rounded-full px-2 py-0.5', b.color)}>{b.name}</span>
                  </a>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </SectionWrapper>
    </PageShell>
  )
}
