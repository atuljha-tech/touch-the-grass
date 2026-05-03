"use client"

import { useState } from 'react'
import { PageShell } from '@/components/PageShell'
import { GlassCard } from '@/components/GlassCard'
import { CTAButton } from '@/components/CTAButton'
import { useAppStore, type NewProjectDraft } from '@/contexts/AppStoreContext'
import { useDemoAuth } from '@/contexts/DemoAuthContext'
import { type DemoProject } from '@/lib/demo/data'
import { cn } from '@/lib/utils'

const TRACKS = ['AI & ML', 'Dev Tooling', 'Health & Wellbeing', 'Smart Cities', 'Open Source', 'FinTech', 'Climate', 'EdTech', 'Other']

export default function HackerDashboard() {
  const { user } = useDemoAuth()
  const { projects, addProject } = useAppStore()
  const hackerId = user?.hacker_id ?? user?.id ?? 'h1'

  const myProjects = projects.filter((p) => p.hacker_id === hackerId)
  const myRanks = myProjects.map((p) => projects.findIndex((x) => x.id === p.id) + 1)

  const [form, setForm] = useState<NewProjectDraft>({
    title: '', description: '', github_url: '', demo_url: '',
    tech_stack: [], hacker_id: hackerId, author_name: user?.name ?? 'You', track: 'AI & ML',
  })
  const [techInput, setTechInput] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState<DemoProject | null>(null)
  const [showForm, setShowForm] = useState(false)

  function addTech() {
    const t = techInput.trim()
    if (t && !form.tech_stack.includes(t)) {
      setForm((p) => ({ ...p, tech_stack: [...p.tech_stack, t] }))
    }
    setTechInput('')
  }

  function removeTech(t: string) {
    setForm((p) => ({ ...p, tech_stack: p.tech_stack.filter((x) => x !== t) }))
  }

  async function handleSubmit() {
    if (!form.title || !form.description) return
    setSubmitting(true)
    // Simulate brief AI processing delay for effect
    await new Promise((r) => setTimeout(r, 900))
    const project = addProject(form)
    setSubmitted(project)
    setSubmitting(false)
    setShowForm(false)
    setForm({ title: '', description: '', github_url: '', demo_url: '', tech_stack: [], hacker_id: hackerId, author_name: user?.name ?? 'You', track: 'AI & ML' })
  }

  const topProjects = projects.slice(0, 5)
  const myBestRank = myRanks.length ? Math.min(...myRanks) : null

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto w-full px-6 md:px-8 py-10 flex flex-col gap-8">

        {/* Header */}
        <div className="animate-fade-rise flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Hacker Dashboard</p>
            <h1 className="text-4xl font-normal text-foreground" style={{ fontFamily: "'Instrument Serif', serif", letterSpacing: '-0.03em' }}>
              {user?.name ?? 'Builder'}
            </h1>
            {myBestRank && (
              <p className="text-muted-foreground text-sm mt-1">
                Your best rank: <span className="text-foreground">#{myBestRank}</span> of {projects.length}
              </p>
            )}
          </div>
          <CTAButton size="sm" onClick={() => setShowForm((v) => !v)}>
            {showForm ? 'Cancel' : '+ Submit Project'}
          </CTAButton>
        </div>

        {/* AI submission success banner */}
        {submitted && (
          <div className="animate-fade-rise liquid-glass rounded-2xl p-6 bg-emerald-400/5 border border-emerald-400/20">
            <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
              <div>
                <p className="text-xs uppercase tracking-widest text-emerald-400 mb-1">Submitted · AI Analysis Complete</p>
                <p className="text-foreground text-lg font-normal" style={{ fontFamily: "'Instrument Serif', serif" }}>
                  {submitted.title}
                </p>
              </div>
              <div className="flex gap-3">
                <MiniScore label="AI Score" value={submitted.ai_score.final_score} />
                <MiniScore label="Effort" value={submitted.effort_score} />
                <MiniScore label="Rank Score" value={submitted.rank_score} highlight />
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-3">{submitted.ai_brief.summary}</p>
            <button onClick={() => setSubmitted(null)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Dismiss
            </button>
          </div>
        )}

        {/* Submission form */}
        {showForm && (
          <GlassCard hover={false} className="animate-fade-rise">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6">New Project Submission</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <FormField label="Project Title *" value={form.title}
                onChange={(v) => setForm((p) => ({ ...p, title: v }))} placeholder="e.g. CropSense AI" />
              <div>
                <label className="block text-xs text-muted-foreground mb-1.5">Track</label>
                <select
                  value={form.track}
                  onChange={(e) => setForm((p) => ({ ...p, track: e.target.value }))}
                  className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-white/30 transition-colors"
                >
                  {TRACKS.map((t) => <option key={t} value={t} className="bg-background">{t}</option>)}
                </select>
              </div>
              <FormField label="GitHub URL" value={form.github_url}
                onChange={(v) => setForm((p) => ({ ...p, github_url: v }))} placeholder="https://github.com/..." />
              <FormField label="Demo URL (optional)" value={form.demo_url}
                onChange={(v) => setForm((p) => ({ ...p, demo_url: v }))} placeholder="https://..." />
            </div>

            <div className="mb-4">
              <label className="block text-xs text-muted-foreground mb-1.5">Description *</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="What does your project do? What problem does it solve?"
                className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-white/30 transition-colors resize-none"
              />
            </div>

            <div className="mb-6">
              <label className="block text-xs text-muted-foreground mb-1.5">Tech Stack</label>
              <div className="flex gap-2 mb-2 flex-wrap">
                {form.tech_stack.map((t) => (
                  <span key={t} className="flex items-center gap-1 text-xs text-muted-foreground border border-white/10 rounded-full px-3 py-0.5 bg-white/5">
                    {t}
                    <button onClick={() => removeTech(t)} className="hover:text-foreground ml-1">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTech()}
                  placeholder="e.g. React (press Enter)"
                  className="flex-1 bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-white/30 transition-colors"
                />
                <CTAButton size="sm" onClick={addTech}>Add</CTAButton>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <CTAButton size="md" onClick={handleSubmit} disabled={submitting || !form.title || !form.description}>
                {submitting ? 'Analyzing with AI...' : 'Submit & Generate AI Score'}
              </CTAButton>
              {submitting && (
                <p className="text-xs text-muted-foreground animate-pulse">Running AI analysis...</p>
              )}
            </div>
          </GlassCard>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* My Projects */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">My Projects</p>

            {myProjects.length === 0 ? (
              <GlassCard hover={false}>
                <p className="text-muted-foreground text-sm">No projects yet. Submit your first project above.</p>
              </GlassCard>
            ) : (
              myProjects.map((p) => {
                const rank = projects.findIndex((x) => x.id === p.id) + 1
                return (
                  <GlassCard key={p.id} hover={false}>
                    <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                      <div>
                        <p className="text-foreground text-lg font-normal" style={{ fontFamily: "'Instrument Serif', serif" }}>
                          {p.title}
                        </p>
                        <p className="text-muted-foreground text-xs mt-0.5">{p.track}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={p.status} />
                        <span className="text-xs text-muted-foreground">Rank #{rank}</span>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">{p.description}</p>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <ScoreBox label="AI Score" value={p.ai_score.final_score} />
                      <ScoreBox label="Effort" value={p.effort_score} />
                      <ScoreBox label="Rank Score" value={p.rank_score} highlight />
                    </div>

                    <div className="pt-3 border-t border-white/10">
                      <p className="text-xs text-muted-foreground mb-1">AI Reasoning</p>
                      <p className="text-xs text-foreground/80 leading-relaxed">{p.ai_score.reasoning}</p>
                    </div>
                  </GlassCard>
                )
              })
            )}
          </div>

          {/* Leaderboard preview */}
          <div className="flex flex-col gap-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Leaderboard</p>
            <GlassCard hover={false}>
              <div className="flex flex-col gap-3">
                {topProjects.map((p, i) => {
                  const isMe = p.hacker_id === hackerId
                  return (
                    <div key={p.id} className={cn('flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors', isMe && 'bg-white/5')}>
                      <span className={cn('text-sm font-light w-5 text-center shrink-0',
                        i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-600' : 'text-muted-foreground'
                      )}>{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className={cn('text-xs truncate', isMe ? 'text-foreground font-medium' : 'text-foreground/80')}>
                          {p.title} {isMe && '← you'}
                        </p>
                        <p className="text-muted-foreground text-xs truncate">{p.team}</p>
                      </div>
                      <span className={cn('text-xs font-light shrink-0',
                        p.rank_score >= 8 ? 'text-emerald-400' : p.rank_score >= 6 ? 'text-yellow-400' : 'text-muted-foreground'
                      )}>{p.rank_score}</span>
                    </div>
                  )
                })}
              </div>
            </GlassCard>

            {/* Stats */}
            <GlassCard hover={false}>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Your Stats</p>
              <div className="flex flex-col gap-3">
                <StatRow label="Projects submitted" value={myProjects.length} />
                <StatRow label="Best rank" value={myBestRank ? `#${myBestRank}` : '—'} />
                <StatRow label="Avg AI score" value={
                  myProjects.length
                    ? Math.round(myProjects.reduce((s, p) => s + p.ai_score.final_score, 0) / myProjects.length * 10) / 10
                    : '—'
                } />
              </div>
            </GlassCard>
          </div>
        </div>

      </div>
    </PageShell>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FormField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div>
      <label className="block text-xs text-muted-foreground mb-1.5">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-white/30 transition-colors"
      />
    </div>
  )
}

function ScoreBox({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  const color = value >= 8 ? 'text-emerald-400' : value >= 6 ? 'text-yellow-400' : 'text-muted-foreground'
  return (
    <div className={cn('liquid-glass rounded-xl p-3 text-center', highlight && 'bg-white/[0.04]')}>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={cn('text-xl font-light', color)}>{value}</p>
    </div>
  )
}

function MiniScore({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  const color = value >= 8 ? 'text-emerald-400' : value >= 6 ? 'text-yellow-400' : 'text-muted-foreground'
  return (
    <div className={cn('liquid-glass rounded-xl px-3 py-2 text-center', highlight && 'bg-white/[0.05]')}>
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className={cn('text-lg font-light', color)}>{value}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: DemoProject['status'] }) {
  const styles = {
    submitted: 'text-blue-400 border-blue-400/30',
    reviewed: 'text-yellow-400 border-yellow-400/30',
    winner: 'text-yellow-400 border-yellow-400/30',
  }
  const labels = { submitted: 'Submitted', reviewed: 'Reviewed', winner: '🏆 Winner' }
  return (
    <span className={cn('text-xs border rounded-full px-2 py-0.5', styles[status])}>
      {labels[status]}
    </span>
  )
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  )
}
