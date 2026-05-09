"use client"

import { useState } from 'react'
import { PageShell } from '@/components/PageShell'
import { SectionWrapper } from '@/components/SectionWrapper'
import { GlassCard } from '@/components/GlassCard'
import { AnimatedHeading } from '@/components/AnimatedHeading'
import { CTAButton } from '@/components/CTAButton'
import { DEMO_HACKERS } from '@/lib/demo/data'
import { cn } from '@/lib/utils'

const INITIAL_POSTS = [
  {
    id: 1,
    author: 'Maya Chen',
    role: 'Full-stack · React, Node',
    avatar: 'M',
    message: 'Looking for a team for BuildFast AI. I have a solid idea around developer observability. Need a backend person and a designer.',
    tags: ['AI', 'Looking for team'],
    time: '2h ago',
    likes: 12,
  },
  {
    id: 2,
    author: 'Ravi Patel',
    role: 'ML Engineer · Python, PyTorch',
    avatar: 'R',
    message: 'Open to joining a team for any AI track. I can own the model side completely. DM me.',
    tags: ['AI', 'Available'],
    time: '4h ago',
    likes: 8,
  },
  {
    id: 3,
    author: 'Lena Müller',
    role: 'Designer + Frontend · Figma, React',
    avatar: 'L',
    message: 'Looking for a team that values design as much as engineering. Working on a climate tech idea but open to others.',
    tags: ['Climate', 'Design', 'Looking for team'],
    time: '6h ago',
    likes: 15,
  },
  {
    id: 4,
    author: 'James Okafor',
    role: 'Backend · Go, PostgreSQL',
    avatar: 'J',
    message: 'Anyone building dev tooling? I have experience shipping CLIs and want to work on something that scratches a real itch.',
    tags: ['DevTools', 'Available'],
    time: '1d ago',
    likes: 6,
  },
  {
    id: 5,
    author: 'Priya Sharma',
    role: 'ML · Python, PyTorch, FastAPI',
    avatar: 'P',
    message: 'Just submitted CropSense AI — a disease detection app for farmers. Happy to share the fine-tuning approach if anyone is working on vision models.',
    tags: ['AI & ML', 'Sharing'],
    time: '3h ago',
    likes: 21,
  },
  {
    id: 6,
    author: 'Chen Wei',
    role: 'RL Engineer · Python, SUMO',
    avatar: 'C',
    message: 'TrafficMind is live! 203 commits in 48 hours. PPO-based traffic signal optimization. Check it out on the leaderboard.',
    tags: ['Smart Cities', 'Winner'],
    time: '5h ago',
    likes: 34,
  },
]

const TAG_COLORS: Record<string, string> = {
  'AI': 'text-purple-400 border-purple-400/30 bg-purple-400/5',
  'AI & ML': 'text-purple-400 border-purple-400/30 bg-purple-400/5',
  'Looking for team': 'text-blue-400 border-blue-400/30 bg-blue-400/5',
  'Available': 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5',
  'Climate': 'text-green-400 border-green-400/30 bg-green-400/5',
  'Design': 'text-pink-400 border-pink-400/30 bg-pink-400/5',
  'DevTools': 'text-yellow-400 border-yellow-400/30 bg-yellow-400/5',
  'Sharing': 'text-orange-400 border-orange-400/30 bg-orange-400/5',
  'Smart Cities': 'text-cyan-400 border-cyan-400/30 bg-cyan-400/5',
  'Winner': 'text-yellow-400 border-yellow-400/30 bg-yellow-400/5',
}

export default function Community() {
  const [posts, setPosts] = useState(INITIAL_POSTS)
  const [liked, setLiked] = useState<Set<number>>(new Set())
  const [filter, setFilter] = useState('all')
  const [showCompose, setShowCompose] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [newTag, setNewTag] = useState('Looking for team')

  const allTags = ['all', 'Looking for team', 'Available', 'AI', 'DevTools', 'Climate', 'Design', 'Sharing']

  const filtered = filter === 'all' ? posts : posts.filter((p) => p.tags.includes(filter))

  function toggleLike(id: number) {
    setLiked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        setPosts((ps) => ps.map((p) => p.id === id ? { ...p, likes: p.likes - 1 } : p))
      } else {
        next.add(id)
        setPosts((ps) => ps.map((p) => p.id === id ? { ...p, likes: p.likes + 1 } : p))
      }
      return next
    })
  }

  function submitPost() {
    if (!newMessage.trim()) return
    const post = {
      id: Date.now(),
      author: 'You',
      role: 'Hacker',
      avatar: 'Y',
      message: newMessage.trim(),
      tags: [newTag],
      time: 'just now',
      likes: 0,
    }
    setPosts((prev) => [post, ...prev])
    setNewMessage('')
    setShowCompose(false)
  }

  return (
    <PageShell>
      <SectionWrapper className="pt-16 pb-24">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
          <AnimatedHeading as="h2">Community</AnimatedHeading>
          <CTAButton size="sm" onClick={() => setShowCompose((v) => !v)}>
            {showCompose ? 'Cancel' : '+ Post'}
          </CTAButton>
        </div>
        <p className="animate-fade-rise-delay text-muted-foreground text-base max-w-xl mb-10">
          Find your people. Form your team. Build something real.
        </p>

        {/* Compose */}
        {showCompose && (
          <GlassCard hover={false} className="mb-8 animate-fade-rise">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">New Post</p>
            <textarea
              rows={3}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="What are you looking for? Share an idea, find a team, or offer your skills..."
              className="w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-white/30 transition-colors resize-none mb-4"
            />
            <div className="flex items-center gap-3 flex-wrap">
              <select
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="bg-transparent border border-white/10 rounded-full px-4 py-2 text-sm text-foreground focus:outline-none focus:border-white/30 transition-colors"
              >
                {['Looking for team', 'Available', 'AI', 'DevTools', 'Climate', 'Design', 'Sharing'].map((t) => (
                  <option key={t} value={t} className="bg-black">{t}</option>
                ))}
              </select>
              <CTAButton size="sm" onClick={submitPost} disabled={!newMessage.trim()}>
                Post →
              </CTAButton>
            </div>
          </GlassCard>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Posts */}
          <div className="lg:col-span-2">
            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setFilter(tag)}
                  className={cn(
                    'text-xs border rounded-full px-3 py-1.5 transition-all capitalize',
                    filter === tag
                      ? 'text-foreground border-white/30 bg-white/10'
                      : 'text-muted-foreground border-white/10 hover:text-foreground hover:border-white/20'
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              {filtered.map((post) => (
                <GlassCard key={post.id} hover={false}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm text-foreground shrink-0"
                        style={{ fontFamily: "'Instrument Serif', serif" }}>
                        {post.avatar}
                      </div>
                      <div>
                        <p className="text-foreground text-sm font-medium">{post.author}</p>
                        <p className="text-muted-foreground text-xs">{post.role}</p>
                      </div>
                    </div>
                    <span className="text-muted-foreground text-xs shrink-0">{post.time}</span>
                  </div>

                  <p className="text-foreground/90 text-sm leading-relaxed mb-4">{post.message}</p>

                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className={cn('text-xs border rounded-full px-2 py-0.5 cursor-pointer transition-all hover:opacity-80', TAG_COLORS[tag] ?? 'text-muted-foreground border-white/10 bg-white/5')}
                          onClick={() => setFilter(tag)}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={cn(
                        'flex items-center gap-1.5 text-xs transition-all',
                        liked.has(post.id) ? 'text-rose-400' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {liked.has(post.id) ? '♥' : '♡'} {post.likes}
                    </button>
                  </div>
                </GlassCard>
              ))}

              {filtered.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-sm">No posts with this tag yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar — builders */}
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Active Builders</p>
              <div className="flex flex-col gap-3">
                {DEMO_HACKERS.map((h) => (
                  <GlassCard key={h.id} hover={false} className="flex items-center gap-3 py-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm shrink-0"
                      style={{ fontFamily: "'Instrument Serif', serif" }}>
                      {h.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground text-sm truncate">{h.name}</p>
                      <p className="text-muted-foreground text-xs truncate">{h.college}</p>
                    </div>
                    <div className="flex flex-wrap gap-1 justify-end max-w-[80px]">
                      {h.skills.slice(0, 1).map((s) => (
                        <span key={s} className="text-xs text-muted-foreground border border-white/10 rounded-full px-2 py-0.5 bg-white/5 truncate">
                          {s}
                        </span>
                      ))}
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>

            {/* Stats */}
            <GlassCard hover={false} className="bg-white/[0.02]">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Community Stats</p>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Active builders', value: DEMO_HACKERS.length },
                  { label: 'Posts today', value: posts.length },
                  { label: 'Teams formed', value: 4 },
                  { label: 'Skills represented', value: new Set(DEMO_HACKERS.flatMap((h) => h.skills)).size },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{label}</span>
                    <span className="text-sm text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </SectionWrapper>
    </PageShell>
  )
}
