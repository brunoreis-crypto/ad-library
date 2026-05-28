import type { Ad } from '@/types'
import Badge from '@/components/ui/Badge'
import { TrendingDown, TrendingUp, MousePointer, Eye, DollarSign } from 'lucide-react'

interface AdCardProps {
  ad: Ad
  showClient?: boolean
}

function fmt(n: number, prefix = '') {
  if (n >= 1_000_000) return `${prefix}${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${prefix}${(n / 1_000).toFixed(1)}K`
  return `${prefix}${n.toLocaleString('pt-BR')}`
}

function fmtBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function AdCard({ ad, showClient }: AdCardProps) {
  const goodCtr = ad.ctr >= 2
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Creative preview */}
      <div className="h-36 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative">
        {ad.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={ad.thumbnail_url} alt={ad.ad_name} className="w-full h-full object-cover" />
        ) : (
          <div className="text-center px-4">
            <p className="text-slate-400 text-xs line-clamp-3">{ad.creative_body}</p>
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-1">
          <Badge label={ad.status === 'ACTIVE' ? 'Ativo' : 'Pausado'} variant={ad.status === 'ACTIVE' ? 'active' : 'paused'} />
          <Badge label={ad.platform} variant={ad.platform as 'meta' | 'google' | 'tiktok'} />
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        {showClient && ad.client && (
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ad.client.color }} />
            <span className="text-xs text-slate-400">{ad.client.name}</span>
          </div>
        )}
        <p className="font-semibold text-slate-800 text-sm line-clamp-1">{ad.ad_name}</p>
        <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">{ad.campaign_name}</p>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100">
          <div className="text-center">
            <div className="flex items-center justify-center gap-0.5 text-slate-400 mb-0.5">
              <DollarSign className="w-3 h-3" />
              <span className="text-xs">Gasto</span>
            </div>
            <p className="text-sm font-bold text-slate-800">{fmtBRL(ad.spend)}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-0.5 text-slate-400 mb-0.5">
              <Eye className="w-3 h-3" />
              <span className="text-xs">Impressões</span>
            </div>
            <p className="text-sm font-bold text-slate-800">{fmt(ad.impressions)}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-0.5 mb-0.5" style={{ color: goodCtr ? '#10B981' : '#F59E0B' }}>
              <MousePointer className="w-3 h-3" />
              <span className="text-xs">CTR</span>
              {goodCtr ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            </div>
            <p className="text-sm font-bold" style={{ color: goodCtr ? '#10B981' : '#F59E0B' }}>
              {ad.ctr.toFixed(2)}%
            </p>
          </div>
        </div>

        {ad.cpl !== undefined && (
          <div className="mt-2 px-3 py-1.5 bg-slate-50 rounded-lg flex items-center justify-between">
            <span className="text-xs text-slate-500">CPL</span>
            <span className="text-sm font-bold text-slate-800">{fmtBRL(ad.cpl)}</span>
          </div>
        )}
      </div>
    </div>
  )
}
