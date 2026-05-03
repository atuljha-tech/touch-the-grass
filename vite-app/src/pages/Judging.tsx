import { useState } from 'react'
import PageContainer from '@/components/PageContainer'
import SectionWrapper from '@/components/SectionWrapper'
import GlassCard from '@/components/GlassCard'
import AnimatedHeading from '@/components/AnimatedHeading'
import CTAButton from '@/components/CTAButton'

const assigned = [
  { id: 1, title: 'Codeflow', team: 'Team Sigma', track: 'Developer Tooling' },
  { id: 2, title: 'NeuralNest', team: 'Team Apex', track: 'AI & Machine Learning' },
  { id: 3, title: 'Patchwork', team: 'Team Drift', track: 'Open Source' },
]

interface Score {
  innovation: string
  execution: string
  impact: string
  feedback: string
}

export default function Judging() {
  const [scores, setScores] = useState<Record<number, Score>>(
    Object.fromEntries(assigned.map((p) => [p.id, { innovation: '', execution: '', impact: '', feedback: '' }]))
  )

  const update = (id: number, field: keyof Score, value: string) =>
    setScores((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }))

  return (
    <PageContainer>
      <SectionWrapper className="pt-32">
        <AnimatedHeading as="h2" className="mb-4">
          Judge Dashboard
        </AnimatedHeading>
        <p className="animate-fade-rise-delay text-muted-foreground text-base max-w-xl mb-14">
          Score your assigned projects. Be honest, be fair.
        </p>

        <div className="flex flex-col gap-8">
          {assigned.map((project) => {
            const s = scores[project.id]
            return (
              <GlassCard key={project.id} hover={false}>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3
                      className="text-foreground text-xl font-normal"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-xs mt-1">
                      {project.team} · {project.track}
                    </p>
                  </div>
                  <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    View Submission →
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                  {(['innovation', 'execution', 'impact'] as const).map((field) => (
                    <div key={field}>
                      <label className="block text-xs text-muted-foreground mb-1.5 capitalize">{field} (1–10)</label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={s[field]}
                        onChange={(e) => update(project.id, field, e.target.value)}
                        className="w-full bg-transparent border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 transition-colors"
                        placeholder="—"
                      />
                    </div>
                  ))}
                </div>

                <div className="mb-5">
                  <label className="block text-xs text-muted-foreground mb-1.5">Feedback</label>
                  <textarea
                    rows={3}
                    value={s.feedback}
                    onChange={(e) => update(project.id, 'feedback', e.target.value)}
                    className="w-full bg-transparent border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 transition-colors resize-none"
                    placeholder="What stood out? What could be stronger?"
                  />
                </div>

                <CTAButton size="sm">Submit Score</CTAButton>
              </GlassCard>
            )
          })}
        </div>
      </SectionWrapper>
    </PageContainer>
  )
}
