-- ============================================================
-- 0004_discovery.sql -- AI opportunity discovery engine
-- Run in Supabase -> SQL Editor (or via the Supabase CLI).
--
-- Flags AI-sourced opportunities for human review, and adds the
-- tunable search themes + a run audit log. Internal (admin/staff)
-- only, via the existing is_staff_or_admin() RLS helper.
-- ============================================================

-- Tunable search themes for the web-search scout.
create table if not exists public.discovery_queries (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  theme text not null,
  enabled boolean not null default true,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

-- One row per discovery run (scout or email ingest) for audit + stats.
create table if not exists public.discovery_runs (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('scout', 'email')),
  status text not null default 'running' check (status in ('running', 'done', 'error')),
  stats jsonb,
  error text,
  triggered_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  finished_at timestamptz
);

-- AI-sourcing flags on opportunities. ai_status is null for human-created
-- opportunities; 'pending' awaits review, 'accepted' promotes it into the
-- pipeline, 'dismissed' hides it.
alter table public.opportunities add column if not exists ai_generated boolean not null default false;
alter table public.opportunities add column if not exists ai_confidence numeric;
alter table public.opportunities add column if not exists ai_rationale text;
alter table public.opportunities add column if not exists ai_status text
  check (ai_status in ('pending', 'accepted', 'dismissed'));
alter table public.opportunities add column if not exists discovery_run_id uuid
  references public.discovery_runs (id);

create index if not exists opportunities_ai_status_idx on public.opportunities (ai_status);

-- RLS: internal (admin/staff) only.
alter table public.discovery_queries enable row level security;
alter table public.discovery_runs enable row level security;

drop policy if exists "discovery_queries_staff_all" on public.discovery_queries;
create policy "discovery_queries_staff_all" on public.discovery_queries
  for all using (public.is_staff_or_admin()) with check (public.is_staff_or_admin());

drop policy if exists "discovery_runs_staff_all" on public.discovery_runs;
create policy "discovery_runs_staff_all" on public.discovery_runs
  for all using (public.is_staff_or_admin()) with check (public.is_staff_or_admin());
