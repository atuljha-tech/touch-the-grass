import { PageShell } from "@/components/PageShell"
import { SectionWrapper } from "@/components/SectionWrapper"
import { GlassCard } from "@/components/GlassCard"
import { AnimatedHeading } from "@/components/AnimatedHeading"

const hackathons = [
  { id: 1, title: "BuildFast AI Hackathon", date: "Jun 14 – Jun 16, 2026", tags: ["AI", "LLM", "Open Source"], participants: 312 },
  { id: 2, title: "Web3 Frontier", date: "Jul 1 – Jul 3, 2026", tags: ["Web3", "Solidity", "DeFi"], participants: 198 },
  { id: 3, title: "Climate Tech Sprint", date: "Jul 20 – Jul 22, 2026", tags: ["Climate", "IoT", "Data"], participants: 145 },
  { id: 4, title: "DevTools Jam", date: "Aug 5 – Aug 7, 2026", tags: ["DevTools", "CLI", "DX"], participants: 267 },
  { id: 5, title: "Health x Code", date: "Aug 18 – Aug 20, 2026", tags: ["Health", "AI", "Mobile"], participants: 183 },
  { id: 6, title: "Open Source Weekend", date: "Sep 6 – Sep 8, 2026", tags: ["Open Source", "Community"], participants: 421 },
]

export default function Explore() {
  return (
    <PageShell>
      <SectionWrapper className="pt-16">
        <AnimatedHeading as="h2" className="text-foreground mb-4">
          Explore Hackathons
        </AnimatedHeading>
        <p className="animate-fade-rise-delay text-muted-foreground text-base max-w-xl mb-14">
          Find your next challenge. Build something that matters.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {hackathons.map((h, i) => (
            <GlassCard key={h.id} className={i < 3 ? "animate-fade-rise" : "animate-fade-rise-delay"}>
              <h3
                className="text-foreground text-lg font-normal mb-1"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                {h.title}
              </h3>
              <p className="text-muted-foreground text-xs mb-4">{h.date}</p>

              <div className="flex flex-wrap gap-2 mb-5">
                {h.tags.map((tag) => (
                  <span key={tag} className="text-xs text-muted-foreground border border-white/10 rounded-full px-3 py-0.5 bg-white/5">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <span className="text-xs text-muted-foreground">{h.participants} participants</span>
                <a href={`/events/${h.id}`} className="text-xs text-foreground hover:opacity-70 transition-opacity">
                  View →
                </a>
              </div>
            </GlassCard>
          ))}
        </div>
      </SectionWrapper>
    </PageShell>
  )
}
