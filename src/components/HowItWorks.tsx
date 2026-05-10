import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { useReveal } from '../hooks/useReveal'

/* ── Step 1: Typing demo ─────────────────────── */
function TypingDemo() {
  const [text, setText] = useState('')
  const target = 'A CLI tool that converts CSV\nto JSON with nested object\nsupport and custom delimiters.\nBuilt with Node.js + TypeScript.'

  useEffect(() => {
    let i = 0
    let t: ReturnType<typeof setTimeout>
    const type = () => {
      if (i <= target.length) {
        setText(target.slice(0, i)); i++
        t = setTimeout(type, 36)
      } else {
        t = setTimeout(() => { setText(''); i = 0; t = setTimeout(type, 500) }, 2600)
      }
    }
    t = setTimeout(type, 800)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="w-full max-w-[360px]">
      <div className="rounded-2xl border border-border bg-[#0c0c0c] overflow-hidden shadow-[0_0_48px_rgba(79,142,247,0.07)]">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-2.5 h-2.5 rounded-full bg-[#2a2a2a]" />
          ))}
          <span className="font-mono text-[10px] text-[#3a3a3a] ml-2">describe.txt</span>
        </div>
        <div className="p-5 min-h-[120px]">
          <p className="font-mono text-[13px] text-text-secondary whitespace-pre-wrap leading-relaxed">
            {text}
            <span style={{ animation: 'blink 0.9s step-end infinite' }} className="text-accent">│</span>
          </p>
        </div>
      </div>
    </div>
  )
}

/* ── Step 2: Scanning grid ───────────────────── */
function ScanningGrid() {
  return (
    <div className="w-full max-w-[360px] rounded-2xl border border-border bg-[#0c0c0c] overflow-hidden p-6 shadow-[0_0_48px_rgba(79,142,247,0.07)]">
      <div className="relative flex items-center justify-center py-4 overflow-hidden rounded-xl">
        <div className="grid grid-cols-10 gap-[13px]">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#1e1e1e]" />
          ))}
        </div>
        {/* Scanning beam */}
        <div
          className="absolute top-0 bottom-0 w-12 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(79,142,247,0.4) 50%, transparent)',
            animation: 'scan 2.2s linear infinite',
          }}
        />
        {/* Fade edges */}
        <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[#0c0c0c] to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-[#0c0c0c] to-transparent pointer-events-none" />
      </div>
      <div className="flex items-center justify-center gap-2 mt-4">
        <span className="font-mono text-[10px] text-text-secondary">Processing…</span>
        <span className="font-mono text-[10px] text-accent" style={{ animation: 'blink 1.2s step-end infinite' }}>■</span>
      </div>
    </div>
  )
}

/* ── Step 3: EKG waveform ────────────────────── */
function EKGDemo() {
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const path = pathRef.current
    if (!path) return
    const len = path.getTotalLength()
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 2.0,
      ease: 'power2.inOut',
      repeat: -1,
      repeatDelay: 1.4,
    })
    return () => { if (path) gsap.killTweensOf(path) }
  }, [])

  return (
    <div className="w-full max-w-[360px] rounded-2xl border border-border bg-[#0c0c0c] p-6 overflow-hidden shadow-[0_0_48px_rgba(0,208,132,0.07)]">
      <svg viewBox="0 0 360 64" className="w-full h-auto">
        <path
          ref={pathRef}
          d="M0 32 L75 32 L95 32 L108 4 L118 60 L130 32 L150 32 L360 32"
          stroke="#00D084"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="flex items-center justify-center gap-2 mt-3">
        <span
          className="w-1.5 h-1.5 rounded-full bg-success"
          style={{ animation: 'fadeDot 1.6s ease-in-out infinite' }}
        />
        <span className="font-mono text-[10px] text-success uppercase tracking-widest">
          README ready
        </span>
      </div>
    </div>
  )
}

/* ── Steps data ──────────────────────────────── */
const STEPS = [
  {
    num: '01',
    label: 'Describe',
    heading: 'Describe in plain English',
    body: 'No special syntax. Just tell us what your project does in a sentence or two.',
    demo: <TypingDemo />,
  },
  {
    num: '02',
    label: 'Generate',
    heading: 'AI writes the README',
    body: 'Claude produces a complete README — badges, installation steps, usage examples, and all.',
    demo: <ScanningGrid />,
  },
  {
    num: '03',
    label: 'Ship',
    heading: 'Copy and push to GitHub',
    body: 'Preview the rendered Markdown, copy to clipboard, or download README.md. Done.',
    demo: <EKGDemo />,
  },
]

/* ── Single step row (hooks called at component level) ── */
function StepRow({ step, isEven }: { step: typeof STEPS[number]; isEven: boolean }) {
  const ref = useReveal({ threshold: 0.15 })
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal grid md:grid-cols-2 gap-12 md:gap-20 items-center ${
        isEven ? 'md:[&>:first-child]:order-2' : ''
      }`}
    >
      <div>
        <div className="flex items-center gap-3 mb-5">
          <span className="font-mono text-[11px] text-accent uppercase tracking-[0.15em]">{step.num} /</span>
          <span className="font-mono text-[11px] text-text-secondary uppercase tracking-[0.15em]">{step.label}</span>
        </div>
        <h3
          className="font-bold tracking-[-0.03em] leading-[1.1] mb-4 text-white"
          style={{ fontSize: 'clamp(26px,3vw,40px)' }}
        >
          {step.heading}
        </h3>
        <p className="text-text-secondary text-base leading-relaxed max-w-sm">{step.body}</p>
      </div>
      <div className={isEven ? 'flex justify-start' : 'flex justify-end md:justify-start'}>
        {step.demo}
      </div>
    </div>
  )
}

/* ── Main component ──────────────────────────── */
export default function HowItWorks() {
  const headingRef = useReveal()

  return (
    <section id="how-it-works" className="py-28 px-5 max-w-6xl mx-auto">
      {/* Section heading */}
      <div ref={headingRef as React.RefObject<HTMLDivElement>} className="reveal text-center mb-20">
        <p className="font-mono text-[10px] text-accent uppercase tracking-[0.2em] mb-3">How it works</p>
        <h2 className="text-[clamp(26px,3.8vw,42px)] font-bold tracking-[-0.03em]">
          Zero to README in 30 seconds
        </h2>
      </div>

      {/* Steps */}
      <div className="space-y-20 md:space-y-28">
        {STEPS.map((step, i) => {
          const isEven = i % 2 === 1
          return (
            <StepRow key={i} step={step} isEven={isEven} />
          )
        })}
      </div>
    </section>
  )
}
