"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'
import { PageShell } from '@/components/PageShell'
import { GlassCard } from '@/components/GlassCard'
import { useDemoAuth } from '@/contexts/DemoAuthContext'
import { DEMO_USERS, type DemoUser } from '@/lib/demo/data'
import { cn } from '@/lib/utils'

const roleDescriptions: Record<string, string> = {
  admin:  'Manage projects, hackers, sponsors · View AI rankings',
  hacker: 'Submit projects · Get AI scores · Track your rank',
  judge:  'Review projects · AI briefs · Score & feedback',
}

const roleColors: Record<string, string> = {
  admin:  'text-purple-400 border-purple-400/30',
  hacker: 'text-blue-400 border-blue-400/30',
  judge:  'text-emerald-400 border-emerald-400/30',
}

const roleDestinations: Record<string, string> = {
  admin:     '/admin/dashboard',
  hacker:    '/dashboard',
  judge:     '/judge-mode',
  organizer: '/explore',
}

const roleHighlights: Record<string, string[]> = {
  admin:  ['20 ranked projects', '8 hackers', 'AI scoring formula'],
  hacker: ['Submit & get AI score', 'See your rank live', 'Leaderboard preview'],
  judge:  ['5 projects pre-loaded', 'AI brief + feedback', 'Blind mode toggle'],
}

function DemoLoginInner() {
  const { login } = useDemoAuth()
  const router = useRouter()
  const params = useSearchParams()
  const preselect = params.get('role')

  // Auto-login if role is pre-selected from hero quick-access
  useEffect(() => {
    if (preselect) {
      const user = DEMO_USERS.find((u) => u.role === preselect)
      if (user) {
        login(user)
        router.push(roleDestinations[user.role] ?? '/')
      }
    }
  }, [preselect, login, router])

  function handleLogin(user: DemoUser) {
    login(user)
    router.push(roleDestinations[user.role] ?? '/')
  }

  return (
    <PageShell>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="w-full max-w-lg animate-fade-rise">

          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Demo Mode</p>
            <h1
              className="text-4xl sm:text-5xl font-normal text-foreground leading-tight mb-3"
              style={{ fontFamily: "'Instrument Serif', serif", letterSpacing: '-0.03em' }}
            >
              Choose your role
            </h1>
            <p className="text-muted-foreground text-sm">
              No signup. Pick a role and explore instantly.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {DEMO_USERS.map((user) => (
              <button key={user.id} onClick={() => handleLogin(user)} className="w-full text-left group">
                <GlassCard className="flex items-start gap-4 group-hover:bg-white/[0.07] transition-all py-5">
                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-base shrink-0 mt-0.5"
                    style={{ fontFamily: "'Instrument Serif', serif" }}
                  >
                    {user.avatar}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-foreground text-sm font-medium">{user.name}</p>
                      <span className={cn('text-xs border rounded-full px-2 py-0.5 capitalize', roleColors[user.role] ?? 'text-muted-foreground border-border')}>
                        {user.role}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs mb-2">{roleDescriptions[user.role]}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(roleHighlights[user.role] ?? []).map((h) => (
                        <span key={h} className="text-xs text-muted-foreground border border-white/10 rounded-full px-2 py-0.5 bg-white/5">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>

                  <span className="text-muted-foreground text-sm group-hover:text-foreground transition-colors shrink-0 mt-1">→</span>
                </GlassCard>
              </button>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            All data pre-loaded · No backend required · Switch roles anytime
          </p>
        </div>
      </div>
    </PageShell>
  )
}

export default function DemoLogin() {
  return (
    <Suspense>
      <DemoLoginInner />
    </Suspense>
  )
}
