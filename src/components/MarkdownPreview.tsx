import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check, Download } from 'lucide-react'

interface Props {
  markdown: string
  isLoading: boolean
}

export default function MarkdownPreview({ markdown, isLoading }: Props) {
  const [tab, setTab] = useState<'preview' | 'markdown'>('preview')
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'README.md'; a.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="bg-surface border border-border rounded-card-lg p-6 h-full min-h-96 space-y-3">
        <div className="flex gap-2 mb-6">
          <div className="h-7 w-20 bg-border rounded-lg animate-pulse" />
          <div className="h-7 w-24 bg-border rounded-lg animate-pulse" />
        </div>
        {[1, 0.8, 0.6, 1, 0.9, 0.7, 0.5, 0.85, 0.65, 1].map((w, i) => (
          <div key={i} className="h-3 bg-border rounded animate-pulse"
            style={{ width: `${w * 100}%`, animationDelay: `${i * 50}ms` }} />
        ))}
      </div>
    )
  }

  if (!markdown) {
    return (
      <div className="bg-surface border border-border rounded-card-lg h-full min-h-96 flex flex-col items-center justify-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-surface-2 border border-border flex items-center justify-center">
          <span className="font-mono text-accent text-lg">&gt;_</span>
        </div>
        <div className="text-center">
          <p className="text-white text-sm font-medium">No README yet</p>
          <p className="text-text-secondary text-xs mt-1">Fill in the form and hit Generate</p>
        </div>
        <p className="font-mono text-[10px] text-text-secondary uppercase tracking-widest opacity-30 mt-2">
          awaiting input…
        </p>
      </div>
    )
  }

  return (
    <div className="bg-surface border border-border rounded-card-lg p-6 flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
        {/* Tabs */}
        <div className="relative flex gap-0 bg-background rounded-lg border border-border p-0.5">
          {(['preview', 'markdown'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative px-4 py-1.5 text-xs font-medium rounded-md transition-all duration-200 capitalize z-10 ${
                tab === t ? 'text-white' : 'text-text-secondary hover:text-white'
              }`}
            >
              {tab === t && (
                <span className="absolute inset-0 bg-surface-2 rounded-md -z-10" />
              )}
              {t}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button onClick={handleCopy}
            className="btn-secondary text-xs px-3 py-1.5 gap-1.5">
            {copied
              ? <><Check className="w-3.5 h-3.5 text-success" />Copied</>
              : <><Copy className="w-3.5 h-3.5" />Copy</>
            }
          </button>
          <button onClick={handleDownload}
            className="btn-secondary text-xs px-3 py-1.5 gap-1.5">
            <Download className="w-3.5 h-3.5" />Download
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {tab === 'preview' ? (
          <div className="prose prose-invert prose-sm max-w-none [&_pre]:rounded-xl [&_code:not(pre_code)]:text-accent [&_code:not(pre_code)]:bg-surface-2 [&_code:not(pre_code)]:px-1.5 [&_code:not(pre_code)]:py-0.5 [&_code:not(pre_code)]:rounded [&_code:not(pre_code)]:font-mono [&_code:not(pre_code)]:text-xs">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  const isInline = !match
                  return isInline ? (
                    <code className="bg-surface-2 px-1.5 py-0.5 rounded text-accent text-xs font-mono" {...props}>
                      {children}
                    </code>
                  ) : (
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{ borderRadius: '12px', fontSize: '12px', margin: '0', fontFamily: '"JetBrains Mono", monospace' }}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  )
                },
              }}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        ) : (
          <pre className="text-xs text-text-secondary font-mono whitespace-pre-wrap leading-relaxed">
            {markdown}
          </pre>
        )}
      </div>
    </div>
  )
}
