'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, Check, Users, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Squad, BU } from '@/types'

export default function WorkspacePage() {
  const router = useRouter()
  const [squads, setSquads] = useState<Squad[]>([])
  const [myBuIds, setMyBuIds] = useState<string[]>([])
  const [selectedSquad, setSelectedSquad] = useState<Squad | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/workspaces').then(r => r.json()),
      fetch('/api/workspaces/my-bus').then(r => r.json()),
    ]).then(([squadsData, myBusData]) => {
      setSquads(squadsData)
      setMyBuIds((myBusData as { bu_id: string }[]).map(b => b.bu_id))
      setLoading(false)
    })
  }, [])

  async function toggleBU(bu: BU) {
    setSaving(bu.id)
    const isMember = myBuIds.includes(bu.id)
    await fetch('/api/workspaces/join', {
      method: isMember ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bu_id: bu.id }),
    })
    setMyBuIds(prev => isMember ? prev.filter(id => id !== bu.id) : [...prev, bu.id])
    setSaving(null)
  }

  function enterBU(buId: string) {
    localStorage.setItem('active_bu_id', buId)
    router.push('/dashboard')
    router.refresh()
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src="/logo.png" alt="V4" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Selecionar Workspace</h1>
              <p className="text-zinc-500 text-sm">Escolha a Squad e entre na sua BU</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-zinc-500 hover:text-white text-sm transition-colors">
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>

        {!selectedSquad ? (
          /* Squad selection */
          <div>
            <p className="text-zinc-400 text-sm mb-4">Selecione sua Squad:</p>
            <div className="space-y-2">
              {squads.map(squad => (
                <button
                  key={squad.id}
                  onClick={() => setSelectedSquad(squad)}
                  className="w-full bg-zinc-900 border border-zinc-800 hover:border-red-500/30 hover:bg-red-500/5 rounded-xl p-4 flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-red-400" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-white">Squad {squad.name}</p>
                      <p className="text-zinc-500 text-xs">{(squad.bus as BU[] | undefined)?.length ?? 0} BUs</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-red-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* BU selection */
          <div>
            <button
              onClick={() => setSelectedSquad(null)}
              className="flex items-center gap-1.5 text-zinc-500 hover:text-white text-sm mb-4 transition-colors"
            >
              ← Squad {selectedSquad.name}
            </button>
            <p className="text-zinc-400 text-sm mb-4">Selecione as BUs que você faz parte:</p>
            <div className="space-y-2">
              {((selectedSquad.bus ?? []) as BU[]).map((bu: BU) => {
                const isMember = myBuIds.includes(bu.id)
                return (
                  <div key={bu.id} className={`bg-zinc-900 border rounded-xl p-4 flex items-center justify-between transition-all ${isMember ? 'border-red-500/30 bg-red-500/5' : 'border-zinc-800'}`}>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleBU(bu)}
                        disabled={saving === bu.id}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${isMember ? 'bg-red-500 border-red-500' : 'border-zinc-600 hover:border-red-400'}`}
                      >
                        {isMember && <Check className="w-3 h-3 text-white" />}
                      </button>
                      <p className="font-semibold text-white">{bu.name}</p>
                    </div>
                    {isMember && (
                      <button
                        onClick={() => enterBU(bu.id)}
                        className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        Entrar →
                      </button>
                    )}
                  </div>
                )
              })}
            </div>

            {myBuIds.length > 0 && (
              <p className="text-zinc-600 text-xs text-center mt-4">
                Clique em <span className="text-white">Entrar →</span> para acessar a BU
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
