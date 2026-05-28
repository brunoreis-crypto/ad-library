import AppShell from '@/components/layout/AppShell'
import { AlertCircle } from 'lucide-react'

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="px-8 py-7">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Configurações</h1>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-3 max-w-2xl">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800">Meta Developer App não configurado</p>
            <p className="text-sm text-amber-700 mt-1">
              Para conectar as contas via OAuth, você precisa criar um app em{' '}
              <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="underline">
                developers.facebook.com
              </a>{' '}
              e preencher as variáveis de ambiente <code className="bg-amber-100 px-1 rounded">META_APP_ID</code> e{' '}
              <code className="bg-amber-100 px-1 rounded">META_APP_SECRET</code>.
            </p>
            <p className="text-sm text-amber-700 mt-2">
              Por enquanto, adicione os clientes com o <strong>Access Token manual</strong> (obtido no Graph Explorer).
            </p>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-xl border border-slate-200 p-6 max-w-2xl">
          <h2 className="font-semibold text-slate-800 mb-4">Variáveis de ambiente necessárias</h2>
          <div className="space-y-2 font-mono text-sm">
            {[
              ['NEXT_PUBLIC_SUPABASE_URL', 'URL do projeto Supabase'],
              ['NEXT_PUBLIC_SUPABASE_ANON_KEY', 'Chave anon do Supabase'],
              ['META_APP_ID', 'App ID do Meta Developer'],
              ['META_APP_SECRET', 'App Secret do Meta Developer'],
              ['NEXT_PUBLIC_APP_URL', 'URL da aplicação (Vercel)'],
            ].map(([key, desc]) => (
              <div key={key} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-lg">
                <code className="text-indigo-700 font-medium w-64 flex-shrink-0">{key}</code>
                <span className="text-slate-500 text-xs font-sans">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
