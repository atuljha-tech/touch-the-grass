"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CTAButton } from "@/components/CTAButton"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/explore", label: "Explore" },
  { href: "/projects", label: "Projects" },
  { href: "/community", label: "Community" },
  { href: "/judging", label: "Judge" },
  { href: "/leaderboard", label: "Leaderboard" },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="relative z-10">
      <div className="flex items-center justify-between px-6 py-6 md:px-8 max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl tracking-tight text-foreground hover:opacity-80 transition-opacity"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          TouchTheGrass
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
                pathname === link.href
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <CTAButton size="sm">Join Now</CTAButton>
      </div>
    </nav>
  )
}
