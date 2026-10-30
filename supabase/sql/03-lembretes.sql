-- Aparelhos que aceitaram receber lembretes (notificações push).
-- Cada aluno vê e altera apenas os próprios aparelhos; a função `lembretes` lê tudo com service_role.
create table if not exists public.push_subscriptions (
  endpoint text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  p256dh text not null,
  auth text not null,
  hour smallint not null default 19 check (hour between 0 and 23),
  timezone text not null default 'America/Sao_Paulo',
  last_sent date,
  created_at timestamptz not null default now()
);
create index if not exists push_subscriptions_user_idx on public.push_subscriptions (user_id);
alter table public.push_subscriptions enable row level security;
drop policy if exists "student reads own devices" on public.push_subscriptions;
drop policy if exists "student adds own devices" on public.push_subscriptions;
drop policy if exists "student updates own devices" on public.push_subscriptions;
drop policy if exists "student removes own devices" on public.push_subscriptions;
create policy "student reads own devices" on public.push_subscriptions for select to authenticated using ((select auth.uid()) = user_id);
create policy "student adds own devices" on public.push_subscriptions for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "student updates own devices" on public.push_subscriptions for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "student removes own devices" on public.push_subscriptions for delete to authenticated using ((select auth.uid()) = user_id);
