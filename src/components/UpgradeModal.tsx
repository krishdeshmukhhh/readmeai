import { useState } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import { api } from '../lib/api'
import { X, Check, Zap, Loader2 } from 'lucide-react'

interface Props { onClose: () => void }

export default function UpgradeModal({ onClose }: Props) {
  const { getToken } = useAuth()
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpgrade = async () => {
    if (!user) return
    setIsLoading(true); setError(null)
    try {
      const token = await getToken()
      if (!token) throw new Error('Not authenticated')
      const { url } = await api.createCheckoutSession(
        user.id,
        user.primaryEmailAddress?.emailAddress ?? '',
        token,
      )
      window.location.href = url
    } catch {
      setError('Failed to start checkout. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="bg-surface border border-border rounded-card-lg max-w-md w-full p-8 relative
        shadow-[0_0_0_1px_rgba(232,165,48,0.1),0_20px_80px_rgba(0,0,0,0.8)]">
        {/* Accent glow top */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-24 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <button onClick={onClose}
          className="absolute top-5 right-5 text-text-secondary hover:text-white transition-colors p-1.5 hover:bg-surface-2 rounded-lg">
          <X className="w-4 h-4" />
        </button>

        <div className="mb-6">
          <h2 className="text-lg font-bold tracking-tight mb-1">You've hit your free limit</h2>
          <p className="text-text-secondary text-sm">Upgrade to Pro for unlimited README generations.</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Free */}
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="font-mono text-[9px] text-text-secondary uppercase tracking-wider mb-2">Free</p>
            <p className="text-white font-bold text-xl mb-3">$0</p>
            <ul className="space-y-1.5">
              {['3 generations', 'Standard template'].map(f => (
                <li key={f} className="flex items-center gap-1.5 text-xs text-text-secondary">
                  <Check className="w-3 h-3 text-success" /> {f}
                </li>
              ))}
            </ul>
          </div>
          {/* Pro */}
          <div className="rounded-xl border border-accent/35 bg-accent/5 p-4 relative overflow-hidden">
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-accent/15 rounded-full blur-xl" />
            <p className="font-mono text-[9px] text-accent uppercase tracking-wider mb-2">Pro</p>
            <div className="flex items-baseline gap-1 mb-3">
              <p className="text-white font-bold text-xl">$10</p>
              <span className="text-text-secondary text-xs">/mo</span>
            </div>
            <ul className="space-y-1.5">
              {['Unlimited', 'All templates', 'Priority speed'].map(f => (
                <li key={f} className="flex items-center gap-1.5 text-xs text-text-secondary">
                  <Check className="w-3 h-3 text-accent" /> {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {error && <p className="text-red-400 font-mono text-xs mb-3">{error}</p>}

        <button
          onClick={handleUpgrade}
          disabled={isLoading}
          className="btn-primary w-full py-3 gap-2"
        >
          {isLoading
            ? <><Loader2 className="w-4 h-4 animate-spin" />Redirecting…</>
            : <><Zap className="w-4 h-4" />Upgrade to Pro — $10/mo</>
          }
        </button>
      </div>
    </div>
  )
}
