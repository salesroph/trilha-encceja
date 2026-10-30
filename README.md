# Trilha ENCCEJA

Plataforma gratuita de estudos para o **ENCCEJA Ensino Médio**, pensada para o celular. Para jovens e adultos que vão fazer o exame para concluir o ensino médio.

**Acesse:** https://salesroph.github.io/trilha-encceja/

## O que a plataforma oferece

- **52 aulas** nas quatro áreas do exame (Matemática, Linguagens, Ciências da Natureza e Ciências Humanas), incluindo uma trilha de **redação**.
- **Estudo em etapas:** explicação → exercícios → revisão no mesmo dia → revisão no dia seguinte.
- **"Não entendi":** a IA explica a aula de outro jeito e responde à dúvida do aluno. Se a IA não estiver disponível, aparece uma explicação alternativa já pronta.
- **Simulados:** a IA gera 10 questões inéditas no estilo do ENCCEJA a cada simulado. Sem login, o simulado é montado com questões sorteadas das aulas.
- **Próximo passo na tela inicial**, com progresso por área e o estado de cada aula.
- **Conta opcional** (e-mail e senha) para sincronizar o progresso entre aparelhos. Sem conta, o progresso fica salvo no navegador.
- **Pode ser instalado** como app na tela inicial do celular (PWA).
- **Materiais oficiais:** links para os livros do estudante e as provas anteriores do Inep, e um guia de como é a prova.

## Como funciona

| Parte | Tecnologia |
| --- | --- |
| Site | HTML, CSS e JavaScript puros, sem etapa de build. Publicado pelo GitHub Pages a partir da pasta `docs/`. |
| Login e progresso | Supabase Auth e tabela `study_progress`, protegida por RLS (cada aluno só acessa os próprios dados). O site usa apenas a chave pública. |
| IA | Função `explicar-aula` no Supabase (Edge Function), que chama modelos via NVIDIA (DeepSeek e, se falhar, GLM). As chaves ficam só nos segredos do Supabase. |
| Limite de uso | 5 pedidos de IA por aluno por dia e 100 no total por dia. Cada explicação ou simulado conta 1. O controle é feito no banco. |

## Estrutura

```
docs/                         site publicado
├── index.html
├── manifest.webmanifest      configuração do app instalável
├── sw.js                     service worker (sempre busca da rede; não guarda cache)
├── css/style.css
├── icons/
└── js/
    ├── app.js                aulas, etapas e exercícios
    ├── inicio.js             tela inicial (próximo passo e áreas)
    ├── simulado.js           simulados
    ├── tutor.js              botão "Não entendi" e explicações alternativas
    ├── account.js            login, sincronização e chamadas à IA
    ├── pwa.js                aviso de instalação
    ├── ux.js                 navegação entre telas e destaque de acertos
    └── conteudo/             textos e questões das aulas
        ├── aulas-extras.js
        ├── aulas-curriculo.js
        └── aulas-complementares.js
supabase/
├── config.toml
├── functions/explicar-aula/  explicações e simulados por IA
└── sql/                      tabelas, políticas e limite de uso
scripts/
└── configurar-chaves-ia.ps1  grava as chaves da NVIDIA nos segredos do Supabase
```

## Rodar localmente

```bash
cd docs
python -m http.server 8000
```

Abra http://localhost:8000. O login funciona localmente. A IA não funciona, porque a função só aceita chamadas do site publicado (CORS); nesse caso aparece a explicação alternativa.

## Publicar

- **Site:** envie as mudanças para a branch `main`. O GitHub Pages publica a pasta `docs/` automaticamente.
- **Função de IA:**
  ```bash
  npx supabase functions deploy explicar-aula --project-ref osthfogyiubiieanzrkf --use-api
  ```
- **Banco:** os arquivos em `supabase/sql/` registram o que foi aplicado. Rode-os no SQL Editor do Supabase ao recriar o projeto.

### Segredos da função

| Segredo | Para quê |
| --- | --- |
| `NVIDIA_DEEPSEEK_API_KEY`, `NVIDIA_DEEPSEEK_MODEL` | Provedor principal |
| `NVIDIA_GLM_API_KEY`, `NVIDIA_GLM_MODEL` | Provedor reserva |
| `ADMIN_USER_ID` | (opcional) usuário autorizado a usar o modo de diagnóstico |

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
