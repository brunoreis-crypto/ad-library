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
      if (res.ok) {
        const data = await res.json()
        if (data.length > 0) setCompetitors(data)
      }
    } catch {}
  }

  useEffect(() => { loadCompetitors() }, [])

  return (
    <AppShell>
      <div className="px-8 py-7">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Concorrentes</h1>
            <p className="text-slate-500 text-sm mt-1">Monitore anúncios dos seus concorrentes em tempo real</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adicionar Concorrente
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {competitors.map(comp => (
            <Link
              key={comp.id}
              href={`/competitors/${comp.id}`}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-lg">
                    {comp.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{comp.name}</p>
                    {comp.industry && <p className="text-xs text-slate-400">{comp.industry}</p>}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{comp._ads_count ?? 0} anúncios ativos</span>
                </div>
                {comp.website && (
                  <a
                    href={comp.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="flex items-center gap-1 text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Adicionado em {new Date(comp.created_at).toLocaleDateString('pt-BR')}
                </span>
                <button
                  onClick={e => { e.preventDefault(); alert('Sincronizando...') }}
                  className="text-slate-400 hover:text-indigo-600 transition-colors"
                  title="Sincronizar"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </Link>
          ))}

          {/* Add placeholder */}
          <button
            onClick={() => setShowModal(true)}
            className="bg-white rounded-xl border-2 border-dashed border-slate-200 p-5 hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors flex flex-col items-center justify-center gap-2 min-h-[160px]"
          >
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
              <Plus className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-sm text-slate-500">Adicionar concorrente</p>
          </button>
        </div>
      </div>

      {showModal && (
        <AddCompetitorModal
          onClose={() => setShowModal(false)}
          onSaved={() => { setShowModal(false); loadCompetitors() }}
        />
      )}
    </AppShell>
  )
}
