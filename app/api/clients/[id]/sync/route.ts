import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { fetchAdsByAccount } from '@/lib/meta-api'

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const token = process.env.META_SYSTEM_TOKEN
  if (!token) return NextResponse.json({ error: 'META_SYSTEM_TOKEN não configurado' }, { status: 500 })

  const { data: client } = await supabase.from('clients').select('*').eq('id', params.id).single()
  if (!client) return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 })
  if (!client.meta_account_id) return NextResponse.json({ error: 'Meta Account ID não configurado para este cliente' }, { status: 400 })

  try {
    const apiData = await fetchAdsByAccount(client.meta_account_id, token)
    const ads: Record<string, unknown>[] = apiData.data ?? []

    const rows = ads.map(ad => {
      const insights = (ad.insights as { data?: Record<string, unknown>[] } | undefined)?.data?.[0] ?? {}
      const creative = ad.creative as Record<string, unknown> | undefined
      const campaign = ad.campaign as Record<string, unknown> | undefined
      const adset = ad.adset as Record<string, unknown> | undefined
      return {
        client_id: client.id,
        ad_id: ad.id as string,
        ad_name: (ad.name as string) || '',
        campaign_name: (campaign?.name as string) || '',
        adset_name: (adset?.name as string) || '',
        status: (ad.effective_status as string) || 'ACTIVE',
        spend: parseFloat((insights.spend as string) || '0'),
        impressions: parseInt((insights.impressions as string) || '0', 10),
        clicks: parseInt((insights.clicks as string) || '0', 10),
        ctr: parseFloat((insights.ctr as string) || '0'),
        cpm: insights.cpm ? parseFloat(insights.cpm as string) : null,
        cpl: insights.cpl ? parseFloat(insights.cpl as string) : null,
        cpc: insights.cpc ? parseFloat(insights.cpc as string) : null,
        reach: insights.reach ? parseInt(insights.reach as string, 10) : null,
        thumbnail_url: (creative?.thumbnail_url as string) || null,
        creative_body: (creative?.body as string) || null,
        platform: 'meta',
        last_synced_at: new Date().toISOString(),
      }
    })

    if (rows.length > 0) {
      await supabase.from('ad_snapshots').upsert(rows, { onConflict: 'ad_id' })
    }

    return NextResponse.json({ synced: rows.length })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
