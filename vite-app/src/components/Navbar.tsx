import { Link, useLocation } from 'react-router-dom'
import CTAButton from '@/components/CTAButton'

const links = [
  { label: 'Home', to: '/' },
  { label: 'Explore', to: '/explore' },
  { label: 'Projects', to: '/projects' },
  { label: 'Community', to: '/community' },
  { label: 'Profile', to: '/profile' },
]

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <nav className="relative z-10 w-full">
      <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl tracking-tight text-foreground hover:opacity-80 transition-opacity"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          TouchTheGrass
        </Link>

        {/* Nav links */}
        <ul className="hidden md:flex items-center gap-8 text-sm">
          {links.map(({ label, to }) => (
            <li key={label}>
              <Link
                to={to}
                className={
                  pathname === to
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground transition-colors'
                }
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <CTAButton size="sm">
          Join Now
        </CTAButton>
      </div>
    </nav>
  )
}
