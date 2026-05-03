import Link from "next/link"
import { CTAButton } from "@/components/CTAButton"

export function Hero() {
  return (
    <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-32 pb-40 min-h-[calc(100vh-88px)]">
      <h1
        className="text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2.46px] max-w-5xl font-normal text-foreground animate-fade-rise text-balance"
        style={{ fontFamily: "'Instrument Serif', serif" }}
      >
        Where developers{" "}
        <em className="not-italic text-muted-foreground">build beyond</em>{" "}
        the noise.
      </h1>

      <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mt-8 leading-relaxed animate-fade-rise-delay text-pretty">
        From hackathons to real-world impact — showcase your work,
        find your team, and grow alongside builders who care.
      </p>

      <div className="animate-fade-rise-delay-2 flex items-center gap-6 mt-12">
        <Link href="/demo-login">
          <CTAButton size="lg">Try the Demo</CTAButton>
        </Link>
        <Link
          href="/explore"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Explore Hackathons →
        </Link>
      </div>
    </section>
  )
}
