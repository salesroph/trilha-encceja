-- Execute no SQL Editor do projeto Supabase dedicado à Trilha ENCCEJA.
-- Cada estudante pode consultar e alterar apenas seu próprio progresso.
create table if not exists public.study_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  progress jsonb not null default '{}'::jsonb,
  version integer not null default 0,
  updated_at timestamptz not null default now()
);
alter table public.study_progress enable row level security;
create policy "student reads own progress" on public.study_progress for select to authenticated using ((select auth.uid()) = user_id);
create policy "student creates own progress" on public.study_progress for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "student updates own progress" on public.study_progress for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
