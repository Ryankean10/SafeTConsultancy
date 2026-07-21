-- ============================================================
-- 0003_opportunities.sql — Leads / CRM pipeline (Milestone 2)
-- Run in Supabase → SQL Editor (or via the Supabase CLI).
--
-- Adds contacts, opportunities, opportunity_activities, tasks.
-- All four are internal-only: readable/writable solely by 'admin'
-- and 'staff' profiles, enforced by RLS via is_staff_or_admin().
-- ============================================================

-- ---- helper: is the current user internal (admin/staff)? --------------------
create or replace function public.is_staff_or_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'staff')
  );
$$;

-- ---- helper: touch updated_at on row update ---------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---- contacts ---------------------------------------------------------------
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  organisation text,
  role_title text,
  email text,
  phone text,
  linkedin_url text,
  source text,
  notes text,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

-- ---- opportunities ----------------------------------------------------------
create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  source_url text,
  source text,
  stage text not null default 'identified'
    check (stage in ('identified', 'contacted', 'qualified', 'proposal',
                     'won', 'lost', 'invoiced', 'paid')),
  estimated_value numeric,
  currency text default 'GBP',
  vessel_type text,
  project_size text,
  contact_id uuid references public.contacts (id),
  owner uuid references public.profiles (id),
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists opportunities_stage_idx on public.opportunities (stage);
create index if not exists opportunities_owner_idx on public.opportunities (owner);
create index if not exists opportunities_contact_idx on public.opportunities (contact_id);

drop trigger if exists on_opportunities_updated on public.opportunities;
create trigger on_opportunities_updated
  before update on public.opportunities
  for each row execute function public.touch_updated_at();

-- ---- opportunity_activities (timeline / audit log) --------------------------
create table if not exists public.opportunity_activities (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.opportunities (id) on delete cascade,
  type text default 'note'
    check (type in ('note', 'call', 'email', 'meeting', 'stage_change')),
  body text,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create index if not exists opportunity_activities_opp_idx
  on public.opportunity_activities (opportunity_id, created_at desc);

-- Auto-log a stage_change activity whenever an opportunity's stage moves.
create or replace function public.log_stage_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.opportunity_activities (opportunity_id, type, body, created_by)
  values (new.id, 'stage_change', old.stage || ' -> ' || new.stage, auth.uid());
  return new;
end;
$$;

drop trigger if exists on_opportunity_stage_change on public.opportunities;
create trigger on_opportunity_stage_change
  after update of stage on public.opportunities
  for each row when (old.stage is distinct from new.stage)
  execute function public.log_stage_change();

-- ---- tasks ------------------------------------------------------------------
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid references public.opportunities (id) on delete cascade,
  title text not null,
  due_date date,
  status text default 'open' check (status in ('open', 'done', 'cancelled')),
  assignee uuid references public.profiles (id),
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create index if not exists tasks_opp_idx on public.tasks (opportunity_id);
create index if not exists tasks_assignee_status_idx on public.tasks (assignee, status);

-- ---- RLS: internal (admin/staff) only, on every table ----------------------
alter table public.contacts enable row level security;
alter table public.opportunities enable row level security;
alter table public.opportunity_activities enable row level security;
alter table public.tasks enable row level security;

drop policy if exists "contacts_staff_all" on public.contacts;
create policy "contacts_staff_all" on public.contacts
  for all using (public.is_staff_or_admin()) with check (public.is_staff_or_admin());

drop policy if exists "opportunities_staff_all" on public.opportunities;
create policy "opportunities_staff_all" on public.opportunities
  for all using (public.is_staff_or_admin()) with check (public.is_staff_or_admin());

drop policy if exists "opportunity_activities_staff_all" on public.opportunity_activities;
create policy "opportunity_activities_staff_all" on public.opportunity_activities
  for all using (public.is_staff_or_admin()) with check (public.is_staff_or_admin());

drop policy if exists "tasks_staff_all" on public.tasks;
create policy "tasks_staff_all" on public.tasks
  for all using (public.is_staff_or_admin()) with check (public.is_staff_or_admin());

-- Let internal users read every profile (needed to show owner / assignee /
-- author names across the CRM, and for the future Team screen). Safe from RLS
-- recursion because is_staff_or_admin() is security definer and bypasses RLS.
-- Complements the existing "select own" policy (which covers client-role users).
drop policy if exists "profiles_select_staff" on public.profiles;
create policy "profiles_select_staff" on public.profiles
  for select using (public.is_staff_or_admin());
