-- ============================================================
-- OXYTIVE: admin lockdown + access requests + schema catch-up
-- Safe to run more than once.
-- ============================================================

-- 1) Catch-up: columns / enum values the app already uses -----------------
alter type public.lead_status add value if not exists 'closed';
alter type public.lead_status add value if not exists 'cancelled';

alter table public.leads
  add column if not exists submission_key text,
  add column if not exists email_notification_status text not null default 'pending',
  add column if not exists whatsapp_notification_status text not null default 'pending',
  add column if not exists notification_error text;

create unique index if not exists leads_submission_key_uidx
  on public.leads (submission_key) where submission_key is not null;

-- 2) Only oxytive.admin@gmail.com is an admin ----------------------------
delete from public.admin_emails where lower(email) <> 'oxytive.admin@gmail.com';
insert into public.admin_emails (email) values ('oxytive.admin@gmail.com')
  on conflict (email) do nothing;

delete from public.user_roles
 where role = 'admin'
   and user_id not in (select id from auth.users where lower(email) = 'oxytive.admin@gmail.com');

-- The owner address can never be removed from the admin list.
create or replace function public.protect_owner_admin()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if lower(old.email) = 'oxytive.admin@gmail.com' then
    raise exception 'The owner admin cannot be removed';
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end; $$;

drop trigger if exists admin_emails_protect_owner on public.admin_emails;
create trigger admin_emails_protect_owner
  before delete or update on public.admin_emails
  for each row execute function public.protect_owner_admin();

-- 3) is_admin() now also requires a CONFIRMED email ----------------------
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public, auth as $$
  select
    exists (
      select 1 from public.user_roles r
      join auth.users u on u.id = r.user_id
      where r.user_id = auth.uid() and r.role = 'admin' and u.email_confirmed_at is not null
    )
    or exists (
      select 1 from auth.users u
      join public.admin_emails a on lower(a.email) = lower(u.email)
      where u.id = auth.uid() and u.email_confirmed_at is not null
    )
$$;
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- 4) Access requests ------------------------------------------------------
create table if not exists public.access_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  decided_at timestamptz
);
create unique index if not exists access_requests_email_uidx on public.access_requests (lower(email));

grant select on public.access_requests to authenticated;
grant update, delete on public.access_requests to authenticated;
grant all on public.access_requests to service_role;
alter table public.access_requests enable row level security;

drop policy if exists "own or admin read access requests" on public.access_requests;
create policy "own or admin read access requests" on public.access_requests
  for select to authenticated using (user_id = auth.uid() or public.is_admin());
drop policy if exists "admins update access requests" on public.access_requests;
create policy "admins update access requests" on public.access_requests
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admins delete access requests" on public.access_requests;
create policy "admins delete access requests" on public.access_requests
  for delete to authenticated using (public.is_admin());
-- inserts happen only through the server function (service role), never from the browser.

drop trigger if exists access_requests_updated_at on public.access_requests;
create trigger access_requests_updated_at before update on public.access_requests
  for each row execute function public.update_updated_at_column();
