"use client"

import { useState, useMemo } from 'react'
import { PageShell } from '@/components/PageShell'
import { AISummaryCard } from '@/components/judge/AISummaryCard'
import { ScorePanel } from '@/components/judge/ScorePanel'
import { FeedbackGenerator } from '@/components/judge/FeedbackGenerator'
import { EffortBadge } from '@/components/judge/EffortBadge'
import { JudgeControls } from '@/components/judge/JudgeControls'
import { DEMO_PROJECTS } from '@/lib/demo/data'
import { ResultToggle } from '@/components/ResultToggle'

export default function JudgeMode() {
  const [index, setIndex] = useState(0)
  const [blindMode, setBlindMode] = useState(false)
  const [highlightOnly, setHighlightOnly] = useState(false)
  const [scores, setScores] = useState({ innovation: 5, execution: 5, impact: 5 })

  const pool = useMemo(() => {
    if (!highlightOnly) return DEMO_PROJECTS
    return DEMO_PROJECTS.filter((p) => p.effort_score >= 8 || p.github_stars >= 80)
  }, [highlightOnly])

  const project = pool[index] ?? pool[0]
  if (!project) return null

  const displayTeam = blindMode ? '— Hidden —' : project.team

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto w-full px-6 md:px-8 py-10 flex flex-col gap-8">

        {/* Controls */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <JudgeControls
            current={index}
            total={pool.length}
            blindMode={blindMode}
            highlightOnly={highlightOnly}
            onPrev={() => setIndex((i) => Math.max(0, i - 1))}
            onNext={() => setIndex((i) => Math.min(pool.length - 1, i + 1))}
            onToggleBlind={() => setBlindMode((b) => !b)}
            onToggleHighlight={() => { setHighlightOnly((h) => !h); setIndex(0) }}
          />
          <ResultToggle />
        </div>

        {/* Project header */}
        <div className="animate-fade-rise liquid-glass rounded-3xl p-8 bg-white/[0.04]">
          <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
            <h1
              className="text-4xl sm:text-5xl font-normal text-foreground leading-tight"
              style={{ fontFamily: "'Instrument Serif', serif", letterSpacing: '-0.03em' }}
            >
              {project.title}
            </h1>
            <EffortBadge
              commit_count={project.commit_count}
              contributors={project.contributors}
              github_stars={project.github_stars}
              preloaded={project.effort_score}
            />
          </div>

          <p className="text-muted-foreground text-sm mb-4">
            {displayTeam} · {project.track}
          </p>

          <p className="text-foreground/90 text-base leading-relaxed max-w-2xl mb-5">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            {project.tech_stack.map((t) => (
              <span key={t} className="text-xs text-muted-foreground border border-white/10 rounded-full px-3 py-0.5 bg-white/5">
                {t}
              </span>
            ))}
          </div>

          <div className="flex gap-5 text-xs pt-4 border-t border-white/10">
            <a href={project.github_url} target="_blank" rel="noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors">
              GitHub →
            </a>
            {project.demo_url && (
              <a href={project.demo_url} target="_blank" rel="noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors">
                Live Demo →
              </a>
            )}
          </div>
        </div>

        {/* Story Mode — Problem / Solution / Impact */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-rise-delay">
          {[
            { label: 'Problem', text: project.problem },
            { label: 'Solution', text: project.solution },
            { label: 'Impact', text: project.impact },
          ].map(({ label, text }) => (
            <div key={label} className="liquid-glass rounded-2xl p-5 bg-white/[0.04]">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{label}</p>
              <p className="text-sm text-foreground/90 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        {/* AI Brief + Score — pre-loaded, instant */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-rise-delay-2">
          <AISummaryCard
            project={project}
            preloaded={project.ai_brief}
          />
          <ScorePanel
            projectId={project.id}
            project={project}
            preloadedScore={project.ai_score}
            onScoreSubmit={(s) => setScores({
              innovation: s.innovation,
              execution: s.execution,
              impact: s.impact,
            })}
          />
        </div>

        {/* AI Feedback — pre-loaded */}
        <div className="animate-fade-rise-delay-2 pb-10">
          <FeedbackGenerator
            project={project}
            scores={scores}
            preloaded={project.ai_feedback}
          />
        </div>

      </div>
    </PageShell>
  )
}
