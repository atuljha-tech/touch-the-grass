import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { VideoBackground } from "@/components/video-background"

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <VideoBackground />
      <Navigation />
      <Hero />
    </main>
  )
}
