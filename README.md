# Trilha ENCCEJA

Protótipo de estudo para ensino médio, otimizado para celulares. Uma aula inicial por área, com explicação, exercícios autorais e revisões no mesmo dia e no dia seguinte.

O site é publicado via GitHub Pages na pasta `docs`. O Supabase Auth fornece login por e-mail e senha; a tabela `study_progress` usa políticas de segurança por usuário para sincronizar o progresso. O aplicativo usa apenas a chave pública. Sem login, os dados ficam no navegador; o progresso anterior sem login não é importado automaticamente para uma conta. `supabase/schema.sql` documenta o esquema aplicado ao projeto.

A primeira versão não cobre todo o exame nem representa uma análise completa das provas recentes. A página de fontes registra as apostilas e o caderno consultado.
