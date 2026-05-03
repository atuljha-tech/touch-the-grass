import { type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface CTAButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg'
}

export default function CTAButton({ className, size = 'md', children, ...props }: CTAButtonProps) {
  const sizes = {
    sm: 'px-6 py-2.5 text-sm',
    md: 'px-10 py-4 text-sm',
    lg: 'px-14 py-5 text-base',
  }

  return (
    <button
      className={cn(
        'liquid-glass rounded-full text-foreground hover:scale-[1.03] transition-transform',
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
