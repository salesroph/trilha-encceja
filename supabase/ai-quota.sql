-- Quota storage for the explain-aula Edge Function.
-- The function is intentionally callable only by service_role.
create table if not exists public.ai_explanation_usage (
  usage_date date not null default current_date,
  scope text not null check (scope in ('user', 'global')),
  subject_id uuid not null,
  request_count integer not null default 0 check (request_count >= 0),
  updated_at timestamptz not null default now(),
  primary key (usage_date, scope, subject_id),
  check ((scope = 'user' and subject_id <> '00000000-0000-0000-0000-000000000000') or (scope = 'global' and subject_id = '00000000-0000-0000-0000-000000000000'))
);

alter table public.ai_explanation_usage enable row level security;
revoke all on table public.ai_explanation_usage from public, anon, authenticated;

create or replace function public.consume_ai_explanation_quota(
  p_user_id uuid,
  p_user_limit integer default 5,
  p_global_limit integer default 100
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_date date := current_date;
  v_user_count integer;
  v_global_count integer;
begin
  if p_user_id is null or p_user_limit < 1 or p_global_limit < 1 then
    return false;
  end if;

  insert into public.ai_explanation_usage (usage_date, scope, subject_id, request_count)
  values (v_date, 'global', '00000000-0000-0000-0000-000000000000', 0)
  on conflict (usage_date, scope, subject_id) do nothing;
  select request_count into v_global_count
    from public.ai_explanation_usage
   where usage_date = v_date and scope = 'global' and subject_id = '00000000-0000-0000-0000-000000000000'
   for update;
  if v_global_count >= p_global_limit then return false; end if;

  insert into public.ai_explanation_usage (usage_date, scope, subject_id, request_count)
  values (v_date, 'user', p_user_id, 0)
  on conflict (usage_date, scope, subject_id) do nothing;
  select request_count into v_user_count
    from public.ai_explanation_usage
   where usage_date = v_date and scope = 'user' and subject_id = p_user_id
   for update;
  if v_user_count >= p_user_limit then return false; end if;

  update public.ai_explanation_usage
     set request_count = request_count + 1, updated_at = now()
   where usage_date = v_date and scope = 'global' and subject_id = '00000000-0000-0000-0000-000000000000';
  update public.ai_explanation_usage
     set request_count = request_count + 1, updated_at = now()
   where usage_date = v_date and scope = 'user' and subject_id = p_user_id;
  return true;
end;
$$;

revoke all on function public.consume_ai_explanation_quota(uuid, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_ai_explanation_quota(uuid, integer, integer) to service_role;
