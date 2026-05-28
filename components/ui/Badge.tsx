import clsx from 'clsx'

interface BadgeProps {
  label: string
  variant?: 'active' | 'paused' | 'archived' | 'meta' | 'google' | 'tiktok' | 'neutral'
}

const variantMap: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  paused: 'bg-amber-50 text-amber-700 border-amber-200',
  archived: 'bg-slate-100 text-slate-500 border-slate-200',
  meta: 'bg-blue-50 text-blue-700 border-blue-200',
  google: 'bg-red-50 text-red-700 border-red-200',
  tiktok: 'bg-slate-900 text-white border-slate-900',
  neutral: 'bg-slate-100 text-slate-600 border-slate-200',
}

export default function Badge({ label, variant = 'neutral' }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border',
        variantMap[variant],
      )}
    >
      {label}
    </span>
  )
}
