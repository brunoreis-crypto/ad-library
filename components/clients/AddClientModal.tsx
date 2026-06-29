'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface Props { onClose: () => void; onSaved: () => void }

const COLORS = ['#EF4444', '#F97316', '#FBBF24', '#34D399', '#60A5FA', '#A78BFA', '#EC4899', '#14B8A6']

export default function AddClientModal({ onClose, onSaved }: Props) {
  const [name, setName] = useState('')
  const [accountId, setAccountId] = useState('')
  const [color, setColor] = useState(COLORS[0])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setError('Nome é obrigatório'); return }
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), meta_account_id: accountId.trim(), color }),
      })
      if (!res.ok) throw new Error()
      onSaved()
    } catch {
      setError('Não foi possível salvar. Tente novamente.')
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h2 className="font-bold text-white">Adicionar Cliente</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Nome do cliente *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Natura & Co"
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Cor</label>
            <div className="flex gap-2">
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
                  style={{ backgroundColor: c, borderColor: color === c ? '#fff' : 'transparent' }} />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Meta Ad Account ID</label>
            <input value={accountId} onChange={e => setAccountId(e.target.value)} placeholder="Ex: act_123456789"
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors" />
            <p className="text-xs text-zinc-600 mt-1">Business Manager → Contas de Anúncio</p>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 border border-zinc-700 text-zinc-300 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-bold transition-colors disabled:opacity-50">
              {saving ? 'Salvando...' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
