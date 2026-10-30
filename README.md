# Trilha ENCCEJA

Plataforma gratuita de estudos para o **ENCCEJA Ensino Médio**, pensada para o celular. Para jovens e adultos que vão fazer o exame para concluir o ensino médio.

**Acesse:** https://salesroph.github.io/trilha-encceja/

## O que a plataforma oferece

- **Prática infinita, uma questão por tela.** O botão "Praticar agora" mistura revisões, pontos fracos e assuntos novos. Também dá para praticar uma área ou um assunto específico.
  - **Matemática:** as questões são geradas pelo próprio app, com números sorteados e gabarito calculado (`js/geradores.js`). São infinitas e funcionam sem internet.
  - **Outras áreas:** a IA gera lotes de questões novas em segundo plano. Sem login, ou quando a IA falha, as questões vêm do banco das aulas, evitando repetir as recentes.
- **Revisão espaçada automática:** cada acerto aumenta o intervalo até a próxima revisão do assunto (1, 3, 7, 14, 30, 60 dias); cada erro traz o assunto de volta no dia seguinte. A tela inicial mostra as revisões do dia e os assuntos com menos de 60% de acerto.
- **Motivação:** meta diária de 10 questões, dias seguidos estudando, pontos e níveis, 12 conquistas, mensagens de incentivo ("Essa era difícil! Parabéns") e um resumo ao fim de cada sessão.
- **52 aulas** nas quatro áreas do exame, incluindo uma trilha de **redação**. Um assunto é considerado dominado com 5 acertos e pelo menos 60% de aproveitamento.
- **"Não entendi":** com um toque, a IA explica o assunto de um jeito mais simples. Sem IA, aparece uma explicação alternativa pronta.
- **Redação com correção por IA:** tema sorteado, rascunho salvo no aparelho, nota estimada por critério, pontos fortes, o que melhorar e um exemplo de reescrita.
- **Simulados** de 10 questões gerados pela IA (ou sorteados das aulas).
- **Contagem regressiva** até a data da prova.
- **Lembretes no celular** (notificações push): 1 por dia, no horário escolhido, só se o aluno ainda não estudou. A mensagem muda conforme a situação: sumido há 2 dias ou mais, sequência em risco, revisões pendentes, prova chegando. No iPhone, exige o app instalado na tela inicial (iOS 16.4+).
- **Conta opcional** para sincronizar o progresso entre aparelhos; **pode ser instalado** como app (PWA); **materiais oficiais** do Inep e um guia da prova.

## Como funciona

| Parte | Tecnologia |
| --- | --- |
| Site | HTML, CSS e JavaScript puros, sem etapa de build. Publicado pelo GitHub Pages a partir da pasta `docs/`. |
| Login e progresso | Supabase Auth e tabela `study_progress`, protegida por RLS (cada aluno só acessa os próprios dados). O site usa apenas a chave pública. |
| IA | Função `explicar-aula` no Supabase (Edge Function), que chama modelos via NVIDIA (DeepSeek e, se falhar, GLM). As chaves ficam só nos segredos do Supabase. |
| Lembretes | Função `lembretes`, chamada a cada hora pelo `pg_cron` do banco (`supabase/sql/04-agendamento-lembretes.sql`). Ela lê o progresso sincronizado do aluno e envia a notificação com chaves VAPID. |
| Limite de uso | 30 usos de IA por aluno por dia e 300 no total por dia. Cada explicação, lote de 10 exercícios, simulado ou correção de redação conta 1. O controle é feito no banco. |

## Estrutura

```
docs/                         site publicado
├── index.html
├── manifest.webmanifest      configuração do app instalável
├── sw.js                     service worker (sempre busca da rede; não guarda cache)
├── css/style.css
├── icons/
└── js/
    ├── app.js                estado, página da aula e materiais
    ├── inicio.js             tela inicial (metas, áreas, reforço, conquistas)
    ├── pratica.js            prática infinita, revisão espaçada, pontos e conquistas
    ├── geradores.js          geradores de questões de Matemática
    ├── redacao.js            redação com correção por IA
    ├── simulado.js           simulados
    ├── tutor.js              botão "Não entendi" e explicações alternativas
    ├── account.js            login, sincronização e chamadas à IA
    ├── pwa.js                aviso de instalação
    ├── ux.js                 navegação entre telas e destaque de acertos
    └── conteudo/             textos e questões das aulas
        ├── aulas-base.js
        ├── aulas-extras.js
        ├── aulas-curriculo.js
        └── aulas-complementares.js
supabase/
├── config.toml
├── functions/explicar-aula/  IA: explicações, exercícios, simulados e correção de redação
├── functions/lembretes/      lembretes diários por notificação
└── sql/                      tabelas, políticas e limite de uso
scripts/
└── configurar-chaves-ia.ps1  grava as chaves da NVIDIA nos segredos do Supabase
```

## Rodar localmente

```bash
cd docs
python -m http.server 8000
```

Abra http://localhost:8000. O login e a prática funcionam localmente. A IA não funciona, porque a função só aceita chamadas do site publicado (CORS); nesse caso aparece a explicação alternativa.

## Publicar

- **Site:** envie as mudanças para a branch `main`. O GitHub Pages publica a pasta `docs/` automaticamente.
- **Função de IA:**
  ```bash
  npx supabase functions deploy explicar-aula --project-ref osthfogyiubiieanzrkf --use-api
  npx supabase functions deploy lembretes --project-ref osthfogyiubiieanzrkf --use-api --no-verify-jwt
  ```
- **Banco:** os arquivos em `supabase/sql/` registram o que foi aplicado. Rode-os no SQL Editor do Supabase ao recriar o projeto.

### Segredos da função

| Segredo | Para quê |
| --- | --- |
| `NVIDIA_DEEPSEEK_API_KEY`, `NVIDIA_DEEPSEEK_MODEL` | Provedor principal |
| `NVIDIA_GLM_API_KEY`, `NVIDIA_GLM_MODEL` | Provedor reserva |
| `ADMIN_USER_ID` | (opcional) usuário autorizado a usar o modo de diagnóstico |
| `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` | Chaves das notificações (função `lembretes`). A pública também está em `docs/js/account.js`. |
| `CRON_SECRET` | Senha que o agendamento envia à função `lembretes`. O mesmo valor fica no Vault do banco (`lembretes_cron_secret`). |

`scripts/configurar-chaves-ia.ps1` grava as duas chaves sem exibi-las na tela. Os nomes dos modelos são definidos com `npx supabase secrets set`.

## Adicionar uma aula

1. Inclua a aula em `docs/js/conteudo/aulas-complementares.js` (ou em `aulas-curriculo.js`). Cada aula tem id, área, título, explicação, dica e 4 questões (enunciado, 4 alternativas, índice da correta, comentário).
2. O id começa com o prefixo da área (`mat-`, `ling-`, `nat-` ou `hum-`); é assim que a aula aparece na área certa.
3. Acrescente a explicação alternativa da aula (o `Object.assign(alternativeExplanations, …)` no mesmo arquivo).
4. Cadastre o id, o título e o escopo no objeto `topics` de `supabase/functions/explicar-aula/index.ts` e publique a função. Sem isso, o "Não entendi" daquela aula não consegue usar a IA.

## Limitações

- As aulas e os exercícios são autorais. Seguem os conteúdos cobrados no exame, mas não substituem as provas oficiais.
- Questões geradas por IA podem, raramente, ter erro de gabarito.
- As regras do exame (notas mínimas, datas) mudam a cada edição: confira sempre o edital do Inep.
- O progresso feito sem login não é transferido automaticamente para uma conta criada depois.
