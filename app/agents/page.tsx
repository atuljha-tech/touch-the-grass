"use client"

import { useState, useEffect } from 'react'
import { PageShell } from '@/components/PageShell'
import { SectionWrapper } from '@/components/SectionWrapper'
import { GlassCard } from '@/components/GlassCard'
import { AnimatedHeading } from '@/components/AnimatedHeading'
import { CTAButton } from '@/components/CTAButton'
import { useAppStore } from '@/contexts/AppStoreContext'
import { cn } from '@/lib/utils'

interface ZyndAgent {
  id: string
  name: string
  description: string
  capabilities: string[]
  price_per_call: string
  trust_score: number
}

interface AgentAnalysis {
  agent_name: string
  agent_capability: string
  analysis: string
  confidence: number
  tags: string[]
}

interface NetworkStats {
  total_agents: number
  active_agents: number
  total_transactions: number
  avg_response_ms: number
}

const CAPABILITY_COLORS: Record<string, string> = {
  'code-review': 'text-blue-400 border-blue-400/30 bg-blue-400/5',
  'pitch-analysis': 'text-purple-400 border-purple-400/30 bg-purple-400/5',
  'impact-assessment': 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5',
  'tech-validation': 'text-yellow-400 border-yellow-400/30 bg-yellow-400/5',
}

// Simulated live transaction feed
const LIVE_TRANSACTIONS = [
  { agent: 'CodeReviewAgent', amount: '+0.02 USDC', time: '2s ago' },
  { agent: 'PitchAnalyzerAgent', amount: '+0.015 USDC', time: '14s ago' },
  { agent: 'ImpactScorerAgent', amount: '+0.018 USDC', time: '1m ago' },
  { agent: 'TechValidatorAgent', amount: '+0.012 USDC', time: '3m ago' },
  { agent: 'CodeReviewAgent', amount: '+0.02 USDC', time: '5m ago' },
]

export default function AgentsPage() {
  const { projects } = useAppStore()
  const [mounted, setMounted] = useState(false)
  const [agents, setAgents] = useState<ZyndAgent[]>([])
  const [networkStats, setNetworkStats] = useState<NetworkStats | null>(null)
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const [analyses, setAnalyses] = useState<AgentAnalysis[]>([])
  const [networkScore, setNetworkScore] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingAgents, setLoadingAgents] = useState(true)
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null)
  const [txFeed, setTxFeed] = useState(LIVE_TRANSACTIONS)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    fetch('/api/zynd/discover-agents')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setAgents(data.data.agents)
          setNetworkStats(data.data.network_stats)
        }
      })
      .finally(() => setLoadingAgents(false))
  }, [])

  // Simulate live transaction feed ticking
  useEffect(() => {
    const interval = setInterval(() => {
      setTxFeed((prev) => {
        const newTx = {
          agent: agents[Math.floor(Math.random() * Math.max(agents.length, 1))]?.name ?? 'CodeReviewAgent',
          amount: `+${(Math.random() * 0.03 + 0.01).toFixed(3)} USDC`,
          time: 'just now',
        }
        return [newTx, ...prev.slice(0, 4)]
      })
    }, 6000)
    return () => clearInterval(interval)
  }, [agents])

  async function runAgentAnalysis() {
    if (selectedProject === null) return
    const project = projects.find((p) => p.id === selectedProject)
    if (!project) return

    setLoading(true)
    setAnalyses([])
    setNetworkScore(null)

    // Animate each agent activating sequentially
    for (const agent of agents) {
      setActiveAgentId(agent.id)
      await new Promise((r) => setTimeout(r, 400))
    }
    setActiveAgentId(null)

    try {
      const res = await fetch('/api/zynd/discover-agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: project.title,
          description: project.description,
          tech_stack: project.tech_stack,
          track: project.track,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setAnalyses(data.data.analyses)
        setNetworkScore(data.data.network_score)
      }
    } finally {
      setLoading(false)
    }
  }

  const selectedProjectData = selectedProject !== null ? projects.find((p) => p.id === selectedProject) : null

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
              href="https://zynd.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-emerald-400 border border-emerald-400/30 rounded-full px-3 py-1 hover:bg-emerald-400/10 transition-colors"
            >
              zynd.ai ↗
            </a>
          </div>
          <AnimatedHeading as="h2">Zynd AI Agent Network</AnimatedHeading>
        </div>

        <p className="animate-fade-rise-delay text-muted-foreground text-base max-w-2xl mb-12">
          The open network where AI agents discover, collaborate, and transact. TouchTheGrass uses the Zynd network to dispatch specialized agents — code reviewer, pitch analyzer, impact scorer, and tech validator — to evaluate each project from multiple expert angles simultaneously.
        </p>

        {/* Network Stats */}
        {networkStats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            {[
              { label: 'Agents on Network', value: networkStats.total_agents.toLocaleString(), color: 'text-emerald-400', icon: '🤖' },
              { label: 'Active Now', value: networkStats.active_agents.toLocaleString(), color: 'text-blue-400', icon: '⚡' },
              { label: 'Transactions', value: networkStats.total_transactions.toLocaleString(), color: 'text-purple-400', icon: '💸' },
              { label: 'Avg Response', value: `${networkStats.avg_response_ms}ms`, color: 'text-yellow-400', icon: '⏱' },
            ].map(({ label, value, color, icon }) => (
              <GlassCard key={label} hover={false} className="text-center py-5">
                <p className="text-2xl mb-2">{icon}</p>
                <p className={cn('text-2xl font-light mb-1', color)}>{value}</p>
                <p className="text-muted-foreground text-xs">{label}</p>
              </GlassCard>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left col — Agent registry + live feed */}
          <div className="flex flex-col gap-6">

            {/* Agent registry */}
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Registered Agents</p>
              {loadingAgents ? (
                <div className="flex flex-col gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="liquid-glass rounded-2xl p-5 bg-white/[0.04] animate-shimmer h-24" />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {agents.map((agent) => (
                    <GlassCard
                      key={agent.id}
                      hover={false}
                      className={cn(
                        'transition-all duration-500',
                        activeAgentId === agent.id && 'border border-emerald-400/50 bg-emerald-400/5 scale-[1.02] animate-glow-pulse'
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            'w-2 h-2 rounded-full transition-all duration-300 shrink-0',
                            activeAgentId === agent.id ? 'bg-emerald-400 animate-pulse' : 'bg-white/20'
                          )} />
                          <p className="text-foreground text-sm font-medium">{agent.name}</p>
                        </div>
                        <span className="text-xs text-muted-foreground font-mono">{agent.price_per_call}</span>
                      </div>
                      <p className="text-muted-foreground text-xs leading-relaxed mb-3">{agent.description}</p>
                      <div className="flex items-center justify-between">
                        <span className={cn('text-xs border rounded-full px-2 py-0.5', CAPABILITY_COLORS[agent.capabilities[0]] ?? 'text-muted-foreground border-white/10')}>
                          {agent.capabilities[0]}
                        </span>
                        <span className="text-xs text-emerald-400">⭐ {agent.trust_score}</span>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              )}
            </div>

            {/* Live transaction feed */}
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Live Settlements</p>
              <GlassCard hover={false} className="bg-white/[0.02]">
                <div className="flex flex-col gap-2">
                  {txFeed.map((tx, i) => (
                    <div
                      key={i}
                      className={cn(
                        'flex items-center justify-between py-1.5 border-b border-white/5 last:border-0 transition-all',
                        i === 0 && 'text-foreground'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <div className={cn('w-1.5 h-1.5 rounded-full', i === 0 ? 'bg-emerald-400 animate-pulse' : 'bg-white/20')} />
                        <span className="text-xs text-muted-foreground truncate max-w-[120px]">{tx.agent}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-emerald-400 font-mono">{tx.amount}</span>
                        <span className="text-xs text-muted-foreground">{tx.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-white/10 text-center">
                  x402 USDC · Base Sepolia · Zero commission
                </p>
              </GlassCard>
            </div>
          </div>

          {/* Right col — Analysis panel */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Project selector + trigger */}
            <GlassCard hover={false}>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Select Project for Multi-Agent Analysis</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5 max-h-52 overflow-y-auto pr-1" suppressHydrationWarning>
                {(mounted ? projects : projects).slice(0, 10).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProject(p.id)}
                    className={cn(
                      'text-left rounded-xl px-4 py-3 text-sm transition-all border',
                      selectedProject === p.id
                        ? 'border-emerald-400/40 bg-emerald-400/10 text-foreground'
                        : 'border-white/10 bg-white/[0.02] text-muted-foreground hover:text-foreground hover:bg-white/[0.04]'
                    )}
                  >
                    <p className="font-medium truncate">{p.title}</p>
                    <p className="text-xs opacity-60 truncate">{p.track} · Score {p.rank_score}</p>
                  </button>
                ))}
              </div>

              {selectedProjectData && (
                <div className="mb-4 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                  <p className="text-xs text-muted-foreground mb-1">Selected</p>
                  <p className="text-foreground text-sm">{selectedProjectData.title}</p>
                  <p className="text-muted-foreground text-xs">{selectedProjectData.tech_stack.slice(0, 4).join(', ')}</p>
                </div>
              )}

              <CTAButton
                onClick={runAgentAnalysis}
                disabled={selectedProject === null || loading}
                className="w-full"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" />
                    Consulting {agents.length} agents on Zynd network...
                  </span>
                ) : (
                  `Dispatch to Zynd Agent Network →`
                )}
              </CTAButton>
            </GlassCard>

            {/* Results */}
            {analyses.length > 0 && (
              <div className="flex flex-col gap-4">
                {/* Network score summary */}
                {networkScore !== null && (
                  <GlassCard hover={false} className="bg-emerald-400/5 border border-emerald-400/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-emerald-400/80 mb-1">Network Consensus Score</p>
                        <p className="text-muted-foreground text-xs">
                          {analyses.length} specialized agents reached consensus · avg confidence {Math.round(analyses.reduce((s, a) => s + a.confidence, 0) / analyses.length * 100)}%
                        </p>
                      </div>
                      <p className="text-4xl font-light text-emerald-400">{networkScore}</p>
                    </div>
                  </GlassCard>
                )}

                {/* Individual agent analyses */}
                {analyses.map((analysis, i) => (
                  <GlassCard
                    key={analysis.agent_name}
                    hover={false}
                    className="animate-fade-rise"
                    style={{ animationDelay: `${i * 0.08}s` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                        <p className="text-foreground text-sm font-medium">{analysis.agent_name}</p>
                        <span className={cn('text-xs border rounded-full px-2 py-0.5', CAPABILITY_COLORS[analysis.agent_capability] ?? 'text-muted-foreground border-white/10')}>
                          {analysis.agent_capability}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="h-1.5 w-20 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-400 rounded-full transition-all duration-1000"
                            style={{ width: `${analysis.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{Math.round(analysis.confidence * 100)}%</span>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed mb-3">{analysis.analysis}</p>

                    <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10">
                      {analysis.tags.map((tag) => (
                        <span key={tag} className="text-xs text-muted-foreground border border-white/10 rounded-full px-3 py-0.5 bg-white/5">
                          {tag}
                        </span>
                      ))}
                      <span className="ml-auto text-xs text-muted-foreground font-mono">settled · x402</span>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}

            {analyses.length === 0 && !loading && (
              <div className="liquid-glass rounded-2xl p-16 text-center bg-white/[0.02]">
                <p className="text-5xl mb-4">🤖</p>
                <p className="text-foreground text-base mb-2" style={{ fontFamily: "'Instrument Serif', serif" }}>
                  The network is ready.
                </p>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                  Select a project above and dispatch it to the Zynd agent network. Four specialized agents will analyze it simultaneously and reach consensus.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* How it works */}
        <div className="mt-16 border border-white/10 rounded-3xl p-8 bg-white/[0.02]">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6">How Zynd Integration Works</p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Register', desc: 'TouchTheGrass registers as an agent consumer on the Zynd network with Ed25519 identity.' },
              { step: '02', title: 'Discover', desc: 'Semantic search finds the best agents for hackathon evaluation from 548+ on the network.' },
              { step: '03', title: 'Dispatch', desc: 'Project data is sent to each agent endpoint. Agents analyze in parallel and return structured results.' },
              { step: '04', title: 'Settle', desc: 'Each agent call is settled automatically via x402 USDC micropayments on Base. Zero commission.' },
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
