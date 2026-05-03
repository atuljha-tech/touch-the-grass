"use client"

import { useAppStore } from '@/contexts/AppStoreContext'
import { useDemoAuth } from '@/contexts/DemoAuthContext'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export function ResultToggle() {
  const { user } = useDemoAuth()
  const { isResultPublic, toggleResultVisibility } = useAppStore()
  const [toastVisible, setToastVisible] = useState(false)

  // Only admin and judge can see this control
  if (!user || (user.role !== 'admin' && user.role !== 'judge')) return null

  function handleToggle() {
    toggleResultVisibility()
    if (!isResultPublic) {
      // About to go public — show toast
      setToastVisible(true)
      setTimeout(() => setToastVisible(false), 3500)
    }
  }

  return (
    <>
      <button
        onClick={handleToggle}
        className={cn(
          'flex items-center gap-3 rounded-full px-4 py-2 border text-xs transition-all hover:scale-[1.02]',
          isResultPublic
            ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-400'
            : 'border-white/15 bg-white/5 text-muted-foreground hover:text-foreground hover:border-white/30',
        )}
      >
        {/* Toggle pill */}
        <span className={cn(
          'relative inline-flex w-8 h-4 rounded-full transition-colors shrink-0',
          isResultPublic ? 'bg-emerald-400' : 'bg-white/20',
        )}>
          <span className={cn(
            'absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform',
            isResultPublic ? 'translate-x-4' : 'translate-x-0.5',
          )} />
        </span>
        <span>{isResultPublic ? 'Results Public' : 'Results Hidden'}</span>
      </button>

      {/* Toast */}
      {toastVisible && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] animate-fade-rise">
          <div className="liquid-glass rounded-2xl px-6 py-3 bg-emerald-400/10 border border-emerald-400/30 text-sm text-emerald-400 whitespace-nowrap">
            🎉 Results are now live — hackers can see their scores
          </div>
        </div>
      )}
    </>
  )
}
