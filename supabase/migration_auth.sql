-- =========================================================
-- Migration: adicionar user_id + RLS por usuário
-- Rodar no SQL Editor do Supabase APÓS o schema.sql
-- =========================================================

-- Adicionar user_id nas tabelas
alter table clients add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table competitors add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- Habilitar RLS
alter table clients enable row level security;
alter table competitors enable row level security;
alter table ad_snapshots enable row level security;
alter table competitor_ads enable row level security;

-- Policies: clients
drop policy if exists "clients_select" on clients;
drop policy if exists "clients_insert" on clients;
drop policy if exists "clients_update" on clients;
drop policy if exists "clients_delete" on clients;

create policy "clients_select" on clients for select using (auth.uid() = user_id);
create policy "clients_insert" on clients for insert with check (auth.uid() = user_id);
create policy "clients_update" on clients for update using (auth.uid() = user_id);
create policy "clients_delete" on clients for delete using (auth.uid() = user_id);

-- Policies: competitors
drop policy if exists "competitors_select" on competitors;
drop policy if exists "competitors_insert" on competitors;
drop policy if exists "competitors_update" on competitors;
drop policy if exists "competitors_delete" on competitors;

create policy "competitors_select" on competitors for select using (auth.uid() = user_id);
create policy "competitors_insert" on competitors for insert with check (auth.uid() = user_id);
create policy "competitors_update" on competitors for update using (auth.uid() = user_id);
create policy "competitors_delete" on competitors for delete using (auth.uid() = user_id);

-- Policies: ad_snapshots (acesso via cliente do usuário)
drop policy if exists "ad_snapshots_select" on ad_snapshots;
drop policy if exists "ad_snapshots_insert" on ad_snapshots;
drop policy if exists "ad_snapshots_delete" on ad_snapshots;

create policy "ad_snapshots_select" on ad_snapshots for select
  using (exists (select 1 from clients where clients.id = ad_snapshots.client_id and clients.user_id = auth.uid()));

create policy "ad_snapshots_insert" on ad_snapshots for insert
  with check (exists (select 1 from clients where clients.id = ad_snapshots.client_id and clients.user_id = auth.uid()));

create policy "ad_snapshots_delete" on ad_snapshots for delete
  using (exists (select 1 from clients where clients.id = ad_snapshots.client_id and clients.user_id = auth.uid()));

-- Policies: competitor_ads (acesso via concorrente do usuário)
drop policy if exists "competitor_ads_select" on competitor_ads;
drop policy if exists "competitor_ads_insert" on competitor_ads;
drop policy if exists "competitor_ads_delete" on competitor_ads;

create policy "competitor_ads_select" on competitor_ads for select
  using (exists (select 1 from competitors where competitors.id = competitor_ads.competitor_id and competitors.user_id = auth.uid()));

create policy "competitor_ads_insert" on competitor_ads for insert
  with check (exists (select 1 from competitors where competitors.id = competitor_ads.competitor_id and competitors.user_id = auth.uid()));

create policy "competitor_ads_delete" on competitor_ads for delete
  using (exists (select 1 from competitors where competitors.id = competitor_ads.competitor_id and competitors.user_id = auth.uid()));
