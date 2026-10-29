# Trilha ENCCEJA

Protótipo de estudo para ensino médio, otimizado para celulares. São três aulas por área, com explicações, exercícios autorais e revisões no mesmo dia e no dia seguinte.

O site é publicado via GitHub Pages na pasta `docs`. O Supabase Auth fornece login por e-mail e senha; a tabela `study_progress` usa políticas de segurança por usuário para sincronizar o progresso. O aplicativo usa apenas a chave pública. Sem login, os dados ficam no navegador; o progresso anterior sem login não é importado automaticamente para uma conta. `supabase/schema.sql` documenta o esquema aplicado ao projeto.

O botão “Não entendi” pede outra explicação, tentando DeepSeek e depois GLM caso o primeiro falhe. É necessário entrar na conta; o limite é de cinco pedidos por usuário por dia e 100 no total. As chaves e os nomes dos modelos ficam nos segredos da função `explicar-aula` do Supabase, nunca no navegador. Se a IA estiver indisponível, o site apresenta uma explicação alternativa preparada para a aula. `supabase/ai-quota.sql` documenta a proteção de uso.

O conteúdo disponível ainda não cobre todo o exame nem representa uma análise completa das provas recentes. A página de fontes registra as apostilas e o caderno consultado.
