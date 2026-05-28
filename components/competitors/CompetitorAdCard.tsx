'use client'

import { useState } from 'react'
import type { CompetitorAd } from '@/types'
import Badge from '@/components/ui/Badge'
import { Sparkles, Calendar, Eye, ChevronDown, ChevronUp } from 'lucide-react'

interface Props {
  ad: CompetitorAd
}

function fmt(n?: number) {
  if (!n) return '—'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString('pt-BR')
}

function daysRunning(startDate?: string) {
  if (!startDate) return null
  const diff = Date.now() - new Date(startDate).getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export default function CompetitorAdCard({ ad }: Props) {
  const [showInsights, setShowInsights] = useState(false)
  const [loadingInsights, setLoadingInsights] = useState(false)
  const [insights, setInsights] = useState<{ what_works: string; angle: string; adaptation_suggestion: string } | null>(
    ad.ai_insights ? JSON.parse(ad.ai_insights) : null,
  )

  const days = daysRunning(ad.started_at)

  async function fetchInsights() {
    if (insights) { setShowInsights(v => !v); return }
    setLoadingInsights(true)
    try {
      const res = await fetch(`/api/competitors/${ad.competitor_id}/ads/${ad.id}/insights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creative_body: ad.creative_body, platforms: ad.platforms }),
      })
      const data = await res.json()
      setInsights(data)
      setShowInsights(true)
    } finally {
      setLoadingInsights(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Creative */}
      <div className="h-32 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center px-4 relative">
        <p className="text-slate-500 text-xs text-center line-clamp-4">{ad.creative_body || 'Sem texto criativo disponível'}</p>
        {days !== null && days > 30 && (
          <div className="absolute top-2 left-2 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
            🔥 {days}d rodando
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-1 flex-wrap justify-end">
          {ad.platforms.slice(0, 2).map(p => (
            <Badge key={p} label={p} variant={p === 'facebook' || p === 'instagram' ? 'meta' : 'neutral'} />
          ))}
        </div>
      </div>

      <div className="p-4">
        {/* Metrics row */}
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{fmt(ad.impressions_lower)}–{fmt(ad.impressions_upper)}</span>
          </div>
          {ad.started_at && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>desde {new Date(ad.started_at).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })}</span>
            </div>
          )}
          {days !== null && (
            <span className="ml-auto font-medium text-slate-700">{days} dias</span>
          )}
        </div>

        {/* AI insights button */}
        <button
          onClick={fetchInsights}
          disabled={loadingInsights}
          className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {loadingInsights ? 'Analisando...' : 'Ver Insights IA'}
          {insights && !loadingInsights && (
            showInsights ? <ChevronUp className="w-3.5 h-3.5 ml-auto" /> : <ChevronDown className="w-3.5 h-3.5 ml-auto" />
          )}
        </button>

        {showInsights && insights && (
          <div className="mt-3 space-y-2">
            <div className="p-2.5 bg-emerald-50 rounded-lg">
              <p className="text-xs font-semibold text-emerald-800 mb-0.5">O que funciona</p>
              <p className="text-xs text-emerald-700">{insights.what_works}</p>
            </div>
            <div className="p-2.5 bg-amber-50 rounded-lg">
              <p className="text-xs font-semibold text-amber-800 mb-0.5">Ângulo/Hook</p>
              <p className="text-xs text-amber-700">{insights.angle}</p>
            </div>
            <div className="p-2.5 bg-indigo-50 rounded-lg">
              <p className="text-xs font-semibold text-indigo-800 mb-0.5">Como usar nos seus criativos</p>
              <p className="text-xs text-indigo-700">{insights.adaptation_suggestion}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
