'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface Props { onClose: () => void; onSaved: () => void }

export default function AddCompetitorModal({ onClose, onSaved }: Props) {
  const [name, setName] = useState('')
  const [pageId, setPageId] = useState('')
  const [industry, setIndustry] = useState('')
  const [website, setWebsite] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { setError('Nome é obrigatório'); return }
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/competitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), facebook_page_id: pageId.trim(), industry: industry.trim(), website: website.trim() }),
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
          <h2 className="font-bold text-white">Adicionar Concorrente</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Nome da marca *</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: L'Oréal Brasil"
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">@ do Facebook</label>
            <div className="flex items-center bg-zinc-800 border border-zinc-700 rounded-lg focus-within:border-red-500 transition-colors overflow-hidden">
              <span className="px-3 text-zinc-500 text-sm">facebook.com/</span>
              <input value={pageId} onChange={e => setPageId(e.target.value.replace('@', ''))} placeholder="SephoraBrasil"
                className="flex-1 pr-3 py-2 bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none" />
            </div>
            <p className="text-xs text-zinc-600 mt-1">Opcional — torna a busca mais precisa</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Setor</label>
            <input value={industry} onChange={e => setIndustry(e.target.value)} placeholder="Ex: Beleza & Cosméticos"
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Website</label>
            <input value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://www.exemplo.com.br"
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors" />
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
