function renderHome() {
  current=null; readOnly=false; reviewBanner();
  document.querySelector('#homeNav').classList.add('active');
  document.querySelector('#sourcesNav').classList.remove('active');
  const areas=[['Matemática','mat'],['Linguagens','ling'],['Ciências da Natureza','nat'],['Ciências Humanas','hum']];
  app.innerHTML=`<div class="hero"><div><span class="label">SEU RITMO DE ESTUDO</span><h2>Um passo de cada vez.</h2><p>Escolha uma aula para aprender e praticar. Você pode estudar em qualquer ordem e voltar às revisões quando quiser.</p></div><div class="hero-icon">✳</div></div><div class="section-head"><div><span class="label">ESCOLHA SEU CAMINHO</span><h2>Áreas de conhecimento</h2></div><p>${lessons.length} aulas disponíveis</p></div><div class="cards">${areas.map(([area, prefix])=>{
    const items=lessons.filter(l=>l.id===prefix||l.id.startsWith(prefix+'-'));
    return `<section class="card area-card"><div class="card-top"><span class="icon">${items[0].icon}</span><span class="tag">${items.length} AULAS</span></div><h3>${area}</h3><div class="lesson-list">${items.map(l=>{
      const s=state[l.id];
      const label=s?.stage==='done'?'Concluída':s?.stage==='same'?'Revisão de hoje':s?.stage==='next'?(s.reviewDate&&today()>s.reviewDate?'Revisão pendente':'Revisão agendada'):s?'Em andamento':'Disponível';
      return `<button class="lesson-link" type="button" onclick="openLesson('${l.id}')"><span>${l.title}<small>${label}</small></span><span aria-hidden="true">→</span></button>`;
    }).join('')}</div></section>`;
  }).join('')}</div>`;
}
