import AppShell from '@/components/layout/AppShell'
import { AlertCircle } from 'lucide-react'

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="px-8 py-7">
        <h1 className="text-2xl font-bold text-white mb-6">Configurações</h1>

        <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-5 flex gap-3 max-w-2xl mb-6">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-400">Meta Developer App não configurado</p>
            <p className="text-sm text-zinc-400 mt-1">
              Para conectar contas via OAuth, crie um app em{' '}
              <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:underline">
                developers.facebook.com
              </a>{' '}
              e preencha as variáveis <code className="bg-zinc-800 px-1 rounded text-xs">META_APP_ID</code> e{' '}
              <code className="bg-zinc-800 px-1 rounded text-xs">META_APP_SECRET</code> no Vercel.
            </p>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 max-w-2xl">
          <h2 className="font-bold text-white mb-4">Variáveis de ambiente</h2>
          <div className="space-y-2 font-mono text-sm">
            {[
              ['NEXT_PUBLIC_SUPABASE_URL', 'URL do projeto Supabase', true],
              ['NEXT_PUBLIC_SUPABASE_ANON_KEY', 'Chave anon do Supabase', true],
              ['META_APP_ID', 'App ID do Meta Developer', false],
              ['META_APP_SECRET', 'App Secret do Meta Developer', false],
              ['NEXT_PUBLIC_APP_URL', 'URL da aplicação (Vercel)', true],
            ].map(([key, desc, configured]) => (
              <div key={key as string} className="flex items-center gap-3 p-2.5 bg-zinc-800 rounded-lg">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${configured ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
                <code className="text-red-400 font-medium w-64 flex-shrink-0 text-xs">{key}</code>
                <span className="text-zinc-500 text-xs font-sans">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
