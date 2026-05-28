import clsx from 'clsx'

interface BadgeProps {
  label: string
  variant?: 'active' | 'paused' | 'archived' | 'meta' | 'google' | 'tiktok' | 'neutral'
}

const variantMap: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  paused: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  archived: 'bg-zinc-800 text-zinc-500 border-zinc-700',
  meta: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  google: 'bg-red-500/10 text-red-400 border-red-500/20',
  tiktok: 'bg-zinc-800 text-white border-zinc-700',
  neutral: 'bg-zinc-800 text-zinc-400 border-zinc-700',
}

export default function Badge({ label, variant = 'neutral' }: BadgeProps) {
  return (
    <span className={clsx('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border', variantMap[variant])}>
      {label}
    </span>
  )
}
