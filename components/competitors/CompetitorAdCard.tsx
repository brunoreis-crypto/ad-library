'use client'

import { useState } from 'react'
import type { CompetitorAd } from '@/types'
import Badge from '@/components/ui/Badge'
import { Sparkles, Calendar, Eye, ChevronDown, ChevronUp } from 'lucide-react'

interface Props { ad: CompetitorAd }

function fmt(n?: number) {
  if (!n) return '—'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString('pt-BR')
}

function daysRunning(startDate?: string) {
  if (!startDate) return null
  return Math.floor((Date.now() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))
}

export default function CompetitorAdCard({ ad }: Props) {
  const [showImage, setShowImage] = useState(false)
  const [showInsights, setShowInsights] = useState(false)
  const [loading, setLoading] = useState(false)
  const [insights, setInsights] = useState<{ what_works: string; angle: string; adaptation_suggestion: string } | null>(
    ad.ai_insights ? JSON.parse(ad.ai_insights) : null,
  )

  const days = daysRunning(ad.started_at)

  async function fetchInsights() {
    if (insights) { setShowInsights(v => !v); return }
    setLoading(true)
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
      setLoading(false)
    }
  }

  return (
    <>
    {showImage && ad.thumbnail_url && (
      <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setShowImage(false)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ad.thumbnail_url} alt="Ad creative" className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl" onClick={e => e.stopPropagation()} />
        <button onClick={() => setShowImage(false)} className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-zinc-300">✕</button>
      </div>
    )}
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden hover:border-zinc-700 hover:shadow-lg hover:shadow-black/20 transition-all">
      <div
        className="h-40 bg-zinc-800 flex items-center justify-center px-4 relative overflow-hidden cursor-pointer"
        onClick={() => ad.thumbnail_url && setShowImage(true)}
      >
        {ad.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={ad.thumbnail_url} alt="Ad creative" className="w-full h-full object-cover hover:scale-105 transition-transform duration-200" />
        ) : (
          <p className="text-zinc-500 text-xs text-center line-clamp-4">{ad.creative_body || 'Sem texto disponível'}</p>
        )}
        {days !== null && days > 30 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
            🔥 {days}d
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-1 flex-wrap justify-end">
          {ad.platforms.slice(0, 2).map(p => (
            <Badge key={p} label={p} variant={p === 'facebook' || p === 'instagram' ? 'meta' : 'neutral'} />
          ))}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3 text-xs text-zinc-500">
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{fmt(ad.impressions_lower)}–{fmt(ad.impressions_upper)}</span>
          </div>
          {ad.started_at && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(ad.started_at).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })}</span>
            </div>
          )}
          {days !== null && <span className="ml-auto font-bold text-zinc-300">{days}d</span>}
        </div>

        <button
          onClick={fetchInsights}
          disabled={loading}
          className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {loading ? 'Analisando...' : 'Ver Insights IA'}
          {insights && !loading && (showInsights ? <ChevronUp className="w-3.5 h-3.5 ml-auto" /> : <ChevronDown className="w-3.5 h-3.5 ml-auto" />)}
        </button>

        {showInsights && insights && (
          <div className="mt-3 space-y-2">
            <div className="p-2.5 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
              <p className="text-xs font-semibold text-emerald-400 mb-0.5">O que funciona</p>
              <p className="text-xs text-zinc-400">{insights.what_works}</p>
            </div>
            <div className="p-2.5 bg-amber-500/5 border border-amber-500/10 rounded-lg">
              <p className="text-xs font-semibold text-amber-400 mb-0.5">Ângulo / Hook</p>
              <p className="text-xs text-zinc-400">{insights.angle}</p>
            </div>
            <div className="p-2.5 bg-red-500/5 border border-red-500/10 rounded-lg">
              <p className="text-xs font-semibold text-red-400 mb-0.5">Como usar nos seus criativos</p>
              <p className="text-xs text-zinc-400">{insights.adaptation_suggestion}</p>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  )
}
