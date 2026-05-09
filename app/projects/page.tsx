"use client"

import { useState } from 'react'
import { PageShell } from '@/components/PageShell'
import { SectionWrapper } from '@/components/SectionWrapper'
import { GlassCard } from '@/components/GlassCard'
import { AnimatedHeading } from '@/components/AnimatedHeading'
import { useAppStore } from '@/contexts/AppStoreContext'
import { cn } from '@/lib/utils'

const TRACK_COLORS: Record<string, string> = {
  'AI & ML': 'text-purple-400 border-purple-400/30 bg-purple-400/5',
  'Dev Tooling': 'text-blue-400 border-blue-400/30 bg-blue-400/5',
  'Health & Wellbeing': 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5',
  'Smart Cities': 'text-yellow-400 border-yellow-400/30 bg-yellow-400/5',
  'Open Source': 'text-orange-400 border-orange-400/30 bg-orange-400/5',
  'FinTech': 'text-cyan-400 border-cyan-400/30 bg-cyan-400/5',
  'Climate': 'text-green-400 border-green-400/30 bg-green-400/5',
  'EdTech': 'text-pink-400 border-pink-400/30 bg-pink-400/5',
  'Social Impact': 'text-rose-400 border-rose-400/30 bg-rose-400/5',
  'LegalTech': 'text-indigo-400 border-indigo-400/30 bg-indigo-400/5',
  'HR Tech': 'text-teal-400 border-teal-400/30 bg-teal-400/5',
}

export default function Projects() {
  const { projects } = useAppStore()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const tracks = ['all', ...Array.from(new Set(projects.map((p) => p.track)))]

  const filtered = projects.filter((p) => {
    const matchTrack = filter === 'all' || p.track === filter
    const matchSearch = !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.team.toLowerCase().includes(search.toLowerCase()) ||
      p.tech_stack.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    return matchTrack && matchSearch
  })

  return (
    <PageShell>
      <SectionWrapper className="pt-16 pb-24">
        <AnimatedHeading as="h2" className="mb-4">
          Project Showcase
        </AnimatedHeading>
        <p className="animate-fade-rise-delay text-muted-foreground text-base max-w-xl mb-10">
          {projects.length} projects submitted. Real work from real builders.
        </p>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects, teams, tech..."
            className="bg-transparent border border-white/10 rounded-full px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-white/30 transition-colors w-56"
          />
          <div className="flex flex-wrap gap-2 flex-1">
            {tracks.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={cn(
                  'text-xs border rounded-full px-3 py-1.5 transition-all capitalize',
                  filter === t
                    ? 'text-foreground border-white/30 bg-white/10'
                    : 'text-muted-foreground border-white/10 hover:text-foreground hover:border-white/20'
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 border border-white/10 rounded-full p-1">
            {(['grid', 'list'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  'text-xs px-3 py-1 rounded-full transition-all',
                  view === v ? 'bg-white/10 text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {v === 'grid' ? '⊞' : '≡'}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-6">{filtered.length} projects</p>

        {view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((p, i) => (
              <GlassCard
                key={p.id}
                className={cn('flex flex-col', i < 3 ? 'animate-fade-rise' : 'animate-fade-rise-delay')}
              >
                {/* Rank badge */}
                <div className="flex items-start justify-between mb-3">
                  <span className={cn('text-xs border rounded-full px-2 py-0.5', TRACK_COLORS[p.track] ?? 'text-muted-foreground border-white/10')}>
                    {p.track}
                  </span>
                  {p.status === 'winner' && (
                    <span className="text-xs text-yellow-400 border border-yellow-400/30 rounded-full px-2 py-0.5">🏆</span>
                  )}
                </div>

                <h3
                  className="text-foreground text-xl font-normal mb-1"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  {p.title}
                </h3>
                <p className="text-muted-foreground text-xs mb-3">{p.team} · {p.author_college}</p>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1 line-clamp-3">{p.description}</p>

                {/* Score bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Rank Score</span>
                    <span className={cn('text-xs font-medium',
                      p.rank_score >= 8 ? 'text-emerald-400' : p.rank_score >= 6 ? 'text-yellow-400' : 'text-muted-foreground'
                    )}>{p.rank_score}/10</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all duration-1000',
                        p.rank_score >= 8 ? 'bg-emerald-400' : p.rank_score >= 6 ? 'bg-yellow-400' : 'bg-white/30'
                      )}
                      style={{ width: `${p.rank_score * 10}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {p.tech_stack.slice(0, 4).map((t) => (
                    <span key={t} className="text-xs text-muted-foreground border border-white/10 rounded-full px-2 py-0.5 bg-white/5">
                      {t}
                    </span>
                  ))}
                  {p.tech_stack.length > 4 && (
                    <span className="text-xs text-muted-foreground">+{p.tech_stack.length - 4}</span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs pt-3 border-t border-white/10">
                  <a href={p.github_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                    GitHub ↗
                  </a>
                  {p.demo_url && (
                    <a href={p.demo_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                      Demo ↗
                    </a>
                  )}
                  <span className="ml-auto text-muted-foreground">⭐ {p.github_stars}</span>
                </div>
              </GlassCard>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((p) => (
              <GlassCard key={p.id} hover={false} className="flex items-center gap-5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-foreground text-base" style={{ fontFamily: "'Instrument Serif', serif" }}>{p.title}</p>
                    {p.status === 'winner' && <span className="text-xs text-yellow-400">🏆</span>}
                    <span className={cn('text-xs border rounded-full px-2 py-0.5', TRACK_COLORS[p.track] ?? 'text-muted-foreground border-white/10')}>
                      {p.track}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs truncate">{p.description}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-center hidden sm:block">
                    <p className="text-xs text-muted-foreground">Score</p>
                    <p className={cn('text-lg font-light', p.rank_score >= 8 ? 'text-emerald-400' : 'text-yellow-400')}>{p.rank_score}</p>
                  </div>
                  <div className="flex gap-3 text-xs">
                    <a href={p.github_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">GitHub ↗</a>
                    {p.demo_url && <a href={p.demo_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">Demo ↗</a>}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-sm">No projects match your search.</p>
          </div>
        )}
      </SectionWrapper>
    </PageShell>
  )
}
