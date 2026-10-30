const homeAreas=[['Matemática','mat','◫'],['Linguagens','ling','✎'],['Ciências da Natureza','nat','✳'],['Ciências Humanas','hum','◎']];
const lessonStatus=s=>!s?['Não iniciada','new']:s.stage==='done'?['Concluída','done']:s.stage==='same'?['Revisão de hoje','review']:s.stage==='next'?(s.reviewDate&&today()>s.reviewDate?['Revisão pendente','review']:['Revisão amanhã','wait']):['Em andamento','doing'];
const statusIcon={new:'○',doing:'◐',review:'🔔',wait:'◷',done:'✓'};

// Escolhe a próxima ação: revisão vencida, aula em andamento ou a primeira aula ainda não iniciada (alternando as áreas).
function nextStep(){
  const review=pendingReviews()[0];
  if(review)return {lesson:review,title:'Hora da revisão',text:'Revisar agora ajuda a guardar o conteúdo.',cta:'Revisar'};
  const doing=lessons.find(l=>state[l.id]&&['explain','practice'].includes(state[l.id].stage));
  if(doing)return {lesson:doing,title:'Continue de onde parou',text:'Você já começou esta aula.',cta:'Continuar'};
  const byArea=homeAreas.map(([,p])=>lessons.filter(l=>(l.id===p||l.id.startsWith(p+'-'))&&!state[l.id]));
  for(let i=0;i<Math.max(...byArea.map(a=>a.length));i++)for(const a of byArea)if(a[i]){const started=lessons.some(l=>state[l.id]);return {lesson:a[i],title:started?'Sua próxima aula':'Comece por aqui',text:started?'Seguimos alternando as áreas para você treinar um pouco de tudo.':'Uma aula leva cerca de 10 minutos: explicação, exercícios e revisão.',cta:started?'Começar aula':'Começar a primeira aula'}}
  return null;
}

function renderHome() {
  current=null; readOnly=false; reviewBanner();
  document.querySelector('#homeNav').classList.add('active');
  document.querySelector('#sourcesNav').classList.remove('active');
  const done=lessons.filter(l=>state[l.id]?.stage==='done').length, exams=(state.simulados||[]).length, next=nextStep();
  const open=state.openArea;
  app.innerHTML=`${next?`<section class="next-card"><span class="label">${next.title.toUpperCase()}</span><h2>${next.lesson.title}</h2><p>${next.lesson.area} · ${next.text}</p><button class="button" type="button" onclick="openLesson('${next.lesson.id}')">${next.cta} →</button></section>`:`<section class="next-card"><span class="label">PARABÉNS</span><h2>Você concluiu todas as aulas!</h2><p>Agora treine com simulados para chegar afiado no dia da prova.</p><button class="button" type="button" onclick="examHome()">Fazer um simulado →</button></section>`}
<div class="progress-summary"><div><b>${done}</b> de ${lessons.length}<small>aulas concluídas</small></div><div><b>${exams}</b><small>${exams===1?'simulado feito':'simulados feitos'}</small></div></div>
<div class="section-head"><div><span class="label">TODAS AS AULAS</span><h2>Áreas de conhecimento</h2></div></div>
<div class="area-list">${homeAreas.map(([area,prefix,icon])=>{
    const items=lessons.filter(l=>l.id===prefix||l.id.startsWith(prefix+'-'));
    const finished=items.filter(l=>state[l.id]?.stage==='done').length;
    return `<details class="area-card" data-area="${prefix}"${open===prefix?' open':''}><summary><span class="icon" aria-hidden="true">${icon}</span><span class="area-title"><b>${area}</b><small>${finished} de ${items.length} concluídas</small><span class="bar" aria-hidden="true"><span style="width:${Math.round(finished/items.length*100)}%"></span></span></span><span class="chevron" aria-hidden="true">⌄</span></summary><div class="lesson-list">${items.map(l=>{
      const [label,kind]=lessonStatus(state[l.id]);
      return `<button class="lesson-link" type="button" onclick="openLesson('${l.id}')"><span class="status-dot ${kind}" aria-hidden="true">${statusIcon[kind]}</span><span class="lesson-name">${l.title}<small>${label}</small></span><span aria-hidden="true">→</span></button>`;
    }).join('')}</div></details>`;
  }).join('')}</div>`;
  // Lembra qual área ficou aberta, sem enviar isso para a nuvem.
  app.querySelectorAll('details.area-card').forEach(d=>d.addEventListener('toggle',()=>{if(d.open){state.openArea=d.dataset.area;app.querySelectorAll('details.area-card').forEach(o=>{if(o!==d)o.open=false})}else if(state.openArea===d.dataset.area)delete state.openArea;try{localStorage.setItem(key,JSON.stringify(state))}catch{}}));
}
