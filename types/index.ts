export interface Squad {
  id: string
  name: string
  created_at: string
  bus?: BU[]
}

export interface BU {
  id: string
  name: string
  squad_id: string
  meta_system_token?: string
  meta_ad_library_token?: string
  created_at: string
  squad?: Squad
}

export interface Client {
  id: string
  name: string
  logo_url?: string
  color: string
  meta_account_id?: string
  meta_access_token?: string
  bu_id?: string
  is_active: boolean
  created_at: string
}

export interface Ad {
  id: string
  client_id: string
  ad_id: string
  ad_name: string
  campaign_name: string
  adset_name?: string
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED'
  spend: number
  impressions: number
  clicks: number
  ctr: number
  cpl?: number
  cpc?: number
  cpm?: number
  reach?: number
  frequency?: number
  roas?: number
  results?: number
  thumbnail_url?: string
  creative_body?: string
  platform: 'meta' | 'google' | 'tiktok'
  objective?: string
  last_synced_at: string
  client?: Client
}

export interface Competitor {
  id: string
  name: string
  facebook_page_id?: string
  facebook_page_name?: string
  logo_url?: string
  industry?: string
  website?: string
  notes?: string
  bu_id?: string
  created_at: string
  _ads_count?: number
}

export interface CompetitorAd {
  id: string
  competitor_id: string
  ad_archive_id: string
  creative_body?: string
  creative_link_caption?: string
  ad_snapshot_url?: string
  status: string
  impressions_lower?: number
  impressions_upper?: number
  spend_lower?: number
  spend_upper?: number
  started_at?: string
  last_seen_at?: string
  platforms: string[]
  ai_insights?: string
  last_synced_at: string
}

export interface DashboardMetrics {
  total_spend: number
  total_impressions: number
  total_clicks: number
  avg_ctr: number
  avg_cpl: number
  active_ads: number
  active_clients: number
}

export interface SpendChartPoint {
  date: string
  [clientName: string]: number | string
}
