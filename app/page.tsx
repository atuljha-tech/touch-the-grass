import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"

export default function Home() {
  return (
    <div className="bg-background text-foreground">

      {/* ── HERO — full viewport with video ── */}
      <div className="relative min-h-screen overflow-hidden">
        {/* Video confined to hero */}
        <video
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
            type="video/mp4"
          />
        </video>

        {/* Dark overlay over video */}
        <div className="absolute inset-0 z-[1] bg-black/55" />

        {/* Navbar + hero content above video */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navigation />
          <Hero.HeroSection />
        </div>
      </div>

      {/* ── BELOW-FOLD — solid dark background ── */}
      <div className="bg-background">
        <Hero.BelowFold />
      </div>

    </div>
  )
}
