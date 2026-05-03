import PageContainer from '@/components/PageContainer'
import SectionWrapper from '@/components/SectionWrapper'
import GlassCard from '@/components/GlassCard'
import AnimatedHeading from '@/components/AnimatedHeading'

const skills = ['TypeScript', 'React', 'Rust', 'Go', 'PostgreSQL', 'Docker']

const projects = [
  { title: 'Codeflow', desc: 'A minimal code review tool built for async teams.', stack: ['React', 'Go'] },
  { title: 'Driftlog', desc: 'Terminal-first journaling for developers.', stack: ['Rust', 'CLI'] },
]

const hackathons = [
  { name: 'BuildFast AI 2025', result: '2nd Place', date: 'Jun 2025' },
  { name: 'Web3 Frontier 2024', result: 'Finalist', date: 'Nov 2024' },
]

const achievements = ['Top 1% contributor', '3 hackathons won', 'Open source maintainer']

export default function Profile() {
  return (
    <PageContainer>
      <SectionWrapper className="pt-32">
        {/* Header */}
        <div className="animate-fade-rise flex flex-col gap-3 mb-14">
          <AnimatedHeading as="h2">Alex Rivera</AnimatedHeading>
          <p className="text-muted-foreground text-base max-w-xl leading-relaxed">
            Full-stack developer. Open source contributor. Building tools that respect the developer's time.
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {skills.map((s) => (
              <span key={s} className="text-xs text-muted-foreground border border-border rounded-full px-3 py-0.5">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <h3 className="text-foreground text-sm uppercase tracking-widest text-muted-foreground mb-1">Projects</h3>
            {projects.map((p) => (
              <GlassCard key={p.title}>
                <h3 className="text-foreground text-lg font-normal mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                  {p.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">{p.desc}</p>
                <div className="flex gap-2">
                  {p.stack.map((t) => (
                    <span key={t} className="text-xs text-muted-foreground border border-border rounded-full px-3 py-0.5">
                      {t}
                    </span>
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-3">Hackathons</h3>
              <div className="flex flex-col gap-3">
                {hackathons.map((h) => (
                  <GlassCard key={h.name} hover={false} className="py-4">
                    <p className="text-foreground text-sm">{h.name}</p>
                    <p className="text-muted-foreground text-xs mt-1">{h.result} · {h.date}</p>
                  </GlassCard>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-3">Achievements</h3>
              <GlassCard hover={false}>
                <ul className="flex flex-col gap-2">
                  {achievements.map((a) => (
                    <li key={a} className="text-sm text-muted-foreground">— {a}</li>
                  ))}
                </ul>
              </GlassCard>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </PageContainer>
  )
}
