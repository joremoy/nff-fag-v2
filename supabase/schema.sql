-- Run this in Supabase SQL editor.
create extension if not exists "pgcrypto";

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.clips (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  video_path text not null,
  situation_type text not null,
  league text not null,
  round int,
  match_number text,
  conclusion_text text not null,
  uploaded_at timestamptz not null default now(),
  created_by uuid not null references auth.users(id) on delete restrict,
  published boolean not null default false,
  constraint clips_round_range check (round is null or round between 1 and 60)
);

alter table public.admins enable row level security;
alter table public.clips enable row level security;

-- Admin policies
create policy if not exists "admins can read admins"
  on public.admins for select
  to authenticated
  using (true);

create policy if not exists "admins can read clips"
  on public.clips for select
  to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

create policy if not exists "admins can insert clips"
  on public.clips for insert
  to authenticated
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

create policy if not exists "admins can update clips"
  on public.clips for update
  to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from public.admins a where a.user_id = auth.uid()));

create policy if not exists "admins can delete clips"
  on public.clips for delete
  to authenticated
  using (exists (select 1 from public.admins a where a.user_id = auth.uid()));

-- Public read policy for published clips only (viewer route has no login)
create policy if not exists "public can read published clips"
  on public.clips for select
  to anon
  using (published = true);

-- Storage setup
insert into storage.buckets (id, name, public)
values ('clips', 'clips', true)
on conflict (id) do nothing;

create policy if not exists "public read clips bucket"
  on storage.objects for select
  to anon
  using (bucket_id = 'clips');

create policy if not exists "admins upload clips bucket"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'clips'
    and exists (select 1 from public.admins a where a.user_id = auth.uid())
  );

create policy if not exists "admins update clips bucket"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'clips'
    and exists (select 1 from public.admins a where a.user_id = auth.uid())
  )
  with check (
    bucket_id = 'clips'
    and exists (select 1 from public.admins a where a.user_id = auth.uid())
  );

create policy if not exists "admins delete clips bucket"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'clips'
    and exists (select 1 from public.admins a where a.user_id = auth.uid())
  );
