import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { searchAdLibrary } from '@/lib/meta-api'

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { data: competitor, error: compErr } = await supabase
    .from('competitors')
    .select('*')
    .eq('id', params.id)
    .single()

  if (compErr || !competitor) return NextResponse.json({ error: 'Concorrente não encontrado' }, { status: 404 })

  const accessToken = process.env.META_ACCESS_TOKEN
  if (!accessToken) return NextResponse.json({ error: 'META_ACCESS_TOKEN não configurado' }, { status: 500 })

  const query = competitor.facebook_page_id || competitor.name
  const byPageId = !!competitor.facebook_page_id

  try {
    const apiData = await searchAdLibrary(query, accessToken, byPageId)
    const ads = apiData.data ?? []

    const rows = ads.map((ad: Record<string, unknown>) => {
      const imp = ad.impressions as Record<string, unknown> | undefined
      const spend = ad.spend as Record<string, unknown> | undefined
      return {
        competitor_id: competitor.id,
        ad_archive_id: ad.id as string,
        creative_body: ((ad.ad_creative_bodies as string[]) ?? [])[0] ?? null,
        creative_link_caption: ((ad.ad_creative_link_captions as string[]) ?? [])[0] ?? null,
        ad_snapshot_url: (ad.ad_snapshot_url as string) ?? null,
        status: 'ACTIVE',
        impressions_lower: imp?.lower_bound ? parseInt(imp.lower_bound as string, 10) : null,
        impressions_upper: imp?.upper_bound ? parseInt(imp.upper_bound as string, 10) : null,
        spend_lower: spend?.lower_bound ? parseFloat(spend.lower_bound as string) : null,
        spend_upper: spend?.upper_bound ? parseFloat(spend.upper_bound as string) : null,
        started_at: (ad.ad_delivery_start_time as string) ?? null,
        last_seen_at: (ad.ad_delivery_stop_time as string) ?? new Date().toISOString().split('T')[0],
        platforms: (ad.publisher_platforms as string[]) ?? [],
        last_synced_at: new Date().toISOString(),
      }
    })

    if (rows.length > 0) {
      await supabase.from('competitor_ads').upsert(rows, { onConflict: 'ad_archive_id' })
    }

    return NextResponse.json({ synced: rows.length })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
