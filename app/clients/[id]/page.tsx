'use client'

import { useParams } from 'next/navigation'
import AppShell from '@/components/layout/AppShell'
import AdCard from '@/components/ads/AdCard'
import MetricCard from '@/components/ui/MetricCard'
import { mockClients, mockAds } from '@/lib/mock-data'
import { ArrowLeft, RefreshCw, DollarSign, Eye, MousePointer, TrendingUp } from 'lucide-react'
import Link from 'next/link'

function fmtBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })
}

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString('pt-BR')
}

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const client = mockClients.find(c => c.id === id)
  const ads = mockAds.filter(a => a.client_id === id).sort((a, b) => (a.cpl ?? 99999) - (b.cpl ?? 99999))

  if (!client) {
    return (
      <AppShell>
        <div className="px-8 py-7">
          <p className="text-slate-500">Cliente não encontrado.</p>
        </div>
      </AppShell>
    )
  }

  const totalSpend = ads.reduce((s, a) => s + a.spend, 0)
  const totalImpressions = ads.reduce((s, a) => s + a.impressions, 0)
  const avgCtr = ads.length ? ads.reduce((s, a) => s + a.ctr, 0) / ads.length : 0
  const avgCpl = ads.length ? ads.reduce((s, a) => s + (a.cpl ?? 0), 0) / ads.length : 0

  return (
    <AppShell>
      <div className="px-8 py-7">
        {/* Back + Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/clients" className="text-slate-400 hover:text-slate-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3 flex-1">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: client.color }}
            >
              {client.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">{client.name}</h1>
              {client.meta_account_id && (
                <p className="text-xs text-slate-400">Meta Account ID: {client.meta_account_id}</p>
              )}
            </div>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm hover:bg-slate-50 transition-colors">
            <RefreshCw className="w-4 h-4" />
            Sincronizar
          </button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard label="Gasto total" value={fmtBRL(totalSpend)} icon={DollarSign} color="amber" />
          <MetricCard label="Impressões" value={fmt(totalImpressions)} icon={Eye} color="slate" />
          <MetricCard label="CTR médio" value={`${avgCtr.toFixed(2)}%`} icon={MousePointer} color="indigo" />
          <MetricCard label="CPL médio" value={fmtBRL(avgCpl)} icon={TrendingUp} color="emerald" />
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
              <p className="text-slate-400">Nenhum anúncio encontrado. Sincronize para buscar do Meta.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {ads.map(ad => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
