import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

async function searchViaApify(query: string): Promise<ApifyAd[]> {
  const token = process.env.APIFY_API_TOKEN
  if (!token) throw new Error('APIFY_API_TOKEN não configurado')

  const searchUrl = `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&q=${encodeURIComponent(query)}`

  // Start the actor run
  const startRes = await fetch(
    `https://api.apify.com/v2/acts/curious_coder~facebook-ads-library-scraper/runs?token=${token}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        urls: [{ url: searchUrl }],
        totalRecords: 50,
      }),
    }
  )

  if (!startRes.ok) {
    const err = await startRes.json().catch(() => ({}))
    throw new Error((err as { error?: { message?: string } }).error?.message ?? `Apify error: ${startRes.status}`)
  }

  const { data: run } = await startRes.json() as { data: { id: string; defaultDatasetId: string } }

  // Poll until finished (max 90s)
  for (let i = 0; i < 18; i++) {
    await new Promise(r => setTimeout(r, 5000))
    const statusRes = await fetch(`https://api.apify.com/v2/actor-runs/${run.id}?token=${token}`)
    const { data: status } = await statusRes.json() as { data: { status: string } }
    if (status.status === 'SUCCEEDED') break
    if (status.status === 'FAILED' || status.status === 'ABORTED') throw new Error('Apify run falhou')
  }

  // Fetch results
  const resultsRes = await fetch(
    `https://api.apify.com/v2/datasets/${run.defaultDatasetId}/items?token=${token}&limit=50`
  )
  if (!resultsRes.ok) throw new Error('Erro ao buscar resultados do Apify')
  return resultsRes.json() as Promise<ApifyAd[]>
}

interface ApifyAd {
  adArchiveID?: string
  id?: string
  snapshot?: {
    body?: { text?: string }
    cards?: { body?: string }[]
    title?: string
    link_url?: string
  }
  snapshotUrl?: string
  startDate?: number
  endDate?: number
  publisherPlatform?: string[]
  impressionsWithIndex?: { lowerBound?: number; upperBound?: number }
  spend?: { lowerBound?: number; upperBound?: number }
  pageName?: string
}

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

  try {
    const ads = await searchViaApify(competitor.name)

    const rows = ads.map((ad: ApifyAd) => {
      const body = ad.snapshot?.body?.text
        ?? ad.snapshot?.cards?.[0]?.body
        ?? null
      return {
        competitor_id: competitor.id,
        ad_archive_id: String(ad.adArchiveID ?? ad.id ?? Math.random()),
        creative_body: body,
        creative_link_caption: ad.snapshot?.title ?? null,
        ad_snapshot_url: ad.snapshotUrl ?? null,
        status: 'ACTIVE',
        impressions_lower: ad.impressionsWithIndex?.lowerBound ?? null,
        impressions_upper: ad.impressionsWithIndex?.upperBound ?? null,
        spend_lower: ad.spend?.lowerBound ?? null,
        spend_upper: ad.spend?.upperBound ?? null,
        started_at: ad.startDate ? new Date(ad.startDate * 1000).toISOString().split('T')[0] : null,
        last_seen_at: ad.endDate ? new Date(ad.endDate * 1000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        platforms: ad.publisherPlatform ?? [],
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
