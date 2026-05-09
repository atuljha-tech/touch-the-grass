"use client"

import { useState, useEffect } from 'react'
import { PageShell } from '@/components/PageShell'
import { SectionWrapper } from '@/components/SectionWrapper'
import { GlassCard } from '@/components/GlassCard'
import { AnimatedHeading } from '@/components/AnimatedHeading'
import { CTAButton } from '@/components/CTAButton'
import { useAppStore } from '@/contexts/AppStoreContext'
import { cn } from '@/lib/utils'

interface RepoAnalysis {
  readme_quality: number
  code_structure_score: number
  documentation_score: number
  activity_score: number
  open_issues: number
  closed_issues: number
  pull_requests: number
  languages: Record<string, number>
  topics: string[]
  license: string | null
  has_ci: boolean
  has_tests: boolean
  last_commit_days_ago: number
  weekly_commits: number[]
  insights: string[]
}

interface AnalysisMeta {
  owner: string
  repo: string
  full_name: string
  powered_by: string
  title: string
}

function ScoreBar({ label, score, color, icon }: { label: string; score: number; color: string; icon: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-sm">{icon}</span>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
        <span className={cn('text-sm font-light', color)}>{score}/10</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-1000', color.replace('text-', 'bg-'))}
          style={{ width: `${score * 10}%` }}
        />
      </div>
    </div>
  )
}

function WeeklyChart({ data }: { data: number[] }) {
  const max = Math.max(...data, 1)
  const labels = ['3w ago', '2w ago', 'Last wk', 'This wk']
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-3">Weekly Commit Activity</p>
      <div className="flex items-end gap-3 h-20">
        {data.map((count, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
            <span className="text-xs text-muted-foreground">{count}</span>
            <div
              className={cn(
                'w-full rounded-t transition-all duration-700',
                i === data.length - 1 ? 'bg-orange-400/60' : 'bg-white/20'
              )}
              style={{ height: `${Math.max((count / max) * 48, count > 0 ? 4 : 0)}px` }}
            />
            <span className="text-muted-foreground" style={{ fontSize: '9px' }}>{labels[i]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const APIFY_CAPABILITIES = [
  { icon: '📄', label: 'README quality scoring' },
  { icon: '🏗️', label: 'Code structure analysis' },
  { icon: '⚙️', label: 'CI/CD pipeline detection' },
  { icon: '🧪', label: 'Test suite presence' },
  { icon: '📈', label: 'Commit velocity patterns' },
  { icon: '🌐', label: 'Language composition' },
  { icon: '🔀', label: 'PR workflow analysis' },
  { icon: '⭐', label: 'Community engagement' },
]

export default function DeepAnalysisPage() {
  const { projects } = useAppStore()
  const [mounted, setMounted] = useState(false)
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const [analysis, setAnalysis] = useState<RepoAnalysis | null>(null)
  const [meta, setMeta] = useState<AnalysisMeta | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { setMounted(true) }, [])

  async function runAnalysis() {
    if (selectedProject === null) return
    const project = projects.find((p) => p.id === selectedProject)
    if (!project) return

    setLoading(true)
    setError(null)
    setAnalysis(null)
    setMeta(null)

    try {
      const res = await fetch('/api/apify/analyze-repo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ github_url: project.github_url, title: project.title }),
      })
      const data = await res.json()
      if (data.success) {
        setAnalysis(data.data)
        setMeta(data.meta)
      } else {
        setError(data.error ?? 'Analysis failed')
      }
    } catch {
      setError('Network error — please try again')
    } finally {
      setLoading(false)
    }
  }

  const selectedProjectData = selectedProject !== null ? projects.find((p) => p.id === selectedProject) : null
  const totalLangBytes = analysis ? Object.values(analysis.languages).reduce((s, v) => s + v, 0) : 0
  const LANG_COLORS = ['bg-blue-400', 'bg-purple-400', 'bg-emerald-400', 'bg-yellow-400', 'bg-orange-400', 'bg-pink-400', 'bg-cyan-400']
  const LANG_TEXT = ['text-blue-400', 'text-purple-400', 'text-emerald-400', 'text-yellow-400', 'text-orange-400', 'text-pink-400', 'text-cyan-400']

  return (
    <PageShell>
      <SectionWrapper className="pt-16 pb-24">

        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs uppercase tracking-widest text-muted-foreground border border-white/10 rounded-full px-3 py-1">
              Sponsor Integration
            </span>
            <a
              href="https://apify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-orange-400 border border-orange-400/30 rounded-full px-3 py-1 hover:bg-orange-400/10 transition-colors"
            >
              apify.com ↗
            </a>
          </div>
          <AnimatedHeading as="h2">Apify Deep Repo Analysis</AnimatedHeading>
        </div>

        <p className="animate-fade-rise-delay text-muted-foreground text-base max-w-2xl mb-12">
          Apify's web scraping and automation platform powers deep repository intelligence that goes far beyond the basic GitHub API — examining code structure, documentation quality, CI/CD maturity, commit patterns, and engineering signals that reveal true project quality.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left — selector + capabilities */}
          <div className="flex flex-col gap-6">

            {/* Project selector */}
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Select Project</p>
              <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1 mb-4" suppressHydrationWarning>
                {(mounted ? projects : projects.slice(0, 12)).slice(0, 12).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProject(p.id)}
                    className={cn(
                      'text-left rounded-xl px-4 py-3 text-sm transition-all border',
                      selectedProject === p.id
                        ? 'border-orange-400/40 bg-orange-400/10 text-foreground'
                        : 'border-white/10 bg-white/[0.02] text-muted-foreground hover:text-foreground hover:bg-white/[0.04]'
                    )}
                  >
                    <p className="font-medium truncate">{p.title}</p>
                    <p className="text-xs opacity-60 font-mono truncate">{p.github_url.replace('https://github.com/', '')}</p>
                  </button>
                ))}
              </div>

              <CTAButton
                onClick={runAnalysis}
                disabled={selectedProject === null || loading}
                className="w-full"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" />
                    Scraping repository...
                  </span>
                ) : (
                  'Run Apify Analysis →'
                )}
              </CTAButton>
            </div>

            {/* What Apify provides */}
            <GlassCard hover={false} className="bg-white/[0.02]">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Apify Capabilities</p>
              <div className="flex flex-col gap-2.5">
                {APIFY_CAPABILITIES.map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <span className="text-sm">{icon}</span>
                    <span className="text-muted-foreground text-xs">{label}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Actor info */}
            <GlassCard hover={false} className="bg-orange-400/5 border border-orange-400/20">
              <p className="text-xs uppercase tracking-widest text-orange-400/80 mb-3">Apify Actor</p>
              <p className="text-foreground text-sm mb-1">GitHub Repository Scraper</p>
              <p className="text-muted-foreground text-xs leading-relaxed mb-3">
                Runs on Apify's serverless infrastructure. Scrapes README, file tree, commit history, issues, PRs, and language stats in parallel.
              </p>
              <a
                href="https://apify.com/integrations"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-orange-400 hover:opacity-80 transition-opacity"
              >
                View Apify integrations ↗
              </a>
            </GlassCard>
          </div>

          {/* Right — Results */}
          <div className="lg:col-span-2">

            {error && (
              <GlassCard hover={false} className="border border-red-400/20 bg-red-400/5 mb-6">
                <p className="text-red-400 text-sm">⚠ {error}</p>
                <p className="text-muted-foreground text-xs mt-1">Make sure the GitHub URL is public and accessible.</p>
              </GlassCard>
            )}

            {loading && (
              <div className="flex flex-col gap-4">
                <div className="liquid-glass rounded-2xl p-6 bg-white/[0.04] animate-shimmer">
                  <div className="h-5 bg-white/10 rounded mb-3 w-1/2" />
                  <div className="grid grid-cols-4 gap-3">
                    {[1,2,3,4].map((i) => <div key={i} className="h-16 bg-white/5 rounded-xl" />)}
                  </div>
                </div>
                <div className="liquid-glass rounded-2xl p-6 bg-white/[0.04] animate-shimmer">
                  <div className="h-4 bg-white/10 rounded mb-4 w-1/3" />
                  {[1,2,3,4].map((i) => <div key={i} className="h-3 bg-white/5 rounded mb-3" />)}
                </div>
              </div>
            )}

            {analysis && meta && !loading && (
              <div className="flex flex-col gap-5">

                {/* Repo header */}
                <GlassCard hover={false}>
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <p className="text-foreground text-xl mb-1" style={{ fontFamily: "'Instrument Serif', serif" }}>{meta.title}</p>
                      <a
                        href={`https://github.com/${meta.full_name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground text-xs hover:text-foreground transition-colors font-mono"
                      >
                        github.com/{meta.full_name} ↗
                      </a>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {analysis.license && (
                        <span className="text-xs text-muted-foreground border border-white/10 rounded-full px-2 py-0.5">{analysis.license}</span>
                      )}
                      <span className="text-xs text-orange-400 border border-orange-400/30 rounded-full px-2 py-0.5">Apify</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Open Issues', value: analysis.open_issues, color: analysis.open_issues > 5 ? 'text-yellow-400' : 'text-emerald-400' },
                      { label: 'Closed Issues', value: analysis.closed_issues, color: 'text-emerald-400' },
                      { label: 'Pull Requests', value: analysis.pull_requests, color: 'text-blue-400' },
                      { label: 'Last Commit', value: `${analysis.last_commit_days_ago}d ago`, color: analysis.last_commit_days_ago < 7 ? 'text-emerald-400' : 'text-muted-foreground' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="text-center liquid-glass rounded-xl py-4 bg-white/[0.02]">
                        <p className={cn('text-xl font-light', color)}>{value}</p>
                        <p className="text-muted-foreground text-xs mt-1">{label}</p>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                {/* Quality scores */}
                <GlassCard hover={false}>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-5">Quality Scores</p>
                  <div className="flex flex-col gap-4">
                    <ScoreBar label="README Quality" score={analysis.readme_quality} color="text-orange-400" icon="📄" />
                    <ScoreBar label="Code Structure" score={analysis.code_structure_score} color="text-blue-400" icon="🏗️" />
                    <ScoreBar label="Documentation" score={analysis.documentation_score} color="text-purple-400" icon="📚" />
                    <ScoreBar label="Activity Score" score={analysis.activity_score} color="text-emerald-400" icon="📈" />
                  </div>
                </GlassCard>

                {/* Engineering signals + weekly chart */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <GlassCard hover={false}>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Engineering Signals</p>
                    <div className="flex flex-col gap-3">
                      {[
                        { label: 'Test Suite', active: analysis.has_tests, icon: '🧪' },
                        { label: 'CI/CD Pipeline', active: analysis.has_ci, icon: '⚙️' },
                        { label: 'License', active: !!analysis.license, icon: '📄' },
                        { label: 'Issues Tracked', active: analysis.open_issues + analysis.closed_issues > 0, icon: '📋' },
                        { label: 'PR Workflow', active: analysis.pull_requests > 0, icon: '🔀' },
                      ].map(({ label, active, icon }) => (
                        <div key={label} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{icon}</span>
                            <span className="text-xs text-muted-foreground">{label}</span>
                          </div>
                          <span className={cn('text-xs font-medium', active ? 'text-emerald-400' : 'text-muted-foreground/40')}>
                            {active ? '✓ Yes' : '✗ No'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  <GlassCard hover={false}>
                    <WeeklyChart data={analysis.weekly_commits} />
                  </GlassCard>
                </div>

                {/* Language composition */}
                {Object.keys(analysis.languages).length > 0 && (
                  <GlassCard hover={false}>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Language Composition</p>
                    <div className="flex h-2.5 rounded-full overflow-hidden mb-4">
                      {Object.entries(analysis.languages).map(([lang, bytes], i) => (
                        <div
                          key={lang}
                          className={cn(LANG_COLORS[i % LANG_COLORS.length], 'transition-all')}
                          style={{ width: `${(bytes / totalLangBytes) * 100}%` }}
                          title={`${lang}: ${Math.round((bytes / totalLangBytes) * 100)}%`}
                        />
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {Object.entries(analysis.languages).map(([lang, bytes], i) => (
                        <div key={lang} className="flex items-center gap-1.5">
                          <div className={cn('w-2 h-2 rounded-full', LANG_COLORS[i % LANG_COLORS.length])} />
                          <span className={cn('text-xs', LANG_TEXT[i % LANG_TEXT.length])}>{lang}</span>
                          <span className="text-xs text-muted-foreground">{Math.round((bytes / totalLangBytes) * 100)}%</span>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                )}

                {/* Topics */}
                {analysis.topics.length > 0 && (
                  <GlassCard hover={false}>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Repository Topics</p>
                    <div className="flex flex-wrap gap-2">
                      {analysis.topics.map((topic) => (
                        <span key={topic} className="text-xs text-muted-foreground border border-white/10 rounded-full px-3 py-0.5 bg-white/5">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </GlassCard>
                )}

                {/* Apify insights */}
                {analysis.insights.length > 0 && (
                  <GlassCard hover={false} className="bg-orange-400/5 border border-orange-400/20">
                    <p className="text-xs uppercase tracking-widest text-orange-400/80 mb-4">Apify Insights</p>
                    <div className="flex flex-col gap-3">
                      {analysis.insights.map((insight, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="text-orange-400 text-xs mt-0.5 shrink-0">→</span>
                          <p className="text-muted-foreground text-sm leading-relaxed">{insight}</p>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                )}
              </div>
            )}

            {!analysis && !loading && !error && (
              <div className="liquid-glass rounded-2xl p-16 text-center bg-white/[0.02]">
                <p className="text-5xl mb-4">🔍</p>
                <p className="text-foreground text-base mb-2" style={{ fontFamily: "'Instrument Serif', serif" }}>
                  Deep analysis ready.
                </p>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                  Select a project and run Apify analysis to get deep repository intelligence — code quality, engineering maturity, and actionable insights.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* How it works */}
        <div className="mt-16 border border-white/10 rounded-3xl p-8 bg-white/[0.02]">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6">How Apify Integration Works</p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Actor Trigger', desc: 'TouchTheGrass triggers the GitHub Scraper Actor via the Apify REST API with the repository URL.' },
              { step: '02', title: 'Parallel Scraping', desc: 'Apify runs the Actor on serverless infrastructure, scraping README, file tree, commits, issues, and PRs in parallel.' },
              { step: '03', title: 'Data Processing', desc: 'Raw scraped data is processed into quality scores, engineering signals, and language composition metrics.' },
              { step: '04', title: 'Insights', desc: 'Processed results are surfaced as actionable insights that judges can use to evaluate project quality.' },
            ].map(({ step, title, desc }) => (
              <div key={step}>
                <p className="text-3xl font-light text-muted-foreground/30 mb-2" style={{ fontFamily: "'Instrument Serif', serif" }}>{step}</p>
                <p className="text-foreground text-sm font-medium mb-1">{title}</p>
                <p className="text-muted-foreground text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

      </SectionWrapper>
    </PageShell>
  )
}
