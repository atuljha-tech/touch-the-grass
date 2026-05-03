import { PageShell } from '@/components/PageShell'
import { SectionWrapper } from '@/components/SectionWrapper'
import { AnimatedHeading } from '@/components/AnimatedHeading'
import { LeaderboardTable } from '@/components/judge/LeaderboardTable'
import { GlassCard } from '@/components/GlassCard'
import { JUDGES } from '@/lib/data'

export default function Leaderboard() {
  return (
    <PageShell>
      <SectionWrapper className="pt-16">
        <AnimatedHeading as="h2" className="mb-4">
          Live Leaderboard
        </AnimatedHeading>
        <p className="animate-fade-rise-delay text-muted-foreground text-base max-w-xl mb-14">
          Ranked by composite score. Updates as judges submit.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <LeaderboardTable />
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Judge Panel</p>
            <div className="flex flex-col gap-3">
              {JUDGES.map((judge) => (
                <GlassCard key={judge.id} hover={false} className="py-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs text-foreground shrink-0">
                      {judge.name[0]}
                    </div>
                    <p className="text-foreground text-sm">{judge.name}</p>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {judge.events_judged} events · Consistency {judge.avg_score_consistency}/10
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs text-muted-foreground border border-white/10 rounded-full px-2 py-0.5 bg-white/5">
                      Feedback {judge.feedback_quality_score}/10
                    </span>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>
    </PageShell>
  )
}
