"use client"

import { cn } from '@/lib/utils'

interface JudgeControlsProps {
  current: number
  total: number
  blindMode: boolean
  highlightOnly: boolean
  onPrev: () => void
  onNext: () => void
  onToggleBlind: () => void
  onToggleHighlight: () => void
}

export function JudgeControls({
  current, total, blindMode, highlightOnly,
  onPrev, onNext, onToggleBlind, onToggleHighlight,
}: JudgeControlsProps) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      {/* Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={onPrev}
          disabled={current === 0}
          className="liquid-glass rounded-full px-5 py-2 text-sm text-foreground hover:scale-[1.03] transition-transform disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Prev
        </button>
        <span className="text-xs text-muted-foreground">
          {current + 1} / {total}
        </span>
        <button
          onClick={onNext}
          disabled={current === total - 1}
          className="liquid-glass rounded-full px-5 py-2 text-sm text-foreground hover:scale-[1.03] transition-transform disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>

      {/* Toggles */}
      <div className="flex items-center gap-3">
        <Toggle active={blindMode} onClick={onToggleBlind} label="Blind Mode" />
        <Toggle active={highlightOnly} onClick={onToggleHighlight} label="🔥 Highlights Only" />
      </div>
    </div>
  )
}

function Toggle({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'text-xs rounded-full px-4 py-1.5 border transition-all',
        active
          ? 'border-foreground/50 text-foreground'
          : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30',
      )}
    >
      {label}
    </button>
  )
}
