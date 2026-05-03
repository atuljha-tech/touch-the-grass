import { PageShell } from "@/components/PageShell"
import { SectionWrapper } from "@/components/SectionWrapper"
import { GlassCard } from "@/components/GlassCard"
import { AnimatedHeading } from "@/components/AnimatedHeading"

const projects = [
  {
    id: 1,
    title: "Codeflow",
    desc: "A minimal async code review tool. No noise, just signal.",
    stack: ["React", "TypeScript", "Go", "PostgreSQL"],
    github: "https://github.com",
    demo: "https://demo.example.com",
  },
  {
    id: 2,
    title: "Driftlog",
    desc: "Terminal-first journaling for developers who think in plaintext.",
    stack: ["Rust", "CLI", "SQLite"],
    github: "https://github.com",
    demo: null,
  },
  {
    id: 3,
    title: "Patchwork",
    desc: "Visual diff tool for design tokens and component libraries.",
    stack: ["React", "Node.js", "CSS"],
    github: "https://github.com",
    demo: "https://demo.example.com",
  },
  {
    id: 4,
    title: "Groundwork",
    desc: "Infrastructure scaffolding CLI for opinionated monorepos.",
    stack: ["Go", "Docker", "Terraform"],
    github: "https://github.com",
    demo: null,
  },
]

export default function Projects() {
  return (
    <PageShell>
      <SectionWrapper className="pt-16">
        <AnimatedHeading as="h2" className="mb-4">
          Project Showcase
        </AnimatedHeading>
        <p className="animate-fade-rise-delay text-muted-foreground text-base max-w-xl mb-14">
          Real work from real builders. No fluff.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {projects.map((p) => (
            <GlassCard key={p.id}>
              <h3
                className="text-foreground text-xl font-normal mb-2"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                {p.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">{p.desc}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {p.stack.map((t) => (
                  <span key={t} className="text-xs text-muted-foreground border border-white/10 rounded-full px-3 py-0.5 bg-white/5">
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-5 text-xs pt-3 border-t border-white/10">
                <a href={p.github} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  GitHub →
                </a>
                {p.demo && (
                  <a href={p.demo} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                    Live Demo →
                  </a>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      </SectionWrapper>
    </PageShell>
  )
}
