import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function GlassCard({ children, className, hover = true }: GlassCardProps) {
  return (
    <div
      className={cn(
        'liquid-glass rounded-2xl p-6 bg-white/[0.04]',
        hover && 'hover:scale-[1.02] hover:bg-white/[0.06] transition-all duration-300',
        className,
      )}
    >
      {children}
    </div>
  )
}
