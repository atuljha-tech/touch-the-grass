import PageContainer from '@/components/PageContainer'
import SectionWrapper from '@/components/SectionWrapper'
import GlassCard from '@/components/GlassCard'
import AnimatedHeading from '@/components/AnimatedHeading'

const posts = [
  {
    id: 1,
    author: 'Maya Chen',
    role: 'Full-stack · React, Node',
    message: 'Looking for a team for BuildFast AI. I have a solid idea around developer observability. Need a backend person and a designer.',
    tags: ['AI', 'Looking for team'],
    time: '2h ago',
  },
  {
    id: 2,
    author: 'Ravi Patel',
    role: 'ML Engineer · Python, PyTorch',
    message: 'Open to joining a team for any AI track. I can own the model side completely. DM me.',
    tags: ['AI', 'Available'],
    time: '4h ago',
  },
  {
    id: 3,
    author: 'Lena Müller',
    role: 'Designer + Frontend · Figma, React',
    message: 'Looking for a team that values design as much as engineering. Working on a climate tech idea but open to others.',
    tags: ['Climate', 'Design', 'Looking for team'],
    time: '6h ago',
  },
  {
    id: 4,
    author: 'James Okafor',
    role: 'Backend · Go, PostgreSQL',
    message: 'Anyone building dev tooling? I have experience shipping CLIs and want to work on something that scratches a real itch.',
    tags: ['DevTools', 'Available'],
    time: '1d ago',
  },
]

export default function Community() {
  return (
    <PageContainer>
      <SectionWrapper className="pt-32">
        <AnimatedHeading as="h2" className="mb-4">
          Community
        </AnimatedHeading>
        <p className="animate-fade-rise-delay text-muted-foreground text-base max-w-xl mb-14">
          Find your people. Form your team. Build something real.
        </p>

        <div className="flex flex-col gap-5 max-w-3xl">
          {posts.map((post) => (
            <GlassCard key={post.id} hover={false}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-foreground text-sm font-medium">{post.author}</p>
                  <p className="text-muted-foreground text-xs mt-0.5">{post.role}</p>
                </div>
                <span className="text-muted-foreground text-xs">{post.time}</span>
              </div>

              <p className="text-foreground text-sm leading-relaxed mb-4">{post.message}</p>

              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-muted-foreground border border-border rounded-full px-3 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      </SectionWrapper>
    </PageContainer>
  )
}
