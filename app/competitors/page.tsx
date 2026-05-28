'use client'

import { useState, useEffect } from 'react'
import AppShell from '@/components/layout/AppShell'
import AddCompetitorModal from '@/components/competitors/AddCompetitorModal'
import { Plus, ArrowRight, Eye, RefreshCw, Globe } from 'lucide-react'
import { mockCompetitors } from '@/lib/mock-data'
import type { Competitor } from '@/types'
import Link from 'next/link'

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = useState<Competitor[]>(mockCompetitors)
  const [showModal, setShowModal] = useState(false)

  async function loadCompetitors() {
    try {
      const res = await fetch('/api/competitors')
      if (res.ok) { const data = await res.json(); if (data.length > 0) setCompetitors(data) }
    } catch {}
  }

  useEffect(() => { loadCompetitors() }, [])

  return (
    <AppShell>
      <div className="px-8 py-7">
        <div className="flex items-center justify-between mb-7">
          <div>
            <h1 className="text-2xl font-bold text-white">Concorrentes</h1>
            <p className="text-zinc-500 text-sm mt-1">Monitore anúncios dos concorrentes em tempo real</p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-bold transition-colors">
            <Plus className="w-4 h-4" /> Adicionar Concorrente
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {competitors.map(comp => (
            <Link key={comp.id} href={`/competitors/${comp.id}`}
              className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 hover:border-zinc-700 hover:shadow-lg hover:shadow-black/20 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-white font-bold text-lg">
                    {comp.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-white">{comp.name}</p>
                    {comp.industry && <p className="text-xs text-zinc-500">{comp.industry}</p>}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-red-400 transition-colors" />
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-zinc-500">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{comp._ads_count ?? 0} anúncios ativos</span>
                </div>
                {comp.website && (
                  <a href={comp.website} target="_blank" rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="flex items-center gap-1 text-zinc-600 hover:text-red-400 transition-colors">
                    <Globe className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-zinc-600">
                  Desde {new Date(comp.created_at).toLocaleDateString('pt-BR')}
                </span>
                <button onClick={e => e.preventDefault()} className="text-zinc-600 hover:text-red-400 transition-colors">
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </Link>
          ))}

          <button onClick={() => setShowModal(true)}
            className="bg-zinc-900 rounded-xl border-2 border-dashed border-zinc-800 p-5 hover:border-red-500/30 hover:bg-red-500/5 transition-all flex flex-col items-center justify-center gap-2 min-h-[160px]">
            <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center">
              <Plus className="w-5 h-5 text-zinc-500" />
            </div>
            <p className="text-sm text-zinc-500">Adicionar concorrente</p>
          </button>
        </div>
      </div>

      {showModal && <AddCompetitorModal onClose={() => setShowModal(false)} onSaved={() => { setShowModal(false); loadCompetitors() }} />}
    </AppShell>
  )
}
