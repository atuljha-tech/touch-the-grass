import PageContainer from '@/components/PageContainer'
import SectionWrapper from '@/components/SectionWrapper'
import GlassCard from '@/components/GlassCard'
import AnimatedHeading from '@/components/AnimatedHeading'
import CTAButton from '@/components/CTAButton'

const tracks = [
  { name: 'AI & Machine Learning', desc: 'Build intelligent systems that solve real problems.' },
  { name: 'Developer Tooling', desc: 'Improve the craft. Build for builders.' },
  { name: 'Open Source', desc: 'Contribute to the commons. Ship something lasting.' },
]

const timeline = [
  { date: 'Jun 14', event: 'Registration opens' },
  { date: 'Jun 14', event: 'Kickoff & team formation' },
  { date: 'Jun 15', event: 'Hacking begins' },
  { date: 'Jun 16', event: 'Submissions close — 12:00 UTC' },
  { date: 'Jun 16', event: 'Judging & results' },
]

export default function EventDetail() {
  return (
    <PageContainer>
      {/* Banner */}
      <div className="relative w-full h-64 bg-muted flex items-end">
        <div className="max-w-7xl mx-auto px-6 md:px-8 pb-10 w-full">
          <AnimatedHeading as="h1" className="text-foreground">
            BuildFast AI Hackathon
          </AnimatedHeading>
          <p className="text-muted-foreground text-sm mt-2">Jun 14 – Jun 16, 2026 · Online · 312 participants</p>
        </div>
      </div>

      <SectionWrapper>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 flex flex-col gap-10">
            {/* About */}
            <div>
              <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-4">About</h3>
              <p className="text-foreground text-base leading-relaxed max-w-2xl">
                BuildFast AI is a 48-hour hackathon for developers who want to push the boundaries of
                what AI can do in the real world. No toy demos — we want production-grade thinking,
                minimal scopes, and honest execution.
              </p>
            </div>

            {/* Tracks */}
            <div>
              <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-4">Tracks</h3>
              <div className="flex flex-col gap-4">
                {tracks.map((t) => (
                  <GlassCard key={t.name} hover={false}>
                    <p className="text-foreground text-base mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                      {t.name}
                    </p>
                    <p className="text-muted-foreground text-sm">{t.desc}</p>
                  </GlassCard>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            {/* Timeline */}
            <div>
              <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-4">Timeline</h3>
              <div className="flex flex-col gap-3">
                {timeline.map((t, i) => (
                  <div key={i} className="flex gap-4 text-sm">
                    <span className="text-muted-foreground w-12 shrink-0">{t.date}</span>
                    <span className="text-foreground">{t.event}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sticky CTA */}
            <div className="sticky top-8 mt-4">
              <CTAButton size="md" className="w-full justify-center">
                Register Now
              </CTAButton>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </PageContainer>
  )
}
