-- York's Lawn Service — Supabase schema
-- Run this once in your Supabase project's SQL Editor (Project > SQL Editor > New query).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  service text not null,
  yard_size text,
  property_type text not null default 'residential',
  preferred_date date not null,
  address text,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  source text not null default 'website' check (source in ('website', 'admin'))
);

create table if not exists public.blocked_dates (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  reason text
);

create index if not exists bookings_preferred_date_idx on public.bookings (preferred_date);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
-- Anonymous site visitors may only INSERT a booking request (submit the
-- estimate form). They can never read, edit, or delete booking rows, so one
-- customer can't see another customer's info. Only the logged-in owner
-- (an authenticated Supabase user) can read/update/delete bookings and
-- manage blocked dates.

alter table public.bookings enable row level security;
alter table public.blocked_dates enable row level security;

drop policy if exists "public can request a booking" on public.bookings;
create policy "public can request a booking"
  on public.bookings for insert
  to anon
  with check (source = 'website' and status = 'pending');

drop policy if exists "owner can view bookings" on public.bookings;
create policy "owner can view bookings"
  on public.bookings for select
  to authenticated
  using (true);

drop policy if exists "owner can update bookings" on public.bookings;
create policy "owner can update bookings"
  on public.bookings for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "owner can insert bookings" on public.bookings;
create policy "owner can insert bookings"
  on public.bookings for insert
  to authenticated
  with check (true);

drop policy if exists "owner can delete bookings" on public.bookings;
create policy "owner can delete bookings"
  on public.bookings for delete
  to authenticated
  using (true);

drop policy if exists "owner can manage blocked dates" on public.blocked_dates;
create policy "owner can manage blocked dates"
  on public.blocked_dates for all
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- Public availability lookup
-- ---------------------------------------------------------------------------
-- The booking calendar needs to know which dates are already full or blocked
-- WITHOUT exposing any customer's name/email/phone to anonymous visitors.
-- This function runs with the privileges of its owner (security definer),
-- so it can read the bookings table internally but only ever returns a
-- bare list of dates.
--
-- MAX_JOBS_PER_DAY below must match `maxJobsPerDay` in src/lib/business.ts.

create or replace function public.get_unavailable_dates()
returns table (unavailable_date date)
language sql
security definer
set search_path = public
as $$
  select date from public.blocked_dates
  union
  select preferred_date as date
  from public.bookings
  where status <> 'cancelled'
  group by preferred_date
  having count(*) >= 3; -- MAX_JOBS_PER_DAY
$$;

grant execute on function public.get_unavailable_dates() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Next step: create the owner's login
-- ---------------------------------------------------------------------------
-- In the Supabase dashboard: Authentication > Users > Add user.
-- Use that email/password to log in at yoursite.com/admin/login.
-- Any authenticated user has full admin access, so only create one account.
