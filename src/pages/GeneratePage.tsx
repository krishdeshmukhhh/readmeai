import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GenerateForm from '../components/GenerateForm'
import MarkdownPreview from '../components/MarkdownPreview'
import UpgradeModal from '../components/UpgradeModal'
import { useUser } from '../hooks/useUser'
import { useGenerate } from '../hooks/useGenerate'

export default function GeneratePage() {
  const navigate = useNavigate()
  const [showUpgrade, setShowUpgrade] = useState(false)
  const { plan, generationCount, isLoading: userLoading, refetch } = useUser()
  const { generate, readmeOutput, isLoading: generating, error } = useGenerate(
    refetch,
    () => setShowUpgrade(true),
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-5 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="font-mono text-sm font-medium text-white flex items-center gap-1.5 hover:-translate-y-px transition-transform"
          >
            <span className="text-accent">&gt;_</span>
            ReadmeAI
          </button>
          {!userLoading && plan === 'pro' && (
            <span className="font-mono text-[10px] bg-accent/10 text-accent border border-accent/25 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Pro
            </span>
          )}
        </div>
      </header>

      <main className="pt-14 max-w-7xl mx-auto px-5 py-5">
        {error && (
          <div className="mb-4 p-3.5 bg-red-500/8 border border-red-500/20 rounded-card text-red-400 text-xs font-medium font-mono">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-5 md:h-[calc(100vh-88px)]">
          {/* Left panel */}
          <div className="bg-surface border border-border rounded-card-lg p-6 md:overflow-y-auto">
            <p className="label-field mb-6">Generate README</p>
            {userLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <GenerateForm
                onGenerate={generate}
                isLoading={generating}
                generationCount={generationCount}
                plan={plan}
                onUpgradeClick={() => setShowUpgrade(true)}
              />
            )}
          </div>

          {/* Right panel */}
          <div className="md:overflow-y-auto">
            <MarkdownPreview markdown={readmeOutput} isLoading={generating} />
          </div>
        </div>
      </main>

      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
    </div>
  )
}
