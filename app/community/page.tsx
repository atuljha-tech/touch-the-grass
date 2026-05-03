import { PageShell } from "@/components/PageShell"
import { SectionWrapper } from "@/components/SectionWrapper"
import { GlassCard } from "@/components/GlassCard"
import { AnimatedHeading } from "@/components/AnimatedHeading"

const posts = [
  {
    id: 1,
    author: "Maya Chen",
    role: "Full-stack · React, Node",
    message: "Looking for a team for BuildFast AI. I have a solid idea around developer observability. Need a backend person and a designer.",
    tags: ["AI", "Looking for team"],
    time: "2h ago",
  },
  {
    id: 2,
    author: "Ravi Patel",
    role: "ML Engineer · Python, PyTorch",
    message: "Open to joining a team for any AI track. I can own the model side completely. DM me.",
    tags: ["AI", "Available"],
    time: "4h ago",
  },
  {
    id: 3,
    author: "Lena Müller",
    role: "Designer + Frontend · Figma, React",
    message: "Looking for a team that values design as much as engineering. Working on a climate tech idea but open to others.",
    tags: ["Climate", "Design", "Looking for team"],
    time: "6h ago",
  },
  {
    id: 4,
    author: "James Okafor",
    role: "Backend · Go, PostgreSQL",
    message: "Anyone building dev tooling? I have experience shipping CLIs and want to work on something that scratches a real itch.",
    tags: ["DevTools", "Available"],
    time: "1d ago",
  },
]

export default function Community() {
  return (
    <PageShell>
      <SectionWrapper className="pt-16">
        <AnimatedHeading as="h2" className="mb-4">
          Community
        </AnimatedHeading>
        <p className="animate-fade-rise-delay text-muted-foreground text-base max-w-xl mb-14">
          Find your people. Form your team. Build something real.
        </p>

        <div className="flex flex-col gap-4 max-w-3xl">
          {posts.map((post) => (
            <GlassCard key={post.id} hover={false}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  {/* Avatar initial */}
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs text-foreground shrink-0">
                      {post.author[0]}
                    </div>
                    <p className="text-foreground text-sm font-medium">{post.author}</p>
                  </div>
                  <p className="text-muted-foreground text-xs ml-10">{post.role}</p>
                </div>
                <span className="text-muted-foreground text-xs shrink-0">{post.time}</span>
              </div>

              <p className="text-foreground/90 text-sm leading-relaxed mb-4">{post.message}</p>

              <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-xs text-muted-foreground border border-white/10 rounded-full px-3 py-0.5 bg-white/5">
                    {tag}
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
