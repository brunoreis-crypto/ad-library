import clsx from 'clsx'
import type { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: string
  sub?: string
  icon: LucideIcon
  color?: 'red' | 'emerald' | 'amber' | 'rose' | 'zinc'
}

const colorMap = {
  red: 'bg-red-500/10 text-red-400',
  emerald: 'bg-emerald-500/10 text-emerald-400',
  amber: 'bg-amber-500/10 text-amber-400',
  rose: 'bg-rose-500/10 text-rose-400',
  zinc: 'bg-zinc-800 text-zinc-400',
}

export default function MetricCard({ label, value, sub, icon: Icon, color = 'red' }: MetricCardProps) {
  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 flex items-start gap-4 hover:border-zinc-700 transition-colors">
      <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', colorMap[color])}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-zinc-500 text-xs font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-white mt-0.5">{value}</p>
        {sub && <p className="text-zinc-600 text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}
