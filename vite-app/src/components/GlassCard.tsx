import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export default function GlassCard({ children, className, hover = true }: GlassCardProps) {
  return (
    <div
      className={cn(
        'liquid-glass rounded-2xl p-6',
        hover && 'hover:scale-[1.02] transition-transform duration-300',
        className,
      )}
    >
      {children}
    </div>
  )
}
