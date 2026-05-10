import { useNavigate } from 'react-router-dom'
import { SignInButton, useAuth } from '@clerk/clerk-react'
import { ArrowRight, ChevronDown } from 'lucide-react'

export default function Hero() {
  const { isSignedIn } = useAuth()
  const navigate = useNavigate()

  return (
    <section className="relative h-[100dvh] flex flex-col items-center justify-center overflow-hidden">
      {/* Blue radial bloom — purely decorative */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(232,165,48,0.07) 0%, transparent 70%)',
        }}
      />

      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.28) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
          maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent)',
          opacity: 0.18,
        }}
      />

      {/* Content — each child gets .hero-el for CSS stagger */}
      <div className="relative z-10 text-center px-5 max-w-5xl mx-auto w-full flex flex-col items-center gap-0">
        {/* Badge */}
        <div className="hero-el inline-flex items-center gap-2 border border-[#1e1e1e] bg-[rgba(232,165,48,0.07)] rounded-full px-4 py-1.5 text-[11px] font-medium text-accent mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-success" style={{ animation: 'fadeDot 2s ease-in-out infinite' }} />
          Powered by Claude AI · Free to start
        </div>

        {/* Line 1 */}
        <div className="hero-el text-[clamp(40px,5.8vw,74px)] font-bold text-white leading-[1.05] tracking-[-0.03em]">
          Your README,
        </div>

        {/* Line 2 — Instrument Serif italic, dramatically larger */}
        <div className="hero-el font-serif italic text-[clamp(64px,10.5vw,132px)] leading-[0.9] tracking-[-0.02em] text-accent mb-7">
          perfected.
        </div>

        {/* Subhead */}
        <p className="hero-el text-[clamp(14px,1.5vw,18px)] text-text-secondary max-w-[460px] mb-10 leading-relaxed">
          Describe your project. Ship a README that doesn't embarrass you.
        </p>

        {/* CTAs */}
        <div className="hero-el flex flex-col sm:flex-row gap-3 justify-center">
          {isSignedIn ? (
            <button
              onClick={() => navigate('/generate')}
              className="btn-primary btn-cta-pulse px-8 py-3 text-sm"
            >
              Generate for free <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <SignInButton mode="modal">
              <button className="btn-primary btn-cta-pulse px-8 py-3 text-sm">
                Generate for free <ArrowRight className="w-4 h-4" />
              </button>
            </SignInButton>
          )}
          <a href="#features" className="btn-ghost px-8 py-3 text-sm">
            See an example
          </a>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="hero-el absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-20">
        <span className="font-mono text-[9px] text-text-secondary uppercase tracking-widest">Scroll</span>
        <ChevronDown className="w-3.5 h-3.5 text-text-secondary animate-bounce" />
      </div>
    </section>
  )
}
