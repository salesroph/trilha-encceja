// Lembretes de estudo por notificação push.
// - Chamada a cada hora pelo pg_cron (cabeçalho x-cron-secret): envia no máximo 1 lembrete por dia,
//   no horário escolhido pelo aluno, e só para quem ainda não estudou hoje.
// - Chamada pelo site com o login do aluno e {"test": true}: envia uma notificação de teste.
import webpush from "npm:web-push@3.6.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://salesroph.github.io",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" } });

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const APP_URL = "https://salesroph.github.io/trilha-encceja/";
webpush.setVapidDetails(Deno.env.get("VAPID_SUBJECT") ?? APP_URL, Deno.env.get("VAPID_PUBLIC_KEY")!, Deno.env.get("VAPID_PRIVATE_KEY")!);

type Subscription = { endpoint: string; user_id: string; p256dh: string; auth: string; hour: number; timezone: string; last_sent: string | null };
type Progress = { days?: Record<string, number>; stats?: Record<string, { due?: string | null }>; examDate?: string };

async function db(path: string, init: RequestInit = {}) {
  return await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { ...init, headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": "application/json", ...(init.headers ?? {}) } });
}

function localNow(timezone: string) {
  let tz = timezone;
  try { new Intl.DateTimeFormat("en", { timeZone: tz }); } catch { tz = "America/Sao_Paulo"; }
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", hourCycle: "h23" }).formatToParts(new Date()).map((p) => [p.type, p.value]));
  return { date: `${parts.year}-${parts.month}-${parts.day}`, hour: Number(parts.hour) };
}
const dayDiff = (a: string, b: string) => Math.round((Date.parse(a + "T12:00:00Z") - Date.parse(b + "T12:00:00Z")) / 86400000);
const addDays = (day: string, n: number) => new Date(Date.parse(day + "T12:00:00Z") + n * 86400000).toISOString().slice(0, 10);

// Escolhe a mensagem do dia; null quando o aluno já estudou hoje.
function chooseMessage(progress: Progress, today: string): { title: string; body: string } | null {
  const days = progress.days ?? {};
  if (days[today]) return null;
  const studied = Object.keys(days).filter((d) => days[d] > 0).sort();
  const last = studied.at(-1);
  if (!last || dayDiff(today, last) >= 2) {
    return { title: "E AÍ, VAI ESTUDAR NÃO, RAPAZ?? 😤", body: "BORA! 📚 Só 10 questõezinhas e a meta do dia tá feita." };
  }
  let streak = 0, d = addDays(today, -1);
  while (days[d]) { streak++; d = addDays(d, -1); }
  const exam = progress.examDate ? dayDiff(progress.examDate, today) : null;
  if (exam !== null && [60, 30, 15, 7, 3, 2, 1].includes(exam)) {
    return { title: `⏳ Faltam ${exam} ${exam === 1 ? "dia" : "dias"} para o ENCCEJA!`, body: "Cada questão de hoje conta. Bora treinar?" };
  }
  if (streak >= 2) return { title: `🔥 Seus ${streak} dias seguidos estão em jogo!`, body: "Faz umas questões rapidinho para não perder a sequência." };
  const due = Object.values(progress.stats ?? {}).filter((s) => s?.due && s.due <= today).length;
  if (due > 0) return { title: `🔔 ${due} ${due === 1 ? "assunto" : "assuntos"} para revisar hoje`, body: "Revisar agora leva 5 minutos e faz o conteúdo ficar na memória." };
  return { title: "Bora bater a meta de hoje? 🎯", body: "10 questões te esperam. Um passo de cada vez." };
}

// Envia; devolve false quando o aparelho cancelou a inscrição (e a remove).
async function send(sub: Subscription, message: { title: string; body: string }) {
  try {
    await webpush.sendNotification({ endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } }, JSON.stringify({ ...message, url: APP_URL }), { TTL: 6 * 3600 });
    return true;
  } catch (error: any) {
    if (error?.statusCode === 404 || error?.statusCode === 410) {
      await db(`push_subscriptions?endpoint=eq.${encodeURIComponent(sub.endpoint)}`, { method: "DELETE" });
    } else console.error("push failed", error?.statusCode ?? error?.message);
    return false;
  }
}

async function userFromToken(authHeader: string | null) {
  if (!authHeader?.startsWith("Bearer ")) return null;
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers: { apikey: Deno.env.get("SUPABASE_ANON_KEY")!, Authorization: authHeader } });
  if (!response.ok) return null;
  const user = await response.json();
  return typeof user?.id === "string" ? user.id as string : null;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Método não permitido." }, 405);
  const body = await request.json().catch(() => ({}));

  // Teste pedido pelo próprio aluno ao ativar os lembretes.
  if (body?.test === true) {
    const userId = await userFromToken(request.headers.get("Authorization"));
    if (!userId) return json({ error: "Faça login." }, 401);
    const subs: Subscription[] = await (await db(`push_subscriptions?user_id=eq.${userId}&select=*`)).json();
    let sent = 0;
    for (const sub of subs) if (await send(sub, { title: "Lembretes ativados! ✅", body: "Você vai receber um lembrete por dia no horário escolhido. Bora estudar!" })) sent++;
    return json({ sent });
  }

  const cronSecret = Deno.env.get("CRON_SECRET");
  if (!cronSecret || request.headers.get("x-cron-secret") !== cronSecret) return json({ error: "Não autorizado." }, 401);

  const subs: Subscription[] = await (await db("push_subscriptions?select=*")).json();
  const due = subs.filter((s) => { const now = localNow(s.timezone); return now.hour === s.hour && s.last_sent !== now.date; });
  if (!due.length) return json({ checked: subs.length, sent: 0 });

  const userIds = [...new Set(due.map((s) => s.user_id))];
  const rows: { user_id: string; progress: Progress }[] = await (await db(`study_progress?user_id=in.(${userIds.join(",")})&select=user_id,progress`)).json();
  const progressByUser = new Map(rows.map((r) => [r.user_id, r.progress ?? {}]));

  let sent = 0;
  for (const sub of due) {
    const today = localNow(sub.timezone).date;
    const message = chooseMessage(progressByUser.get(sub.user_id) ?? {}, today);
    if (message && await send(sub, message)) sent++;
    // Marca o dia mesmo sem envio (aluno já estudou), para não repetir nesta data.
    await db(`push_subscriptions?endpoint=eq.${encodeURIComponent(sub.endpoint)}`, { method: "PATCH", body: JSON.stringify({ last_sent: today }) });
  }
  return json({ checked: subs.length, sent });
});
