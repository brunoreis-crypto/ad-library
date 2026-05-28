'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { SpendChartPoint } from '@/types'

interface Props { data: SpendChartPoint[]; clients: string[] }

const COLORS = ['#EF4444', '#F97316', '#FBBF24', '#34D399', '#60A5FA', '#A78BFA']

function fmtBRL(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-zinc-400 text-xs mb-1.5 font-medium">{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-zinc-300">{p.name}:</span>
          <span className="text-white font-bold">{fmtBRL(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function SpendChart({ data, clients }: Props) {
  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
      <h3 className="font-bold text-white mb-4">Gasto por cliente — últimos 7 dias</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#71717A' }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#71717A' }} tickLine={false} axisLine={false} tickFormatter={v => `R$${v}`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: '#A1A1AA' }} />
          {clients.map((client, i) => (
            <Line key={client} type="monotone" dataKey={client} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
