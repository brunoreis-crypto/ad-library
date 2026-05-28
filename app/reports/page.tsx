'use client'

import { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import { mockClients, mockAds } from '@/lib/mock-data'
import { Sparkles, TrendingUp, AlertTriangle, XCircle, CheckCircle2, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'
import type { Ad } from '@/types'

interface AdDiagnosis {
  ad_id: string
  status: 'otimo' | 'bom' | 'atencao' | 'critico'
  score: number
  problema_principal: string
  o_que_otimizar: string
  ponto_forte: string
}

const statusConfig = {
  otimo: { label: 'Ótimo', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2, dot: 'bg-emerald-500' },
  bom: { label: 'Bom', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', icon: TrendingUp, dot: 'bg-blue-500' },
  atencao: { label: 'Atenção', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', icon: AlertTriangle, dot: 'bg-amber-500' },
  critico: { label: 'Crítico', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: XCircle, dot: 'bg-red-500' },
}

function fmtBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 })
}

function ScoreBar({ score }: { score: number }) {
  const pct = (score / 10) * 100
  const color = score >= 8 ? '#34D399' : score >= 6 ? '#60A5FA' : score >= 4 ? '#FBBF24' : '#EF4444'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-bold" style={{ color }}>{score}/10</span>
    </div>
  )
}

function AdDiagnosisCard({ ad, diagnosis }: { ad: Ad; diagnosis?: AdDiagnosis }) {
  const [expanded, setExpanded] = useState(false)
  const cfg = diagnosis ? statusConfig[diagnosis.status] : null
  const StatusIcon = cfg?.icon

  return (
    <div className={`bg-zinc-900 rounded-xl border overflow-hidden transition-all ${cfg ? `border-zinc-800 hover:${cfg.bg}` : 'border-zinc-800'}`}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white text-sm truncate">{ad.ad_name}</p>
            <p className="text-zinc-500 text-xs mt-0.5 truncate">{ad.campaign_name}</p>
          </div>
          {cfg && StatusIcon && (
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold flex-shrink-0 ${cfg.bg} ${cfg.color}`}>
              <StatusIcon className="w-3 h-3" />
              {cfg.label}
            </div>
          )}
        </div>

        {diagnosis && <ScoreBar score={diagnosis.score} />}

        <div className="grid grid-cols-3 gap-2 mt-3 text-center">
          <div className="bg-zinc-800 rounded-lg p-2">
            <p className="text-zinc-500 text-xs">CTR</p>
            <p className={`text-sm font-bold ${ad.ctr >= 2 ? 'text-emerald-400' : ad.ctr >= 1.5 ? 'text-white' : 'text-amber-400'}`}>{ad.ctr.toFixed(2)}%</p>
          </div>
          <div className="bg-zinc-800 rounded-lg p-2">
            <p className="text-zinc-500 text-xs">CPL</p>
            <p className="text-sm font-bold text-white">{ad.cpl ? fmtBRL(ad.cpl) : '—'}</p>
          </div>
          <div className="bg-zinc-800 rounded-lg p-2">
            <p className="text-zinc-500 text-xs">ROAS</p>
            <p className={`text-sm font-bold ${(ad.roas ?? 0) >= 4 ? 'text-emerald-400' : 'text-white'}`}>{ad.roas ? `${ad.roas.toFixed(1)}x` : '—'}</p>
          </div>
        </div>

        {diagnosis && (
          <button
            onClick={() => setExpanded(v => !v)}
            className="mt-3 w-full flex items-center justify-between px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-medium text-zinc-300 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-red-400" />
              Ver diagnóstico IA
            </span>
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        )}

        {expanded && diagnosis && (
          <div className="mt-2 space-y-2">
            <div className="p-2.5 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
              <p className="text-xs font-semibold text-emerald-400 mb-0.5">Ponto forte</p>
              <p className="text-xs text-zinc-400">{diagnosis.ponto_forte}</p>
            </div>
            <div className={`p-2.5 border rounded-lg ${statusConfig[diagnosis.status].bg}`}>
              <p className={`text-xs font-semibold mb-0.5 ${statusConfig[diagnosis.status].color}`}>Problema: {diagnosis.problema_principal}</p>
              <p className="text-xs text-zinc-400">{diagnosis.o_que_otimizar}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ReportsPage() {
  const [diagnoses, setDiagnoses] = useState<AdDiagnosis[]>([])
  const [loading, setLoading] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)

  async function runAnalysis() {
    setLoading(true)
    try {
      const res = await fetch('/api/reports/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ads: mockAds }),
      })
      const data = await res.json()
      setDiagnoses(data)
      setAnalyzed(true)
    } finally {
      setLoading(false)
    }
  }

  function getDiagnosis(adId: string) {
    return diagnoses.find(d => d.ad_id === adId)
  }

  const summary = analyzed ? {
    otimo: diagnoses.filter(d => d.status === 'otimo').length,
    bom: diagnoses.filter(d => d.status === 'bom').length,
    atencao: diagnoses.filter(d => d.status === 'atencao').length,
    critico: diagnoses.filter(d => d.status === 'critico').length,
    avgScore: diagnoses.length ? (diagnoses.reduce((s, d) => s + d.score, 0) / diagnoses.length).toFixed(1) : '—',
  } : null

  return (
    <AppShell>
      <div className="px-8 py-7">
        <div className="flex items-start justify-between mb-7">
          <div>
            <h1 className="text-2xl font-bold text-white">Relatório de Performance</h1>
            <p className="text-zinc-500 text-sm mt-1">Diagnóstico IA dos seus anúncios ativos — o que otimizar agora</p>
          </div>
          <button
            onClick={runAnalysis}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? 'Analisando...' : analyzed ? 'Reanalisar' : 'Analisar com IA'}
          </button>
        </div>

        {/* Summary */}
        {summary && (
          <div className="grid grid-cols-5 gap-3 mb-7">
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 text-center">
              <p className="text-2xl font-bold text-white">{summary.avgScore}</p>
              <p className="text-xs text-zinc-500 mt-0.5">Score médio</p>
            </div>
            {(['otimo', 'bom', 'atencao', 'critico'] as const).map(s => (
              <div key={s} className={`rounded-xl border p-4 text-center ${statusConfig[s].bg}`}>
                <p className={`text-2xl font-bold ${statusConfig[s].color}`}>{summary[s]}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{statusConfig[s].label}</p>
              </div>
            ))}
          </div>
        )}

        {!analyzed && !loading && (
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-12 text-center">
            <Sparkles className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <p className="text-white font-bold mb-1">Diagnóstico IA dos seus anúncios</p>
            <p className="text-zinc-500 text-sm mb-4">Clique em "Analisar com IA" para identificar o que está funcionando, o que precisa de atenção e ações específicas de otimização.</p>
            <button onClick={runAnalysis}
              className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-bold transition-colors">
              Analisar agora
            </button>
          </div>
        )}

        {/* Per client */}
        {mockClients.map(client => {
          const clientAds = mockAds.filter((a: Ad) => a.client_id === client.id)
          return (
            <div key={client.id} className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: client.color }}>{client.name.charAt(0)}</div>
                <h2 className="font-bold text-white">{client.name}</h2>
                <span className="text-zinc-500 text-sm">{clientAds.length} anúncios</span>
                {analyzed && (() => {
                  const clientDiag = diagnoses.filter(d => clientAds.some((a: Ad) => a.id === d.ad_id))
                  const avg = clientDiag.length ? clientDiag.reduce((s, d) => s + d.score, 0) / clientDiag.length : 0
                  const status = avg >= 8 ? 'otimo' : avg >= 6 ? 'bom' : avg >= 4 ? 'atencao' : 'critico'
                  const cfg = statusConfig[status]
                  return (
                    <div className={`ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold ${cfg.bg} ${cfg.color}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      Score {avg.toFixed(1)}/10
                    </div>
                  )
                })()}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {clientAds.map((ad: Ad) => (
                  <AdDiagnosisCard key={ad.id} ad={ad} diagnosis={getDiagnosis(ad.id)} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </AppShell>
  )
}
