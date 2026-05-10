import { useEffect, useRef, useState } from 'react'
import { FileText, Terminal, Package, GitBranch, CheckCircle2 } from 'lucide-react'
import { gsap } from '../lib/gsap'
import { useReveal } from '../hooks/useReveal'

const TEMPLATE_CARDS = [
  { label: 'Standard README', icon: FileText,  accent: '#4F8EF7', desc: 'Classic open-source structure' },
  { label: 'CLI Tool Docs',   icon: Terminal,  accent: '#00D084', desc: 'Flags, commands, examples' },
  { label: 'npm Package Ref', icon: Package,   accent: '#F59E0B', desc: 'API reference and usage' },
  { label: 'Monorepo Guide',  icon: GitBranch, accent: '#A78BFA', desc: 'Workspace and package setup' },
]

const TYPEWRITER_LINES = [
  { text: '# MyProject',                                    cls: 'text-white font-bold' },
  { text: '',                                               cls: '' },
  { text: '![License](https://img.shields.io/badge/license-MIT-blue)', cls: 'text-text-secondary' },
  { text: '![Build](https://img.shields.io/badge/build-passing-success)', cls: 'text-text-secondary' },
  { text: '',                                               cls: '' },
  { text: '> Converts CSV to JSON blazing fast.',           cls: 'text-success' },
  { text: '',                                               cls: '' },
  { text: '## Installation',                               cls: 'text-white font-semibold' },
  { text: '```bash',                                        cls: 'text-accent' },
  { text: 'npm install myproject',                          cls: 'text-text-secondary' },
  { text: '```',                                            cls: 'text-accent' },
]

const TEMPLATES = ['Standard', 'CLI Tool', 'npm Package', 'Monorepo']

/* ── Card 1: Shuffler ─────────────────────────── */
function ShufflerCard() {
  const orderRef = useRef<number[]>([0, 1, 2, 3])
  const cardEls  = useRef<(HTMLDivElement | null)[]>([null, null, null, null])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    // Wait one frame to ensure refs are attached
    const frameId = requestAnimationFrame(() => {
      const els = cardEls.current
      if (els.some(el => !el)) return

      gsap.set(els[0]!, { y: 0,  scale: 1,    opacity: 1,    zIndex: 40 })
      gsap.set(els[1]!, { y: 26, scale: 0.95, opacity: 0.7,  zIndex: 30 })
      gsap.set(els[2]!, { y: 52, scale: 0.90, opacity: 0.4,  zIndex: 20 })
      gsap.set(els[3]!, { y: 78, scale: 0.85, opacity: 0,    zIndex: 10 })

      const cycle = () => {
        const [f, m, b, h] = orderRef.current
        const [fE, mE, bE, hE] = [els[f], els[m], els[b], els[h]]
        if (!fE || !mE || !bE || !hE) return

        gsap.to(fE, { y: -64, opacity: 0, scale: 1.01, zIndex: 5,  duration: 0.42, ease: 'power2.in' })
        gsap.to(mE, { y: 0,   scale: 1,   opacity: 1,  zIndex: 40, duration: 0.6,  delay: 0.07, ease: 'back.out(1.4)' })
        gsap.to(bE, { y: 26,  scale: 0.95, opacity: 0.7, zIndex: 30, duration: 0.55, delay: 0.12, ease: 'back.out(1.2)' })
        gsap.set(hE, { y: 76, scale: 0.85, zIndex: 20 })
        gsap.to(hE,  { y: 52, scale: 0.90, opacity: 0.4, duration: 0.5, delay: 0.18 })

        orderRef.current = [m, b, h, f]
      }

      intervalRef.current = setInterval(cycle, 3200)
    })

    return () => {
      cancelAnimationFrame(frameId)
      if (intervalRef.current) clearInterval(intervalRef.current)
      cardEls.current.forEach(el => { if (el) gsap.killTweensOf(el) })
    }
  }, [])

  return (
    <div className="relative h-[196px] mt-2">
      {TEMPLATE_CARDS.map((card, i) => {
        const Icon = card.icon
        return (
          <div
            key={card.label}
            ref={el => { cardEls.current[i] = el }}
            className="absolute inset-x-0 top-0 bg-surface-2 border border-border rounded-[1.25rem] p-5"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${card.accent}1a` }}
              >
                <Icon className="w-4 h-4" style={{ color: card.accent }} strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-white text-sm font-semibold leading-tight">{card.label}</p>
                <p className="text-text-secondary text-xs mt-0.5">{card.desc}</p>
              </div>
            </div>
            <div className="mt-4 h-[3px] rounded-full bg-border">
              <div className="h-full w-2/3 rounded-full" style={{ background: card.accent }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ── Card 2: Typewriter ───────────────────────── */
function TypewriterCard() {
  const [done,    setDone]    = useState<string[]>([])
  const [current, setCurrent] = useState('')
  const [li,      setLi]      = useState(0)
  const [ci,      setCi]      = useState(0)

  useEffect(() => {
    if (li >= TYPEWRITER_LINES.length) {
      const t = setTimeout(() => {
        setDone([]); setCurrent(''); setLi(0); setCi(0)
      }, 2000)
      return () => clearTimeout(t)
    }
    const line = TYPEWRITER_LINES[li].text
    if (ci < line.length) {
      const t = setTimeout(() => { setCurrent(line.slice(0, ci + 1)); setCi(c => c + 1) }, 30)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => {
      setDone(d => [...d, line]); setCurrent(''); setLi(l => l + 1); setCi(0)
    }, line === '' ? 55 : 120)
    return () => clearTimeout(t)
  }, [li, ci])

  return (
    <div className="rounded-[1.25rem] border border-border bg-[#0b0e0b] p-4 font-mono text-xs h-[196px] overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-[#232323]" />)}
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-success">
          <span className="w-1.5 h-1.5 rounded-full bg-success" style={{ animation: 'fadeDot 1.8s ease-in-out infinite' }} />
          Live Preview
        </div>
      </div>
      <div className="space-y-0.5 leading-5">
        {done.map((l, i) => (
          <div key={i} className={TYPEWRITER_LINES[i]?.cls || 'text-text-secondary'}>
            {l || ' '}
          </div>
        ))}
        {li < TYPEWRITER_LINES.length && (
          <div className={TYPEWRITER_LINES[li].cls}>
            {current}
            <span style={{ animation: 'blink 0.9s step-end infinite' }}>▌</span>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Card 3: Template selector ────────────────── */
function TemplateSelectorCard() {
  const [active, setActive] = useState(1)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    let step = 0
    const schedule = () => {
      step = (step + 1) % TEMPLATES.length
      setSuccess(false)
      setActive(step)
      if (step === TEMPLATES.length - 1) {
        setTimeout(() => setSuccess(true), 600)
      }
    }
    const id = setInterval(schedule, 1900)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="h-[196px] flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2 flex-1">
        {TEMPLATES.map((t, i) => (
          <div
            key={t}
            className="rounded-xl border text-xs font-medium flex items-center justify-center"
            style={{
              borderColor:     i === active ? 'rgba(79,142,247,0.5)' : '#1e1e1e',
              backgroundColor: i === active ? 'rgba(79,142,247,0.09)' : '#141416',
              color:           i === active ? '#4F8EF7' : '#444',
              transform:       i === active ? 'scale(1.04)' : 'scale(1)',
              transition: 'all 0.35s cubic-bezier(0.25,0.46,0.45,0.94)',
            }}
          >
            {t}
          </div>
        ))}
      </div>
      <div
        className="w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors duration-300"
        style={{ background: '#4F8EF7', color: '#fff' }}
      >
        {success && <CheckCircle2 className="w-3.5 h-3.5" />}
        {success ? 'Generated!' : 'Generate README'}
      </div>
    </div>
  )
}

/* ── Section ──────────────────────────────────── */
export default function Features() {
  const headingRef = useReveal()
  const gridRef    = useReveal({ threshold: 0.06 }) as React.RefObject<HTMLDivElement>

  const cards = [
    {
      label: 'TEMPLATES',
      heading: 'Every project type, covered',
      desc: 'Standard, CLI, npm, monorepo — pick the right structure and AI fills it in.',
      demo: <ShufflerCard />,
    },
    {
      label: 'LIVE PREVIEW',
      heading: "See your README as it's written",
      desc: 'Watch your README take shape in real time — rendered Markdown, syntax-highlighted code.',
      demo: <TypewriterCard />,
    },
    {
      label: 'GENERATION',
      heading: 'Pick a template, we handle the rest',
      desc: 'Select your template and hit generate. AI handles the structure, sections, and prose.',
      demo: <TemplateSelectorCard />,
    },
  ]

  return (
    <section id="features" className="py-28 px-5 max-w-6xl mx-auto">
      <div ref={headingRef as React.RefObject<HTMLDivElement>} className="reveal text-center mb-16">
        <p className="font-mono text-[10px] text-accent uppercase tracking-[0.2em] mb-3">Features</p>
        <h2 className="text-[clamp(26px,3.8vw,42px)] font-bold tracking-[-0.03em]">
          Built for developers who ship
        </h2>
      </div>

      <div ref={gridRef} className="reveal-group grid md:grid-cols-3 gap-5">
        {cards.map((card, i) => (
          <div
            key={i}
            className="reveal-item bg-surface border border-border rounded-card-lg p-6 flex flex-col gap-5
              transition-all duration-300 hover:border-border-2 hover:shadow-[0_0_40px_rgba(79,142,247,0.07)]"
          >
            <div>
              <p className="font-mono text-[9px] text-accent uppercase tracking-[0.2em] mb-2">{card.label}</p>
              <h3 className="text-white font-semibold text-[15px] leading-snug mb-2">{card.heading}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{card.desc}</p>
            </div>
            <div className="flex-1">{card.demo}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
