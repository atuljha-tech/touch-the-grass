"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useDemoAuth } from "@/contexts/DemoAuthContext"
import { cn } from "@/lib/utils"

const publicLinks = [
  { href: "/explore", label: "Explore" },
  { href: "/projects", label: "Projects" },
  { href: "/community", label: "Community" },
  { href: "/leaderboard", label: "Leaderboard" },
]

const sponsorLinks = [
  { href: "/agents", label: "Agent Network", badge: "Zynd AI", badgeColor: "text-emerald-400 border-emerald-400/30" },
  { href: "/deep-analysis", label: "Deep Analysis", badge: "Apify", badgeColor: "text-orange-400 border-orange-400/30" },
  { href: "/pipeline", label: "Pipeline", badge: "Superplane", badgeColor: "text-blue-400 border-blue-400/30" },
]

const roleLinks: Record<string, { href: string; label: string }[]> = {
  admin: [{ href: "/admin/dashboard", label: "Admin" }],
  hacker: [{ href: "/dashboard", label: "Dashboard" }],
  judge: [
    { href: "/judging", label: "Judge" },
    { href: "/judge-mode", label: "Judge Mode" },
    { href: "/judge/student-analyzer", label: "Analyzer" },
  ],
  organizer: [{ href: "/explore", label: "Explore" }],
}

const roleColors: Record<string, string> = {
  admin: "text-purple-400 border-purple-400/30",
  hacker: "text-blue-400 border-blue-400/30",
  judge: "text-emerald-400 border-emerald-400/30",
  organizer: "text-yellow-400 border-yellow-400/30",
}

export function Navigation() {
  const pathname = usePathname()
  const { user } = useDemoAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const extraLinks = user ? (roleLinks[user.role] ?? []) : []
  const allLinks = [...publicLinks, ...extraLinks]

  return (
    <nav className="relative z-10 w-full">
      <div className="flex items-center justify-between px-6 py-5 md:px-8 max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl tracking-tight text-foreground hover:opacity-80 transition-opacity shrink-0 flex items-center gap-2"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">🌿</span>
          TouchTheGrass
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-6">
          {allLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm transition-colors',
                pathname === link.href ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {link.label}
            </Link>
          ))}

          {/* Sponsor integrations dropdown */}
          <div className="relative group">
            <button className={cn(
              'text-sm transition-colors flex items-center gap-1',
              sponsorLinks.some(l => pathname === l.href) ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}>
              Integrations
              <svg className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-all group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0">
              <div className="liquid-glass rounded-2xl p-2 bg-black/80 backdrop-blur-xl border border-white/10">
                {sponsorLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors',
                      pathname === link.href ? 'bg-white/10 text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                    )}
                  >
                    <span>{link.label}</span>
                    <span className={cn('text-xs border rounded-full px-2 py-0.5', link.badgeColor)}>{link.badge}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right — user badge or sign in */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className={cn("hidden sm:block text-xs border rounded-full px-3 py-1 capitalize", roleColors[user.role] ?? 'text-muted-foreground border-border')}>
                {user.role}
              </span>
              <Link href="/demo-login" title={`${user.name} · Switch role`}>
                <div className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 transition-colors flex items-center justify-center text-sm text-foreground cursor-pointer"
                  style={{ fontFamily: "'Instrument Serif', serif" }}>
                  {user.avatar}
                </div>
              </Link>
            </>
          ) : (
            <Link
              href="/demo-login"
              className="liquid-glass rounded-full px-5 py-2 text-sm text-foreground hover:scale-[1.03] transition-transform"
            >
              Sign In
            </Link>
          )}

          {/* Mobile menu button */}
          <button
            className="lg:hidden w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 z-50">
          <div className="mx-4 mb-4 liquid-glass rounded-2xl p-4 bg-black/90 backdrop-blur-xl border border-white/10">
            <div className="flex flex-col gap-1">
              {allLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'px-4 py-2.5 rounded-xl text-sm transition-colors',
                    pathname === link.href ? 'bg-white/10 text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-white/10 my-2" />
              <p className="text-xs uppercase tracking-widest text-muted-foreground px-4 py-1">Integrations</p>
              {sponsorLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'px-4 py-2.5 rounded-xl text-sm transition-colors flex items-center justify-between',
                    pathname === link.href ? 'bg-white/10 text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  )}
                >
                  <span>{link.label}</span>
                  <span className={cn('text-xs border rounded-full px-2 py-0.5', link.badgeColor)}>{link.badge}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
