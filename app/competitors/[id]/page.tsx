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

  if (!competitor) return <AppShell><div className="px-8 py-7"><p className="text-zinc-500">Concorrente não encontrado.</p></div></AppShell>

  const avgDays = ads.length
    ? Math.round(ads.reduce((s, a) => {
        if (!a.started_at) return s
        return s + (Date.now() - new Date(a.started_at).getTime()) / (1000 * 60 * 60 * 24)
      }, 0) / ads.length)
    : 0

  return (
    <AppShell>
      <div className="px-8 py-7">
        <div className="flex items-center gap-4 mb-7">
          <Link href="/competitors" className="text-zinc-500 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-white font-bold text-lg">
              {competitor.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">{competitor.name}</h1>
                {competitor.website && (
                  <a href={competitor.website} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-red-400 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
              {competitor.industry && <p className="text-xs text-zinc-500">{competitor.industry}</p>}
            </div>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-zinc-700 text-zinc-300 rounded-lg text-sm hover:bg-zinc-800 hover:text-white transition-colors">
            <RefreshCw className="w-4 h-4" /> Sincronizar
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Anúncios ativos', value: ads.length, color: 'text-white' },
            { label: 'Dias rodando (média)', value: avgDays, color: 'text-white' },
            { label: 'Insights gerados', value: ads.filter(a => a.ai_insights).length, color: 'text-red-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="bg-red-500/5 border border-red-500/10 rounded-xl px-5 py-3.5 mb-6 flex items-start gap-3">
          <span className="text-lg">💡</span>
          <div>
            <p className="text-sm font-bold text-white">Como usar esta seção</p>
            <p className="text-xs text-zinc-400 mt-0.5">
              Anúncios rodando há mais de <strong className="text-white">30 dias</strong> geralmente são lucrativos.
              Clique em <strong className="text-red-400">"Ver Insights IA"</strong> para descobrir o ângulo e como adaptar para seus criativos.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-bold text-white mb-4">
            Anúncios ativos <span className="text-zinc-500 font-normal text-sm">({ads.length})</span>
          </h2>
          {ads.length === 0 ? (
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-12 text-center">
              <p className="text-zinc-500">Nenhum anúncio. Sincronize para buscar da Meta Ad Library.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {ads.map(ad => <CompetitorAdCard key={ad.id} ad={ad} />)}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
