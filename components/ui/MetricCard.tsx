import clsx from 'clsx'
import type { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: string
  sub?: string
  icon: LucideIcon
  trend?: 'up' | 'down' | 'neutral'
  color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate'
}

const colorMap = {
  indigo: 'bg-indigo-50 text-indigo-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  rose: 'bg-rose-50 text-rose-600',
  slate: 'bg-slate-100 text-slate-600',
}

export default function MetricCard({
  label,
  value,
  sub,
  icon: Icon,
  color = 'indigo',
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-4">
      <div className={clsx('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', colorMap[color])}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-slate-900 mt-0.5">{value}</p>
        {sub && <p className="text-slate-400 text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}
