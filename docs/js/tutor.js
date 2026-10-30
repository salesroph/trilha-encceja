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
  'hum-democracia': 'Votar é uma forma de participar da democracia; conversar em uma audiência pública sobre uma obra é outra. Já os relatos de moradores antigos ajudam a lembrar como um lugar mudou. Comparar relatos e documentos ajuda a estudar o passado.',
  'mat-fracoes': 'Imagine uma barra de chocolate com 4 pedaços iguais. Comer 3 pedaços é comer 3/4 da barra. Para virar decimal, divida: 3 ÷ 4 = 0,75. Se juntar 1 pedaço com mais 2, são 3 pedaços de 4: 1/4 + 2/4 = 3/4.',
  'mat-proporcao': 'Se 1 pão custa R$ 0,50, 2 pães custam R$ 1,00 e 10 pães custam R$ 5,00: quando uma quantidade dobra, a outra também dobra. Na regra de três, monte a tabela (1 pão → 0,50; 10 pães → x) e multiplique em cruz: x = 10 × 0,50 = 5.',
  'mat-equacoes': 'Pense na equação como uma balança equilibrada. Em x + 7 = 19, tire 7 dos dois pratos: sobra x = 12. Uma função é uma regra que transforma entrada em saída: taxa de R$ 5 + R$ 2 por km; com 3 km, 5 + 2 × 3 = R$ 11.',
  'mat-geometria': 'Perímetro é o rodapé do cômodo: some todos os lados. Área é o piso que você vai cobrir: comprimento × largura. Volume é quanto cabe dentro de uma caixa: comprimento × largura × altura.',
  'mat-probabilidade': 'Média é dividir igualmente: se três amigos têm R$ 4, R$ 6 e R$ 8, juntando tudo (R$ 18) e repartindo, cada um fica com R$ 6. Probabilidade é casos que você quer sobre casos possíveis: sair 6 em um dado é 1 chance em 6.',
  'ling-coesao': 'Conectivos são as “pontes” entre ideias: “mas” mostra contraste, “porque” mostra causa, “portanto” mostra conclusão. Pronomes como “ela” e “isso” retomam algo já dito. E não existe um único jeito certo de falar: escolha a linguagem que combina com a situação.',
  'ling-redacao': 'Pense na redação como uma conversa para convencer alguém. 1) Diga sua opinião sobre o tema (tese). 2) Dê dois motivos, cada um em um parágrafo, com um exemplo. 3) Feche retomando a opinião e propondo uma solução: quem faz o quê, como e para quê. Antes de escrever, faça um rascunho rápido com essas três partes.',
  'ling-artes': 'Diante de uma obra, pergunte: o que vejo ou ouço? Que materiais e formas foram usados? Onde e quando ela foi feita? O que pode estar querendo dizer? Um grafite no muro de um bairro, por exemplo, pode falar sobre a vida das pessoas que moram ali.',
  'ling-idiomas': 'Você não precisa saber todas as palavras. Olhe título, imagens e palavras parecidas com o português: “information” lembra informação, “agua” é água. Depois pergunte: o texto informa, pede ou convida? Cuidado com falsos amigos, como “pretend” (fingir) e “exquisito” (delicioso).',
  'nat-materia': 'Água com sal parece uma coisa só: é mistura homogênea. Água com óleo mostra duas camadas: é heterogênea. Gelo derretendo continua sendo água (mudança física). Papel queimando vira cinza e fumaça, outras substâncias (mudança química).',
  'nat-celulas': 'A célula é como um tijolo do corpo. Dentro dela, o DNA funciona como um livro de receitas, e cada gene é uma receita. Os filhos recebem receitas do pai e da mãe. Ao longo de muitas gerações, quem tem características que ajudam a sobreviver deixa mais descendentes: é a seleção natural.',
  'nat-fisica': 'Velocidade média é quanto você andou dividido pelo tempo: 120 km em 2 h dá 60 km/h. Uma força é um empurrão ou puxão que muda o movimento. Num circuito, a corrente é como água num cano fechado: se o fio quebra, ela para e a lâmpada apaga.',
  'hum-brasil': 'Os portugueses ocuparam terras onde já viviam povos indígenas e usaram trabalho forçado, principalmente de africanos escravizados. Houve resistência: fugas, revoltas e quilombos. A abolição de 1888 acabou com a escravidão legal, mas sem garantir terra, escola ou trabalho digno, o que ajuda a explicar desigualdades de hoje.',
  'hum-mundo': 'Antes, muita coisa era feita à mão em casa ou em oficinas. Com as máquinas e as fábricas, a produção aumentou e muita gente se mudou para as cidades. Isso trouxe novos empregos, mas também jornadas longas, moradias precárias e a luta dos trabalhadores por direitos.',
  'hum-geografia': 'Tempo é o que acontece hoje (“está chovendo”); clima é o padrão de muitos anos (“aqui chove muito no verão”). Globalização é o mundo mais conectado: um celular pode ser projetado num país, montado em outro e vendido no mundo todo.',
  'hum-filosofia': 'Ética é parar para pensar se uma ação é justa, considerando as razões e as consequências para as outras pessoas. Respeitar a diversidade é reconhecer que culturas diferentes têm valor, sem tratar a própria como a única certa.'
};
async function askTutor(id) {
  const panel=document.querySelector('#tutor-panel');
  if(!panel)return;
  panel.hidden=false;
  if(panel.dataset.lesson===id){panel.scrollIntoView({behavior:'smooth',block:'nearest'});return;}
  panel.dataset.lesson=id;
  panel.innerHTML='<strong>Vamos tentar de outro jeito</strong><p>Conte sua dúvida se quiser. Você pode pedir até 5 explicações por dia.</p><label for="tutor-doubt">Qual parte ficou difícil?</label><textarea id="tutor-doubt" maxlength="400" rows="3" placeholder="Ex.: como encontro 20% de um valor?"></textarea><button class="button secondary" id="tutor-retry" type="button">Pedir explicação</button><p id="tutor-status" role="status"></p><div id="tutor-answer"></div>';
  const status=panel.querySelector('#tutor-status'),answer=panel.querySelector('#tutor-answer'),retry=panel.querySelector('#tutor-retry');
  async function explain(){
    const doubt=panel.querySelector('#tutor-doubt').value.trim();
    retry.disabled=true;status.textContent='Preparando outra explicação...';answer.textContent='';
    try {
      if(typeof window.requestLessonExplanation!=='function')throw new Error('unavailable');
      const result=await window.requestLessonExplanation(id,doubt);
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
