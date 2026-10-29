const alternativeExplanations = {
  mat: 'Pense em uma etiqueta que divide um valor em 100 partes iguais. Se um produto custa R$ 100, cada parte vale R$ 1. Assim, 20% correspondem a R$ 20. Em R$ 50, cada parte vale R$ 0,50; logo, 20 partes valem R$ 10. Se for desconto, subtraia esse valor do preço: R$ 50 − R$ 10 = R$ 40. O valor de partida muda, mas a ideia de “partes em 100” continua a mesma.',
  ling: 'Imagine alguém dizendo: “Precisamos de mais árvores na praça porque elas dão sombra”. Pergunte duas coisas: o que a pessoa defende? Mais árvores. Por qual motivo? Elas dão sombra. A primeira resposta é o ponto de vista; a segunda é o argumento. Quando o texto tenta convencer alguém, procure o pedido e as razões que o sustentam.',
  nat: 'Pense na saúde de um bairro como algo que depende de várias condições. Se a água está contaminada, tratar a água ajuda a evitar contato com microrganismos. Se há recipientes com água parada, esvaziá-los dificulta a reprodução de mosquitos. Antes de escolher uma solução, identifique qual é o problema e como a medida atua sobre ele.',
  hum: 'Cidadania é participar da vida em comunidade e exercer direitos e deveres. Por exemplo: estudar em uma escola pública envolve o direito à educação; votar é uma forma de participação política; participar de uma reunião sobre a praça é outra forma de discutir decisões coletivas. Uma política pública é uma ação organizada pelo poder público para responder a uma necessidade da população.',
  'mat-graficos-tabelas': 'Imagine três contas de água: 10, 20 e 30 reais. A maior é 30. Para saber quanto a última supera a primeira, faça 30 − 10 = 20. Para achar a média, some 10 + 20 + 30 = 60 e divida por 3: a média é 20 reais.',
  'mat-medidas': 'Pense em uma garrafa de 1 litro: ela contém 1 000 mililitros. Meia garrafa contém 500 mL. Agora imagine um piso retangular de 3 m por 2 m: são 3 × 2 = 6 metros quadrados de superfície.',
  'ling-generos': 'Um aviso de horário informa: “A biblioteca abre às 8h”. Um cartaz pode convidar: “Venha à biblioteca!”. Compare o que cada texto quer provocar no leitor; palavras e imagens dão pistas sobre essa finalidade.',
  'ling-leitura': 'Se o texto diz “Ana levou um guarda-chuva”, sabemos isso diretamente. Se acrescenta que o céu estava escuro, podemos supor que ela esperava chuva. É uma possibilidade apoiada nas pistas, não uma certeza de que choveu.',
  'nat-energia': 'Uma lâmpada recebe eletricidade e produz luz e calor. Dois aparelhos ligados pelo mesmo tempo podem consumir quantidades diferentes: se oferecem a mesma iluminação, uma lâmpada de 9 W usa menos energia que uma de 60 W.',
  'nat-ecologia': 'Imagine uma horta com plantas, insetos e pássaros. Os insetos podem comer plantas e os pássaros podem comer insetos. Se uma dessas populações muda, as outras podem ser afetadas. Fungos e bactérias ajudam a decompor restos.',
  'hum-territorio': 'Dois bairros podem ter acessos diferentes a transporte e saúde. Se um tem poucos ônibus, seus moradores podem demorar mais para chegar ao trabalho. Essa diferença no acesso a serviços é um exemplo de desigualdade entre espaços.',
  'hum-democracia': 'Votar é uma forma de participar da democracia; conversar em uma audiência pública sobre uma obra é outra. Já os relatos de moradores antigos ajudam a lembrar como um lugar mudou. Comparar relatos e documentos ajuda a estudar o passado.'
};
async function askTutor(id) {
  const panel=document.querySelector('#tutor-panel');
  if(!panel)return;
  panel.hidden=false;
  if(panel.dataset.lesson===id){panel.scrollIntoView({behavior:'smooth',block:'nearest'});return;}
  panel.dataset.lesson=id;
  panel.innerHTML='<strong>Vamos tentar de outro jeito</strong><p>Escolha uma IA e, se quiser, conte sua dúvida. Você pode pedir até 5 explicações por dia.</p><label for="tutor-provider">IA para explicar:</label><select id="tutor-provider"><option value="deepseek">DeepSeek</option><option value="glm">GLM</option></select><label for="tutor-doubt">Se quiser, conte qual parte ficou difícil:</label><textarea id="tutor-doubt" maxlength="400" rows="3" placeholder="Ex.: como encontro 20% de um valor?"></textarea><button class="button secondary" id="tutor-retry" type="button">Pedir explicação</button><p id="tutor-status" role="status"></p><div id="tutor-answer"></div>';
  const status=panel.querySelector('#tutor-status'),answer=panel.querySelector('#tutor-answer'),retry=panel.querySelector('#tutor-retry');
  async function explain(){
    const doubt=panel.querySelector('#tutor-doubt').value.trim();
    retry.disabled=true;status.textContent='Preparando outra explicação...';answer.textContent='';
    try {
      if(typeof window.requestLessonExplanation!=='function')throw new Error('unavailable');
      const result=await window.requestLessonExplanation(id,doubt,panel.querySelector('#tutor-provider').value);
      if(!result || typeof result!=='string')throw new Error('unavailable');
      status.textContent='Uma nova explicação para você:';answer.textContent=result;
    } catch(e) {
      status.textContent=e?.message==='signin'?'Entre na sua conta para usar a explicação por IA. Enquanto isso, veja este outro jeito de entender:':e?.message==='quota'?'Você atingiu o limite de explicações por IA de hoje. Enquanto isso, veja este outro jeito de entender:':'A explicação por IA ainda não está disponível. Enquanto isso, veja este outro jeito de entender:';
      answer.textContent=alternativeExplanations[id]||'Leia novamente os exemplos e tente identificar o passo que ficou mais difícil.';
    } finally {retry.disabled=false;}
  }
  retry.onclick=explain;
  panel.scrollIntoView({behavior:'smooth',block:'nearest'});
}
