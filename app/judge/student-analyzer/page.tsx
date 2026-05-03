"use client"

import { useState } from 'react'
import { PageShell } from '@/components/PageShell'
import { GlassCard } from '@/components/GlassCard'
import { CTAButton } from '@/components/CTAButton'
import { cn } from '@/lib/utils'
import type { StudentVerdict } from '@/lib/verdictGenerator'

// ── Types ─────────────────────────────────────────────────────────────────────

interface RepoSummary {
  name: string
  description: string | null
  language: string | null
  stars: number
  forks: number
  url: string
}

interface ProfileSummary {
  name: string | null
  bio: string | null
  avatar_url: string
  html_url: string
  public_repos: number
  followers: number
  location: string | null
  account_age_years: number
  total_stars: number
  active_days_estimate: number
}

interface AnalysisResult {
  username: string
  profile: ProfileSummary
  top_repos: RepoSummary[]
  languages: Record<string, number>
  verdict: StudentVerdict
}

// ── Verdict config ─────────────────────────────────────────────────────────────

const verdictConfig = {
  'Strong Hire': { color: 'text-emerald-400', border: 'border-emerald-400/30', bg: 'bg-emerald-400/5', dot: 'bg-emerald-400' },
  'Hire':        { color: 'text-blue-400',    border: 'border-blue-400/30',    bg: 'bg-blue-400/5',    dot: 'bg-blue-400' },
  'Maybe':       { color: 'text-yellow-400',  border: 'border-yellow-400/30',  bg: 'bg-yellow-400/5',  dot: 'bg-yellow-400' },
  'Pass':        { color: 'text-red-400',     border: 'border-red-400/30',     bg: 'bg-red-400/5',     dot: 'bg-red-400' },
}

// ── Demo profiles for quick testing ───────────────────────────────────────────

const DEMO_PROFILES = [
  { username: 'torvalds',    label: 'Linus Torvalds' },
  { username: 'gaearon',     label: 'Dan Abramov' },
  { username: 'sindresorhus', label: 'Sindre Sorhus' },
]

// ── Main page ─────────────────────────────────────────────────────────────────

export default function StudentAnalyzer() {
  const [username, setUsername] = useState('')
  const [context, setContext] = useState('')
  const [loading, setLoading] = useState(false)
  const [stage, setStage] = useState<'idle' | 'fetching' | 'analyzing' | 'done' | 'error'>('idle')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<AnalysisResult[]>([])

  async function analyze(user?: string) {
    const target = (user ?? username).trim().replace(/^@/, '')
    if (!target) return

    setLoading(true)
    setError(null)
    setResult(null)
    setStage('fetching')

    try {
      // Simulate staged loading for UX
      await new Promise((r) => setTimeout(r, 600))
      setStage('analyzing')

      const res = await fetch('/api/analyze-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: target, context: context.trim() || undefined }),
      })

      const json = await res.json()
      if (!json.success) throw new Error(json.error)

      setResult(json.data)
      setHistory((prev) => [json.data, ...prev.filter((h) => h.username !== json.data.username)].slice(0, 5))
      setStage('done')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Analysis failed')
      setStage('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto w-full px-6 md:px-8 py-10 pb-24 flex flex-col gap-8">

        {/* Header */}
        <div className="animate-fade-rise">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Judge Tools</p>
          <h1
            className="text-4xl sm:text-5xl font-normal text-foreground leading-tight"
            style={{ fontFamily: "'Instrument Serif', serif", letterSpacing: '-0.03em' }}
          >
            Student Verdict Analyzer
          </h1>
          <p className="text-muted-foreground text-sm mt-3 max-w-xl">
            Enter a GitHub username. The system fetches their public profile, repos, and activity,
            then generates an AI-powered recruitment verdict.
          </p>
        </div>

        {/* Input panel */}
        <GlassCard hover={false} className="animate-fade-rise-delay">
          <div className="flex flex-col gap-4">
            <div className="flex gap-3 flex-wrap">
              <div className="flex-1 min-w-0">
                <label className="block text-xs text-muted-foreground mb-1.5">GitHub Username</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !loading && analyze()}
                  placeholder="e.g. torvalds or github.com/torvalds"
                  className="w-full bg-transparent border border-white/10 rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>
              <div className="flex items-end">
                <CTAButton size="md" onClick={() => analyze()} disabled={loading || !username.trim()}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full border border-foreground/40 border-t-foreground animate-spin" />
                      {stage === 'fetching' ? 'Fetching GitHub...' : 'Analyzing...'}
                    </span>
                  ) : 'Analyze'}
                </CTAButton>
              </div>
            </div>

            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">
                Context for AI (optional) — e.g. "Looking for a React specialist for a fintech hackathon"
              </label>
              <input
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Add context to sharpen the verdict..."
                className="w-full bg-transparent border border-white/10 rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>

            {/* Quick demo profiles */}
            <div className="flex items-center gap-3 flex-wrap pt-1">
              <span className="text-xs text-muted-foreground">Try:</span>
              {DEMO_PROFILES.map((p) => (
                <button
                  key={p.username}
                  onClick={() => { setUsername(p.username); analyze(p.username) }}
                  disabled={loading}
                  className="text-xs text-muted-foreground border border-white/10 rounded-full px-3 py-1 hover:text-foreground hover:border-white/30 transition-colors disabled:opacity-40"
                >
                  @{p.username}
                </button>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Loading state */}
        {loading && (
          <div className="animate-fade-rise flex flex-col gap-3">
            {[
              { active: stage === 'fetching' || stage === 'analyzing', label: 'Fetching GitHub profile & repositories' },
              { active: stage === 'analyzing', label: 'Running AI verdict analysis via Groq' },
            ].map(({ active, label }, i) => (
              <div key={i} className={cn('liquid-glass rounded-xl px-5 py-3 flex items-center gap-3 transition-all', active ? 'bg-white/[0.06]' : 'bg-white/[0.02]')}>
                <span className={cn('w-2 h-2 rounded-full shrink-0', active ? 'bg-emerald-400 animate-pulse' : 'bg-white/20')} />
                <span className={cn('text-sm', active ? 'text-foreground' : 'text-muted-foreground')}>{label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {stage === 'error' && error && (
          <div className="animate-fade-rise rounded-2xl border border-red-400/20 bg-red-400/5 px-6 py-4">
            <p className="text-red-400 text-sm font-medium mb-1">Analysis failed</p>
            <p className="text-red-400/70 text-xs">{error}</p>
            {error.includes('GROQ_API_KEY') && (
              <p className="text-muted-foreground text-xs mt-2">
                Add <code className="text-foreground">GROQ_API_KEY=your_key</code> to <code className="text-foreground">.env.local</code> and restart the server.
              </p>
            )}
          </div>
        )}

        {/* Result */}
        {result && stage === 'done' && (
          <VerdictDisplay result={result} />
        )}

        {/* History */}
        {history.length > 1 && (
          <div className="animate-fade-rise-delay">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Recent Analyses</p>
            <div className="flex gap-2 flex-wrap">
              {history.slice(1).map((h) => {
                const cfg = verdictConfig[h.verdict.overall_verdict]
                return (
                  <button
                    key={h.username}
                    onClick={() => { setUsername(h.username); setResult(h); setStage('done') }}
                    className={cn('flex items-center gap-2 text-xs border rounded-full px-3 py-1.5 transition-all hover:scale-[1.02]', cfg.border, cfg.color)}
                  >
                    <span className={cn('w-1.5 h-1.5 rounded-full', cfg.dot)} />
                    @{h.username} · {h.verdict.overall_verdict}
                  </button>
                )
              })}
            </div>
          </div>
        )}

      </div>
    </PageShell>
  )
}

// ── Verdict display ────────────────────────────────────────────────────────────

function VerdictDisplay({ result }: { result: AnalysisResult }) {
  const { profile, top_repos, languages, verdict, username } = result
  const cfg = verdictConfig[verdict.overall_verdict]

  const topLangs = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)

  return (
    <div className="flex flex-col gap-6 animate-fade-rise">

      {/* Verdict hero */}
      <div className={cn('liquid-glass rounded-3xl p-8 border', cfg.border, cfg.bg)}>
        <div className="flex items-start justify-between flex-wrap gap-5">
          {/* Profile */}
          <div className="flex items-start gap-4">
            <img
              src={profile.avatar_url}
              alt={username}
              className="w-14 h-14 rounded-full border border-white/10 shrink-0"
            />
            <div>
              <p className="text-foreground text-xl font-normal" style={{ fontFamily: "'Instrument Serif', serif" }}>
                {profile.name ?? username}
              </p>
              <a href={profile.html_url} target="_blank" rel="noreferrer"
                className="text-muted-foreground text-xs hover:text-foreground transition-colors">
                @{username} →
              </a>
              {profile.bio && (
                <p className="text-muted-foreground text-xs mt-1 max-w-sm leading-relaxed">{profile.bio}</p>
              )}
              {profile.location && (
                <p className="text-muted-foreground text-xs mt-1">📍 {profile.location}</p>
              )}
            </div>
          </div>

          {/* Verdict badge */}
          <div className="flex flex-col items-end gap-2">
            <div className={cn('flex items-center gap-2 rounded-full px-5 py-2 border', cfg.border, cfg.bg)}>
              <span className={cn('w-2 h-2 rounded-full', cfg.dot)} />
              <span className={cn('text-base font-medium', cfg.color)}>{verdict.overall_verdict}</span>
            </div>
            <div className="flex items-center gap-3">
              <ScorePill label="Score" value={verdict.verdict_score} color={cfg.color} />
              <ScorePill label="Hackathon" value={verdict.hackathon_readiness} color={cfg.color} />
              <span className="text-xs text-muted-foreground border border-white/10 rounded-full px-2 py-0.5">
                {verdict.confidence} confidence
              </span>
            </div>
          </div>
        </div>

        {/* Summary */}
        <p className="text-foreground/90 text-sm leading-relaxed mt-5 max-w-3xl">{verdict.summary}</p>

        {/* Recommendation */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-xs text-muted-foreground mb-1">Recommendation</p>
          <p className="text-foreground text-sm">{verdict.recommendation}</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Public Repos', value: profile.public_repos },
          { label: 'Total Stars', value: profile.total_stars },
          { label: 'Followers', value: profile.followers },
          { label: 'Account Age', value: `${profile.account_age_years}y` },
        ].map(({ label, value }) => (
          <GlassCard key={label} hover={false} className="text-center py-4">
            <p className="text-2xl font-light text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </GlassCard>
        ))}
      </div>

      {/* Strengths + Concerns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <GlassCard hover={false}>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Strengths</p>
          <ul className="flex flex-col gap-2">
            {verdict.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-emerald-400">
                <span className="shrink-0 mt-0.5">—</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard hover={false}>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Concerns</p>
          <ul className="flex flex-col gap-2">
            {verdict.concerns.length > 0 ? verdict.concerns.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-yellow-400">
                <span className="shrink-0 mt-0.5">—</span>
                <span>{c}</span>
              </li>
            )) : (
              <li className="text-sm text-muted-foreground">No significant concerns identified.</li>
            )}
          </ul>
        </GlassCard>
      </div>

      {/* Skill profile + Languages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <GlassCard hover={false}>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Skill Profile</p>
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-xs text-muted-foreground mb-2">Primary Languages</p>
              <div className="flex flex-wrap gap-2">
                {verdict.skill_profile.primary_languages.map((l) => (
                  <span key={l} className="text-xs text-foreground border border-white/10 rounded-full px-3 py-0.5 bg-white/5">{l}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Domains</p>
              <div className="flex flex-wrap gap-2">
                {verdict.skill_profile.domains.map((d) => (
                  <span key={d} className="text-xs text-foreground border border-white/10 rounded-full px-3 py-0.5 bg-white/5">{d}</span>
                ))}
              </div>
            </div>
            <div className="pt-2 border-t border-white/10">
              <p className="text-xs text-muted-foreground mb-1">Depth Signal</p>
              <p className="text-sm text-foreground/90">{verdict.skill_profile.depth_signal}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard hover={false}>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Language Distribution</p>
          <div className="flex flex-col gap-2">
            {topLangs.map(([lang, count]) => {
              const max = topLangs[0][1]
              const pct = Math.round((count / max) * 100)
              return (
                <div key={lang} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-20 shrink-0">{lang}</span>
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-foreground/40 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8 text-right shrink-0">{count}</span>
                </div>
              )
            })}
          </div>
        </GlassCard>
      </div>

      {/* Top repos */}
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Top Repositories</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {top_repos.map((repo) => {
            const isStandout = verdict.standout_projects.includes(repo.name)
            return (
              <a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  'liquid-glass rounded-2xl p-5 flex flex-col gap-2 hover:bg-white/[0.07] transition-all hover:scale-[1.02]',
                  isStandout && 'border border-emerald-400/20 bg-emerald-400/[0.03]',
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-foreground text-sm font-medium truncate">{repo.name}</p>
                  {isStandout && (
                    <span className="text-xs text-emerald-400 border border-emerald-400/30 rounded-full px-2 py-0.5 shrink-0">★ Standout</span>
                  )}
                </div>
                {repo.description && (
                  <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">{repo.description}</p>
                )}
                <div className="flex items-center gap-3 mt-auto pt-2 border-t border-white/10 text-xs text-muted-foreground">
                  {repo.language && <span>{repo.language}</span>}
                  <span>⭐ {repo.stars}</span>
                  <span>🍴 {repo.forks}</span>
                </div>
              </a>
            )
          })}
        </div>
      </div>

    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function ScorePill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="liquid-glass rounded-xl px-3 py-2 text-center">
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className={cn('text-lg font-light', color)}>{value}<span className="text-xs text-muted-foreground">/10</span></p>
    </div>
  )
}
