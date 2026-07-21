-- ============================================================
-- 0002_profiles_reconcile.sql
-- Converges an early profiles table (id, full_name, role) to the
-- target schema: adds email/job_title/phone, widens the role
-- constraint to include 'client', backfills email, and refreshes
-- the triggers. Idempotent — safe to run more than once, and a
-- no-op on a database where 0001 was applied in full.
-- ============================================================

alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists job_title text;
alter table public.profiles add column if not exists phone text;

alter table public.profiles alter column role set default 'client';
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role in ('admin', 'staff', 'client'));

update public.profiles p set email = u.email
from auth.users u where u.id = p.id and p.email is null;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
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

create or replace function public.handle_user_email_change()
returns trigger language plpgsql security definer set search_path = public as $$
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
