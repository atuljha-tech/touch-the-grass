import Link from "next/link"
import { CTAButton } from "@/components/CTAButton"

const features = [
  {
    icon: "⚡",
    title: "AI Project Scoring",
    desc: "Every submission is instantly evaluated on innovation, complexity, and completeness. No waiting, no bias.",
  },
  {
    icon: "📊",
    title: "Effort Detection",
    desc: "Commit history, contributor balance, and community signal combine into a transparent effort score.",
  },
  {
    icon: "🏆",
    title: "Live Rankings",
    desc: "rank = (AI score × 0.7) + (effort × 0.3). Formula is visible. Results update in real time.",
  },
  {
    icon: "🎭",
    title: "Blind Judging",
    desc: "Toggle blind mode to hide team names and colleges. Evaluate the work, not the pedigree.",
  },
  {
    icon: "🧑‍💻",
    title: "Hacker Dashboard",
    desc: "Submit a project, get an AI brief and score in under a second. See your rank on the live leaderboard.",
  },
  {
    icon: "🛡️",
    title: "Admin Control",
    desc: "Manage hackers, sponsors, and rankings from one panel. Full visibility, zero spreadsheets.",
  },
]

const roles = [
  { href: "/demo-login?role=admin",  label: "Admin",  color: "border-purple-400/30 hover:border-purple-400/60", dot: "bg-purple-400" },
  { href: "/demo-login?role=hacker", label: "Hacker", color: "border-blue-400/30 hover:border-blue-400/60",   dot: "bg-blue-400" },
  { href: "/demo-login?role=judge",  label: "Judge",  color: "border-emerald-400/30 hover:border-emerald-400/60", dot: "bg-emerald-400" },
]

// ── Above-fold: sits on top of the video ──────────────────────────────────────
function HeroSection() {
  return (
    <section className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-8 pb-20">
      <p className="animate-fade-rise text-xs uppercase tracking-widest text-muted-foreground mb-5">
        Hackathon Intelligence Platform
      </p>

      <h1
        className="animate-fade-rise text-5xl sm:text-7xl md:text-[88px] leading-[0.92] max-w-4xl font-normal text-foreground text-balance"
        style={{ fontFamily: "'Instrument Serif', serif", letterSpacing: '-2.5px' }}
      >
        Hackathons deserve{" "}
        <em className="not-italic text-muted-foreground">better evaluation.</em>
      </h1>

      <p className="animate-fade-rise-delay text-muted-foreground text-base sm:text-lg max-w-2xl mt-8 leading-relaxed">
        TouchTheGrass replaces spreadsheets and gut-feel judging with an AI-powered platform
        that scores projects fairly, ranks them transparently, and gives every builder
        meaningful feedback.
      </p>

      <div className="animate-fade-rise-delay flex flex-wrap items-center justify-center gap-4 mt-10">
        <Link href="/demo-login">
          <CTAButton size="lg">See the Demo</CTAButton>
        </Link>
        <span className="text-muted-foreground text-sm hidden sm:block">or jump to →</span>
        {roles.map((r) => (
          <Link key={r.href} href={r.href}>
            <div className={`liquid-glass rounded-full px-5 py-2.5 flex items-center gap-2 border transition-all hover:scale-[1.03] ${r.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${r.dot}`} />
              <span className="text-sm text-foreground">{r.label}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Scroll hint */}
      <div className="animate-fade-rise-delay-2 mt-16 flex flex-col items-center gap-2 opacity-40">
        <span className="text-xs text-muted-foreground tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-muted-foreground/50" />
      </div>
    </section>
  )
}

// ── Below-fold: sits on solid dark background ─────────────────────────────────
function BelowFold() {
  return (
    <div className="text-foreground">

      {/* Problem */}
      <section className="px-6 md:px-8 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="border border-white/10 rounded-3xl p-8 md:p-12 bg-white/[0.02]">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-8">The Problem</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { stat: "48hrs", label: "of building", sub: "reduced to a 5-minute judge glance" },
                { stat: "60%",   label: "of winners",  sub: "chosen by familiarity, not merit" },
                { stat: "0",     label: "structured feedback", sub: "most hackers leave with nothing" },
              ].map(({ stat, label, sub }) => (
                <div key={stat}>
                  <p className="text-5xl font-light text-foreground mb-2" style={{ fontFamily: "'Instrument Serif', serif" }}>
                    {stat}
                  </p>
                  <p className="text-foreground text-sm mb-1">{label}</p>
                  <p className="text-muted-foreground text-xs leading-relaxed">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 md:px-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">What we built</p>
          <h2
            className="text-3xl sm:text-4xl font-normal text-foreground mb-12 max-w-xl leading-tight"
            style={{ fontFamily: "'Instrument Serif', serif", letterSpacing: '-0.03em' }}
          >
            Every feature exists to make evaluation fair.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div key={f.title} className="border border-white/10 rounded-2xl p-6 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <p className="text-2xl mb-3">{f.icon}</p>
                <p className="text-foreground text-sm font-medium mb-2">{f.title}</p>
                <p className="text-muted-foreground text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo CTA */}
      <section className="px-6 md:px-8 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="border border-white/10 rounded-3xl p-10 md:p-16 bg-white/[0.02] text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Live Demo</p>
            <h2
              className="text-4xl sm:text-5xl font-normal text-foreground mb-5 leading-tight"
              style={{ fontFamily: "'Instrument Serif', serif", letterSpacing: '-0.03em' }}
            >
              Three roles. One platform.
            </h2>
            <p className="text-muted-foreground text-base max-w-lg mx-auto mb-10 leading-relaxed">
              Log in as a hacker to submit and get scored. As a judge to evaluate with AI assistance.
              As an admin to see the full ranked picture.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {roles.map((r) => (
                <Link key={r.href} href={r.href}>
                  <div className={`border rounded-full px-8 py-3 flex items-center gap-2.5 transition-all hover:scale-[1.03] hover:bg-white/5 ${r.color}`}>
                    <span className={`w-2 h-2 rounded-full ${r.dot}`} />
                    <span className="text-sm text-foreground">Login as {r.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

// Export as namespace so page.tsx can import both parts separately
export const Hero = { HeroSection, BelowFold }
