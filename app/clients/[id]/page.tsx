'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import AdCard from '@/components/ads/AdCard'
import { ArrowLeft, RefreshCw, DollarSign, Eye, MousePointer, TrendingUp, Loader2 } from 'lucide-react'
import Link from 'next/link'
import type { Client, Ad } from '@/types'

function fmtBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })
}
function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString('pt-BR')
}

function MetricCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: React.ElementType; color: string }) {
  const colorMap: Record<string, string> = {
    amber: 'text-amber-400 bg-amber-500/10',
    red: 'text-red-400 bg-red-500/10',
    emerald: 'text-emerald-400 bg-emerald-500/10',
    zinc: 'text-zinc-400 bg-zinc-500/10',
  }
  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${colorMap[color]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
    </div>
  )
}

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [client, setClient] = useState<Client | null>(null)
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [syncMsg, setSyncMsg] = useState<string | null>(null)

  async function loadData() {
    const [clientRes, adsRes] = await Promise.all([
      fetch(`/api/clients/${id}`),
      fetch(`/api/clients/${id}/ads`),
    ])
    if (clientRes.ok) setClient(await clientRes.json())
    if (adsRes.ok) setAds(await adsRes.json())
    setLoading(false)
  }

  useEffect(() => { loadData() }, [id])

  async function handleSync() {
    setSyncing(true)
    setSyncMsg('Sincronizando com Meta Ads...')
    try {
      const res = await fetch(`/api/clients/${id}/sync`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        setSyncMsg(`Erro: ${data.error}`)
      } else {
        setSyncMsg(`${data.synced} anúncios sincronizados`)
        await loadData()
      }
    } catch {
      setSyncMsg('Erro ao conectar')
    } finally {
      setSyncing(false)
    }
  }

  if (loading) return (
    <AppShell>
      <div className="px-8 py-7 flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-red-500 animate-spin" />
      </div>
    </AppShell>
  )

  if (!client) return (
    <AppShell>
      <div className="px-8 py-7">
        <p className="text-zinc-500">Cliente não encontrado.</p>
      </div>
    </AppShell>
  )

  const totalSpend = ads.reduce((s, a) => s + (a.spend || 0), 0)
  const totalImpressions = ads.reduce((s, a) => s + (a.impressions || 0), 0)
  const avgCtr = ads.length ? ads.reduce((s, a) => s + (a.ctr || 0), 0) / ads.length : 0
  const avgCpl = ads.filter(a => a.cpl).length
    ? ads.reduce((s, a) => s + (a.cpl ?? 0), 0) / ads.filter(a => a.cpl).length
    : 0

  return (
    <AppShell>
      <div className="px-8 py-7">
        <div className="flex items-center gap-4 mb-7">
          <Link href="/clients" className="text-zinc-500 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: client.color }}>{client.name.charAt(0)}</div>
            <div>
              <h1 className="text-xl font-bold text-white">{client.name}</h1>
              {client.meta_account_id && <p className="text-xs text-zinc-500">{client.meta_account_id}</p>}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <button
              onClick={handleSync}
              disabled={syncing || !client.meta_account_id}
              className="flex items-center gap-2 px-3 py-2 border border-zinc-700 text-zinc-300 rounded-lg text-sm hover:bg-zinc-800 hover:text-white transition-colors disabled:opacity-50"
            >
              {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              {syncing ? 'Sincronizando...' : 'Sincronizar'}
            </button>
            {syncMsg && (
              <span className={`text-xs ${syncMsg.startsWith('Erro') ? 'text-red-400' : 'text-green-400'}`}>
                {syncMsg}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7">
          <MetricCard label="Gasto total" value={fmtBRL(totalSpend)} icon={DollarSign} color="amber" />
          <MetricCard label="Impressões" value={fmt(totalImpressions)} icon={Eye} color="zinc" />
          <MetricCard label="CTR médio" value={`${avgCtr.toFixed(2)}%`} icon={MousePointer} color="red" />
          <MetricCard label="CPL médio" value={avgCpl ? fmtBRL(avgCpl) : '—'} icon={TrendingUp} color="emerald" />
        </div>

        <div>
          <h2 className="font-bold text-white mb-4">
            Anúncios <span className="text-zinc-500 font-normal text-sm">({ads.length})</span>
          </h2>
          {ads.length === 0 ? (
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-12 text-center">
              <p className="text-zinc-500 mb-3">Nenhum anúncio ainda.</p>
              {client.meta_account_id ? (
                <button onClick={handleSync} disabled={syncing}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-bold transition-colors disabled:opacity-50">
                  {syncing ? 'Buscando...' : 'Buscar do Meta Ads'}
                </button>
              ) : (
                <p className="text-xs text-zinc-600">Adicione o Meta Account ID para sincronizar.</p>
              )}
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
