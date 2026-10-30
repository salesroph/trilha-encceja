// Simulado: questões novas geradas por IA ou, como reserva, sorteadas do banco das aulas.
const examAreaNames={misto:'Todas as áreas',mat:'Matemática',ling:'Linguagens',nat:'Ciências da Natureza',hum:'Ciências Humanas'};
let exam=null;
const shuffled=list=>{const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
function mixOptions(q){const right=q.alternativas[q.correta],alternativas=shuffled(q.alternativas);return {...q,alternativas,correta:alternativas.indexOf(right)}}

function setExamNav(){
  document.querySelector('#examNav').classList.add('active');
  document.querySelector('#homeNav').classList.remove('active');
  document.querySelector('#sourcesNav').classList.remove('active');
}

function bankExam(area){
  const pool=lessons.filter(l=>area==='misto'||l.id===area||l.id.startsWith(area+'-'));
  const picked=shuffled(pool).slice(0,10).map(l=>{const qs=[...l.qs,l.same,l.next];const q=qs[Math.floor(Math.random()*qs.length)];return {enunciado:q[0],alternativas:q[1],correta:q[2],explicacao:q[3],tema:l.title,aula:l.id}});
  return picked.map(mixOptions);
}

function examHome(){
  current=null;exam=null;reviewBanner();setExamNav();
  const history=(state.simulados||[]).slice(-5).reverse();
  app.innerHTML=`<div class="section-head"><div><span class="label">TREINE COMO NA PROVA</span><h2>Simulado</h2></div></div>
<section class="panel"><p>Escolha a área. Com a sua conta, a IA cria <b>10 questões novas</b> no estilo do ENCCEJA a cada simulado (usa 1 dos seus 5 pedidos de IA do dia). Sem conta, ou se a IA estiver indisponível, montamos o simulado com questões sorteadas das aulas.</p>
<div class="exam-areas">${Object.entries(examAreaNames).map(([id,name])=>`<button class="button secondary" type="button" onclick="startExam('${id}')">${name}</button>`).join('')}</div>
<p id="exam-status" role="status"></p>
${history.length?`<h3>Seus últimos simulados</h3><ul>${history.map(h=>`<li>${h.date.split('-').reverse().join('/')} · ${esc(examAreaNames[h.area]||h.area)}: <b>${h.score} de ${h.total}</b>${h.ai?' · gerado por IA':''}</li>`).join('')}</ul>`:''}
<div class="notice">As questões geradas por IA são inéditas e podem, raramente, conter erros. Se discordar de um gabarito, confira na aula do tema. Para treinar com questões oficiais, use as provas anteriores em “Materiais e fontes”.</div></section>`;
}

async function startExam(area){
  const status=document.querySelector('#exam-status');
  document.querySelectorAll('.exam-areas button').forEach(b=>b.disabled=true);
  let questions,ai=false,note='';
  status.textContent='Gerando um simulado novo com IA... isso pode levar até um minuto.';
  try{
    if(typeof window.requestAIExam!=='function')throw new Error('unavailable');
    questions=(await window.requestAIExam(area)).map(mixOptions);ai=true;
  }catch(e){
    note=e?.message==='signin'?'Entre na sua conta para receber questões novas geradas por IA. Este simulado usa questões das aulas.':e?.message==='quota'?'Você usou seus pedidos de IA de hoje. Este simulado usa questões das aulas.':'A IA não respondeu agora. Este simulado usa questões das aulas.';
    questions=bankExam(area);
  }
  exam={area,questions,ai,note,started:Date.now()};
  renderExam();
}

function renderExam(){
  setExamNav();
  const {area,questions,ai,note}=exam;
  app.innerHTML=`<button class="text-button" onclick="examHome()">← Simulados</button><div class="section-head"><div><span class="label">${ai?'SIMULADO GERADO POR IA':'SIMULADO COM QUESTÕES DAS AULAS'}</span><h2>${esc(examAreaNames[area])}</h2></div><p>${questions.length} questões</p></div>
${note?`<div class="feedback">${esc(note)}</div>`:''}
<section class="panel"><form id="exam-form">${questions.map((q,i)=>`<div class="question"><p><b>${i+1}.</b> <small class="muted">${esc(q.tema||'')}</small><br>${esc(q.enunciado).replace(/\n/g,'<br>')}</p>${q.alternativas.map((x,j)=>`<label class="option"><input type="radio" name="e${i}" value="${j}"> &nbsp; ${String.fromCharCode(65+j)}. ${esc(x)}</label>`).join('')}<div id="exam-feedback${i}"></div></div>`).join('')}
<button class="button" type="submit">Corrigir simulado →</button></form><div id="exam-result"></div></section>`;
  document.querySelector('#exam-form').onsubmit=e=>{e.preventDefault();finishExam(new FormData(e.target))};
}

function finishExam(data){
  const {questions}=exam;let score=0;
  markAnswers(document.querySelector('#exam-form'),questions.map(q=>q.correta),i=>data.get('e'+i));
  questions.forEach((q,i)=>{
    const chosen=data.get('e'+i),ok=chosen!==null&&Number(chosen)===q.correta;if(ok)score++;
    if(q.aula&&chosen!==null)recordAnswer(q.aula,ok,q.dificuldade);
    document.querySelector('#exam-feedback'+i).innerHTML=`<div class="feedback">${ok?'✓ Correta.':chosen===null?'Sem resposta.':'✗ Incorreta.'} Resposta: <b>${String.fromCharCode(65+q.correta)}</b>. ${esc(q.explicacao||'')}</div>`;
  });
  const minutes=Math.max(1,Math.round((Date.now()-exam.started)/60000));
  state.simulados=(state.simulados||[]).concat({date:today(),area:exam.area,score,total:questions.length,ai:exam.ai}).slice(-30);checkBadges();save();
  const pct=Math.round(score/questions.length*100);
  const result=document.querySelector('#exam-result');
  result.innerHTML=`<div class="feedback"><b>Você acertou ${score} de ${questions.length} (${pct}%) em cerca de ${minutes} min.</b><br>${pct>=60?'Bom resultado! Continue treinando para manter o ritmo.':'Revise as explicações acima e volte às aulas dos temas em que errou.'}</div><button class="button" type="button" onclick="startExam('${exam.area}')">Fazer outro simulado →</button> <button class="button secondary" type="button" onclick="examHome()">Voltar</button>`;
  result.scrollIntoView({behavior:'smooth',block:'nearest'});
}

