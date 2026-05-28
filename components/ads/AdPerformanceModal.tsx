'use client'

import { useState } from 'react'
import { X, TrendingUp, DollarSign, MousePointer, Eye } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import type { Ad } from '@/types'
import Badge from '@/components/ui/Badge'

interface Props { ad: Ad; onClose: () => void }

type MetricKey = 'spend' | 'cpl' | 'ctr' | 'impressions'

const METRICS: { key: MetricKey; label: string; icon: React.ElementType; color: string; format: (v: number) => string }[] = [
  { key: 'spend', label: 'Gasto', icon: DollarSign, color: '#F59E0B', format: v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }) },
  { key: 'cpl', label: 'CPL', icon: TrendingUp, color: '#34D399', format: v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }) },
  { key: 'ctr', label: 'CTR', icon: MousePointer, color: '#EF4444', format: v => `${v.toFixed(2)}%` },
  { key: 'impressions', label: 'Impressões', icon: Eye, color: '#60A5FA', format: v => v >= 1000 ? `${(v / 1000).toFixed(1)}K` : String(v) },
]

function generateDailyData(ad: Ad) {
  const days = 14
  const data = []
  const seed = (n: number, variance: number) => Math.max(0, n + (Math.random() - 0.5) * variance * 2)

  const dailySpend = ad.spend / days
  const dailyCpl = ad.cpl ?? 45
  const dailyCtr = ad.ctr
  const dailyImpressions = ad.impressions / days

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const label = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    data.push({
      date: label,
      spend: Math.round(seed(dailySpend, dailySpend * 0.3)),
      cpl: parseFloat(seed(dailyCpl, dailyCpl * 0.25).toFixed(2)),
      ctr: parseFloat(seed(dailyCtr, dailyCtr * 0.3).toFixed(2)),
      impressions: Math.round(seed(dailyImpressions, dailyImpressions * 0.35)),
    })
  }
  return data
}

const CustomTooltip = ({ active, payload, label, format }: { active?: boolean; payload?: { value: number }[]; label?: string; format: (v: number) => string }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-zinc-400 text-xs mb-1">{label}</p>
      <p className="text-white font-bold text-sm">{format(payload[0].value)}</p>
    </div>
  )
}

function fmtBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })
}

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString('pt-BR')
}

export default function AdPerformanceModal({ ad, onClose }: Props) {
  const [activeMetric, setActiveMetric] = useState<MetricKey>('spend')
  const data = generateDailyData(ad)
  const metric = METRICS.find(m => m.key === activeMetric)!

  const avg = data.reduce((s, d) => s + (d[activeMetric] as number), 0) / data.length
  const max = Math.max(...data.map(d => d[activeMetric] as number))
  const min = Math.min(...data.map(d => d[activeMetric] as number))

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge label={ad.status === 'ACTIVE' ? 'Ativo' : 'Pausado'} variant={ad.status === 'ACTIVE' ? 'active' : 'paused'} />
              <Badge label={ad.platform} variant={ad.platform as 'meta' | 'google'} />
            </div>
            <p className="font-bold text-white truncate">{ad.ad_name}</p>
            <p className="text-zinc-500 text-xs mt-0.5 truncate">{ad.campaign_name}</p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors ml-4 flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-4 gap-px bg-zinc-800 border-b border-zinc-800">
          {[
            { label: 'Gasto total', value: fmtBRL(ad.spend) },
            { label: 'CPL', value: ad.cpl ? fmtBRL(ad.cpl) : '—' },
            { label: 'CTR', value: `${ad.ctr.toFixed(2)}%` },
            { label: 'Impressões', value: fmt(ad.impressions) },
          ].map(({ label, value }) => (
            <div key={label} className="bg-zinc-900 px-4 py-3 text-center">
              <p className="text-zinc-500 text-xs">{label}</p>
              <p className="text-white font-bold text-sm mt-0.5">{value}</p>
            </div>
          ))}
        </div>

        {/* Metric selector */}
        <div className="px-6 pt-5">
          <div className="flex gap-2">
            {METRICS.map(m => (
              <button
                key={m.key}
                onClick={() => setActiveMetric(m.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeMetric === m.key
                    ? 'text-white border'
                    : 'text-zinc-500 bg-zinc-800 hover:text-zinc-300'
                }`}
                style={activeMetric === m.key ? { backgroundColor: `${m.color}15`, borderColor: `${m.color}30`, color: m.color } : {}}
              >
                <m.icon className="w-3 h-3" />
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="px-6 pt-4 pb-2">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#71717A' }} tickLine={false} axisLine={false} interval={1} />
              <YAxis tick={{ fontSize: 10, fill: '#71717A' }} tickLine={false} axisLine={false} tickFormatter={v => metric.format(v).replace('R$ ', 'R$')} width={52} />
              <Tooltip content={<CustomTooltip format={metric.format} />} />
              <ReferenceLine y={avg} stroke={metric.color} strokeDasharray="4 4" strokeOpacity={0.4} />
              <Line
                type="monotone"
                dataKey={activeMetric}
                stroke={metric.color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: metric.color }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Min/Avg/Max */}
        <div className="grid grid-cols-3 gap-px bg-zinc-800 border-t border-zinc-800 rounded-b-2xl overflow-hidden">
          {[
            { label: 'Mínimo', value: metric.format(min) },
            { label: 'Média', value: metric.format(avg) },
            { label: 'Máximo', value: metric.format(max) },
          ].map(({ label, value }) => (
            <div key={label} className="bg-zinc-900 px-4 py-3 text-center">
              <p className="text-zinc-500 text-xs">{label}</p>
              <p className="font-bold text-sm mt-0.5" style={{ color: metric.color }}>{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
