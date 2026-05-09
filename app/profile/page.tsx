"use client"

import { PageShell } from '@/components/PageShell'
import { SectionWrapper } from '@/components/SectionWrapper'
import { GlassCard } from '@/components/GlassCard'
import { AnimatedHeading } from '@/components/AnimatedHeading'
import { CTAButton } from '@/components/CTAButton'
import { useAppStore } from '@/contexts/AppStoreContext'
import { useDemoAuth } from '@/contexts/DemoAuthContext'
import { DEMO_HACKERS } from '@/lib/demo/data'
import { canViewScores } from '@/lib/auth'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const TRACK_COLORS: Record<string, string> = {
  'AI & ML': 'text-purple-400 border-purple-400/30',
  'Dev Tooling': 'text-blue-400 border-blue-400/30',
  'Health & Wellbeing': 'text-emerald-400 border-emerald-400/30',
  'Smart Cities': 'text-yellow-400 border-yellow-400/30',
  'Open Source': 'text-orange-400 border-orange-400/30',
  'FinTech': 'text-cyan-400 border-cyan-400/30',
  'Climate': 'text-green-400 border-green-400/30',
  'EdTech': 'text-pink-400 border-pink-400/30',
}

export default function Profile() {
  const { user } = useDemoAuth()
  const { projects, isResultPublic } = useAppStore()
  const scoresVisible = canViewScores(user?.role, isResultPublic)

  const hackerId = user?.hacker_id ?? user?.id ?? 'h1'
  const hacker = DEMO_HACKERS.find((h) => h.id === hackerId) ?? DEMO_HACKERS[0]
  const myProjects = projects.filter((p) => p.hacker_id === hackerId)
  const myRanks = myProjects.map((p) => projects.findIndex((x) => x.id === p.id) + 1)
  const bestRank = myRanks.length ? Math.min(...myRanks) : null
  const avgScore = myProjects.length
    ? Math.round(myProjects.reduce((s, p) => s + p.rank_score, 0) / myProjects.length * 10) / 10
    : null

  const displayName = user?.name ?? hacker.name
  const displayAvatar = user?.avatar ?? hacker.avatar

  return (
    <PageShell>
      <SectionWrapper className="pt-16 pb-24">

        {/* Profile header */}
        <div className="animate-fade-rise liquid-glass rounded-3xl p-8 mb-10 bg-white/[0.04]">
          <div className="flex items-start gap-6 flex-wrap">
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-3xl shrink-0 border border-white/10"
              style={{ fontFamily: "'Instrument Serif', serif" }}>
              {displayAvatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <AnimatedHeading as="h2">{displayName}</AnimatedHeading>
                {user?.role && (
                  <span className={cn('text-xs border rounded-full px-3 py-1 capitalize',
                    user.role === 'admin' ? 'text-purple-400 border-purple-400/30' :
                    user.role === 'judge' ? 'text-emerald-400 border-emerald-400/30' :
                    user.role === 'hacker' ? 'text-blue-400 border-blue-400/30' :
                    'text-yellow-400 border-yellow-400/30'
                  )}>
                    {user.role}
                  </span>
                )}
              </div>
              <p className="text-muted-foreground text-sm mb-1">{hacker.email}</p>
              <p className="text-muted-foreground text-sm mb-4">{hacker.college}</p>
              <div className="flex flex-wrap gap-2">
                {hacker.skills.map((s) => (
                  <span key={s} className="text-xs text-muted-foreground border border-white/10 rounded-full px-3 py-0.5 bg-white/5">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-4 flex-wrap">
              {[
                { label: 'Projects', value: myProjects.length || hacker.projects_submitted },
                { label: 'Best Rank', value: bestRank ? `#${bestRank}` : '—', color: 'text-yellow-400' },
                { label: 'Avg Score', value: scoresVisible && avgScore ? avgScore : hacker.avg_score, color: 'text-emerald-400' },
              ].map(({ label, value, color }) => (
                <div key={label} className="text-center liquid-glass rounded-2xl px-5 py-4 bg-white/[0.03]">
                  <p className={cn('text-2xl font-light mb-1', color ?? 'text-foreground')}>{value}</p>
                  <p className="text-muted-foreground text-xs">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">My Projects</p>
              <Link href="/dashboard">
                <CTAButton size="sm">+ Submit New</CTAButton>
              </Link>
            </div>

            {myProjects.length === 0 ? (
              <GlassCard hover={false} className="text-center py-12 bg-white/[0.02]">
                <p className="text-muted-foreground text-sm mb-4">No projects submitted yet.</p>
                <Link href="/dashboard">
                  <CTAButton size="sm">Submit your first project →</CTAButton>
                </Link>
              </GlassCard>
            ) : (
              myProjects.map((p) => {
                const rank = projects.findIndex((x) => x.id === p.id) + 1
                return (
                  <GlassCard key={p.id} hover={false}>
                    <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-foreground text-lg" style={{ fontFamily: "'Instrument Serif', serif" }}>{p.title}</p>
                          {p.status === 'winner' && <span className="text-xs text-yellow-400">🏆</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={cn('text-xs border rounded-full px-2 py-0.5', TRACK_COLORS[p.track] ?? 'text-muted-foreground border-white/10')}>
                            {p.track}
                          </span>
                          <span className="text-xs text-muted-foreground">Rank #{rank} of {projects.length}</span>
                        </div>
                      </div>
                      {scoresVisible && (
                        <div className="flex gap-3">
                          {[
                            { label: 'AI', value: p.ai_score.final_score },
                            { label: 'Effort', value: p.effort_score },
                            { label: 'Rank', value: p.rank_score },
                          ].map(({ label, value }) => (
                            <div key={label} className="text-center liquid-glass rounded-xl px-3 py-2 bg-white/[0.03]">
                              <p className="text-xs text-muted-foreground">{label}</p>
                              <p className={cn('text-lg font-light', value >= 8 ? 'text-emerald-400' : 'text-yellow-400')}>{value}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">{p.description}</p>

                    {scoresVisible && p.ai_brief.summary && (
                      <div className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 mb-4">
                        <p className="text-xs text-muted-foreground mb-1">AI Brief</p>
                        <p className="text-xs text-foreground/80 leading-relaxed">{p.ai_brief.summary}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10">
                      {p.tech_stack.map((t) => (
                        <span key={t} className="text-xs text-muted-foreground border border-white/10 rounded-full px-2 py-0.5 bg-white/5">{t}</span>
                      ))}
                      <a href={p.github_url} target="_blank" rel="noreferrer" className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors">
                        GitHub ↗
                      </a>
                    </div>
                  </GlassCard>
                )
              })
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-5">
            {/* Hackathon history */}
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Hackathons</p>
              <div className="flex flex-col gap-3">
                {[
                  { name: 'BuildFast AI 2026', result: 'Active', date: 'Jun 2026', color: 'text-emerald-400 border-emerald-400/30' },
                  { name: 'Web3 Frontier 2025', result: 'Finalist', date: 'Nov 2025', color: 'text-yellow-400 border-yellow-400/30' },
                ].map((h) => (
                  <GlassCard key={h.name} hover={false} className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-foreground text-sm">{h.name}</p>
                        <p className="text-muted-foreground text-xs mt-0.5">{h.date}</p>
                      </div>
                      <span className={cn('text-xs border rounded-full px-2 py-0.5', h.color)}>{h.result}</span>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Achievements</p>
              <GlassCard hover={false}>
                <div className="flex flex-col gap-3">
                  {[
                    { icon: '🏆', label: 'Hackathon Winner', desc: 'Won a track prize' },
                    { icon: '⚡', label: 'High Effort', desc: '100+ commits in 48h' },
                    { icon: '🤖', label: 'AI Native', desc: 'Used AI in every project' },
                    { icon: '🌿', label: 'TouchTheGrass', desc: 'First submission' },
                  ].map(({ icon, label, desc }) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className="text-lg">{icon}</span>
                      <div>
                        <p className="text-foreground text-xs font-medium">{label}</p>
                        <p className="text-muted-foreground text-xs">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Quick links */}
            <GlassCard hover={false} className="bg-white/[0.02]">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Quick Links</p>
              <div className="flex flex-col gap-2">
                {[
                  { href: '/dashboard', label: 'Dashboard' },
                  { href: '/leaderboard', label: 'Leaderboard' },
                  { href: '/agents', label: 'Agent Analysis' },
                  { href: '/deep-analysis', label: 'Repo Analysis' },
                ].map(({ href, label }) => (
                  <Link key={href} href={href} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-between">
                    <span>{label}</span>
                    <span className="text-xs">→</span>
                  </Link>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </SectionWrapper>
    </PageShell>
  )
}
