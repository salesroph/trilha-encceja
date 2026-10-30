// Redação: tema sorteado, rascunho salvo no aparelho e correção comentada pela IA.
const ESSAY_DRAFT_KEY='trilha-encceja-rascunho-redacao';
const essayThemes=[
  'Desafios para a valorização do trabalho informal no Brasil',
  'A importância da leitura na formação do cidadão',
  'Caminhos para combater o lixo nas cidades brasileiras',
  'O combate à violência contra a mulher no Brasil',
  'Desafios da mobilidade urbana nas grandes cidades',
  'A importância da vacinação para a saúde coletiva',
  'Os impactos das redes sociais na vida dos jovens',
  'O combate às notícias falsas na internet',
  'Caminhos para reduzir a evasão escolar no Brasil',
  'A inclusão de pessoas com deficiência no mercado de trabalho',
  'O desperdício de alimentos no Brasil',
  'Desafios para garantir saneamento básico a todos os brasileiros',
  'A valorização da pessoa idosa na sociedade brasileira',
  'O papel da educação de jovens e adultos na redução das desigualdades',
  'Caminhos para combater o racismo no Brasil',
  'Os desafios do acesso à saúde pública',
  'A preservação das florestas brasileiras',
  'O uso consciente da água no dia a dia',
  'A segurança no trânsito e a prevenção de acidentes',
  'Os desafios da inclusão digital no Brasil',
];
let essayTheme=null;
const readDraft=()=>{try{return JSON.parse(localStorage.getItem(ESSAY_DRAFT_KEY)||'null')}catch{return null}};
const writeDraft=d=>{try{localStorage.setItem(ESSAY_DRAFT_KEY,JSON.stringify(d))}catch{}};

function essayHome(){
  current=null;session=null;
  const draft=readDraft();
  essayTheme=essayTheme||draft?.tema||pick1(essayThemes);
  const history=(state.redacoes||[]).slice(-5).reverse();
  app.innerHTML=`<div class="section-head"><div><span class="label">TREINE A ESCRITA</span><h2>Redação</h2></div></div>
<section class="panel"><span class="label">SEU TEMA</span><h3 class="essay-theme" id="essay-theme">${esc(essayTheme)}</h3>
<button class="text-button" type="button" onclick="newEssayTheme()">↻ Sortear outro tema</button>
<details class="essay-tips"><summary>Como montar o texto (toque para ver)</summary><ol><li><b>Introdução:</b> apresente o tema e diga sua opinião (tese).</li><li><b>Desenvolvimento 1:</b> primeiro argumento, explicado, com um exemplo.</li><li><b>Desenvolvimento 2:</b> segundo argumento, explicado, com um exemplo.</li><li><b>Conclusão:</b> retome a tese e proponha uma solução: quem faz, o quê, como e para quê.</li></ol><p>Quer revisar antes? <button class="text-button" type="button" onclick="openLesson('ling-redacao-estrutura')">Aula de estrutura</button> · <button class="text-button" type="button" onclick="openLesson('ling-redacao-proposta')">Aula de proposta de intervenção</button></p></details>
<label class="essay-label" for="essay-text">Escreva sua redação</label>
<textarea id="essay-text" rows="16" maxlength="5000" placeholder="Comece pela introdução...">${esc(draft?.texto||'')}</textarea>
<p class="muted" id="essay-count"></p>
<button class="button" id="essay-send" type="button" onclick="sendEssay()">Enviar para correção →</button>
<p id="essay-status" role="status"></p><div id="essay-result"></div></section>
${history.length?`<section class="panel"><h3>Suas últimas redações</h3><ul>${history.map(h=>`<li>${h.date.split('-').reverse().join('/')} · ${esc(h.tema)}: <b>${h.nota.toLocaleString('pt-BR')}</b></li>`).join('')}</ul></section>`:''}
<div class="notice">A nota é uma estimativa feita por IA para você treinar. Ela não é a nota oficial do ENCCEJA.</div>`;
  const area=document.querySelector('#essay-text');
  const update=()=>{const t=area.value.trim(),words=t?t.split(/\s+/).length:0,pars=t?t.split(/\n\s*\n|\n/).filter(p=>p.trim()).length:0;document.querySelector('#essay-count').textContent=`${words} palavras · ${pars} ${pars===1?'parágrafo':'parágrafos'}${words&&words<120?' · escreva pelo menos uns 4 parágrafos':''}`;writeDraft({tema:essayTheme,texto:area.value})};
  area.addEventListener('input',update);update();
}

function newEssayTheme(){
  const area=document.querySelector('#essay-text');
  if(area.value.trim().length>40&&!confirm('Trocar de tema? Seu texto continua salvo aqui.'))return;
  let t;do{t=pick1(essayThemes)}while(t===essayTheme);essayTheme=t;
  document.querySelector('#essay-theme').textContent=t;writeDraft({tema:t,texto:area.value});
}

async function sendEssay(){
  const text=document.querySelector('#essay-text').value.trim(),status=document.querySelector('#essay-status'),button=document.querySelector('#essay-send');
  if(text.length<200){status.textContent='Escreva um pouco mais antes de enviar: pelo menos alguns parágrafos.';return}
  button.disabled=true;status.textContent='Corrigindo sua redação... isso pode levar até um minuto.';
  try{
    if(typeof window.requestEssayCorrection!=='function')throw new Error('unavailable');
    const r=await window.requestEssayCorrection(essayTheme,text);
    status.textContent='';
    state.redacoes=(state.redacoes||[]).concat({date:today(),tema:essayTheme,nota:r.nota}).slice(-30);
    const events=checkBadges();save();
    const msg=r.nota>=8?'Excelente redação! 🏆':r.nota>=6?'Muito bom! Você está no caminho certo 💪':r.nota>=5?'Boa! Dá para chegar mais longe 👍':'Bom começo! Veja abaixo o que ajustar 🌱';
    document.querySelector('#essay-result').innerHTML=`<div class="essay-score"><b>${r.nota.toLocaleString('pt-BR')}</b><span>de 10</span><p>${msg}</p></div>
${events.map(e=>`<div class="celebrate">${esc(e)}</div>`).join('')}
${r.criterios.map(c=>`<div class="criterion"><div><b>${esc(c.nome)}</b><span>${c.nota.toLocaleString('pt-BR')}</span></div><span class="bar"><span style="width:${c.nota*10}%"></span></span><p>${esc(c.comentario)}</p></div>`).join('')}
${r.pontos_fortes.length?`<h3>Pontos fortes</h3><ul>${r.pontos_fortes.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}
${r.melhorar.length?`<h3>O que melhorar</h3><ul>${r.melhorar.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}
${r.exemplo_reescrita?`<h3>Exemplo de como reescrever</h3><div class="feedback">${esc(r.exemplo_reescrita)}</div>`:''}
<button class="button" type="button" onclick="essayTheme=null;writeDraft(null);essayHome()">Escrever outra redação →</button>`;
    document.querySelector('#essay-result').scrollIntoView({behavior:'smooth',block:'start'});
  }catch(e){
    status.textContent=e?.message==='signin'?'Entre na sua conta (na tela inicial) para receber a correção. Seu texto fica salvo aqui.':e?.message==='quota'?'Você usou a IA o máximo permitido hoje. Seu texto fica salvo; envie amanhã.':'A correção não está disponível agora. Seu texto fica salvo; tente de novo mais tarde.';
  }finally{button.disabled=false}
}
