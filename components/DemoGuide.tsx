"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useDemoAuth } from "@/contexts/DemoAuthContext"
import { cn } from "@/lib/utils"

const steps = [
  { path: "/",              label: "1. Pitch",         desc: "The problem we solve" },
  { path: "/demo-login",    label: "2. Login",         desc: "Pick your role" },
  { path: "/dashboard",     label: "3. Hacker",        desc: "Submit & get AI scored" },
  { path: "/judge-mode",    label: "4. Judge",         desc: "AI brief + scoring" },
  { path: "/admin/dashboard", label: "5. Admin",       desc: "Rankings & control" },
  { path: "/leaderboard",   label: "6. Leaderboard",   desc: "Live ranked results" },
]

export function DemoGuide() {
  const pathname = usePathname()
  const { user } = useDemoAuth()

  // Only show when someone is logged in (not on landing or login page)
  if (!user || pathname === "/" || pathname === "/demo-login") return null

  const current = steps.findIndex((s) => s.path === pathname)

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <div className="liquid-glass rounded-2xl px-4 py-3 bg-black/40 backdrop-blur-md flex items-center gap-1 overflow-x-auto scrollbar-none">
        <span className="text-xs text-muted-foreground shrink-0 mr-2 hidden sm:block">Demo:</span>
        {steps.map((step, i) => (
          <Link
            key={step.path}
            href={step.path}
            className={cn(
              "shrink-0 rounded-xl px-3 py-1.5 text-xs transition-all whitespace-nowrap",
              i === current
                ? "bg-white/10 text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            )}
          >
            {step.label}
          </Link>
        ))}
        <Link
          href="/demo-login"
          className="shrink-0 ml-2 text-xs text-muted-foreground hover:text-foreground transition-colors border-l border-white/10 pl-3 whitespace-nowrap"
        >
          Switch role
        </Link>
      </div>
    </div>
  )
}
