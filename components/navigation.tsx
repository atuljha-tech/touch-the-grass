"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useDemoAuth } from "@/contexts/DemoAuthContext"
import { cn } from "@/lib/utils"

const publicLinks = [
  { href: "/explore", label: "Explore" },
  { href: "/projects", label: "Projects" },
  { href: "/community", label: "Community" },
  { href: "/leaderboard", label: "Leaderboard" },
]

const roleLinks: Record<string, { href: string; label: string }[]> = {
  admin: [{ href: "/admin/dashboard", label: "Admin" }],
  hacker: [{ href: "/dashboard", label: "Dashboard" }],
  judge: [{ href: "/judging", label: "Judge" }, { href: "/judge-mode", label: "Judge Mode" }],
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

  const extraLinks = user ? (roleLinks[user.role] ?? []) : []
  const allLinks = [...publicLinks, ...extraLinks]

  return (
    <nav className="relative z-10 w-full">
      <div className="flex items-center justify-between px-6 py-6 md:px-8 max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl tracking-tight text-foreground hover:opacity-80 transition-opacity shrink-0"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          TouchTheGrass
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-7">
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
        </div>

        {/* Right — user badge or sign in */}
        {user ? (
          <div className="flex items-center gap-3 shrink-0">
            <span className={cn("hidden sm:block text-xs border rounded-full px-3 py-1 capitalize", roleColors[user.role] ?? 'text-muted-foreground border-border')}>
              {user.role}
            </span>
            <Link href="/demo-login" title={`${user.name} · Switch role`}>
              <div className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 transition-colors flex items-center justify-center text-sm text-foreground cursor-pointer"
                style={{ fontFamily: "'Instrument Serif', serif" }}>
                {user.avatar}
              </div>
            </Link>
          </div>
        ) : (
          <Link
            href="/demo-login"
            className="liquid-glass rounded-full px-6 py-2.5 text-sm text-foreground hover:scale-[1.03] transition-transform"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  )
}
