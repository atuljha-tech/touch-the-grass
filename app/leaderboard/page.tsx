import { Navigation } from '@/components/navigation'
import { SectionWrapper } from '@/components/SectionWrapper'
import { AnimatedHeading } from '@/components/AnimatedHeading'
import { LeaderboardTable } from '@/components/judge/LeaderboardTable'
import { GlassCard } from '@/components/GlassCard'
import { JUDGES } from '@/lib/data'

export default function Leaderboard() {
  return (
    <main className="relative min-h-screen bg-background overflow-hidden">
      <Navigation />
      <SectionWrapper className="pt-16">
        <AnimatedHeading as="h2" className="mb-4">
          Live Leaderboard
        </AnimatedHeading>
        <p className="animate-fade-rise-delay text-muted-foreground text-base max-w-xl mb-14">
          Ranked by composite score. Updates as judges submit.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Leaderboard */}
          <div className="lg:col-span-2">
            <LeaderboardTable />
          </div>

          {/* Judge Reputation sidebar */}
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Judge Panel</p>
            <div className="flex flex-col gap-3">
              {JUDGES.map((judge) => (
                <GlassCard key={judge.id} hover={false} className="py-4">
                  <p className="text-foreground text-sm">{judge.name}</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    {judge.events_judged} events · Consistency {judge.avg_score_consistency}/10
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs text-muted-foreground border border-border rounded-full px-2 py-0.5">
                      Feedback {judge.feedback_quality_score}/10
                    </span>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>
    </main>
  )
}
