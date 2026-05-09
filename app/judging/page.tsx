"use client"

import { useState } from 'react'
import Link from 'next/link'
import { PageShell } from '@/components/PageShell'
import { SectionWrapper } from '@/components/SectionWrapper'
import { GlassCard } from '@/components/GlassCard'
import { AnimatedHeading } from '@/components/AnimatedHeading'
import { CTAButton } from '@/components/CTAButton'
import { EffortBadge } from '@/components/judge/EffortBadge'
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
}

export default function Judging() {
  const { projects } = useAppStore()
  const [filter, setFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [runningPipeline, setRunningPipeline] = useState<number | null>(null)
  const [pipelineResults, setPipelineResults] = useState<Record<number, { score: number; status: string }>>({})

  const tracks = ['all', ...Array.from(new Set(projects.map((p) => p.track)))]

  const filtered = projects.filter((p) => {
    const matchesTrack = filter === 'all' || p.track === filter
    const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.team.toLowerCase().includes(search.toLowerCase())
    return matchesTrack && matchesSearch
  })

  async function triggerPipeline(projectId: number) {
    const project = projects.find((p) => p.id === projectId)
    if (!project) return

    setRunningPipeline(projectId)
    try {
      const res = await fetch('/api/superplane/pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: project.id,
          project_title: project.title,
          ai_score: project.ai_score.final_score,
          effort_score: project.effort_score,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setPipelineResults((prev) => ({
          ...prev,
          [projectId]: { score: data.data.final_score, status: 'completed' },
        }))
      }
    } finally {
      setRunningPipeline(null)
    }
  }

  return (
    <PageShell>
      <SectionWrapper className="pt-16">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
          <div>
            <AnimatedHeading as="h2">Judge Dashboard</AnimatedHeading>
            <p className="animate-fade-rise-delay text-muted-foreground text-sm mt-1">
              {projects.length} projects · {filtered.length} shown
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/pipeline">
              <span className="text-xs text-blue-400 border border-blue-400/30 rounded-full px-3 py-1.5 hover:bg-blue-400/10 transition-colors cursor-pointer">
                ⚡ Superplane Pipeline
              </span>
            </Link>
            <Link href="/judge-mode">
              <CTAButton size="sm">Enter Judge Mode →</CTAButton>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="bg-transparent border border-white/10 rounded-full px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-white/30 transition-colors w-48"
          />
          <div className="flex flex-wrap gap-2">
            {tracks.map((track) => (
              <button
                key={track}
                onClick={() => setFilter(track)}
                className={cn(
                  'text-xs border rounded-full px-3 py-1.5 transition-all capitalize',
                  filter === track
                    ? 'text-foreground border-white/30 bg-white/10'
                    : 'text-muted-foreground border-white/10 hover:text-foreground hover:border-white/20'
                )}
              >
                {track}
              </button>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Projects', value: projects.length, color: 'text-foreground' },
            { label: 'Reviewed', value: projects.filter((p) => p.status === 'reviewed' || p.status === 'winner').length, color: 'text-emerald-400' },
            { label: 'Avg AI Score', value: (projects.reduce((s, p) => s + p.ai_score.final_score, 0) / projects.length).toFixed(1), color: 'text-blue-400' },
            { label: 'Winners', value: projects.filter((p) => p.status === 'winner').length, color: 'text-yellow-400' },
          ].map(({ label, value, color }) => (
            <GlassCard key={label} hover={false} className="text-center py-4">
              <p className={cn('text-2xl font-light mb-1', color)}>{value}</p>
              <p className="text-muted-foreground text-xs">{label}</p>
            </GlassCard>
          ))}
        </div>

        <div className="flex flex-col gap-4 pb-16">
          {filtered.map((project) => (
            <GlassCard key={project.id} hover={false}>
              <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3
                      className="text-foreground text-xl font-normal"
                      style={{ fontFamily: "'Instrument Serif', serif" }}
                    >
                      {project.title}
                    </h3>
                    {project.status === 'winner' && (
                      <span className="text-xs text-yellow-400 border border-yellow-400/30 rounded-full px-2 py-0.5">🏆 Winner</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-muted-foreground text-xs">{project.team}</p>
                    <span className={cn('text-xs border rounded-full px-2 py-0.5', TRACK_COLORS[project.track] ?? 'text-muted-foreground border-white/10')}>
                      {project.track}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {/* Scores */}
                  <div className="flex items-center gap-2">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">AI</p>
                      <p className={cn('text-lg font-light', project.ai_score.final_score >= 8 ? 'text-emerald-400' : 'text-yellow-400')}>
                        {project.ai_score.final_score}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Effort</p>
                      <p className={cn('text-lg font-light', project.effort_score >= 8 ? 'text-emerald-400' : 'text-yellow-400')}>
                        {project.effort_score}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Rank</p>
                      <p className={cn('text-lg font-light', project.rank_score >= 8 ? 'text-emerald-400' : project.rank_score >= 6 ? 'text-yellow-400' : 'text-muted-foreground')}>
                        {project.rank_score}
                      </p>
                    </div>
                  </div>

                  <EffortBadge
                    commit_count={project.commit_count}
                    contributors={project.contributors}
                    github_stars={project.github_stars}
                  />

                  {/* Pipeline trigger */}
                  <button
                    onClick={() => triggerPipeline(project.id)}
                    disabled={runningPipeline === project.id}
                    className={cn(
                      'text-xs border rounded-full px-3 py-1.5 transition-all',
                      pipelineResults[project.id]
                        ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5'
                        : runningPipeline === project.id
                        ? 'text-blue-400 border-blue-400/30 animate-pulse'
                        : 'text-muted-foreground border-white/10 hover:text-blue-400 hover:border-blue-400/30'
                    )}
                  >
                    {runningPipeline === project.id ? '⚡ Running...' : pipelineResults[project.id] ? '✓ Pipeline done' : '⚡ Run Pipeline'}
                  </button>

                  <Link href="/judge-mode" className="text-xs text-muted-foreground hover:text-foreground transition-colors border border-white/10 rounded-full px-3 py-1.5 hover:border-white/20">
                    Score →
                  </Link>
                </div>
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed mb-4 max-w-3xl">
                {project.description}
              </p>

              {/* AI brief */}
              {project.ai_brief?.summary && (
                <div className="mb-4 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                  <p className="text-xs text-muted-foreground mb-1">AI Brief</p>
                  <p className="text-xs text-foreground/80 leading-relaxed">{project.ai_brief.summary}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10">
                {project.tech_stack.map((t) => (
                  <span key={t} className="text-xs text-muted-foreground border border-white/10 rounded-full px-3 py-0.5 bg-white/5">
                    {t}
                  </span>
                ))}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground border border-white/10 rounded-full px-3 py-0.5 bg-white/5 hover:text-foreground transition-colors ml-auto"
                  >
                    GitHub ↗
                  </a>
                )}
              </div>
            </GlassCard>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-sm">No projects match your filters.</p>
            </div>
          )}
        </div>
      </SectionWrapper>
    </PageShell>
  )
}
