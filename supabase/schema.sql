-- =========================================================
-- Ad Library — Schema Supabase
-- Rodar no SQL Editor do Supabase
-- =========================================================

create table if not exists clients (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  logo_url text,
  color text default '#6366F1',
  meta_account_id text,
  meta_access_token text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists ad_snapshots (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references clients(id) on delete cascade,
  ad_id text not null unique,
  ad_name text,
  campaign_name text,
  adset_name text,
  status text default 'ACTIVE',
  spend decimal(12,2) default 0,
  impressions bigint default 0,
  clicks bigint default 0,
  ctr decimal(6,4) default 0,
  cpl decimal(12,2),
  cpc decimal(12,2),
  reach bigint,
  thumbnail_url text,
  creative_body text,
  platform text default 'meta',
  objective text,
  last_synced_at timestamptz default now(),
  created_at timestamptz default now()
);

create table if not exists competitors (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  facebook_page_id text,
  facebook_page_name text,
  logo_url text,
  industry text,
  website text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists competitor_ads (
  id uuid default gen_random_uuid() primary key,
  competitor_id uuid references competitors(id) on delete cascade,
  ad_archive_id text unique,
  creative_body text,
  creative_link_caption text,
  creative_link_description text,
  ad_snapshot_url text,
  status text default 'ACTIVE',
  impressions_lower bigint,
  impressions_upper bigint,
  spend_lower decimal(12,2),
  spend_upper decimal(12,2),
  started_at date,
  last_seen_at date,
  platforms text[] default '{}',
  ai_insights text,
  last_synced_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_ad_snapshots_client_id on ad_snapshots(client_id);
create index if not exists idx_ad_snapshots_status on ad_snapshots(status);
create index if not exists idx_competitor_ads_competitor_id on competitor_ads(competitor_id);
create index if not exists idx_competitor_ads_status on competitor_ads(status);
