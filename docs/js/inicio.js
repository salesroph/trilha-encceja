const homeAreas=[['Matemática','mat','◫'],['Linguagens','ling','✎'],['Ciências da Natureza','nat','✳'],['Ciências Humanas','hum','◎']];
function lessonStatus(id){
  const s=state.stats?.[id];
  if(mastered(id))return s?.due&&s.due<=today()?['Dominada · revisar hoje','review']:['Dominada','done'];
  if(s?.due&&s.due<=today())return ['Revisar hoje','review'];
  if(s)return [`${Math.round(accuracy(id)*100)}% de acerto`,'doing'];
  if(state[id])return ['Em andamento','doing'];
  return ['Não iniciada','new'];
}
const statusIcon={new:'○',doing:'◐',review:'🔔',done:'✓'};
const daysUntil=date=>Math.round((new Date(date+'T12:00:00')-new Date(today()+'T12:00:00'))/86400000);

function areaAccuracy(prefix){
  let r=0,w=0;for(const [id,s] of Object.entries(state.stats||{}))if(areaOf(id)===prefix){r+=s.right;w+=s.wrong}
  return r+w?Math.round(r/(r+w)*100):null;
}

function renderHome() {
  current=null; readOnly=false; reviewBanner();
  const lv=level(),streak=dayStreak(),goal=todayCount(),due=dueLessons(),weak=weakLessons().slice(0,3);
  const exam=state.examDate&&daysUntil(state.examDate)>=0?daysUntil(state.examDate):null;
  const smartHint=due.length?`${due.length} ${due.length===1?'revisão':'revisões'} + pontos fracos + assuntos novos`:Object.keys(state.stats||{}).length?'Mistura seus pontos fracos com assuntos novos':'Questões de todas as áreas para começar';
  const badges=BADGES.map(([id,name,desc])=>({id,name,desc,got:!!state.badges?.[id]}));
  app.innerHTML=`<div class="stat-row"><span title="Dias seguidos estudando">🔥 <b>${streak}</b> ${streak===1?'dia':'dias'}</span><span title="Seu nível">⭐ Nível <b>${lv.n}</b></span><span title="Meta de hoje">🎯 <b>${Math.min(goal,DAILY_GOAL)}/${DAILY_GOAL}</b> hoje</span></div>
<div class="goal-bar" aria-hidden="true"><span style="width:${Math.min(100,goal/DAILY_GOAL*100)}%"></span></div>
<section class="next-card"><span class="label">${goal>=DAILY_GOAL?'META CUMPRIDA 🎯 · SEGUE O BÔNUS':'SEU TREINO DE HOJE'}</span><h2>Praticar agora</h2><p>${smartHint}. Uma questão por vez, sem fim: pare quando quiser.</p><button class="button" type="button" onclick="startPractice({kind:'smart'})">Começar →</button></section>
<div class="section-head"><div><span class="label">ESCOLHA UMA ÁREA</span><h2>Praticar por área</h2></div></div>
<div class="area-grid">${homeAreas.map(([name,prefix,icon])=>{const acc=areaAccuracy(prefix);return `<button class="area-btn" type="button" onclick="practiceArea('${prefix}')"><span class="icon" aria-hidden="true">${icon}</span><b>${name}</b><small>${acc===null?'Começar':`${acc}% de acerto`}</small></button>`}).join('')}</div>
<div class="section-head"><div><span class="label">REVISAR E REFORÇAR</span><h2>Seus pontos de atenção</h2></div></div>
<section class="panel reinforce-panel">${due.length?`<div class="reinforce-item"><span>🔔 <b>${due.length}</b> ${due.length===1?'assunto para revisar hoje':'assuntos para revisar hoje'}</span><button class="button" type="button" onclick="startPractice({kind:'review'})">Revisar</button></div>`:''}
${weak.length?weak.map(l=>`<div class="reinforce-item"><span>${esc(l.title)}<small>${Math.round(accuracy(l.id)*100)}% de acerto</small></span><span><button class="text-button" type="button" onclick="openLesson('${l.id}')">Aula</button> · <button class="text-button" type="button" onclick="practiceLesson('${l.id}')">Treinar</button></span></div>`).join('')+`<button class="button secondary" type="button" onclick="startPractice({kind:'weak'})">Treinar todos os pontos fracos →</button>`:due.length?'':'<p>Nada pendente por aqui. Conforme você pratica, mostramos as revisões do dia e os assuntos em que você mais erra.</p>'}</section>
<section class="panel exam-date">${exam!==null?`<div><span class="label">CONTAGEM REGRESSIVA</span><h3>${exam===0?'A prova é hoje! Boa sorte! 🍀':`Faltam <b>${exam}</b> ${exam===1?'dia':'dias'} para a prova`}</h3></div><button class="text-button" type="button" onclick="setExamDate()">Alterar data</button>`:`<div><span class="label">CONTAGEM REGRESSIVA</span><h3>Quando é a sua prova?</h3></div><button class="button secondary" type="button" onclick="setExamDate()">Definir data</button>`}</section>
<section class="panel reminders" id="reminders"></section>
<div class="section-head"><div><span class="label">SUAS CONQUISTAS</span><h2>${badges.filter(b=>b.got).length} de ${badges.length} conquistas</h2></div></div>
<div class="badges">${badges.map(b=>`<div class="badge ${b.got?'got':''}" title="${esc(b.desc)}"><span>${b.got?'🏅':'🔒'}</span><b>${esc(b.name)}</b><small>${esc(b.desc)}</small></div>`).join('')}</div>
<div class="section-head"><div><span class="label">TODAS AS AULAS</span><h2>Estude um assunto</h2></div></div>
<div class="area-list">${homeAreas.map(([area,prefix,icon])=>{
    const items=lessons.filter(l=>areaOf(l.id)===prefix);
    const finished=items.filter(l=>mastered(l.id)).length;
    return `<details class="area-card" data-area="${prefix}"${state.openArea===prefix?' open':''}><summary><span class="icon" aria-hidden="true">${icon}</span><span class="area-title"><b>${area}</b><small>${finished} de ${items.length} dominadas</small><span class="bar" aria-hidden="true"><span style="width:${Math.round(finished/items.length*100)}%"></span></span></span><span class="chevron" aria-hidden="true">⌄</span></summary><div class="lesson-list">${items.map(l=>{
      const [label,kind]=lessonStatus(l.id);
      return `<button class="lesson-link" type="button" onclick="openLesson('${l.id}')"><span class="status-dot ${kind}" aria-hidden="true">${statusIcon[kind]}</span><span class="lesson-name">${l.title}<small>${label}</small></span><span aria-hidden="true">→</span></button>`;
    }).join('')}</div></details>`;
  }).join('')}</div>`;
  renderReminders();
  // Lembra qual área ficou aberta.
  app.querySelectorAll('details.area-card').forEach(d=>d.addEventListener('toggle',()=>{if(d.open){state.openArea=d.dataset.area;app.querySelectorAll('details.area-card').forEach(o=>{if(o!==d)o.open=false})}else if(state.openArea===d.dataset.area)delete state.openArea;try{localStorage.setItem(key,JSON.stringify(state))}catch{}}));
}

function setExamDate(){
  const box=document.querySelector('.exam-date');
  box.innerHTML=`<label for="exam-date-input"><span class="label">DATA DA PROVA</span></label><div class="exam-date-form"><input id="exam-date-input" type="date" min="${today()}" value="${state.examDate||''}"><button class="button" type="button" id="exam-date-save">Salvar</button></div>`;
  document.querySelector('#exam-date-save').onclick=()=>{const v=document.querySelector('#exam-date-input').value;if(v){state.examDate=v}else delete state.examDate;save();renderHome()};
}

// Cartão de lembretes por notificação (as funções de push ficam em account.js).
const hourOptions=sel=>Array.from({length:17},(_,i)=>i+6).map(h=>`<option value="${h}"${h===sel?' selected':''}>${h}h</option>`).join('');
async function renderReminders(message=''){
  const box=document.querySelector('#reminders');if(!box)return;
  const push=window.pushReminders,head='<span class="label">LEMBRETES NO CELULAR</span>';
  const note=message?`<p class="status">${esc(message)}</p>`:'';
  if(!push){box.innerHTML=`${head}<p>Carregando…</p>`;return}
  if(push.needsInstall()){box.innerHTML=`${head}<h3>Receba um lembrete por dia 🔔</h3><p>No iPhone, primeiro instale o app: toque em <b>Compartilhar</b> ⬆️ e depois em <b>Adicionar à Tela de Início</b>. Abra o app pela tela inicial e ative os lembretes aqui.</p>`;return}
  if(!push.supported()){box.innerHTML=`${head}<p>Este navegador não aceita notificações. No celular, use o Chrome (Android) ou instale o app.</p>`;return}
  if(!push.loggedIn()){box.innerHTML=`${head}<h3>Receba um lembrete por dia 🔔</h3><p>Entre na sua conta (no fim desta página) para ativar os lembretes.</p>`;return}
  let st;try{st=await push.status()}catch{st={on:false}}
  if(st.denied){box.innerHTML=`${head}<h3>Notificações bloqueadas</h3><p>Você bloqueou as notificações deste app. Para ativar, libere nas configurações do navegador ou do celular e volte aqui.</p>`;return}
  if(st.on){box.innerHTML=`${head}<h3>Lembretes ativados ✅</h3><p>Um lembrete por dia, só se você ainda não tiver estudado.</p><div class="reminder-form"><label for="reminder-hour">Horário</label><select id="reminder-hour">${hourOptions(st.hour)}</select><button class="text-button" type="button" id="reminder-off">Desativar</button></div>${note}`;
    box.querySelector('#reminder-hour').onchange=async e=>{await push.setHour(Number(e.target.value));renderReminders('Horário atualizado.')};
    box.querySelector('#reminder-off').onclick=async()=>{await push.disable();renderReminders('Lembretes desativados.')};return}
  box.innerHTML=`${head}<h3>Receba um lembrete por dia 🔔</h3><p>A gente te avisa no horário escolhido, só nos dias em que você ainda não estudou.</p><div class="reminder-form"><label for="reminder-hour">Horário</label><select id="reminder-hour">${hourOptions(19)}</select><button class="button" type="button" id="reminder-on">Ativar lembretes</button></div>${note}`;
  box.querySelector('#reminder-on').onclick=async e=>{e.target.disabled=true;e.target.textContent='Ativando…';
    try{await push.enable(Number(box.querySelector('#reminder-hour').value));renderReminders('Pronto! Enviamos uma notificação de teste.')}
    catch(err){renderReminders(err?.message==='denied'?'Você não permitiu as notificações. Toque em Ativar de novo e escolha “Permitir”.':'Não foi possível ativar agora. Tente de novo.')}};
}
