import { Link } from 'react-router-dom'
import CTAButton from '@/components/CTAButton'

export default function HeroSection() {
  return (
    <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-32 pb-40 min-h-screen">
      <h1
        className="animate-fade-rise text-5xl sm:text-7xl md:text-8xl font-normal leading-[0.95] max-w-5xl"
        style={{ fontFamily: 'var(--font-display)', letterSpacing: '-2.46px' }}
      >
        Where developers{' '}
        <em className="not-italic text-muted-foreground">build beyond</em>{' '}
        the noise.
      </h1>

      <p className="animate-fade-rise-delay text-muted-foreground text-base sm:text-lg max-w-2xl mt-8 leading-relaxed">
        From hackathons to real-world impact — showcase your work,
        find your team, and grow alongside builders who care.
      </p>

      <div className="animate-fade-rise-delay-2 flex items-center gap-4 mt-12">
        <Link to="/explore">
          <CTAButton size="lg">Explore Hackathons</CTAButton>
        </Link>
        <Link
          to="/profile"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          View Profile →
        </Link>
      </div>
    </section>
  )
}
