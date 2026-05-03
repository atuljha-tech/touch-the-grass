import { cn } from '@/lib/utils'
import { type ReactNode } from 'react'

interface AnimatedHeadingProps {
  as?: 'h1' | 'h2' | 'h3'
  children: ReactNode
  className?: string
  delay?: 0 | 1 | 2
}

const delayClass = {
  0: 'animate-fade-rise',
  1: 'animate-fade-rise-delay',
  2: 'animate-fade-rise-delay-2',
}

export function AnimatedHeading({
  as: Tag = 'h2',
  children,
  className,
  delay = 0,
}: AnimatedHeadingProps) {
  const base =
    Tag === 'h1'
      ? 'text-5xl sm:text-7xl md:text-8xl font-normal leading-[0.95]'
      : Tag === 'h2'
        ? 'text-3xl sm:text-4xl md:text-5xl font-normal leading-tight'
        : 'text-xl sm:text-2xl font-normal leading-snug'

  return (
    <Tag
      className={cn(base, delayClass[delay], className)}
      style={{ fontFamily: "'Instrument Serif', serif", letterSpacing: '-0.03em' }}
    >
      {children}
    </Tag>
  )
}
