-- ============================================================
-- 0001_profiles.sql — user profiles + roles (Milestone 1)
-- Run in Supabase → SQL Editor (or via the Supabase CLI).
-- ============================================================

-- One profile row per auth user: name, contact details, and role.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  job_title text,
  phone text,
  role text not null default 'client' check (role in ('admin', 'staff', 'client')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- A signed-in user can read their own profile row.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

-- A user can update their own name (role changes happen server-side, admin-only).
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Auto-create a profile whenever a new auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', new.email));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep profiles.email in sync if the user later changes their auth email.
create or replace function public.handle_user_email_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles set email = new.email where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_email_changed on auth.users;
create trigger on_auth_user_email_changed
  after update of email on auth.users
  for each row when (old.email is distinct from new.email)
  execute function public.handle_user_email_change();

-- ------------------------------------------------------------
-- Roles: 'admin' (full access), 'staff' (internal team), 'client'
-- (external, least privilege — the default for new users).
-- Access levels per role are defined in a later milestone.
--
-- After creating your own user (Supabase → Authentication →
-- Users → Add user), promote it to admin with:
--
--   update public.profiles set role = 'admin'
--   where id = (select id from auth.users where email = 'YOUR_EMAIL');
-- ------------------------------------------------------------
