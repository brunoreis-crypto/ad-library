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
      if (res.ok) { const data = await res.json(); if (data.length > 0) setClients(data) }
    } catch {}
  }

  useEffect(() => { loadClients() }, [])

  function getStats(clientId: string) {
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
        <div className="flex items-center justify-between mb-7">
          <div>
            <h1 className="text-2xl font-bold text-white">Clientes</h1>
            <p className="text-zinc-500 text-sm mt-1">{clients.length} cliente{clients.length !== 1 ? 's' : ''} cadastrado{clients.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-bold transition-colors">
            <Plus className="w-4 h-4" /> Adicionar Cliente
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map(client => {
            const stats = getStats(client.id)
            return (
              <Link key={client.id} href={`/clients/${client.id}`}
                className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 hover:border-zinc-700 hover:shadow-lg hover:shadow-black/20 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: client.color }}>
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-white">{client.name}</p>
                      {client.meta_account_id && <p className="text-xs text-zinc-500">ID: {client.meta_account_id}</p>}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-red-400 transition-colors" />
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-zinc-800 rounded-lg p-2">
                    <Target className="w-3 h-3 text-red-400 mx-auto mb-0.5" />
                    <p className="text-lg font-bold text-white">{stats.activeAds}</p>
                    <p className="text-xs text-zinc-500">ads ativos</p>
                  </div>
                  <div className="bg-zinc-800 rounded-lg p-2">
                    <p className="text-xs text-zinc-500 mb-0.5">Gasto</p>
                    <p className="text-sm font-bold text-white">{fmtBRL(stats.totalSpend)}</p>
                  </div>
                  <div className="bg-zinc-800 rounded-lg p-2">
                    <p className="text-xs text-zinc-500 mb-0.5">CPL médio</p>
                    <p className="text-sm font-bold text-emerald-400">{fmtBRL(stats.avgCpl)}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs text-zinc-500">Conectado ao Meta Ads</span>
                  <button onClick={e => { e.preventDefault() }}
                    className="ml-auto text-zinc-600 hover:text-red-400 transition-colors">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Link>
            )
          })}

          <button onClick={() => setShowModal(true)}
            className="bg-zinc-900 rounded-xl border-2 border-dashed border-zinc-800 p-5 hover:border-red-500/30 hover:bg-red-500/5 transition-all flex flex-col items-center justify-center gap-2 min-h-[180px]">
            <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center">
              <Plus className="w-5 h-5 text-zinc-500" />
            </div>
            <p className="text-sm text-zinc-500">Adicionar cliente</p>
          </button>
        </div>
      </div>

      {showModal && <AddClientModal onClose={() => setShowModal(false)} onSaved={() => { setShowModal(false); loadClients() }} />}
    </AppShell>
  )
}
