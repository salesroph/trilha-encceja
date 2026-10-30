// Prática infinita: uma questão por tela, revisão espaçada por assunto, pontos, metas e conquistas.
const DAILY_GOAL=10;
const REVIEW_DAYS=[1,3,7,14,30,60];
const XP_BY_LEVEL={fácil:5,média:10,difícil:15};
const XP_PER_LEVEL=150;
const AI_POOL_KEY='trilha-encceja-ia-questoes';

const praise=['Mandou bem!','Isso aí!','Certíssimo!','Muito bom!','Acertou em cheio!','Boa! Você está pegando o jeito.','Perfeito!'];
const hardPraise=['Essa era difícil! Parabéns 👏','Questão difícil e você acertou. Excelente! 💪','Essa derrubava muita gente. Mandou muito bem! 🏆'];
const comeback=['Recuperou bem! 👊','Errou, aprendeu e acertou. É assim que se estuda!'];
const wrongMsgs=['Quase! Veja a explicação abaixo 👇','Errar faz parte. Leia a explicação e siga em frente.','Não foi dessa vez. A explicação vai ajudar 👇'];
const streakMsgs={3:'3 seguidas! 🔥',5:'5 em sequência! Que fase! 🔥🔥',10:'10 seguidas! Você está voando 🚀',15:'15 seguidas! Impressionante! 🌟',20:'20 seguidas! Nível prova! 🏅'};

const BADGES=[
  ['primeira','Primeiro passo','Respondeu a primeira questão',s=>s.answers>=1],
  ['acertos10','Esquentando','10 acertos',s=>s.rights>=10],
  ['acertos50','Pegando ritmo','50 acertos',s=>s.rights>=50],
  ['acertos200','Máquina de estudar','200 acertos',s=>s.rights>=200],
  ['seq10','Em chamas','10 acertos seguidos',s=>s.bestStreak>=10],
  ['dias3','Constância','Estudou 3 dias seguidos',s=>s.dayStreak>=3],
  ['dias7','Uma semana firme','Estudou 7 dias seguidos',s=>s.dayStreak>=7],
  ['meta','Meta batida','Cumpriu a meta do dia',s=>s.todayCount>=DAILY_GOAL],
  ['areas','Pé em tudo','Praticou as quatro áreas',s=>s.areas>=4],
  ['dominou','Dominou um assunto','Concluiu a primeira aula',s=>s.mastered>=1],
  ['simulado70','Pronto para a prova?','Fez 70% ou mais em um simulado',s=>s.bestExam>=70],
  ['redacao','Escritor','Enviou uma redação para correção',s=>s.essays>=1],
];

const pick1=list=>list[Math.floor(Math.random()*list.length)];
const iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const addDays=(day,n)=>{const d=new Date(day+'T12:00:00');d.setDate(d.getDate()+n);return iso(d)};
const areaOf=id=>id.split('-')[0];
const areaName={mat:'Matemática',ling:'Linguagens',nat:'Ciências da Natureza',hum:'Ciências Humanas'};
const lessonById=id=>lessons.find(l=>l.id===id);

// ---------- Estatísticas ----------
function topicStats(id){state.stats=state.stats||{};return state.stats[id]||(state.stats[id]={right:0,wrong:0,level:0,due:null})}
function accuracy(id){const s=state.stats?.[id];return s&&s.right+s.wrong?s.right/(s.right+s.wrong):null}
function dueLessons(){return lessons.filter(l=>{const s=state.stats?.[l.id];return s?.due&&s.due<=today()})}
function weakLessons(){return lessons.filter(l=>{const s=state.stats?.[l.id];return s&&s.right+s.wrong>=3&&accuracy(l.id)<0.6}).sort((a,b)=>accuracy(a.id)-accuracy(b.id))}
function todayCount(){return state.days?.[today()]||0}
function dayStreak(){let n=0,d=today();if(!state.days?.[d])d=addDays(d,-1);while(state.days?.[d]){n++;d=addDays(d,-1)}return n}
function level(){const xp=state.xp||0;return {n:Math.floor(xp/XP_PER_LEVEL)+1,progress:xp%XP_PER_LEVEL}}
function mastered(id){return state[id]?.stage==='done'}

function summaryStats(){
  const st=Object.values(state.stats||{});
  return {answers:st.reduce((a,s)=>a+s.right+s.wrong,0),rights:st.reduce((a,s)=>a+s.right,0),bestStreak:state.bestStreak||0,dayStreak:dayStreak(),todayCount:todayCount(),
    areas:new Set(Object.keys(state.stats||{}).map(areaOf)).size,mastered:lessons.filter(l=>mastered(l.id)).length,
    bestExam:Math.max(0,...(state.simulados||[]).map(s=>Math.round(s.score/s.total*100))),essays:(state.redacoes||[]).length};
}
function checkBadges(){
  const s=summaryStats(),got=state.badges=state.badges||{},fresh=[];
  for(const [id,name,desc,test] of BADGES)if(!got[id]&&test(s)){got[id]=today();fresh.push(`🏅 Conquista: ${name}`)}
  return fresh;
}

// Registra uma resposta: ajusta o nível do assunto, agenda a próxima revisão e soma pontos.
function recordAnswer(lessonId,ok,dificuldade){
  if(!lessonId||!lessonById(lessonId))return {xp:0,events:[]};
  const s=topicStats(lessonId),events=[];
  const goalBefore=todayCount();
  if(ok){s.right++;s.level=Math.min(REVIEW_DAYS.length,s.level+1);s.due=addDays(today(),REVIEW_DAYS[s.level-1])}
  else{s.wrong++;s.level=Math.max(0,s.level-1);s.due=addDays(today(),1)}
  const xp=ok?(XP_BY_LEVEL[dificuldade]||10):1,lvBefore=level().n;
  state.xp=(state.xp||0)+xp;
  state.days=state.days||{};state.days[today()]=goalBefore+1;
  if(!state[lessonId])state[lessonId]={stage:'practice'};
  if(!mastered(lessonId)&&s.right>=5&&accuracy(lessonId)>=0.6){state[lessonId].stage='done';events.push(`✓ Você dominou “${lessonById(lessonId).title}”!`)}
  if(goalBefore<DAILY_GOAL&&goalBefore+1>=DAILY_GOAL)events.push('🎯 Meta do dia batida! Tudo que vier agora é bônus.');
  if(level().n>lvBefore)events.push(`⭐ Você subiu para o nível ${level().n}!`);
  events.push(...checkBadges());
  save();
  return {xp,events};
}

// ---------- Fontes de questões ----------
let aiPool=[];try{aiPool=JSON.parse(localStorage.getItem(AI_POOL_KEY)||'[]')}catch{aiPool=[]}
const saveAiPool=()=>{try{localStorage.setItem(AI_POOL_KEY,JSON.stringify(aiPool.slice(-120)))}catch{}};
let aiFetching=false;

const qHash=t=>{let h=0;for(const c of t)h=(h*31+c.charCodeAt(0))>>>0;return h.toString(36)};
function seenRecently(text){return (state.recent||[]).includes(qHash(text))}
function markSeen(text){state.recent=(state.recent||[]).concat(qHash(text)).slice(-150)}

function bankQuestion(lessonId){
  const l=lessonById(lessonId);if(!l)return null;
  const all=[...l.qs,l.same,l.next].filter(Boolean);
  const fresh=all.filter(q=>!seenRecently(q[0]));
  const q=pick1(fresh.length?fresh:all);
  const right=q[1][q[2]],alternativas=[...q[1]].sort(()=>Math.random()-.5);
  return {enunciado:q[0],alternativas,correta:alternativas.indexOf(right),explicacao:q[3],dificuldade:'média',aula:lessonId,origem:'aula'};
}

function scopeLessons(scope){
  if(scope.kind==='lesson')return [scope.lesson];
  if(scope.kind==='area')return lessons.filter(l=>areaOf(l.id)===scope.area).map(l=>l.id);
  if(scope.kind==='review'){const due=dueLessons().map(l=>l.id);if(due.length)return due}
  if(scope.kind==='weak'){const weak=weakLessons().map(l=>l.id);if(weak.length)return weak}
  // Prática inteligente: revisões e pontos fracos têm prioridade, mas sempre entra um pouco de tudo.
  return lessons.map(l=>l.id);
}
function lessonWeight(id){
  const s=state.stats?.[id];if(!s)return 1.2;
  let w=1;if(s.due&&s.due<=today())w+=3;const acc=accuracy(id);if(acc!==null&&acc<0.6)w+=2;if(mastered(id)&&!(s.due<=today()))w*=0.4;
  return w;
}
function chooseLesson(ids){
  const weights=ids.map(lessonWeight),total=weights.reduce((a,b)=>a+b,0);let r=Math.random()*total;
  for(let i=0;i<ids.length;i++){r-=weights[i];if(r<=0)return ids[i]}
  return ids[ids.length-1];
}

function nextQuestion(scope){
  const ids=scopeLessons(scope);
  for(let attempt=0;attempt<6;attempt++){
    const id=chooseLesson(ids);
    const aiIndex=aiPool.findIndex(q=>q.aula===id&&!seenRecently(q.enunciado));
    let question=null;
    if(generators[id]&&(aiIndex<0||Math.random()<0.6))question=generateQuestion(id);
    else if(aiIndex>=0)question=aiPool.splice(aiIndex,1)[0],saveAiPool();
    else question=bankQuestion(id);
    if(question&&(!seenRecently(question.enunciado)||attempt===5)){prefetchAI(ids);return question}
  }
  return bankQuestion(ids[0]);
}

// Pede um lote de questões novas à IA quando o estoque daquele recorte está baixo (só com login).
async function prefetchAI(ids){
  const wanted=ids.filter(id=>!generators[id]);
  if(!wanted.length||aiFetching||session?.aiOff||typeof window.requestAIExercises!=='function')return;
  const stock=aiPool.filter(q=>wanted.includes(q.aula)).length;
  if(stock>=4)return;
  aiFetching=true;
  try{
    const batch=[...wanted].sort(()=>Math.random()-.5).slice(0,10);
    const questions=await window.requestAIExercises(batch);
    aiPool.push(...questions.filter(q=>lessonById(q.aula)).map(q=>({...q,origem:'ia'})));saveAiPool();
  }catch(e){if(session)session.aiOff=true}
  finally{aiFetching=false}
}

// ---------- Tela de prática ----------
let session=null;
function scopeTitle(scope){
  if(scope.kind==='lesson')return lessonById(scope.lesson)?.title||'Prática';
  if(scope.kind==='area')return areaName[scope.area];
  if(scope.kind==='review')return 'Revisões de hoje';
  if(scope.kind==='weak')return 'Reforço dos pontos fracos';
  return 'Prática do dia';
}

function startPractice(scope){
  current=null;
  session={scope,answered:0,right:0,streak:0,best:0,xp:0,lastWrong:false,missed:{},question:null,answered_current:false};
  showQuestion();
}
const practiceArea=area=>startPractice({kind:'area',area});
const practiceLesson=id=>startPractice({kind:'lesson',lesson:id});

function practiceHeader(){
  const lv=level();
  return `<div class="practice-top"><button class="text-button" type="button" onclick="finishPractice()">✕ Sair</button><span class="label">${esc(scopeTitle(session.scope)).toUpperCase()}</span></div>
<div class="practice-stats"><span title="Acertos nesta sessão">✓ ${session.right}/${session.answered}</span><span title="Acertos seguidos">🔥 ${session.streak}</span><span title="Pontos ganhos">⭐ +${session.xp}</span><span title="Meta do dia">🎯 ${Math.min(todayCount(),DAILY_GOAL)}/${DAILY_GOAL}</span></div>
<div class="goal-bar" aria-hidden="true"><span style="width:${Math.min(100,todayCount()/DAILY_GOAL*100)}%"></span></div>`;
}

function showQuestion(){
  const q=session.question=nextQuestion(session.scope);session.answered_current=false;
  const l=lessonById(q.aula);
  app.innerHTML=`${practiceHeader()}<section class="panel practice-card">
<div class="q-meta"><span class="tag-dif ${q.dificuldade==='difícil'?'hard':q.dificuldade==='fácil'?'easy':''}">${esc(q.dificuldade||'média')}</span><span>${esc(l?.title||'')}</span>${q.origem==='ia'?'<span class="tag-ia">questão nova · IA</span>':''}</div>
<p class="q-text">${esc(q.enunciado).replace(/\n/g,'<br>')}</p>
<div class="q-options">${q.alternativas.map((a,i)=>`<button class="option" type="button" onclick="answerQuestion(${i})"><b>${'ABCD'[i]}</b>&nbsp; ${esc(a)}</button>`).join('')}</div>
<div id="q-feedback" aria-live="polite"></div><div class="tutor-panel" id="tutor-panel" hidden></div></section>
<div class="practice-actions"><button class="button secondary" type="button" onclick="finishPractice()">Finalizar exercícios</button><button class="button" id="next-q" type="button" onclick="showQuestion()" disabled>Próximo exercício →</button></div>`;
  window.scrollTo(0,0);
}

function answerQuestion(i){
  if(session.answered_current)return;session.answered_current=true;
  const q=session.question,ok=i===q.correta;markSeen(q.enunciado);
  session.answered++;
  const buttons=document.querySelectorAll('.q-options .option');
  buttons.forEach((b,j)=>{b.disabled=true;if(j===q.correta)b.classList.add('right');else if(j===i)b.classList.add('wrong')});
  let msg;
  if(ok){
    session.right++;session.streak++;session.best=Math.max(session.best,session.streak);state.bestStreak=Math.max(state.bestStreak||0,session.streak);
    msg=streakMsgs[session.streak]||(q.dificuldade==='difícil'?pick1(hardPraise):session.lastWrong?pick1(comeback):pick1(praise));
  }else{session.streak=0;session.missed[q.aula]=(session.missed[q.aula]||0)+1;msg=pick1(wrongMsgs)}
  session.lastWrong=!ok;
  const {xp,events}=recordAnswer(q.aula,ok,q.dificuldade);session.xp+=xp;
  document.querySelector('#q-feedback').innerHTML=`<div class="feedback ${ok?'good':'bad'}"><b>${ok?'✓':'✗'} ${esc(msg)}</b>${ok?` <span class="xp">+${xp} pontos</span>`:''}<br>${esc(q.explicacao||'')}</div>
${events.map(e=>`<div class="celebrate">${esc(e)}</div>`).join('')}
${ok?'':`<button class="text-button" type="button" onclick="askTutor('${q.aula}')">Não entendi este assunto →</button>`}`;
  document.querySelector('.practice-stats').outerHTML=practiceHeader().match(/<div class="practice-stats">[\s\S]*?<\/div>/)[0];
  document.querySelector('.goal-bar span').style.width=Math.min(100,todayCount()/DAILY_GOAL*100)+'%';
  const next=document.querySelector('#next-q');next.disabled=false;
  document.querySelector('#q-feedback').scrollIntoView({behavior:'smooth',block:'nearest'});
}

function finishPractice(){
  if(!session||!session.answered){session=null;home();return}
  const s=session,pct=Math.round(s.right/s.answered*100),lv=level();
  const missed=Object.entries(s.missed).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([id])=>lessonById(id)).filter(Boolean);
  const headline=pct>=80?'Excelente! 🏆':pct>=60?'Muito bom! 💪':pct>=40?'Bom treino! 👍':'Cada erro é um aprendizado 🌱';
  const scope=JSON.stringify(s.scope).replace(/"/g,'&quot;');
  app.innerHTML=`<section class="panel finish-card"><span class="label">FIM DA SESSÃO</span><h2>${headline}</h2>
<div class="finish-grid"><div><b>${s.right}/${s.answered}</b><small>acertos (${pct}%)</small></div><div><b>+${s.xp}</b><small>pontos</small></div><div><b>${s.best}</b><small>maior sequência</small></div><div><b>${dayStreak()}</b><small>${dayStreak()===1?'dia seguido':'dias seguidos'}</small></div></div>
<p>Nível ${lv.n} · ${lv.progress}/${XP_PER_LEVEL} pontos para o próximo. ${todayCount()>=DAILY_GOAL?'🎯 Meta do dia cumprida!':`Faltam ${DAILY_GOAL-todayCount()} questões para a meta de hoje.`}</p>
${missed.length?`<h3>Vale reforçar</h3><div class="reinforce">${missed.map(l=>`<div class="reinforce-item"><span>${esc(l.title)}</span><span><button class="text-button" type="button" onclick="openLesson('${l.id}')">Rever aula</button> · <button class="text-button" type="button" onclick="practiceLesson('${l.id}')">Treinar</button></span></div>`).join('')}</div>`:''}
<div class="practice-actions static"><button class="button secondary" type="button" onclick="home()">Voltar ao início</button><button class="button" type="button" onclick="startPractice(${scope})">Continuar praticando →</button></div></section>`;
  session=null;window.scrollTo(0,0);
}
