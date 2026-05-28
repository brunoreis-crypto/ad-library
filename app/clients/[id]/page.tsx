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

  if (!client) return <AppShell><div className="px-8 py-7"><p className="text-zinc-500">Cliente não encontrado.</p></div></AppShell>

  const totalSpend = ads.reduce((s, a) => s + a.spend, 0)
  const totalImpressions = ads.reduce((s, a) => s + a.impressions, 0)
  const avgCtr = ads.length ? ads.reduce((s, a) => s + a.ctr, 0) / ads.length : 0
  const avgCpl = ads.length ? ads.reduce((s, a) => s + (a.cpl ?? 0), 0) / ads.length : 0

  return (
    <AppShell>
      <div className="px-8 py-7">
        <div className="flex items-center gap-4 mb-7">
          <Link href="/clients" className="text-zinc-500 hover:text-white transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: client.color }}>{client.name.charAt(0)}</div>
            <div>
              <h1 className="text-xl font-bold text-white">{client.name}</h1>
              {client.meta_account_id && <p className="text-xs text-zinc-500">Meta Account ID: {client.meta_account_id}</p>}
            </div>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-zinc-700 text-zinc-300 rounded-lg text-sm hover:bg-zinc-800 hover:text-white transition-colors">
            <RefreshCw className="w-4 h-4" /> Sincronizar
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7">
          <MetricCard label="Gasto total" value={fmtBRL(totalSpend)} icon={DollarSign} color="amber" />
          <MetricCard label="Impressões" value={fmt(totalImpressions)} icon={Eye} color="zinc" />
          <MetricCard label="CTR médio" value={`${avgCtr.toFixed(2)}%`} icon={MousePointer} color="red" />
          <MetricCard label="CPL médio" value={fmtBRL(avgCpl)} icon={TrendingUp} color="emerald" />
        </div>

        <div>
          <h2 className="font-bold text-white mb-4">
            Anúncios ativos <span className="text-zinc-500 font-normal text-sm">({ads.length})</span>
          </h2>
          {ads.length === 0 ? (
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-12 text-center">
              <p className="text-zinc-500">Nenhum anúncio encontrado. Sincronize para buscar do Meta.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {ads.map(ad => <AdCard key={ad.id} ad={ad} />)}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
