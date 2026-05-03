"use client"

import { useState, useMemo } from 'react'
import { Navigation } from '@/components/navigation'
import { AISummaryCard } from '@/components/judge/AISummaryCard'
import { ScorePanel } from '@/components/judge/ScorePanel'
import { FeedbackGenerator } from '@/components/judge/FeedbackGenerator'
import { EffortBadge } from '@/components/judge/EffortBadge'
import { JudgeControls } from '@/components/judge/JudgeControls'
import { PROJECTS } from '@/lib/data'

export default function JudgeMode() {
  const [index, setIndex] = useState(0)
  const [blindMode, setBlindMode] = useState(false)
  const [highlightOnly, setHighlightOnly] = useState(false)
  const [scores, setScores] = useState({ innovation: 5, execution: 5, impact: 5 })

  const pool = useMemo(() => {
    if (!highlightOnly) return PROJECTS
    return PROJECTS.filter((p) => p.github_stars >= 40 || p.commit_count >= 100)
  }, [highlightOnly])

  const project = pool[index] ?? pool[0]
  if (!project) return null

  const displayProject = blindMode
    ? { ...project, author_name: '— Hidden —', author_college: '— Hidden —', team: '— Hidden —' }
    : project

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-hidden">
      <Navigation />

      <div className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-8 py-10 flex flex-col gap-8">
        {/* Controls */}
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

        {/* Project header */}
        <div className="animate-fade-rise">
          <div className="flex items-start justify-between flex-wrap gap-3 mb-2">
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
            />
          </div>

          {!blindMode && (
            <p className="text-muted-foreground text-sm">
              {displayProject.team} · {project.track}
            </p>
          )}

          <p className="text-foreground text-base leading-relaxed max-w-2xl mt-4">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            {project.tech_stack.map((t) => (
              <span key={t} className="text-xs text-muted-foreground border border-border rounded-full px-3 py-0.5">{t}</span>
            ))}
          </div>

          <div className="flex gap-5 mt-4 text-xs">
            <a href={project.github_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              GitHub →
            </a>
            {project.demo_url && (
              <a href={project.demo_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                Live Demo →
              </a>
            )}
          </div>
        </div>

        {/* Story Mode sections */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-rise-delay">
          {[
            { label: 'Problem', text: 'Developers waste hours on noisy, slow code review workflows.' },
            { label: 'Solution', text: project.description },
            { label: 'Impact', text: `${project.github_stars} stars · ${project.commit_count} commits · ${project.contributors} contributors` },
          ].map(({ label, text }) => (
            <div key={label} className="liquid-glass rounded-2xl p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{label}</p>
              <p className="text-sm text-foreground leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        {/* AI + Scoring grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-rise-delay-2">
          <AISummaryCard project={project} />
          <ScorePanel
            projectId={project.id}
            project={project}
            onScoreSubmit={(s) => setScores({ innovation: s.innovation, execution: s.execution, impact: s.impact })}
          />
        </div>

        {/* Feedback */}
        <div className="animate-fade-rise-delay-2">
          <FeedbackGenerator project={project} scores={scores} />
        </div>
      </div>
    </div>
  )
}
