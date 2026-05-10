import { useState } from 'react'
import GenerationCounter from './GenerationCounter'
import { Wand2, Loader2 } from 'lucide-react'

const TEMPLATE_OPTIONS = ['Standard', 'CLI Tool', 'npm Package', 'Monorepo'] as const
type TemplateType = (typeof TEMPLATE_OPTIONS)[number]

interface FormState {
  projectName: string
  description: string
  techStack: string
  githubUrl: string
  templateType: TemplateType
}

interface Props {
  onGenerate: (input: Omit<FormState, 'githubUrl'> & { githubUrl?: string }) => void
  isLoading: boolean
  generationCount: number
  plan: 'free' | 'pro'
  onUpgradeClick: () => void
}

const FREE_LIMIT = 3

export default function GenerateForm({ onGenerate, isLoading, generationCount, plan, onUpgradeClick }: Props) {
  const isAtLimit = plan === 'free' && generationCount >= FREE_LIMIT
  const [form, setForm] = useState<FormState>({
    projectName: '',
    description: '',
    techStack: '',
    githubUrl: '',
    templateType: 'Standard',
  })

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm(p => ({ ...p, [field]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isAtLimit) { onUpgradeClick(); return }
    onGenerate({ ...form, githubUrl: form.githubUrl || undefined })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="label-field">Project Name</label>
        <input
          className="input-field"
          placeholder="my-awesome-project"
          value={form.projectName}
          onChange={set('projectName')}
          required
        />
      </div>

      <div>
        <label className="label-field">Project Description</label>
        <textarea
          className="input-field resize-none"
          rows={4}
          placeholder="What does it do? Who's it for? What makes it unique?"
          value={form.description}
          onChange={set('description')}
          required
        />
      </div>

      <div>
        <label className="label-field">Tech Stack</label>
        <input
          className="input-field"
          placeholder="Node.js, Express, PostgreSQL, React"
          value={form.techStack}
          onChange={set('techStack')}
          required
        />
      </div>

      <div>
        <label className="label-field">
          GitHub URL <span className="normal-case text-[#333] tracking-normal">— optional</span>
        </label>
        <input
          className="input-field"
          placeholder="https://github.com/username/repo"
          value={form.githubUrl}
          onChange={set('githubUrl')}
          type="url"
        />
      </div>

      <div>
        <label className="label-field">Template</label>
        <select
          className="input-field cursor-pointer"
          value={form.templateType}
          onChange={set('templateType')}
          style={{ WebkitAppearance: 'none', appearance: 'none' }}
        >
          {TEMPLATE_OPTIONS.map(t => (
            <option key={t} value={t} style={{ background: '#0A0A0A' }}>{t}</option>
          ))}
        </select>
      </div>

      <GenerationCounter generationCount={generationCount} plan={plan} />

      {isAtLimit ? (
        <div className="space-y-2.5">
          <button type="button" disabled
            className="btn-primary w-full py-3 opacity-30 cursor-not-allowed gap-2">
            <Wand2 className="w-4 h-4" /> Generate README
          </button>
          <p className="text-center font-mono text-[11px] text-text-secondary">
            <button type="button" onClick={onUpgradeClick} className="text-accent hover:underline">
              Upgrade to Pro to continue →
            </button>
          </p>
        </div>
      ) : (
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full py-3 gap-2"
        >
          {isLoading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</>
            : <><Wand2 className="w-4 h-4" /> Generate README</>
          }
        </button>
      )}
    </form>
  )
}
