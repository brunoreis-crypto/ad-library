'use client'

import { useState, useEffect } from 'react'
import AppShell from '@/components/layout/AppShell'
import AddClientModal from '@/components/clients/AddClientModal'
import { Plus, RefreshCw, ArrowRight, Target } from 'lucide-react'
import { mockClients, mockAds } from '@/lib/mock-data'
import type { Client } from '@/types'
import Link from 'next/link'

function fmtBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [showModal, setShowModal] = useState(false)

  async function loadClients() {
    try {
      const res = await fetch('/api/clients')
      if (res.ok) {
        const data = await res.json()
        if (data.length > 0) setClients(data)
      }
    } catch {}
  }

  useEffect(() => { loadClients() }, [])

  function getClientStats(clientId: string) {
    const ads = mockAds.filter(a => a.client_id === clientId)
    return {
      activeAds: ads.filter(a => a.status === 'ACTIVE').length,
      totalSpend: ads.reduce((s, a) => s + a.spend, 0),
      avgCpl: ads.length ? ads.reduce((s, a) => s + (a.cpl ?? 0), 0) / ads.length : 0,
    }
  }

  return (
    <AppShell>
      <div className="px-8 py-7">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Clientes</h1>
            <p className="text-slate-500 text-sm mt-1">{clients.length} cliente{clients.length !== 1 ? 's' : ''} cadastrado{clients.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Adicionar Cliente
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map(client => {
            const stats = getClientStats(client.id)
            return (
              <Link
                key={client.id}
                href={`/clients/${client.id}`}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: client.color }}
                    >
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{client.name}</p>
                      {client.meta_account_id && (
                        <p className="text-xs text-slate-400">ID: {client.meta_account_id}</p>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-50 rounded-lg p-2">
                    <div className="flex items-center justify-center mb-0.5">
                      <Target className="w-3 h-3 text-indigo-500" />
                    </div>
                    <p className="text-lg font-bold text-slate-800">{stats.activeAds}</p>
                    <p className="text-xs text-slate-400">ads ativos</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2">
                    <p className="text-xs text-slate-400 mb-0.5">Gasto</p>
                    <p className="text-sm font-bold text-slate-800">{fmtBRL(stats.totalSpend)}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2">
                    <p className="text-xs text-slate-400 mb-0.5">CPL médio</p>
                    <p className="text-sm font-bold text-emerald-600">{fmtBRL(stats.avgCpl)}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs text-slate-500">Conectado ao Meta Ads</span>
                  <button
                    onClick={e => { e.preventDefault(); alert('Sincronizando...') }}
                    className="ml-auto text-slate-400 hover:text-indigo-600 transition-colors"
                    title="Sincronizar"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Link>
            )
          })}

          {/* Add client placeholder */}
          <button
            onClick={() => setShowModal(true)}
            className="bg-white rounded-xl border-2 border-dashed border-slate-200 p-5 hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors flex flex-col items-center justify-center gap-2 min-h-[180px]"
          >
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
              <Plus className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-sm text-slate-500">Adicionar cliente</p>
          </button>
        </div>
      </div>

      {showModal && (
        <AddClientModal
          onClose={() => setShowModal(false)}
          onSaved={() => { setShowModal(false); loadClients() }}
        />
      )}
    </AppShell>
  )
}
