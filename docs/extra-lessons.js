// Aulas adicionais autorais. As situações seguem a lógica das apostilas
// (competência + problema do cotidiano) e o estilo contextualizado observado
// no caderno oficial de Matemática 2020 e nos cadernos oficiais de 2020 das
// demais áreas. Não reproduzem questões oficiais.
const extraLessons = [
  {
    id: 'mat-graficos-tabelas', area: 'Matemática', icon: '◫',
    title: 'Gráficos e tabelas do dia a dia',
    chapter: 'Matemática · capítulo VIII, “Gráficos e tabelas do dia-a-dia”',
    pdf: 'https://download.inep.gov.br/educacao_basica/encceja/material_estudo/livro_estudante/encceja_matematica_ens_medio.pdf',
    explain: [
      'Uma tabela organiza dados; um gráfico permite comparar valores e perceber tendências rapidamente. Antes de calcular, confira título, unidade, período e legenda.',
      'Para comparar uma variação, encontre a diferença entre os valores. Exemplo: uma conta passou de R$ 40 para R$ 46. A diferença é 46 − 40 = R$ 6. Para calcular o aumento percentual, divida 6 pelo valor inicial, 40, e multiplique por 100: 6 ÷ 40 × 100 = 15%.',
      'A média resume os valores em uma divisão igual. Some os valores e divida pela quantidade deles: 8, 12 e 10 livros somam 30; como são três meses, 30 ÷ 3 = 10 livros por mês. Confira se a pergunta pede diferença, porcentagem ou média.'
    ],
    tip: 'Leia a unidade e o período antes de olhar as alternativas; muitas respostas erradas surgem da leitura apressada do gráfico.',
    qs: [
      ['Uma família registrou o consumo de água: abril 18 m³, maio 21 m³ e junho 19 m³. Em qual mês o consumo foi maior?', ['abril', 'maio', 'junho', 'foi igual'], 1, '21 m³ é o maior valor da tabela.'],
      ['Uma tarifa passou de R$ 40 para R$ 46. Qual foi o aumento percentual?', ['6%', '10%', '15%', '46%'], 2, 'O aumento foi de R$ 6; 6 ÷ 40 = 0,15, ou 15%.']
    ],
    same: ['Em um gráfico, a barra de 2024 mostra 120 atendimentos e a de 2025 mostra 150. Quantos atendimentos a mais houve em 2025?', ['20', '30', '120', '270'], 1, 'A diferença é 150 − 120 = 30.'],
    next: ['Uma tabela mostra 8, 12 e 10 livros lidos em três meses. Qual é a média mensal?', ['8', '9', '10', '30'], 2, 'A média é (8 + 12 + 10) ÷ 3 = 10.']
  },
  {
    id: 'mat-medidas', area: 'Matemática', icon: '◫',
    title: 'Medidas, escala e espaço',
    chapter: 'Matemática · capítulos IV e V, “Nossa realidade e as formas que nos rodeiam” e “Medidas e seus usos”',
    pdf: 'https://download.inep.gov.br/educacao_basica/encceja/material_estudo/livro_estudante/encceja_matematica_ens_medio.pdf',
    explain: [
      'Medir é comparar uma grandeza com uma unidade. Em problemas práticos, transforme as unidades antes de operar: 1 m = 100 cm e 1 L = 1 000 mL.',
      'Em uma planta ou mapa, a escala relaciona o desenho ao tamanho real. Se 1 cm representa 2 m, então 4 cm representam 4 × 2 = 8 m. Em uma conversão, 750 mL correspondem a 750 ÷ 1 000 = 0,75 L.',
      'Área é a medida da superfície. Para um retângulo, multiplique comprimento por largura: um terreno de 8 m por 5 m tem área de 8 × 5 = 40 m². O resultado usa unidades quadradas porque mede uma superfície, não apenas um comprimento.'
    ],
    tip: 'Anote a unidade de cada número e converta tudo para a mesma unidade antes de calcular.',
    qs: [
      ['Uma receita usa 750 mL de suco. Quantos litros correspondem a essa quantidade?', ['0,075 L', '0,75 L', '7,5 L', '75 L'], 1, '750 ÷ 1 000 = 0,75 L.'],
      ['Em uma planta, 1 cm representa 2 m. Um corredor mede 6 cm no desenho. Qual é o comprimento real?', ['3 m', '8 m', '12 m', '20 m'], 2, 'Multiplique 6 por 2: o corredor mede 12 m.']
    ],
    same: ['Um terreno retangular tem 8 m de comprimento e 5 m de largura. Qual é sua área?', ['13 m²', '26 m²', '40 m²', '80 m²'], 2, 'Área do retângulo = comprimento × largura = 8 × 5 = 40 m².'],
    next: ['Uma caixa contém 2,5 L de água. Quantos mililitros há nela?', ['25 mL', '250 mL', '2 500 mL', '25 000 mL'], 2, '2,5 × 1 000 = 2 500 mL.']
  },
  {
    id: 'ling-generos', area: 'Linguagens', icon: '✎',
    title: 'Gênero, finalidade e linguagem',
    chapter: 'Linguagens · capítulos I e IX, publicidade e tecnologias de comunicação',
    pdf: 'https://download.inep.gov.br/educacao_basica/encceja/material_estudo/livro_estudante/linguagens_codigos_em_br.pdf',
    explain: [
      'O gênero textual está ligado à situação de comunicação. Um aviso orienta, uma notícia informa, uma campanha procura mobilizar e uma propaganda busca persuadir.',
      'A escolha de palavras, imagens e verbos revela a finalidade. Imperativos como “participe” ou “economize” indicam convite ou orientação; dados, fonte e data ajudam a situar a informação e verificar sua origem. Esses elementos, sozinhos, não garantem que a notícia seja verdadeira.',
      'Compare dois exemplos: “A campanha começa na segunda-feira” informa uma data. “Participe da campanha!” convida o leitor a agir. Em um cartaz com torneira fechada e “Cada gota conta”, imagem e frase trabalham juntas para incentivar a economia de água.'
    ],
    tip: 'Pergunte: quem produziu o texto, para qual público e qual ação ou compreensão ele espera provocar?',
    qs: [
      ['“Vacine-se contra a gripe. Procure a unidade de saúde mais próxima.” Esse texto tem a finalidade de', ['narrar uma aventura', 'orientar e mobilizar', 'divertir o leitor', 'descrever uma paisagem'], 1, 'O texto orienta uma ação de saúde e mobiliza o público.'],
      ['Uma notícia apresenta título, data, local e fala de uma fonte. Esses elementos ajudam a', ['inventar personagens', 'situar e verificar a origem da informação', 'formar versos', 'ocultar o assunto'], 1, 'Data, local e fonte ajudam a situar e conferir a informação, embora não garantam sua veracidade.']
    ],
    same: ['Em “Economize energia: apague a luz ao sair”, o verbo “apague” está no', ['indicativo', 'imperativo', 'infinitivo', 'particípio'], 1, 'O imperativo expressa orientação ou pedido.'],
    next: ['Um cartaz combina imagem de uma torneira fechada com a frase “Cada gota conta”. O recurso principal é', ['apelo à economia de água', 'relato de uma viagem', 'explicação de uma regra gramatical', 'descrição de um personagem'], 0, 'A imagem e a frase procuram incentivar economia de água.']
  },
  {
    id: 'ling-leitura', area: 'Linguagens', icon: '✎',
    title: 'Informação explícita e inferência',
    chapter: 'Linguagens · capítulos VI e VIII, leitura em sociedade e contexto',
    pdf: 'https://download.inep.gov.br/educacao_basica/encceja/material_estudo/livro_estudante/linguagens_codigos_em_br.pdf',
    explain: [
      'Informação explícita é aquela apresentada diretamente. Inferir é relacionar pistas do texto para concluir algo que não foi dito com as mesmas palavras.',
      'Em uma questão de leitura, volte ao trecho que sustenta a resposta. Uma alternativa pode repetir palavras do texto e ainda estar errada se não responder ao que foi perguntado.',
      'Exemplo: “A escola instalou rampas para facilitar o acesso.” A instalação das rampas está explícita. É possível inferir que a escola buscou tornar o acesso mais fácil, mas não que todos os alunos usem cadeira de rodas: o texto não diz isso. Uma inferência deve ser possível a partir das pistas, não uma certeza inventada.'
    ],
    tip: 'Separe o que o texto afirma do que você imagina; a resposta precisa ser sustentada por pistas presentes no texto.',
    qs: [
      ['“A feira começou cedo e terminou ao meio-dia.” Qual informação está explícita?', ['Durou apenas alguns minutos', 'Terminou ao meio-dia', 'Ocorreu à noite', 'Foi cancelada'], 1, 'O horário de término aparece diretamente no texto.'],
      ['Em “Joana levou guarda-chuva; o céu estava coberto”, a segunda informação sugere que', ['poderia chover', 'era uma noite estrelada', 'fazia muito calor', 'a rua estava iluminada'], 0, 'O céu coberto é uma pista de possibilidade de chuva.']
    ],
    same: ['Se um texto diz “A escola instalou rampas para facilitar o acesso”, qual informação é explícita?', ['A escola instalou rampas', 'Todos usam cadeira de rodas', 'A obra foi cara', 'A escola é antiga'], 0, 'Essa informação aparece diretamente no enunciado.'],
    next: ['“Marcos consultou a previsão e separou o casaco.” É possível inferir que ele esperava', ['um dia frio', 'uma competição', 'uma mudança de escola', 'um apagão'], 0, 'O casaco e a previsão são pistas de frio.']
  },
  {
    id: 'nat-energia', area: 'Ciências da Natureza', icon: '✳',
    title: 'Energia, tecnologia e consumo',
    chapter: 'Ciências da Natureza · capítulos II, III e VII, tecnologias e conhecimentos físicos',
    pdf: 'https://download.inep.gov.br/educacao_basica/encceja/material_estudo/livro_estudante/ciencias_naturais_em_br.pdf',
    explain: [
      'Energia pode ser transformada: uma lâmpada transforma energia elétrica em luz e calor; um painel solar transforma radiação do Sol em eletricidade. A energia não desaparece, mas o uso pode ser mais ou menos eficiente.',
      'Problemas cotidianos pedem comparar consumo, fonte e impacto. Desligar aparelhos, aproveitar luz natural e escolher equipamentos eficientes reduz desperdícios sem abandonar a tecnologia.',
      'Potência, medida em watts (W), indica a taxa de uso de energia. Se duas lâmpadas iluminam igualmente e ficam acesas pelo mesmo tempo, a de 9 W consome menos energia que a de 60 W. Em uma hidrelétrica, a água em movimento aciona turbinas ligadas a geradores.'
    ],
    tip: 'Identifique a transformação de energia e o efeito da escolha sobre o consumo e o ambiente.',
    qs: [
      ['Um painel fotovoltaico instalado no telhado transforma principalmente', ['energia química em sonora', 'luz solar em elétrica', 'elétrica em nuclear', 'térmica em química'], 1, 'Células fotovoltaicas convertem a luz solar em energia elétrica.'],
      ['Duas lâmpadas iluminam igualmente. A primeira consome 60 W e a segunda 9 W. Qual é mais eficiente?', ['a de 60 W', 'a de 9 W', 'as duas, pois consomem igual', 'não é possível comparar'], 1, 'Para a mesma iluminação, a de 9 W usa menos energia.']
    ],
    same: ['Qual atitude reduz o consumo de energia em casa?', ['Deixar luzes acesas em cômodos vazios', 'Usar luz natural quando possível', 'Abrir a geladeira repetidamente', 'Manter aparelhos em funcionamento sem uso'], 1, 'A luz natural evita consumo elétrico desnecessário.'],
    next: ['Uma usina hidrelétrica usa principalmente a energia', ['do movimento da água', 'do vento do deserto', 'da combustão do carvão', 'da luz de lâmpadas'], 0, 'A água em movimento aciona turbinas e geradores.']
  },
  {
    id: 'nat-ecologia', area: 'Ciências da Natureza', icon: '✳',
    title: 'Ecossistemas e equilíbrio',
    chapter: 'Ciências da Natureza · capítulo IX, “Biodiversidade e meio ambiente”',
    pdf: 'https://download.inep.gov.br/educacao_basica/encceja/material_estudo/livro_estudante/ciencias_naturais_em_br.pdf',
    explain: [
      'Em um ecossistema, seres vivos e elementos não vivos interagem. Plantas produzem matéria orgânica, animais podem se alimentar delas e decompositores devolvem nutrientes ao ambiente.',
      'Uma alteração em uma população pode afetar outras. A retirada de predadores, a poluição ou a introdução de espécies pode desequilibrar relações e diminuir a biodiversidade.',
      'Imagine capim → gafanhoto → sapo. Se faltar capim, os gafanhotos podem ter menos alimento; uma queda de gafanhotos pode afetar os sapos. Fungos e bactérias decompõem restos de seres vivos, participando da reciclagem de nutrientes. Biodiversidade é a variedade de vida em uma região.'
    ],
    tip: 'Siga as relações de alimentação e observe quais grupos dependem diretamente da mudança descrita.',
    qs: [
      ['Se a quantidade de plantas de uma área diminui muito, o efeito mais direto para os herbívoros é', ['aumento imediato de alimento', 'redução de alimento disponível', 'desaparecimento da água', 'produção de mais oxigênio'], 1, 'Herbívoros dependem das plantas como fonte de alimento.'],
      ['A retirada de uma espécie predadora pode causar aumento da população de suas presas. Isso ilustra', ['uma cadeia de relações ecológicas', 'a formação de rochas', 'a evaporação da água', 'a geração de eletricidade'], 0, 'A mudança em um nível da cadeia afeta outros níveis.']
    ],
    same: ['Qual grupo participa da decomposição de restos de seres vivos?', ['fungos e bactérias', 'apenas os predadores', 'somente os animais herbívoros', 'nuvens e rios'], 0, 'Fungos e bactérias decompõem matéria orgânica e reciclam nutrientes.'],
    next: ['Uma área com muitas espécies diferentes apresenta maior', ['biodiversidade', 'uniformidade genética', 'ausência de relações', 'quantidade de lixo'], 0, 'Biodiversidade é a variedade de seres vivos.']
  },
  {
    id: 'hum-territorio', area: 'Ciências Humanas', icon: '◎',
    title: 'Território, trabalho e desigualdade',
    chapter: 'Ciências Humanas · capítulos II, VII e VIII, território, mundo urbano e trabalho',
    pdf: 'https://download.inep.gov.br/educacao_basica/encceja/material_estudo/livro_estudante/ciencias_humanas_em_br.pdf',
    explain: [
      'Território é um espaço marcado por relações de poder, circulação e uso. A cidade reúne atividades e pessoas, mas os serviços e as oportunidades podem estar distribuídos de forma desigual.',
      'Mudanças tecnológicas transformam o trabalho: algumas tarefas são automatizadas, novas ocupações aparecem e a qualificação exigida pode mudar. Analisar uma situação é relacionar trabalho, espaço e condições de vida.',
      'Por exemplo, retirar uma linha de ônibus de um bairro distante pode dificultar o acesso ao trabalho e à escola. Quando alguns bairros têm mais transporte, hospitais e escolas que outros, há desigualdade socioespacial. Uma nova ferramenta digital, por sua vez, pode exigir treinamento dos trabalhadores.'
    ],
    tip: 'Procure quem tem acesso aos recursos, quem decide sobre o espaço e quais grupos são mais afetados pela mudança.',
    qs: [
      ['Quando uma linha de ônibus é retirada de um bairro distante, o impacto mais imediato pode ser', ['maior acesso ao emprego', 'dificuldade de deslocamento dos moradores', 'redução das distâncias físicas', 'aumento da oferta de transporte'], 1, 'A retirada reduz as opções de deslocamento.'],
      ['A instalação de internet em uma comunidade pode ampliar', ['acesso a informação e serviços', 'isolamento obrigatório', 'desemprego em todas as áreas', 'desaparecimento do território'], 0, 'Conectividade pode ampliar acesso a informações e serviços.']
    ],
    same: ['A diferença de acesso a escolas, hospitais e transporte entre bairros revela', ['desigualdade socioespacial', 'igualdade plena', 'ausência de território', 'fenômeno exclusivamente natural'], 0, 'A distribuição desigual de serviços é desigualdade socioespacial.'],
    next: ['Quando uma nova tecnologia exige treinamento para seu uso, trabalhadores podem precisar de', ['qualificação profissional', 'isolamento social', 'menos informação', 'redução de direitos'], 0, 'A qualificação ajuda a acompanhar mudanças no trabalho.']
  },
  {
    id: 'hum-democracia', area: 'Ciências Humanas', icon: '◎',
    title: 'Democracia, participação e memória',
    chapter: 'Ciências Humanas · capítulos I, IV, V e IX, identidade, Estado, cidadania e tempo',
    pdf: 'https://download.inep.gov.br/educacao_basica/encceja/material_estudo/livro_estudante/ciencias_humanas_em_br.pdf',
    explain: [
      'Democracia envolve participação, direitos, regras e possibilidade de debate. Votar é uma forma de participação, mas conselhos, associações, audiências e movimentos sociais também permitem acompanhar decisões.',
      'Memória e identidade são construídas socialmente. Preservar diferentes relatos sobre um lugar ajuda a compreender conflitos, mudanças e experiências que não aparecem em uma única versão da história.',
      'Por exemplo, em uma audiência pública, moradores podem expor opiniões sobre uma obra e acompanhar decisões. Em um museu comunitário, relatos de moradores antigos ajudam a preservar memórias. Comparar esses relatos com documentos e outras fontes amplia a compreensão do passado.'
    ],
    tip: 'Diferencie opinião individual de decisão coletiva e procure quais direitos e instituições aparecem na situação.',
    qs: [
      ['Uma audiência pública permite que moradores apresentem opiniões sobre uma obra. Ela é um exemplo de', ['participação política', 'censura automática', 'decisão sem debate', 'atividade sem relação com direitos'], 0, 'A audiência cria espaço de participação e debate público.'],
      ['Um museu comunitário reúne relatos de antigos moradores. A iniciativa contribui para', ['preservar memórias sociais', 'apagar identidades', 'impedir pesquisa histórica', 'substituir todas as fontes'], 0, 'Relatos preservam experiências e memórias de uma comunidade.']
    ],
    same: ['Em uma democracia, o direito de expressar opinião deve conviver com', ['respeito aos direitos de outras pessoas', 'proibição de qualquer debate', 'ausência de regras', 'decisões sempre individuais'], 0, 'Direitos são exercidos em convivência com os direitos dos demais.'],
    next: ['Registrar diferentes versões de um acontecimento histórico ajuda a', ['ampliar a compreensão do passado', 'eliminar todos os conflitos', 'provar que só existe uma memória', 'impedir o diálogo'], 0, 'Fontes e relatos diferentes ampliam a análise histórica.']
  }
];
