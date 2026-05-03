"use client"

import Link from 'next/link'
import { PageShell } from '@/components/PageShell'
import { SectionWrapper } from '@/components/SectionWrapper'
import { GlassCard } from '@/components/GlassCard'
import { AnimatedHeading } from '@/components/AnimatedHeading'
import { CTAButton } from '@/components/CTAButton'
import { EffortBadge } from '@/components/judge/EffortBadge'
import { PROJECTS } from '@/lib/data'

export default function Judging() {
  return (
    <PageShell>
      <SectionWrapper className="pt-16">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
          <AnimatedHeading as="h2">Judge Dashboard</AnimatedHeading>
          <Link href="/judge-mode">
            <CTAButton size="sm">Enter Judge Mode →</CTAButton>
          </Link>
        </div>
        <p className="animate-fade-rise-delay text-muted-foreground text-base max-w-xl mb-14">
          Overview of assigned projects. Use Judge Mode for immersive scoring.
        </p>

        <div className="flex flex-col gap-5">
          {PROJECTS.map((project) => (
            <GlassCard key={project.id} hover={false}>
              <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                <div>
                  <h3
                    className="text-foreground text-xl font-normal"
                    style={{ fontFamily: "'Instrument Serif', serif" }}
                  >
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-xs mt-1">
                    {project.team} · {project.track}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <EffortBadge
                    commit_count={project.commit_count}
                    contributors={project.contributors}
                    github_stars={project.github_stars}
                  />
                  <Link href="/judge-mode" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    Score →
                  </Link>
                </div>
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed mb-4 max-w-2xl">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10">
                {project.tech_stack.map((t) => (
                  <span key={t} className="text-xs text-muted-foreground border border-white/10 rounded-full px-3 py-0.5 bg-white/5">
                    {t}
                  </span>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      </SectionWrapper>
    </PageShell>
  )
}
