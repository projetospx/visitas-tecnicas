# Visitas Técnicas — RH Operacional

Módulo web independente para diagnosticar operações críticas de RH com base em **dados objetivos, percepção coletada e observação RH**. O sistema inicia zerado, sem operações ou indicadores fictícios, e funciona sem backend.

## Como abrir

Opção rápida: abra `index.html` em um navegador moderno.

Opção recomendada para desenvolvimento: sirva esta pasta com qualquer servidor HTTP estático. Exemplo com Python:

```bash
python -m http.server 4173
```

Depois acesse `http://localhost:4173`. O arquivo `journey-demo.html` mostra o atalho de integração com `target="_blank"`.

## O que está funcional

- Dashboard em seis visões: executiva, diagnóstica, lideranças, pessoas, plano de ação e evolução.
- Nova visita com baseline, validação mínima e checklist “Preparar Visita”.
- Modo Campo guiado em 13 etapas, com anterior/próximo, progresso, autosave e recuperação local.
- Entrevistas separadas para Site Leader, líderes individuais e colaboradores, com 13 perguntas padrão e “Transformar em achado”.
- Score geral ponderado, convergência de evidências, alerta de divergência e confiança diagnóstica.
- Avaliação comportamental 1–5 com 15 critérios observáveis de liderança.
- Hipóteses de causa de ABS com causa primária, secundária e agravantes.
- Achados com criticidade, evidência, causa provável, risco, recomendação, dono, prazo e status.
- Radar de lideranças restrito ao RH, sala de situação, histórico 30/60/90 e comparação entre visitas.
- Pesquisa pré-visita/clima e três relatórios imprimíveis: resumo executivo, relatório completo e plano de ação.
- Modo claro/escuro, layout responsivo, estados vazios, backup JSON e aviso ao sair com alteração ainda não salva.

## Estrutura

```text
index.html           aplicação e navegação
styles.css           tema base branco/laranja e modo escuro
product.css          superfícies funcionais e responsividade
app.js               estado vazio, telas, interações, autosave e relatórios
score-engine.mjs     regras puras de score, convergência e criticidade
tests.mjs            testes automatizados da lógica diagnóstica
journey-demo.html    atalho demonstrativo do Shopee Journey
.openai/hosting.json configuração de hospedagem estática
```

## Lógica de scores

O score de cada dimensão combina as três fontes disponíveis:

- dado objetivo: 40%;
- percepção coletada: 30%;
- observação RH: 30%.

Se uma fonte estiver ausente, os pesos das fontes restantes são normalizados. O score geral usa os pesos solicitados: ABS 20%, Liderança 20%, Clima 15%, Turnover 15%, Gestão de Pessoas 10%, Onboarding 8%, Comunicação 5%, Estrutura 5% e Governança 2%.

Faixas iniciais: **Crítico < 40**, **Alto risco 40–59**, **Atenção 60–74**, **Saudável ≥ 75**. A convergência compara a amplitude entre fontes; a divergência crítica é sinalizada quando gestão e equipe diferem em 30 pontos ou mais.

A criticidade do achado usa Severidade × Frequência × Abrangência × Urgência, com escala 1–5. A “Confiança do Diagnóstico” combina quantidade, qualidade e convergência. Ela expressa robustez da hipótese e **não causalidade automática**.

## Persistência e prevenção de perda

O estado é salvo no `localStorage` sob a chave `visitasTecnicasRH.v1` após cada alteração. Campos do modo campo e entrevistas usam autosave com atraso curto; mudanças ainda pendentes acionam confirmação ao fechar. O usuário também pode baixar um backup JSON no menu Relatórios.

Para produção, o armazenamento local deve permanecer como contingência, não como fonte principal.

## Integração futura com Supabase

Mapeamento recomendado:

- `operations`, `visits`, `visit_stage_entries`;
- `interviews`, `interview_answers` com políticas rígidas de acesso RH;
- `evidence`, `findings`, `action_items`, `action_updates`;
- `surveys`, `survey_responses` e snapshots de indicadores;
- `score_configs` versionado para pesos e faixas;
- trilha de auditoria para alteração de score, achado, responsável e prazo.

Substitua `loadState`/`saveState` em `app.js` por um repositório assíncrono. Mantenha o `localStorage` como fila offline, com IDs idempotentes, indicador de sincronização e resolução explícita de conflitos.

## Integração com Shopee Journey

No Journey, use um link para a URL implantada:

```html
<a href="https://URL-DO-MODULO" target="_blank" rel="noopener">
  Visitas Técnicas
</a>
```

Em produção, aplique SSO, autorização por perfil, CSP, logs de auditoria e restrição específica do Radar de Lideranças e das entrevistas individuais.

## Testes

Com Node.js disponível:

```bash
node tests.mjs
```

Os testes cobrem escala comportamental, score de dimensão, convergência, divergência crítica, score geral, matriz de criticidade e confiança diagnóstica.
