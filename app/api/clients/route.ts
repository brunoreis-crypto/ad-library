import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('clients')
    .select('*, ad_snapshots(spend, status)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const body = await req.json()
  const { name, meta_account_id, color } = body
  if (!name) return NextResponse.json({ error: 'Nome obrigatório' }, { status: 400 })

  const { data, error } = await supabase
    .from('clients')
    .insert({ name, meta_account_id: meta_account_id || null, color: color || '#EF4444' })
    .select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
