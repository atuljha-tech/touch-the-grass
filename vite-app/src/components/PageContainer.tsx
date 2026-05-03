import { type ReactNode } from 'react'
import Navbar from '@/components/Navbar'

interface PageContainerProps {
  children: ReactNode
}

export default function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-hidden">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  )
}
