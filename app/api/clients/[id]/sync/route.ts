import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { fetchAdsByAccount } from '@/lib/meta-api'

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const { data: client, error: clientErr } = await supabase
    .from('clients')
    .select('*')
    .eq('id', params.id)
    .single()

  if (clientErr || !client) return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 })
  if (!client.meta_account_id || !client.meta_access_token)
    return NextResponse.json({ error: 'Meta Ads não configurado para este cliente' }, { status: 400 })

  try {
    const apiData = await fetchAdsByAccount(client.meta_account_id, client.meta_access_token)
    const ads = apiData.data ?? []

    const rows = ads.map((ad: Record<string, unknown>) => {
      const insights = (ad.insights as { data?: Record<string, unknown>[] } | undefined)?.data?.[0] ?? {}
      return {
        client_id: client.id,
        ad_id: ad.id as string,
        ad_name: (ad.name as string) || '',
        campaign_name: ((ad.campaign as Record<string, unknown> | undefined)?.name as string) || '',
        adset_name: ((ad.adset as Record<string, unknown> | undefined)?.name as string) || '',
        status: (ad.status as string) || 'ACTIVE',
        spend: parseFloat((insights.spend as string) || '0'),
        impressions: parseInt((insights.impressions as string) || '0', 10),
        clicks: parseInt((insights.clicks as string) || '0', 10),
        ctr: parseFloat((insights.ctr as string) || '0'),
        cpl: insights.cpl ? parseFloat(insights.cpl as string) : null,
        cpc: insights.cpc ? parseFloat(insights.cpc as string) : null,
        reach: insights.reach ? parseInt(insights.reach as string, 10) : null,
        thumbnail_url: ((ad.creative as Record<string, unknown> | undefined)?.thumbnail_url as string) || null,
        creative_body: ((ad.creative as Record<string, unknown> | undefined)?.body as string) || null,
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
