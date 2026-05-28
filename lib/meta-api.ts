const META_API_VERSION = 'v20.0'
const BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`

const DEFAULT_AD_FIELDS = [
  'id', 'name', 'status', 'campaign{name,objective}',
  'adset{name}', 'creative{thumbnail_url,body}',
].join(',')

const DEFAULT_INSIGHTS_FIELDS = [
  'spend', 'impressions', 'clicks', 'ctr', 'cpl', 'cpc', 'reach',
].join(',')

export async function fetchAdsByAccount(accountId: string, accessToken: string) {
  const url = new URL(`${BASE_URL}/act_${accountId}/ads`)
  url.searchParams.set('access_token', accessToken)
  url.searchParams.set('fields', `${DEFAULT_AD_FIELDS},insights{${DEFAULT_INSIGHTS_FIELDS}}`)
  url.searchParams.set('effective_status', '["ACTIVE"]')
  url.searchParams.set('limit', '50')

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`Meta API error: ${res.status}`)
  return res.json()
}

export async function searchAdLibrary(pageId: string, accessToken: string) {
  const url = new URL(`${BASE_URL}/ads_archive`)
  url.searchParams.set('access_token', accessToken)
  url.searchParams.set('ad_reached_countries', '["BR"]')
  url.searchParams.set('search_page_ids', `[${pageId}]`)
  url.searchParams.set('ad_active_status', 'ACTIVE')
  url.searchParams.set('fields', [
    'id', 'ad_snapshot_url', 'ad_creative_bodies',
    'ad_creative_link_captions', 'ad_delivery_start_time',
    'ad_delivery_stop_time', 'publisher_platforms',
    'impressions', 'spend',
  ].join(','))
  url.searchParams.set('limit', '50')

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`Meta Ad Library API error: ${res.status}`)
  return res.json()
}

export function buildOAuthUrl(appId: string, redirectUri: string, state: string) {
  const url = new URL('https://www.facebook.com/v20.0/dialog/oauth')
  url.searchParams.set('client_id', appId)
  url.searchParams.set('redirect_uri', redirectUri)
  url.searchParams.set('scope', 'ads_read,ads_management,business_management')
  url.searchParams.set('state', state)
  return url.toString()
}

export async function exchangeCodeForToken(
  code: string,
  appId: string,
  appSecret: string,
  redirectUri: string,
) {
  const url = new URL(`${BASE_URL}/oauth/access_token`)
  url.searchParams.set('client_id', appId)
  url.searchParams.set('client_secret', appSecret)
  url.searchParams.set('redirect_uri', redirectUri)
  url.searchParams.set('code', code)

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error('Failed to exchange code for token')
  return res.json() as Promise<{ access_token: string; token_type: string }>
}

export async function getLongLivedToken(shortToken: string, appId: string, appSecret: string) {
  const url = new URL(`${BASE_URL}/oauth/access_token`)
  url.searchParams.set('grant_type', 'fb_exchange_token')
  url.searchParams.set('client_id', appId)
  url.searchParams.set('client_secret', appSecret)
  url.searchParams.set('fb_exchange_token', shortToken)

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error('Failed to get long-lived token')
  return res.json() as Promise<{ access_token: string }>
}
