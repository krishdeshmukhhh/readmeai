import { useNavigate } from 'react-router-dom'
import { SignInButton, useAuth } from '@clerk/clerk-react'
import { Check } from 'lucide-react'
import { useReveal } from '../hooks/useReveal'

const FREE_FEATURES = ['1 generation / month', 'Standard template', 'Copy & download']
const PRO_FEATURES  = [
  '100 generations / day',
  'All templates — CLI, npm, Monorepo',
  'Priority generation speed',
  'Copy & download',
]

export default function Pricing() {
  const { isSignedIn } = useAuth()
  const navigate = useNavigate()
  const headingRef = useReveal()
  const gridRef    = useReveal({ threshold: 0.1 })

  return (
    <section id="pricing" className="py-28 px-5 max-w-5xl mx-auto">
      <div ref={headingRef as React.RefObject<HTMLDivElement>} className="reveal text-center mb-16">
        <p className="font-mono text-[10px] text-accent uppercase tracking-[0.2em] mb-3">Pricing</p>
        <h2 className="text-[clamp(26px,3.8vw,42px)] font-bold tracking-[-0.03em]">Simple pricing</h2>
        <p className="text-text-secondary text-sm mt-3">Start free. Upgrade when you need more.</p>
      </div>

      <div
        ref={gridRef as React.RefObject<HTMLDivElement>}
        className="reveal-group grid md:grid-cols-2 gap-5 max-w-2xl mx-auto"
      >
        {/* Free */}
        <div className="reveal-item bg-surface border border-border rounded-card-lg p-8 flex flex-col gap-6
          transition-transform duration-300 hover:-translate-y-1">
          <div>
            <p className="font-mono text-[10px] text-text-secondary uppercase tracking-[0.15em] mb-4">Free</p>
            <div className="flex items-baseline gap-1">
              <span className="text-[44px] font-bold text-white tracking-tight">$0</span>
              <span className="text-text-secondary text-sm">/month</span>
            </div>
          </div>
          <ul className="space-y-3 flex-1">
            {FREE_FEATURES.map(f => (
              <li key={f} className="flex items-center gap-3 text-sm text-text-secondary">
                <Check className="w-4 h-4 text-success flex-shrink-0" strokeWidth={2.5} />
                {f}
              </li>
            ))}
          </ul>
          {isSignedIn ? (
            <button onClick={() => navigate('/generate')} className="btn-ghost w-full py-3">
              Get started
            </button>
          ) : (
            <SignInButton mode="modal">
              <button className="btn-ghost w-full py-3">Get started free</button>
            </SignInButton>
          )}
        </div>

        {/* Pro */}
        <div
          className="reveal-item rounded-card-lg p-8 flex flex-col gap-6 relative overflow-hidden
            transition-transform duration-300 hover:-translate-y-1"
          style={{
            background: '#E8A530',
            boxShadow: '0 20px 60px rgba(232,165,48,0.3), 0 0 0 1px rgba(232,165,48,0.5)',
          }}
        >
          {/* Shine highlight */}
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/10 blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="font-mono text-[10px] text-white/60 uppercase tracking-[0.15em]">Pro</p>
              <span className="text-[10px] font-semibold bg-white/20 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
                Most Popular
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-[44px] font-bold text-white tracking-tight">$10</span>
              <span className="text-white/60 text-sm">/month</span>
            </div>
          </div>

          <ul className="space-y-3 flex-1">
            {PRO_FEATURES.map(f => (
              <li key={f} className="flex items-center gap-3 text-sm text-white/80">
                <Check className="w-4 h-4 text-white flex-shrink-0" strokeWidth={2.5} />
                {f}
              </li>
            ))}
          </ul>

          {isSignedIn ? (
            <button
              onClick={() => navigate('/generate')}
              className="w-full py-3 rounded-btn bg-white text-accent font-semibold text-sm
                transition-all duration-200 hover:bg-white/92 hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Pro
            </button>
          ) : (
            <SignInButton mode="modal">
              <button className="w-full py-3 rounded-btn bg-white text-accent font-semibold text-sm
                transition-all duration-200 hover:bg-white/92 hover:scale-[1.02] active:scale-[0.98]">
                Get Pro — $10/mo
              </button>
            </SignInButton>
          )}
        </div>
      </div>
    </section>
  )
}
