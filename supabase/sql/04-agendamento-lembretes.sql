-- Chama a função `lembretes` a cada hora (no minuto 0).
-- O segredo fica no Vault do banco, nunca neste arquivo. Para criar ou trocar:
--   select vault.create_secret('<mesmo valor do segredo CRON_SECRET da função>', 'lembretes_cron_secret');
create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.unschedule('lembretes-de-estudo') where exists (select 1 from cron.job where jobname = 'lembretes-de-estudo');
select cron.schedule(
  'lembretes-de-estudo',
  '0 * * * *',
  $$
  select net.http_post(
    url := 'https://osthfogyiubiieanzrkf.supabase.co/functions/v1/lembretes',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-cron-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'lembretes_cron_secret')
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 30000
  );
  $$
);
