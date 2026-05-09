"use client"

import { useState, useEffect } from 'react'
import { PageShell } from '@/components/PageShell'
import { SectionWrapper } from '@/components/SectionWrapper'
import { GlassCard } from '@/components/GlassCard'
import { AnimatedHeading } from '@/components/AnimatedHeading'
import { CTAButton } from '@/components/CTAButton'
import { useAppStore } from '@/contexts/AppStoreContext'
import { cn } from '@/lib/utils'

interface PipelineStage {
  id: string
  name: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  duration_ms?: number | null
  output?: Record<string, unknown>
  started_at?: string
  completed_at?: string
}

interface PipelineRun {
  pipeline_id: string
  project_title: string
  status: 'running' | 'completed' | 'failed'
  created_at: string
  stages: PipelineStage[]
  final_score?: number
  canvas_yaml?: string
}

interface PipelineStats {
  total_runs: number
  successful: number
  failed: number
  avg_duration_ms: number
  stages_per_pipeline: number
}

const STAGE_ICONS: Record<string, string> = {
  'github-analysis': '📦',
  'ai-scoring': '🧠',
  'zynd-agent-review': '🤖',
  'feedback-generation': '💬',
  'rank-update': '🏆',
  'notify-hacker': '📨',
}

const STAGE_INTEGRATIONS: Record<string, { name: string; color: string }> = {
  'github-analysis': { name: 'Apify', color: 'text-orange-400 border-orange-400/30' },
  'ai-scoring': { name: 'Groq AI', color: 'text-purple-400 border-purple-400/30' },
  'zynd-agent-review': { name: 'Zynd AI', color: 'text-emerald-400 border-emerald-400/30' },
  'feedback-generation': { name: 'Groq AI', color: 'text-purple-400 border-purple-400/30' },
  'rank-update': { name: 'Platform', color: 'text-blue-400 border-blue-400/30' },
  'notify-hacker': { name: 'Webhook', color: 'text-yellow-400 border-yellow-400/30' },
}

export default function PipelinePage() {
  const { projects } = useAppStore()
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState<PipelineStats | null>(null)
  const [recentRuns, setRecentRuns] = useState<Array<{ id: string; project: string; status: string; duration_ms: number | null; score: number | null }>>([])
  const [activePipeline, setActivePipeline] = useState<PipelineRun | null>(null)
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [showYAML, setShowYAML] = useState(false)
  const [animatingStages, setAnimatingStages] = useState<Set<string>>(new Set())

  useEffect(() => {
    setMounted(true)
    fetch('/api/superplane/pipeline')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setStats(data.data.stats)
          setRecentRuns(data.data.pipelines)
        }
      })
  }, [])

  async function triggerPipeline() {
    if (selectedProject === null) return
    const project = projects.find((p) => p.id === selectedProject)
    if (!project) return

    setLoading(true)
    setActivePipeline(null)
    setAnimatingStages(new Set())

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
        // Animate stages appearing one by one
        const pipeline = data.data as PipelineRun
        setActivePipeline({ ...pipeline, stages: [] })

        for (let i = 0; i < pipeline.stages.length; i++) {
          await new Promise((r) => setTimeout(r, 300))
          setActivePipeline((prev) => prev ? {
            ...prev,
            stages: pipeline.stages.slice(0, i + 1),
          } : null)
        }

        setActivePipeline(pipeline)

        // Add to recent runs
        setRecentRuns((prev) => [{
          id: pipeline.pipeline_id,
          project: pipeline.project_title,
          status: pipeline.status,
          duration_ms: pipeline.stages.reduce((s, st) => s + (st.duration_ms ?? 0), 0),
          score: pipeline.final_score ?? null,
        }, ...prev.slice(0, 3)])
      }
    } finally {
      setLoading(false)
    }
  }

  const selectedProjectData = selectedProject !== null ? projects.find((p) => p.id === selectedProject) : null
  const totalDuration = activePipeline?.stages.reduce((s, st) => s + (st.duration_ms ?? 0), 0) ?? 0

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
              href="https://superplane.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-blue-400 border border-blue-400/30 rounded-full px-3 py-1 hover:bg-blue-400/10 transition-colors"
            >
              superplane.com ↗
            </a>
          </div>
          <AnimatedHeading as="h2">Superplane Judging Pipeline</AnimatedHeading>
        </div>

        <p className="animate-fade-rise-delay text-muted-foreground text-base max-w-2xl mb-12">
          Every project submission triggers an automated, observable judging pipeline orchestrated by Superplane — the AI-first control plane for platform engineering. From GitHub analysis to AI scoring to leaderboard update, every step is visible, auditable, and policy-gated.
        </p>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-12">
            {[
              { label: 'Total Runs', value: stats.total_runs, color: 'text-foreground' },
              { label: 'Successful', value: stats.successful, color: 'text-emerald-400' },
              { label: 'Failed', value: stats.failed, color: 'text-red-400' },
              { label: 'Avg Duration', value: `${(stats.avg_duration_ms / 1000).toFixed(1)}s`, color: 'text-blue-400' },
              { label: 'Stages / Run', value: stats.stages_per_pipeline, color: 'text-purple-400' },
            ].map(({ label, value, color }) => (
              <GlassCard key={label} hover={false} className="text-center py-5">
                <p className={cn('text-2xl font-light mb-1', color)}>{value}</p>
                <p className="text-muted-foreground text-xs">{label}</p>
              </GlassCard>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left — trigger + recent */}
          <div className="flex flex-col gap-6">

            {/* Trigger */}
            <GlassCard hover={false}>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Trigger Pipeline</p>
              <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1 mb-4" suppressHydrationWarning>
                {(mounted ? projects : projects).slice(0, 10).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProject(p.id)}
                    className={cn(
                      'text-left rounded-xl px-4 py-3 text-sm transition-all border',
                      selectedProject === p.id
                        ? 'border-blue-400/40 bg-blue-400/10 text-foreground'
                        : 'border-white/10 bg-white/[0.02] text-muted-foreground hover:text-foreground hover:bg-white/[0.04]'
                    )}
                  >
                    <p className="font-medium truncate">{p.title}</p>
                    <p className="text-xs opacity-60 truncate">{p.track} · {p.rank_score}/10</p>
                  </button>
                ))}
              </div>

              {selectedProjectData && (
                <div className="mb-4 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                  <p className="text-xs text-muted-foreground mb-1">Selected</p>
                  <p className="text-foreground text-sm">{selectedProjectData.title}</p>
                  <p className="text-muted-foreground text-xs">AI: {selectedProjectData.ai_score.final_score} · Effort: {selectedProjectData.effort_score}</p>
                </div>
              )}

              <CTAButton
                onClick={triggerPipeline}
                disabled={selectedProject === null || loading}
                className="w-full"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" />
                    Running pipeline...
                  </span>
                ) : (
                  '⚡ Trigger Judging Pipeline →'
                )}
              </CTAButton>
            </GlassCard>

            {/* Recent runs */}
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Recent Runs</p>
              <div className="flex flex-col gap-2">
                {recentRuns.map((run) => (
                  <div key={run.id} className="liquid-glass rounded-xl px-4 py-3 bg-white/[0.03] flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-foreground text-xs truncate">{run.project}</p>
                      <p className="text-muted-foreground text-xs font-mono">
                        {run.duration_ms ? `${(run.duration_ms / 1000).toFixed(1)}s` : 'running...'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {run.score && <span className="text-xs text-emerald-400 font-light">{run.score}</span>}
                      <span className={cn(
                        'text-xs border rounded-full px-2 py-0.5',
                        run.status === 'completed' ? 'text-emerald-400 border-emerald-400/30' :
                        run.status === 'running' ? 'text-blue-400 border-blue-400/30 animate-pulse' :
                        'text-red-400 border-red-400/30'
                      )}>
                        {run.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Superplane info */}
            <GlassCard hover={false} className="bg-blue-400/5 border border-blue-400/20">
              <p className="text-xs uppercase tracking-widest text-blue-400/80 mb-3">About Superplane</p>
              <p className="text-muted-foreground text-xs leading-relaxed mb-3">
                Open source control plane for platform engineering. Define event-driven workflows in Canvas YAML. Policy gates, audit trails, and 300+ integrations.
              </p>
              <div className="flex flex-col gap-1.5">
                {['Event-driven workflows', 'Policy-gated approvals', 'Full audit trail', 'Canvas YAML config', 'Apache 2.0 licensed'].map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <span className="text-blue-400 text-xs">→</span>
                    <span className="text-muted-foreground text-xs">{f}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Right — pipeline visualization */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Pipeline Execution</p>
              {activePipeline?.canvas_yaml && (
                <button
                  onClick={() => setShowYAML(!showYAML)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors border border-white/10 rounded-full px-3 py-1 hover:border-white/20"
                >
                  {showYAML ? 'Hide' : 'View'} Canvas YAML
                </button>
              )}
            </div>

            {showYAML && activePipeline?.canvas_yaml && (
              <GlassCard hover={false} className="mb-6 bg-white/[0.02]">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Superplane Canvas YAML</p>
                <pre className="text-xs text-muted-foreground overflow-x-auto leading-relaxed font-mono whitespace-pre-wrap max-h-80 overflow-y-auto">
                  {activePipeline.canvas_yaml}
                </pre>
              </GlassCard>
            )}

            {activePipeline ? (
              <div className="flex flex-col gap-3">
                {/* Pipeline header */}
                <GlassCard hover={false} className="border border-blue-400/20 bg-blue-400/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground text-base font-medium">{activePipeline.project_title}</p>
                      <p className="text-muted-foreground text-xs font-mono mt-0.5">{activePipeline.pipeline_id}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      {activePipeline.final_score && (
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Final Score</p>
                          <p className="text-2xl font-light text-emerald-400">{activePipeline.final_score}</p>
                        </div>
                      )}
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Duration</p>
                        <p className="text-sm text-blue-400">{(totalDuration / 1000).toFixed(1)}s</p>
                      </div>
                      <span className={cn(
                        'text-xs border rounded-full px-3 py-1',
                        activePipeline.status === 'completed' ? 'text-emerald-400 border-emerald-400/30' :
                        activePipeline.status === 'running' ? 'text-blue-400 border-blue-400/30 animate-pulse' :
                        'text-red-400 border-red-400/30'
                      )}>
                        {activePipeline.status}
                      </span>
                    </div>
                  </div>
                </GlassCard>

                {/* Stages */}
                {activePipeline.stages.map((stage, i) => (
                  <div key={stage.id} className="flex gap-4 animate-fade-rise" style={{ animationDelay: `${i * 0.05}s` } as React.CSSProperties}>
                    {/* Connector */}
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        'w-9 h-9 rounded-full border flex items-center justify-center text-base shrink-0',
                        stage.status === 'completed' ? 'border-emerald-400/40 bg-emerald-400/10' :
                        stage.status === 'running' ? 'border-blue-400/40 bg-blue-400/10 animate-pulse' :
                        stage.status === 'failed' ? 'border-red-400/40 bg-red-400/10' :
                        'border-white/10 bg-white/[0.02]'
                      )}>
                        {STAGE_ICONS[stage.id] ?? '⚙️'}
                      </div>
                      {i < activePipeline.stages.length - 1 && (
                        <div className={cn(
                          'w-px mt-1',
                          stage.status === 'completed' ? 'bg-emerald-400/30' : 'bg-white/10'
                        )} style={{ minHeight: '16px', flex: 1 }} />
                      )}
                    </div>

                    {/* Stage card */}
                    <GlassCard
                      hover={false}
                      className={cn(
                        'flex-1 mb-1',
                        stage.status === 'completed' && 'border border-emerald-400/10',
                        stage.status === 'running' && 'border border-blue-400/20 animate-pulse',
                        stage.status === 'failed' && 'border border-red-400/20',
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-foreground text-sm">{stage.name}</p>
                          {STAGE_INTEGRATIONS[stage.id] && (
                            <span className={cn('text-xs border rounded-full px-2 py-0.5', STAGE_INTEGRATIONS[stage.id].color)}>
                              {STAGE_INTEGRATIONS[stage.id].name}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {stage.duration_ms && (
                            <span className="text-xs text-muted-foreground font-mono">{stage.duration_ms}ms</span>
                          )}
                          <span className={cn(
                            'text-xs border rounded-full px-2 py-0.5',
                            stage.status === 'completed' ? 'text-emerald-400 border-emerald-400/30' :
                            stage.status === 'running' ? 'text-blue-400 border-blue-400/30' :
                            stage.status === 'failed' ? 'text-red-400 border-red-400/30' :
                            'text-muted-foreground border-white/10'
                          )}>
                            {stage.status}
                          </span>
                        </div>
                      </div>

                      {stage.output && Object.keys(stage.output).length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(stage.output).slice(0, 4).map(([key, val]) => (
                            <span key={key} className="text-xs text-muted-foreground border border-white/10 rounded-full px-2 py-0.5 bg-white/5 font-mono">
                              {key}: {typeof val === 'boolean' ? (val ? '✓' : '✗') : String(val)}
                            </span>
                          ))}
                        </div>
                      )}
                    </GlassCard>
                  </div>
                ))}

                {/* Audit trail */}
                {activePipeline.status === 'completed' && (
                  <div className="liquid-glass rounded-xl px-5 py-3 bg-white/[0.02] flex items-center gap-3 animate-fade-rise">
                    <span className="text-sm">🔒</span>
                    <p className="text-xs text-muted-foreground">
                      Full audit trail recorded by Superplane. {activePipeline.stages.length} stages · {(totalDuration / 1000).toFixed(1)}s total · All events logged immutably.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="liquid-glass rounded-2xl p-16 text-center bg-white/[0.02]">
                <p className="text-5xl mb-4">⚡</p>
                <p className="text-foreground text-base mb-2" style={{ fontFamily: "'Instrument Serif', serif" }}>
                  Pipeline ready.
                </p>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                  Select a project and trigger the Superplane judging pipeline. Watch each stage execute in real time — GitHub analysis → AI scoring → Zynd agents → feedback → leaderboard.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* How it works */}
        <div className="mt-16 border border-white/10 rounded-3xl p-8 bg-white/[0.02]">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6">How Superplane Integration Works</p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Canvas YAML', desc: 'The judging workflow is defined as a Superplane Canvas — a declarative YAML that describes stages, dependencies, and policies.' },
              { step: '02', title: 'Event Trigger', desc: 'When a project is submitted, a webhook fires to Superplane which starts the pipeline and tracks each stage.' },
              { step: '03', title: 'Orchestration', desc: 'Superplane calls Apify, Groq AI, and Zynd agents in the right order, passing outputs between stages automatically.' },
              { step: '04', title: 'Audit & Policy', desc: 'Every stage is logged. High-scoring projects trigger a policy gate requiring judge approval before announcing as winner.' },
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
