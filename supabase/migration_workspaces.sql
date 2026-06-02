-- =========================================================
-- Migration: Squads, BUs e workspace por usuário
-- Rodar no SQL Editor do Supabase
-- =========================================================

-- Squads
create table if not exists squads (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamptz default now()
);

-- Business Units
create table if not exists bus (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  squad_id uuid references squads(id) on delete cascade,
  meta_system_token text,
  meta_ad_library_token text,
  created_at timestamptz default now()
);

-- Relação usuário ↔ BU (N:N)
create table if not exists user_bus (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  bu_id uuid references bus(id) on delete cascade,
  joined_at timestamptz default now(),
  unique(user_id, bu_id)
);

-- Adicionar bu_id nas tabelas de dados
alter table clients add column if not exists bu_id uuid references bus(id) on delete cascade;
alter table competitors add column if not exists bu_id uuid references bus(id) on delete cascade;

-- Indexes
create index if not exists idx_user_bus_user_id on user_bus(user_id);
create index if not exists idx_user_bus_bu_id on user_bus(bu_id);
create index if not exists idx_bus_squad_id on bus(squad_id);
create index if not exists idx_clients_bu_id on clients(bu_id);
create index if not exists idx_competitors_bu_id on competitors(bu_id);

-- RLS
alter table squads enable row level security;
alter table bus enable row level security;
alter table user_bus enable row level security;

-- Squads: todos autenticados podem ver
create policy "squads_select" on squads for select to authenticated using (true);

-- BUs: todos autenticados podem ver
create policy "bus_select" on bus for select to authenticated using (true);

-- user_bus: usuário gerencia as próprias
create policy "user_bus_select" on user_bus for select using (auth.uid() = user_id);
create policy "user_bus_insert" on user_bus for insert with check (auth.uid() = user_id);
create policy "user_bus_delete" on user_bus for delete using (auth.uid() = user_id);

-- =========================================================
-- Seed: Squads e BUs iniciais
-- =========================================================
insert into squads (id, name) values
  ('11111111-0000-0000-0000-000000000001', 'Invictus'),
  ('11111111-0000-0000-0000-000000000002', 'Exclusive'),
  ('11111111-0000-0000-0000-000000000003', 'Bilions')
on conflict do nothing;

insert into bus (id, name, squad_id) values
  ('22222222-0000-0000-0000-000000000001', 'BU Jefferson', '11111111-0000-0000-0000-000000000001'),
  ('22222222-0000-0000-0000-000000000002', 'BU Thaina',    '11111111-0000-0000-0000-000000000001'),
  ('22222222-0000-0000-0000-000000000003', 'BU Melissa',   '11111111-0000-0000-0000-000000000001')
on conflict do nothing;
