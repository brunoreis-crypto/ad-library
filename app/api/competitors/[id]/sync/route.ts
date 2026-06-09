import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const APIFY_ACTOR = 'XtaWFhbtfxyzqrFmd' // curious_coder/facebook-ads-library-scraper

// POST — inicia o job no Apify e retorna runId imediatamente
export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const token = process.env.APIFY_API_TOKEN
  if (!token) return NextResponse.json({ error: 'APIFY_API_TOKEN não configurado' }, { status: 500 })

  const { data: competitor } = await supabase
    .from('competitors').select('*').eq('id', params.id).single()
  if (!competitor) return NextResponse.json({ error: 'Concorrente não encontrado' }, { status: 404 })

  const searchUrl = competitor.facebook_page_id
    ? `https://www.facebook.com/${competitor.facebook_page_id}`
    : `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&media_type=all&q=${encodeURIComponent(competitor.name)}&search_type=keyword_unordered`

  const res = await fetch(`https://api.apify.com/v2/acts/${APIFY_ACTOR}/runs?token=${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ urls: [{ url: searchUrl }], totalRecords: 50 }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    return NextResponse.json({ error: (err as { error?: { message?: string } }).error?.message ?? 'Erro ao iniciar Apify' }, { status: 500 })
  }

  const { data: run } = await res.json() as { data: { id: string; defaultDatasetId: string } }
  return NextResponse.json({ runId: run.id, datasetId: run.defaultDatasetId })
}

// GET — checa status e salva resultados quando pronto
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const token = process.env.APIFY_API_TOKEN
  if (!token) return NextResponse.json({ error: 'APIFY_API_TOKEN não configurado' }, { status: 500 })

  const { searchParams } = new URL(req.url)
  const runId = searchParams.get('runId')
  const datasetId = searchParams.get('datasetId')
  if (!runId || !datasetId) return NextResponse.json({ error: 'runId e datasetId obrigatórios' }, { status: 400 })

  const statusRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${token}`)
  const { data: run } = await statusRes.json() as { data: { status: string } }

  if (run.status === 'RUNNING' || run.status === 'READY') {
    return NextResponse.json({ status: 'running' })
  }
  if (run.status === 'FAILED' || run.status === 'ABORTED') {
    return NextResponse.json({ status: 'failed', error: 'Apify run falhou' })
  }

  // SUCCEEDED — busca e salva os resultados
  const resultsRes = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}&limit=50`)
  const ads: Record<string, unknown>[] = await resultsRes.json()

  const rows = ads
    .filter(ad => ad.ad_archive_id && ad.is_active)
    .map(ad => {
      const snapshot = ad.snapshot as Record<string, unknown> | undefined
      const body = snapshot?.body as Record<string, unknown> | undefined
      const images = snapshot?.images as Record<string, unknown>[] | undefined
      return {
        competitor_id: params.id,
        ad_archive_id: String(ad.ad_archive_id),
        creative_body: (body?.text as string) ?? null,
        creative_link_caption: (snapshot?.title as string) ?? null,
        ad_snapshot_url: (ad.ad_library_url as string) ?? null,
        thumbnail_url: (images?.[0]?.resized_image_url as string) ?? null,
        status: 'ACTIVE',
        impressions_lower: null,
        impressions_upper: null,
        spend_lower: null,
        spend_upper: null,
        started_at: ad.start_date ? new Date((ad.start_date as number) * 1000).toISOString().split('T')[0] : null,
        last_seen_at: ad.end_date
          ? new Date((ad.end_date as number) * 1000).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        platforms: (ad.publisher_platform as string[]) ?? [],
        last_synced_at: new Date().toISOString(),
      }
    })

  if (rows.length > 0) {
    await supabase.from('competitor_ads').upsert(rows, { onConflict: 'ad_archive_id' })
  }

  return NextResponse.json({ status: 'done', synced: rows.length })
}
