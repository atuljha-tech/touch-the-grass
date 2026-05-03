"use client"

import { useState } from 'react'
import { PageShell } from '@/components/PageShell'
import { GlassCard } from '@/components/GlassCard'
import { CTAButton } from '@/components/CTAButton'
import { useAppStore } from '@/contexts/AppStoreContext'
import { type DemoProject, type DemoSponsor } from '@/lib/demo/data'
import { cn } from '@/lib/utils'

type Tab = 'overview' | 'projects' | 'hackers' | 'sponsors' | 'leaderboard'

const tierColors = {
  gold: 'text-yellow-400 border-yellow-400/30',
  silver: 'text-slate-300 border-slate-300/30',
  bronze: 'text-amber-600 border-amber-600/30',
}

export default function AdminDashboard() {
  const { projects, hackers, sponsors, addSponsor } = useAppStore()
  const [tab, setTab] = useState<Tab>('overview')
  const [selectedProject, setSelectedProject] = useState<DemoProject | null>(null)
  const [sponsorForm, setSponsorForm] = useState({ name: '', logo_url: '', contribution: '', tier: 'bronze' as DemoSponsor['tier'], website: '' })
  const [sponsorAdded, setSponsorAdded] = useState(false)
  const [search, setSearch] = useState('')

  const filteredProjects = search.trim()
    ? projects.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.track.toLowerCase().includes(search.toLowerCase()) ||
        p.team.toLowerCase().includes(search.toLowerCase())
      )
    : projects

  const avgScore = projects.length
    ? Math.round((projects.reduce((s, p) => s + p.rank_score, 0) / projects.length) * 10) / 10
    : 0

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'projects', label: `Projects (${projects.length})` },
    { id: 'hackers', label: `Hackers (${hackers.length})` },
    { id: 'sponsors', label: `Sponsors (${sponsors.length})` },
    { id: 'leaderboard', label: 'Leaderboard' },
  ]

  function submitSponsor() {
    if (!sponsorForm.name) return
    addSponsor(sponsorForm)
    setSponsorForm({ name: '', logo_url: '', contribution: '', tier: 'bronze', website: '' })
    setSponsorAdded(true)
    setTimeout(() => setSponsorAdded(false), 2000)
  }

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto w-full px-6 md:px-8 py-10 flex flex-col gap-8">

        {/* Header */}
        <div className="animate-fade-rise">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Admin</p>
          <h1 className="text-4xl font-normal text-foreground" style={{ fontFamily: "'Instrument Serif', serif", letterSpacing: '-0.03em' }}>
            Control Panel
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap animate-fade-rise-delay">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'text-xs rounded-full px-4 py-1.5 border transition-all',
                tab === t.id
                  ? 'border-foreground/50 text-foreground bg-white/5'
                  : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div className="flex flex-col gap-6 animate-fade-rise">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard label="Total Hackers" value={hackers.length} sub="registered participants" />
              <StatCard label="Total Projects" value={projects.length} sub="submissions received" />
              <StatCard label="Avg Rank Score" value={avgScore} sub="across all projects" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Top 5 projects */}
              <GlassCard hover={false}>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-5">Top Ranked Projects</p>
                <div className="flex flex-col gap-3">
                  {projects.slice(0, 5).map((p, i) => (
                    <div key={p.id} className="flex items-center gap-3">
                      <span className={cn('text-lg font-light w-6 text-center shrink-0',
                        i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-600' : 'text-muted-foreground'
                      )}>{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-foreground text-sm truncate">{p.title}</p>
                        <p className="text-muted-foreground text-xs">{p.track}</p>
                      </div>
                      <RankBadge score={p.rank_score} />
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Active event */}
              <GlassCard hover={false}>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-5">Active Event</p>
                <p className="text-foreground text-xl font-normal mb-2" style={{ fontFamily: "'Instrument Serif', serif" }}>
                  BuildFast AI Hackathon 2026
                </p>
                <p className="text-muted-foreground text-xs mb-4">Jun 14 – Jun 16, 2026 · Online</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="liquid-glass rounded-xl p-3 bg-white/[0.03]">
                    <p className="text-xs text-muted-foreground mb-1">Participants</p>
                    <p className="text-2xl font-light text-foreground">312</p>
                  </div>
                  <div className="liquid-glass rounded-xl p-3 bg-white/[0.03]">
                    <p className="text-xs text-muted-foreground mb-1">Prize Pool</p>
                    <p className="text-2xl font-light text-foreground">$25k</p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        )}

        {/* ── PROJECTS ── */}
        {tab === 'projects' && (
          <div className="flex flex-col gap-4 animate-fade-rise">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <p className="text-xs text-muted-foreground">
                Sorted by rank score = (AI score × 0.7) + (effort × 0.3)
              </p>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects..."
                className="bg-transparent border border-white/10 rounded-lg px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-white/30 transition-colors w-48"
              />
            </div>

            {selectedProject ? (
              <ProjectDetail project={selectedProject} onBack={() => setSelectedProject(null)} />
            ) : (
              <div className="flex flex-col gap-3">
                {/* Header row */}
                <div className="grid grid-cols-12 gap-3 px-4 text-xs text-muted-foreground uppercase tracking-widest">
                  <span className="col-span-1">#</span>
                  <span className="col-span-4">Project</span>
                  <span className="col-span-2 hidden sm:block">Track</span>
                  <span className="col-span-2 text-center">AI Score</span>
                  <span className="col-span-2 text-center">Effort</span>
                  <span className="col-span-1 text-right">Rank</span>
                </div>

                {filteredProjects.map((p, i) => (
                  <button key={p.id} onClick={() => setSelectedProject(p)} className="w-full text-left group">
                    <GlassCard hover={false} className="grid grid-cols-12 gap-3 items-center py-4 group-hover:bg-white/[0.07] transition-all">
                      <span className={cn('col-span-1 text-sm font-light',
                        i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-600' : 'text-muted-foreground'
                      )}>{i + 1}</span>

                      <div className="col-span-4 min-w-0">
                        <p className="text-foreground text-sm truncate">{p.title}</p>
                        <p className="text-muted-foreground text-xs">{p.team}</p>
                      </div>

                      <span className="col-span-2 hidden sm:block text-xs text-muted-foreground truncate">{p.track}</span>

                      <div className="col-span-2 text-center">
                        <span className={cn('text-sm font-light',
                          p.ai_score.final_score >= 8 ? 'text-emerald-400' : p.ai_score.final_score >= 6 ? 'text-yellow-400' : 'text-muted-foreground'
                        )}>{p.ai_score.final_score}</span>
                      </div>

                      <div className="col-span-2 text-center">
                        <span className={cn('text-sm font-light',
                          p.effort_score >= 8 ? 'text-emerald-400' : p.effort_score >= 5 ? 'text-yellow-400' : 'text-muted-foreground'
                        )}>{p.effort_score}</span>
                      </div>

                      <div className="col-span-1 text-right">
                        <RankBadge score={p.rank_score} />
                      </div>
                    </GlassCard>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── HACKERS ── */}
        {tab === 'hackers' && (
          <div className="flex flex-col gap-3 animate-fade-rise">
            <div className="grid grid-cols-12 gap-3 px-4 text-xs text-muted-foreground uppercase tracking-widest">
              <span className="col-span-4">Name</span>
              <span className="col-span-3 hidden sm:block">College</span>
              <span className="col-span-2 text-center">Projects</span>
              <span className="col-span-3 text-right">Avg Score</span>
            </div>

            {hackers.map((h) => (
              <GlassCard key={h.id} hover={false} className="grid grid-cols-12 gap-3 items-center py-4">
                <div className="col-span-4 flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm shrink-0"
                    style={{ fontFamily: "'Instrument Serif', serif" }}>
                    {h.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="text-foreground text-sm truncate">{h.name}</p>
                    <p className="text-muted-foreground text-xs truncate">{h.email}</p>
                  </div>
                </div>

                <span className="col-span-3 hidden sm:block text-xs text-muted-foreground truncate">{h.college}</span>

                <div className="col-span-2 text-center">
                  <span className="text-sm text-foreground">{h.projects_submitted}</span>
                </div>

                <div className="col-span-3 text-right">
                  <span className={cn('text-sm font-light',
                    h.avg_score >= 8 ? 'text-emerald-400' : h.avg_score >= 6 ? 'text-yellow-400' : 'text-muted-foreground'
                  )}>{h.avg_score}</span>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* ── SPONSORS ── */}
        {tab === 'sponsors' && (
          <div className="flex flex-col gap-6 animate-fade-rise">
            {/* Existing sponsors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {sponsors.map((s) => (
                <GlassCard key={s.id} hover={false} className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className="text-foreground text-sm font-medium">{s.name}</p>
                    <span className={cn('text-xs border rounded-full px-2 py-0.5 capitalize', tierColors[s.tier])}>
                      {s.tier}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs">{s.contribution}</p>
                  <a href={s.website} target="_blank" rel="noreferrer"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors mt-auto">
                    Visit →
                  </a>
                </GlassCard>
              ))}
            </div>

            {/* Add sponsor form */}
            <GlassCard hover={false}>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-5">Add Sponsor</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {[
                  { key: 'name', label: 'Company Name', placeholder: 'Acme Corp' },
                  { key: 'contribution', label: 'Contribution', placeholder: '$5,000 + credits' },
                  { key: 'website', label: 'Website', placeholder: 'https://acme.com' },
                  { key: 'logo_url', label: 'Logo URL (optional)', placeholder: 'https://...' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs text-muted-foreground mb-1.5">{label}</label>
                    <input
                      value={sponsorForm[key as keyof typeof sponsorForm]}
                      onChange={(e) => setSponsorForm((p) => ({ ...p, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-white/30 transition-colors"
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">Tier</label>
                  <select
                    value={sponsorForm.tier}
                    onChange={(e) => setSponsorForm((p) => ({ ...p, tier: e.target.value as DemoSponsor['tier'] }))}
                    className="bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-white/30 transition-colors"
                  >
                    <option value="gold" className="bg-background">Gold</option>
                    <option value="silver" className="bg-background">Silver</option>
                    <option value="bronze" className="bg-background">Bronze</option>
                  </select>
                </div>
                <div className="mt-5">
                  <CTAButton size="sm" onClick={submitSponsor}>
                    {sponsorAdded ? 'Added ✓' : 'Add Sponsor'}
                  </CTAButton>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* ── LEADERBOARD ── */}
        {tab === 'leaderboard' && (
          <div className="flex flex-col gap-4 animate-fade-rise">
            <p className="text-xs text-muted-foreground mb-2">
              Live ranking · rank score = (AI score × 0.7) + (effort × 0.3)
            </p>
            {projects.map((p, i) => (
              <GlassCard key={p.id} hover={false} className="flex items-center gap-5">
                <span className={cn('text-2xl font-light w-8 text-center shrink-0',
                  i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-600' : 'text-muted-foreground'
                )}>{i + 1}</span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-foreground text-sm" style={{ fontFamily: "'Instrument Serif', serif" }}>
                      {p.title}
                    </p>
                    {p.status === 'winner' && (
                      <span className="text-xs text-yellow-400 border border-yellow-400/30 rounded-full px-2 py-0.5">🏆 Winner</span>
                    )}
                    {i < 3 && p.status !== 'winner' && (
                      <span className="text-xs text-emerald-400 border border-emerald-400/30 rounded-full px-2 py-0.5">🔥 Top Pick</span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-xs mt-0.5">{p.team} · {p.track}</p>
                </div>

                <div className="hidden sm:flex gap-1.5 flex-wrap justify-end max-w-[160px]">
                  {p.tech_stack.slice(0, 2).map((t) => (
                    <span key={t} className="text-xs text-muted-foreground border border-white/10 rounded-full px-2 py-0.5 bg-white/5">{t}</span>
                  ))}
                </div>

                <div className="text-right shrink-0">
                  <RankBadge score={p.rank_score} large />
                </div>
              </GlassCard>
            ))}
          </div>
        )}

      </div>
    </PageShell>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ label, value, sub }: { label: string; value: number; sub: string }) {
  return (
    <GlassCard hover={false} className="flex flex-col gap-1">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="text-4xl font-light text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </GlassCard>
  )
}

function RankBadge({ score, large }: { score: number; large?: boolean }) {
  const color = score >= 8 ? 'text-emerald-400' : score >= 6 ? 'text-yellow-400' : 'text-muted-foreground'
  return (
    <span className={cn('font-light', large ? 'text-2xl' : 'text-sm', color)}>
      {score}
    </span>
  )
}

function ProjectDetail({ project, onBack }: { project: DemoProject; onBack: () => void }) {
  return (
    <div className="flex flex-col gap-5 animate-fade-rise">
      <button onClick={onBack} className="text-xs text-muted-foreground hover:text-foreground transition-colors text-left">
        ← Back to projects
      </button>

      <GlassCard hover={false}>
        <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
          <div>
            <h2 className="text-2xl font-normal text-foreground mb-1" style={{ fontFamily: "'Instrument Serif', serif" }}>
              {project.title}
            </h2>
            <p className="text-muted-foreground text-xs">{project.team} · {project.track}</p>
          </div>
          <div className="flex gap-3">
            <ScoreChip label="AI" value={project.ai_score.final_score} />
            <ScoreChip label="Effort" value={project.effort_score} />
            <ScoreChip label="Rank" value={project.rank_score} highlight />
          </div>
        </div>

        <p className="text-foreground/90 text-sm leading-relaxed mb-5">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-5">
          {project.tech_stack.map((t) => (
            <span key={t} className="text-xs text-muted-foreground border border-white/10 rounded-full px-3 py-0.5 bg-white/5">{t}</span>
          ))}
        </div>

        <div className="flex gap-5 text-xs pt-4 border-t border-white/10">
          <a href={project.github_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">GitHub →</a>
          {project.demo_url && <a href={project.demo_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">Live Demo →</a>}
        </div>
      </GlassCard>

      <GlassCard hover={false}>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">AI Summary</p>
        <p className="text-foreground/90 text-sm leading-relaxed mb-4">{project.ai_brief.summary}</p>
        <p className="text-xs text-muted-foreground mb-2">Key Strengths</p>
        <ul className="flex flex-col gap-1">
          {project.ai_brief.key_strengths.map((s, i) => (
            <li key={i} className="text-sm text-foreground/90">— {s}</li>
          ))}
        </ul>
      </GlassCard>

      <GlassCard hover={false}>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">AI Feedback</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FeedbackList label="Strengths" items={project.ai_feedback.strengths} color="text-emerald-400" />
          <FeedbackList label="Suggestions" items={project.ai_feedback.suggestions} color="text-foreground/90" />
        </div>
      </GlassCard>
    </div>
  )
}

function ScoreChip({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  const color = value >= 8 ? 'text-emerald-400' : value >= 6 ? 'text-yellow-400' : 'text-muted-foreground'
  return (
    <div className={cn('liquid-glass rounded-xl px-3 py-2 text-center', highlight && 'bg-white/[0.05]')}>
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className={cn('text-lg font-light', color)}>{value}</p>
    </div>
  )
}

function FeedbackList({ label, items, color }: { label: string; items: string[]; color: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-2">{label}</p>
      <ul className="flex flex-col gap-1.5">
        {items.map((item, i) => <li key={i} className={cn('text-sm', color)}>— {item}</li>)}
      </ul>
    </div>
  )
}
