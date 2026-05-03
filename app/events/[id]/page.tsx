import { PageShell } from "@/components/PageShell"
import { SectionWrapper } from "@/components/SectionWrapper"
import { GlassCard } from "@/components/GlassCard"
import { AnimatedHeading } from "@/components/AnimatedHeading"
import { CTAButton } from "@/components/CTAButton"

const tracks = [
  { name: "AI & Machine Learning", desc: "Build intelligent systems that solve real problems." },
  { name: "Developer Tooling", desc: "Improve the craft. Build for builders." },
  { name: "Open Source", desc: "Contribute to the commons. Ship something lasting." },
]

const timeline = [
  { date: "Jun 14", event: "Registration opens" },
  { date: "Jun 14", event: "Kickoff & team formation" },
  { date: "Jun 15", event: "Hacking begins" },
  { date: "Jun 16", event: "Submissions close — 12:00 UTC" },
  { date: "Jun 16", event: "Judging & results" },
]

export default function EventDetail() {
  return (
    <PageShell>
      {/* Hero banner */}
      <div className="px-6 md:px-8 pt-16 pb-12">
        <div className="max-w-7xl mx-auto liquid-glass rounded-3xl p-10 bg-white/[0.04]">
          <AnimatedHeading as="h1" className="text-foreground mb-3">
            BuildFast AI Hackathon
          </AnimatedHeading>
          <p className="text-muted-foreground text-sm">
            Jun 14 – Jun 16, 2026 · Online · 312 participants
          </p>
        </div>
      </div>

      <SectionWrapper className="pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main */}
          <div className="lg:col-span-2 flex flex-col gap-10">
            <GlassCard hover={false}>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">About</p>
              <p className="text-foreground text-base leading-relaxed">
                BuildFast AI is a 48-hour hackathon for developers who want to push the boundaries of
                what AI can do in the real world. No toy demos — we want production-grade thinking,
                minimal scopes, and honest execution.
              </p>
            </GlassCard>

            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Tracks</p>
              <div className="flex flex-col gap-4">
                {tracks.map((t) => (
                  <GlassCard key={t.name} hover={false}>
                    <p className="text-foreground text-base mb-1" style={{ fontFamily: "'Instrument Serif', serif" }}>
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
            <GlassCard hover={false}>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-5">Timeline</p>
              <div className="flex flex-col gap-4">
                {timeline.map((t, i) => (
                  <div key={i} className="flex gap-4 text-sm">
                    <span className="text-muted-foreground w-12 shrink-0">{t.date}</span>
                    <span className="text-foreground">{t.event}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            <div className="sticky top-8">
              <CTAButton size="md" className="w-full justify-center">
                Register Now
              </CTAButton>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </PageShell>
  )
}
