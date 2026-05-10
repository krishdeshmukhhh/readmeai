import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 56)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-5 px-4 pointer-events-none">
      <nav
        className={`pointer-events-auto w-full max-w-3xl flex items-center justify-between px-5 h-12 rounded-full
          transition-all duration-500 ease-out border
          ${scrolled
            ? 'bg-[#0A0A0A]/85 backdrop-blur-2xl border-[#1e1e1e] shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_8px_40px_rgba(0,0,0,0.6)]'
            : 'bg-transparent border-transparent'
          }`}
      >
        {/* Logo */}
        <Link to="/" className="font-mono text-sm font-medium text-white flex items-center gap-1.5 hover:-translate-y-px transition-transform">
          <span className="text-accent font-bold">&gt;_</span>
          <span>ReadmeAI</span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-7">
          {['#features', '#how-it-works', '#pricing'].map((href, i) => (
            <a
              key={href}
              href={href}
              className="text-[11px] font-medium text-text-secondary hover:text-white transition-colors hover:-translate-y-px duration-150"
            >
              {['Features', 'How it works', 'Pricing'][i]}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-[11px] text-text-secondary hover:text-white transition-colors hidden sm:block">
                Sign in
              </button>
            </SignInButton>
            <SignInButton mode="modal">
              <button className="btn-primary text-[11px] px-4 py-1.5 rounded-full">
                Get Started
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <button
              onClick={() => navigate('/generate')}
              className="btn-primary text-[11px] px-4 py-1.5 rounded-full"
            >
              Open App
            </button>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>
    </div>
  )
}
