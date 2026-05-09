import Link from "next/link"
import { CTAButton } from "@/components/CTAButton"

const features = [
  {
    icon: "⚡",
    title: "AI Project Scoring",
    desc: "Every submission is instantly evaluated on innovation, complexity, and completeness. No waiting, no bias.",
    color: "border-yellow-400/20 hover:border-yellow-400/40",
  },
  {
    icon: "📊",
    title: "Effort Detection",
    desc: "Commit history, contributor balance, and community signal combine into a transparent effort score.",
    color: "border-blue-400/20 hover:border-blue-400/40",
  },
  {
    icon: "🏆",
    title: "Live Rankings",
    desc: "rank = (AI score × 0.7) + (effort × 0.3). Formula is visible. Results update in real time.",
    color: "border-emerald-400/20 hover:border-emerald-400/40",
  },
  {
    icon: "🎭",
    title: "Blind Judging",
    desc: "Toggle blind mode to hide team names and colleges. Evaluate the work, not the pedigree.",
    color: "border-purple-400/20 hover:border-purple-400/40",
  },
  {
    icon: "🧑‍💻",
    title: "Hacker Dashboard",
    desc: "Submit a project, get an AI brief and score in under a second. See your rank on the live leaderboard.",
    color: "border-blue-400/20 hover:border-blue-400/40",
  },
  {
    icon: "🛡️",
    title: "Admin Control",
    desc: "Manage hackers, sponsors, and rankings from one panel. Full visibility, zero spreadsheets.",
    color: "border-white/10 hover:border-white/20",
  },
]

const integrations = [
  {
    name: "Zynd AI",
    desc: "Multi-agent network analysis",
    href: "/agents",
    color: "text-emerald-400 border-emerald-400/30 bg-emerald-400/5 hover:bg-emerald-400/10",
    icon: "🤖",
  },
  {
    name: "Apify",
    desc: "Deep repository intelligence",
    href: "/deep-analysis",
    color: "text-orange-400 border-orange-400/30 bg-orange-400/5 hover:bg-orange-400/10",
    icon: "🔍",
  },
  {
    name: "Superplane",
    desc: "Automated judging pipelines",
    href: "/pipeline",
    color: "text-blue-400 border-blue-400/30 bg-blue-400/5 hover:bg-blue-400/10",
    icon: "⚡",
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
      {/* Sponsor badges */}
      <div className="animate-fade-rise flex flex-wrap items-center justify-center gap-2 mb-6">
        {integrations.map((i) => (
          <Link key={i.href} href={i.href}>
            <span className={`text-xs border rounded-full px-3 py-1 transition-all cursor-pointer ${i.color}`}>
              {i.icon} {i.name}
            </span>
          </Link>
        ))}
      </div>

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
        meaningful feedback — powered by Zynd AI agents, Apify deep analysis, and Superplane pipelines.
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

      {/* Sponsor Integrations Showcase */}
      <section className="px-6 md:px-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Sponsor Integrations</p>
          <h2
            className="text-3xl sm:text-4xl font-normal text-foreground mb-12 max-w-xl leading-tight"
            style={{ fontFamily: "'Instrument Serif', serif", letterSpacing: '-0.03em' }}
          >
            Powered by the best tools in the ecosystem.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                name: "Zynd AI",
                href: "/agents",
                icon: "🤖",
                color: "border-emerald-400/20 hover:border-emerald-400/40",
                badge: "text-emerald-400 border-emerald-400/30",
                title: "Open Agent Network",
                desc: "Specialized AI agents from the Zynd network collaborate to evaluate projects from multiple angles — code quality, pitch clarity, impact potential, and technical feasibility. 548+ agents on the network.",
                features: ["Multi-agent consensus scoring", "Ed25519 cryptographic identity", "x402 USDC micropayments", "Semantic agent discovery"],
              },
              {
                name: "Apify",
                href: "/deep-analysis",
                icon: "🔍",
                color: "border-orange-400/20 hover:border-orange-400/40",
                badge: "text-orange-400 border-orange-400/30",
                title: "Deep Repository Analysis",
                desc: "Goes beyond basic GitHub stats to analyze code structure, documentation quality, CI/CD setup, commit patterns, and engineering maturity signals that reveal true project quality.",
                features: ["README & docs quality scoring", "CI/CD pipeline detection", "Test suite presence", "Weekly commit velocity"],
              },
              {
                name: "Superplane",
                href: "/pipeline",
                icon: "⚡",
                color: "border-blue-400/20 hover:border-blue-400/40",
                badge: "text-blue-400 border-blue-400/30",
                title: "Automated Judging Pipelines",
                desc: "Every project submission triggers an observable, auditable judging pipeline — from GitHub analysis to AI scoring to leaderboard update — with policy gates and full audit trail.",
                features: ["Event-driven workflow automation", "Policy-gated approvals", "Full audit trail", "Canvas YAML configuration"],
              },
            ].map((integration) => (
              <Link key={integration.name} href={integration.href}>
                <div className={`border rounded-3xl p-7 bg-white/[0.02] transition-all hover:bg-white/[0.04] cursor-pointer h-full flex flex-col ${integration.color}`}>
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">{integration.icon}</span>
                    <span className={`text-xs border rounded-full px-3 py-1 ${integration.badge}`}>{integration.name}</span>
                  </div>
                  <p className="text-foreground text-lg mb-2" style={{ fontFamily: "'Instrument Serif', serif" }}>{integration.title}</p>
                  <p className="text-muted-foreground text-xs leading-relaxed mb-5 flex-1">{integration.desc}</p>
                  <div className="flex flex-col gap-1.5 pt-4 border-t border-white/10">
                    {integration.features.map((f) => (
                      <div key={f} className="flex items-center gap-2">
                        <span className="text-muted-foreground text-xs">→</span>
                        <span className="text-muted-foreground text-xs">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
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
              <div key={f.title} className={`border rounded-2xl p-6 bg-white/[0.02] hover:bg-white/[0.04] transition-all ${f.color}`}>
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
