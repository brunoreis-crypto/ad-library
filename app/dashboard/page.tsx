import AppShell from '@/components/layout/AppShell'
import MetricCard from '@/components/ui/MetricCard'
import AdCard from '@/components/ads/AdCard'
import SpendChart from '@/components/dashboard/SpendChart'
import { mockMetrics, mockAds, mockSpendChart, mockClients } from '@/lib/mock-data'
import { DollarSign, Eye, MousePointer, Target, Users, TrendingUp } from 'lucide-react'
import Link from 'next/link'

function fmtBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })
}

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString('pt-BR')
}

export default function DashboardPage() {
  const m = mockMetrics
  const topAds = [...mockAds].sort((a, b) => (a.cpl ?? 99999) - (b.cpl ?? 99999)).slice(0, 4)
  const clientNames = mockClients.map(c => c.name)

  return (
    <AppShell>
      <div className="px-8 py-7">
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-1">Visão geral de todos os clientes ativos</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
          <MetricCard label="Clientes ativos" value={String(m.active_clients)} icon={Users} color="red" />
          <MetricCard label="Anúncios ativos" value={String(m.active_ads)} icon={Target} color="emerald" />
          <MetricCard label="Gasto total" value={fmtBRL(m.total_spend)} icon={DollarSign} color="amber" />
          <MetricCard label="Impressões" value={fmt(m.total_impressions)} icon={Eye} color="zinc" />
          <MetricCard label="CTR médio" value={`${m.avg_ctr.toFixed(2)}%`} icon={MousePointer} color="red" />
          <MetricCard label="CPL médio" value={fmtBRL(m.avg_cpl)} icon={TrendingUp} color="emerald" />
        </div>

        <div className="mb-6">
          <SpendChart data={mockSpendChart} clients={clientNames} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white">Top anúncios por CPL</h2>
            <Link href="/clients" className="text-red-400 text-sm hover:text-red-300 transition-colors">Ver todos →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topAds.map(ad => <AdCard key={ad.id} ad={ad} showClient />)}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
