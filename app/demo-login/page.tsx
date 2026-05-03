"use client"

import { useRouter } from 'next/navigation'
import { PageShell } from '@/components/PageShell'
import { GlassCard } from '@/components/GlassCard'
import { useDemoAuth } from '@/contexts/DemoAuthContext'
import { DEMO_USERS, type DemoUser } from '@/lib/demo/data'
import { cn } from '@/lib/utils'

const roleDescriptions: Record<string, string> = {
  admin: 'Manage projects, hackers, sponsors, and rankings',
  hacker: 'Submit projects, track scores, view leaderboard',
  judge: 'Score projects, view AI briefs, generate feedback',
}

const roleColors: Record<string, string> = {
  admin: 'text-purple-400 border-purple-400/30',
  hacker: 'text-blue-400 border-blue-400/30',
  judge: 'text-emerald-400 border-emerald-400/30',
}

const roleDestinations: Record<string, string> = {
  admin: '/admin/dashboard',
  hacker: '/dashboard',
  judge: '/judge-mode',
  organizer: '/explore',
}

export default function DemoLogin() {
  const { login } = useDemoAuth()
  const router = useRouter()

  function handleLogin(user: DemoUser) {
    login(user)
    router.push(roleDestinations[user.role] ?? '/')
  }

  return (
    <PageShell>
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="w-full max-w-lg animate-fade-rise">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Demo Mode</p>
            <h1
              className="text-4xl sm:text-5xl font-normal text-foreground leading-tight mb-4"
              style={{ fontFamily: "'Instrument Serif', serif", letterSpacing: '-0.03em' }}
            >
              Choose your role
            </h1>
            <p className="text-muted-foreground text-sm">
              No signup needed. Pick a role and explore the platform instantly.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {DEMO_USERS.map((user) => (
              <button key={user.id} onClick={() => handleLogin(user)} className="w-full text-left group">
                <GlassCard className="flex items-center gap-5 group-hover:bg-white/[0.07] transition-all">
                  <div
                    className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-lg shrink-0"
                    style={{ fontFamily: "'Instrument Serif', serif" }}
                  >
                    {user.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="text-foreground text-sm font-medium">{user.name}</p>
                      <span className={cn('text-xs border rounded-full px-2 py-0.5 capitalize', roleColors[user.role] ?? 'text-muted-foreground border-border')}>
                        {user.role}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs">{user.email}</p>
                    <p className="text-muted-foreground text-xs mt-1">{roleDescriptions[user.role]}</p>
                  </div>
                  <span className="text-muted-foreground text-sm group-hover:text-foreground transition-colors shrink-0">→</span>
                </GlassCard>
              </button>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-8">
            All data is pre-loaded · No backend required
          </p>
        </div>
      </div>
    </PageShell>
  )
}
