// Ativar somente após implantação e teste do serviço de IA.
const aiTutorEnabled = false;
const alternativeExplanations = {
  mat: 'Pense em uma etiqueta que divide um valor em 100 partes iguais. Se um produto custa R$ 100, cada parte vale R$ 1. Assim, 20% correspondem a R$ 20. Em R$ 50, cada parte vale R$ 0,50; logo, 20 partes valem R$ 10. Se for desconto, subtraia esse valor do preço: R$ 50 − R$ 10 = R$ 40. O valor de partida muda, mas a ideia de “partes em 100” continua a mesma.',
  ling: 'Imagine alguém dizendo: “Precisamos de mais árvores na praça porque elas dão sombra”. Pergunte duas coisas: o que a pessoa defende? Mais árvores. Por qual motivo? Elas dão sombra. A primeira resposta é o ponto de vista; a segunda é o argumento. Quando o texto tenta convencer alguém, procure o pedido e as razões que o sustentam.',
  nat: 'Pense na saúde de um bairro como algo que depende de várias condições. Se a água está contaminada, tratar a água ajuda a evitar contato com microrganismos. Se há recipientes com água parada, esvaziá-los dificulta a reprodução de mosquitos. Antes de escolher uma solução, identifique qual é o problema e como a medida atua sobre ele.',
  hum: 'Cidadania é participar da vida em comunidade e exercer direitos e deveres. Por exemplo: estudar em uma escola pública envolve o direito à educação; votar é uma forma de participação política; participar de uma reunião sobre a praça é outra forma de discutir decisões coletivas. Uma política pública é uma ação organizada pelo poder público para responder a uma necessidade da população.'
};
async function askTutor(id) {
  const panel=document.querySelector('#tutor-panel');
  if(!panel)return;
  panel.hidden=false;
  if(panel.dataset.lesson===id){panel.scrollIntoView({behavior:'smooth',block:'nearest'});return;}
  panel.dataset.lesson=id;
  panel.innerHTML='<strong>Vamos tentar de outro jeito</strong><p id="tutor-status" role="status">Preparando outra explicação...</p><div id="tutor-answer"></div><label for="tutor-doubt">Se quiser, conte qual parte ficou difícil:</label><textarea id="tutor-doubt" maxlength="400" rows="3" placeholder="Ex.: como encontro 20% de um valor?"></textarea><button class="button secondary" id="tutor-retry" type="button">Pedir outra explicação</button>';
  const status=panel.querySelector('#tutor-status'),answer=panel.querySelector('#tutor-answer'),retry=panel.querySelector('#tutor-retry');
  async function explain(){
    const doubt=panel.querySelector('#tutor-doubt').value.trim();
    retry.disabled=true;status.textContent='Preparando outra explicação...';answer.textContent='';
    try {
      if(!aiTutorEnabled || typeof window.requestLessonExplanation!=='function')throw new Error('unavailable');
      const result=await window.requestLessonExplanation(id,doubt);
      if(!result || typeof result!=='string')throw new Error('unavailable');
      status.textContent='Uma nova explicação para você:';answer.textContent=result;
    } catch(e) {
      status.textContent=e?.message==='signin'?'Entre na sua conta para usar a explicação por IA. Enquanto isso, veja este outro jeito de entender:':e?.message==='quota'?'Você atingiu o limite de explicações por IA de hoje. Enquanto isso, veja este outro jeito de entender:':'A explicação por IA ainda não está disponível. Enquanto isso, veja este outro jeito de entender:';
      answer.textContent=alternativeExplanations[id]||'Leia novamente os exemplos e tente identificar o passo que ficou mais difícil.';
    } finally {retry.disabled=false;}
  }
  retry.onclick=explain;
  await explain();
}
