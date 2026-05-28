'use client'

import { useParams } from 'next/navigation'
import AppShell from '@/components/layout/AppShell'
import CompetitorAdCard from '@/components/competitors/CompetitorAdCard'
import { mockCompetitors, mockCompetitorAds } from '@/lib/mock-data'
import { ArrowLeft, RefreshCw, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function CompetitorDetailPage() {
  const { id } = useParams<{ id: string }>()
  const competitor = mockCompetitors.find(c => c.id === id)
  const ads = mockCompetitorAds.filter(a => a.competitor_id === id)

  if (!competitor) {
    return (
      <AppShell>
        <div className="px-8 py-7">
          <p className="text-slate-500">Concorrente não encontrado.</p>
        </div>
      </AppShell>
    )
  }

  const activeAds = ads.filter(a => a.status === 'ACTIVE')
  const avgDays = ads.length
    ? Math.round(
        ads.reduce((s, a) => {
          if (!a.started_at) return s
          return s + (Date.now() - new Date(a.started_at).getTime()) / (1000 * 60 * 60 * 24)
        }, 0) / ads.length,
      )
    : 0

  return (
    <AppShell>
      <div className="px-8 py-7">
        {/* Back + Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/competitors" className="text-slate-400 hover:text-slate-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-lg">
              {competitor.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">{competitor.name}</h1>
                {competitor.website && (
                  <a href={competitor.website} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-600">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
              {competitor.industry && <p className="text-xs text-slate-400">{competitor.industry}</p>}
            </div>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm hover:bg-slate-50 transition-colors">
            <RefreshCw className="w-4 h-4" />
            Sincronizar
          </button>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-2xl font-bold text-slate-900">{activeAds.length}</p>
            <p className="text-xs text-slate-500 mt-0.5">Anúncios ativos</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-2xl font-bold text-slate-900">{avgDays}</p>
            <p className="text-xs text-slate-500 mt-0.5">Dias rodando (média)</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className="text-2xl font-bold text-indigo-600">
              {ads.filter(a => a.ai_insights).length}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Insights gerados</p>
          </div>
        </div>

        {/* Tip banner */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-5 py-3.5 mb-6 flex items-start gap-3">
          <span className="text-lg">💡</span>
          <div>
            <p className="text-sm font-medium text-indigo-800">Como usar esta seção</p>
            <p className="text-xs text-indigo-600 mt-0.5">
              Anúncios que ficam rodando por mais de 30 dias geralmente são lucrativos — o concorrente está pagando por eles por um motivo.
              Clique em <strong>"Ver Insights IA"</strong> para descobrir o ângulo e como adaptar para seus criativos.
            </p>
          </div>
        </div>

        {/* Ads grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800">
              Anúncios ativos
              <span className="ml-2 text-slate-400 font-normal text-sm">({ads.length})</span>
            </h2>
          </div>

          {ads.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <p className="text-slate-400">Nenhum anúncio encontrado. Sincronize para buscar da Meta Ad Library.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {ads.map(ad => (
                <CompetitorAdCard key={ad.id} ad={ad} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
