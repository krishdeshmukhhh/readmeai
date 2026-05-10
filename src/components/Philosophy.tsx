import { useReveal } from '../hooks/useReveal'

export default function Philosophy() {
  const ref = useReveal({ threshold: 0.2 })

  return (
    <section className="relative py-36 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=25"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover opacity-[0.07]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, #0A0A0A 0%, rgba(10,10,10,0.8) 30%, rgba(10,10,10,0.8) 70%, #0A0A0A 100%)',
          }}
        />
      </div>

      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="reveal relative z-10 max-w-5xl mx-auto px-5"
      >
        <p className="text-text-secondary text-lg md:text-xl mb-5 leading-relaxed">
          Most README generators give you a blank template.
        </p>
        <p
          className="font-serif italic leading-[0.92] tracking-[-0.02em]"
          style={{ fontSize: 'clamp(50px, 7.5vw, 92px)' }}
        >
          We write the{' '}
          <span className="text-accent">whole</span>
          {' '}thing.
        </p>
      </div>
    </section>
  )
}
