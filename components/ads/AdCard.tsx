import type { Ad } from '@/types'
import Badge from '@/components/ui/Badge'

interface AdCardProps {
  ad: Ad
  showClient?: boolean
}

function fmtBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })
}

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString('pt-BR')
}

interface MetricItemProps { label: string; value: string; highlight?: boolean }
function MetricItem({ label, value, highlight }: MetricItemProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-zinc-500 text-xs">{label}</span>
      <span className={`text-sm font-bold ${highlight ? 'text-emerald-400' : 'text-white'}`}>{value}</span>
    </div>
  )
}

export default function AdCard({ ad, showClient }: AdCardProps) {
  const goodCtr = ad.ctr >= 2

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden hover:border-zinc-700 hover:shadow-lg hover:shadow-black/20 transition-all">
      {/* Creative preview */}
      <div className="h-32 bg-zinc-800 flex items-center justify-center relative px-4">
        {ad.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={ad.thumbnail_url} alt={ad.ad_name} className="w-full h-full object-cover absolute inset-0" />
        ) : (
          <p className="text-zinc-500 text-xs text-center line-clamp-3">{ad.creative_body}</p>
        )}
        <div className="absolute top-2 right-2 flex gap-1">
          <Badge label={ad.status === 'ACTIVE' ? 'Ativo' : 'Pausado'} variant={ad.status === 'ACTIVE' ? 'active' : 'paused'} />
          <Badge label={ad.platform} variant={ad.platform as 'meta' | 'google' | 'tiktok'} />
        </div>
        {showClient && ad.client && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ad.client.color }} />
            <span className="text-xs text-zinc-300 font-medium">{ad.client.name}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="font-semibold text-white text-sm line-clamp-1">{ad.ad_name}</p>
        <p className="text-zinc-500 text-xs mt-0.5 line-clamp-1">{ad.campaign_name}</p>

        {/* Primary metrics */}
        <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-zinc-800">
          <MetricItem label="Gasto" value={fmtBRL(ad.spend)} />
          <MetricItem label="Impressões" value={fmt(ad.impressions)} />
          <MetricItem label="CTR" value={`${ad.ctr.toFixed(2)}%`} highlight={goodCtr} />
        </div>

        {/* Secondary metrics */}
        <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-zinc-800">
          {ad.cpl !== undefined && <MetricItem label="CPL" value={fmtBRL(ad.cpl)} highlight />}
          {ad.cpc !== undefined && <MetricItem label="CPC" value={fmtBRL(ad.cpc)} />}
          {ad.cpm !== undefined && <MetricItem label="CPM" value={fmtBRL(ad.cpm)} />}
        </div>

        {/* Tertiary metrics */}
        <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-zinc-800">
          {ad.reach !== undefined && <MetricItem label="Alcance" value={fmt(ad.reach)} />}
          {ad.frequency !== undefined && <MetricItem label="Freq." value={ad.frequency.toFixed(2)} />}
          {ad.roas !== undefined && <MetricItem label="ROAS" value={`${ad.roas.toFixed(1)}x`} highlight />}
        </div>

        {ad.results !== undefined && (
          <div className="mt-3 px-3 py-2 bg-red-500/5 border border-red-500/10 rounded-lg flex items-center justify-between">
            <span className="text-xs text-zinc-500">Resultados</span>
            <span className="text-sm font-bold text-red-400">{ad.results}</span>
          </div>
        )}
      </div>
    </div>
  )
}
