import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('competitors')
    .select('*, competitor_ads(count)')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const withCount = (data ?? []).map((c: Record<string, unknown>) => ({
    ...c,
    _ads_count: (c.competitor_ads as { count: number }[])?.[0]?.count ?? 0,
    competitor_ads: undefined,
  }))

  return NextResponse.json(withCount)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { name, facebook_page_id, industry, website } = body

  if (!name) return NextResponse.json({ error: 'Nome obrigatório' }, { status: 400 })

  const { data, error } = await supabase
    .from('competitors')
    .insert({ name, facebook_page_id: facebook_page_id || null, industry: industry || null, website: website || null })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
