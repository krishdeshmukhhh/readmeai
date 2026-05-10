export default function Footer() {
  return (
    <footer className="bg-[#080808] rounded-t-[3rem] mt-10 border-t border-[#1e1e1e]">
      <div className="max-w-6xl mx-auto px-6 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-14">
          {/* Brand */}
          <div>
            <div className="font-mono text-base font-medium text-white mb-3 flex items-center gap-1.5">
              <span className="text-accent">&gt;_</span> ReadmeAI
            </div>
            <p className="text-text-secondary text-sm leading-relaxed max-w-[220px]">
              AI-powered README generation for developers who ship.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-3">
            <p className="font-mono text-[10px] text-[#444] uppercase tracking-[0.15em] mb-1">Product</p>
            {['#features', '#how-it-works', '#pricing'].map((href, i) => (
              <a key={href} href={href}
                className="text-text-secondary text-sm hover:text-white transition-colors hover:-translate-y-px duration-150 w-fit">
                {['Features', 'How it works', 'Pricing'][i]}
              </a>
            ))}
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-3">
            <p className="font-mono text-[10px] text-[#444] uppercase tracking-[0.15em] mb-1">Legal</p>
            <span className="text-text-secondary text-sm">Privacy Policy</span>
            <span className="text-text-secondary text-sm">Terms of Service</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#1e1e1e] pt-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="text-[#444] text-xs">
            ReadmeAI © {new Date().getFullYear()}
          </span>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-success [animation:fadeDot_2s_ease-in-out_infinite]" />
            <span className="font-mono text-[10px] text-text-secondary uppercase tracking-[0.15em]">
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
