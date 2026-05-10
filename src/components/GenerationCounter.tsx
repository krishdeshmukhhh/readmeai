const FREE_LIMIT = 3

interface Props {
  generationCount: number
  plan: 'free' | 'pro'
}

export default function GenerationCounter({ generationCount, plan }: Props) {
  if (plan === 'pro') return null
  const used = Math.min(generationCount, FREE_LIMIT)
  const pct  = (used / FREE_LIMIT) * 100
  const at   = used >= FREE_LIMIT

  return (
    <div className="space-y-2 py-1">
      <div className="flex justify-between font-mono text-[10px] text-text-secondary uppercase tracking-wider">
        <span>{used} / {FREE_LIMIT} free generations</span>
        {at && <span className="text-accent">Limit reached</span>}
      </div>
      <div className="h-[3px] bg-border rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, backgroundColor: at ? '#E8A530' : '#00D084' }}
        />
      </div>
    </div>
  )
}
