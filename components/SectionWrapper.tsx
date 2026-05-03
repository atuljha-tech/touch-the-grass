import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionWrapperProps {
  children: ReactNode
  className?: string
}

export function SectionWrapper({ children, className }: SectionWrapperProps) {
  return (
    <section className={cn('py-20 px-6 md:px-8', className)}>
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </section>
  )
}
