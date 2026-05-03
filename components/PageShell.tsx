import { type ReactNode } from 'react'
import { Navigation } from '@/components/navigation'

interface PageShellProps {
  children: ReactNode
}

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="relative min-h-screen text-foreground overflow-hidden">
      {/* Video — fixed so it covers the whole viewport always */}
      <video
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className="fixed inset-0 w-full h-full object-cover z-0"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
          type="video/mp4"
        />
      </video>

      {/* Dark overlay — dims the video so text is readable */}
      <div className="fixed inset-0 z-[1] bg-black/60" />

      {/* Blur layer — frosted glass over the whole page */}
      <div className="fixed inset-0 z-[2] backdrop-blur-[2px]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </div>
    </div>
  )
}
