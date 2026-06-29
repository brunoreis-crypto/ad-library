import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('ad_snapshots')
    .select('*')
    .eq('client_id', params.id)
    .order('spend', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}
