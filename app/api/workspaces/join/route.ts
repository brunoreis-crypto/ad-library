import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { bu_id } = await req.json()
  if (!bu_id) return NextResponse.json({ error: 'bu_id obrigatório' }, { status: 400 })

  const { error } = await supabase
    .from('user_bus')
    .upsert({ user_id: user.id, bu_id }, { onConflict: 'user_id,bu_id' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { bu_id } = await req.json()
  const { error } = await supabase
    .from('user_bus')
    .delete()
    .eq('user_id', user.id)
    .eq('bu_id', bu_id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
