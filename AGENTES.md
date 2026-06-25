# Equipe de Subagentes e Responsabilidades — How To Immigrate

Este documento define os agentes autônomos, suas competências técnicas e diretrizes de comunicação para o desenvolvimento do projeto **How To Immigrate**.

---

## 1. Tabela da Equipe de Agentes

| Agente | Responsabilidade Principal | Skills Utilizadas |
| :--- | :--- | :--- |
| **Agente Orquestrador** | Gestão de repositórios, distribuição de tarefas, revisão de pull requests, integridade arquitetural e critérios de aceitação. | `orchestration`, `git-management`, `code-review`, `quality-assurance` |
| **Agente de Dados** | Modelagem de banco de dados, design de tabelas PostgreSQL (Supabase), migrations e otimização de queries com Prisma. | `database-design`, `prisma-expert`, `database-migrations-sql-migrations`, `database-optimizer` |
| **Agente Backend** | Arquitetura de APIs, autenticação (Auth.js v5), regras de negócio no servidor, caching e integração com serviços de terceiros. | `backend-architect`, `nextjs-app-router-patterns`, `auth-implementation-patterns`, `api-design-principles` |
| **Agente Frontend** | Implementação de interfaces UI, CSS/Tailwind, animações (Framer Motion), internacionalização e estado do cliente (Zustand). | `frontend-design`, `react-best-practices`, `tailwind-design-system`, `zustand-store-ts`, `i18n-localization` |
| **Agente de Testes** | Cobertura de testes unitários (Vitest), testes E2E multi-viewport (Playwright) e garantia de conformidade visual/funcional. | `tdd`, `e2e-testing`, `playwright-skill`, `testing-qa`, `unit-testing-test-generate` |
| **Agente de Segurança** | Proteção contra vulnerabilidades, conformidade LGPD/GDPR, configuração de cabeçalhos de segurança, lint hooks e auditoria. | `security-audit`, `api-security-best-practices`, `privacy-by-design`, `security-scanning-security-hardening` |

---

## 2. Exemplos de Prompts para Acionamento de Agentes

Sempre que um novo módulo for iniciado, o **Agente Orquestrador** poderá acionar os subagentes utilizando os templates de prompts abaixo:

### 2.1 Agente de Dados
```markdown
# [PROMPT] - Modelagem da Entidade de Países (Etapa 02)
Contexto: Precisamos modelar a entidade Country e seus respectivos critérios de imigração.
Tarefa:
1. Abra o arquivo `prisma/schema.prisma`.
2. Adicione os modelos `Country` e `ImmigrationCriteria` seguindo as convenções de snake_case no banco e UUIDs como chaves.
3. Gere e aplique a nova migration localmente (`npx prisma migrate dev`).
4. Atualize o `RELATORIO.md` com a nova estrutura de tabelas.
```

### 2.2 Agente Backend
```markdown
# [PROMPT] - Integração do Google OAuth com NextAuth/Auth.js (Etapa 04)
Contexto: Precisamos implementar o fluxo de login social utilizando o Google.
Tarefa:
1. Crie o arquivo `lib/auth/auth-config.ts` utilizando a versão `next-auth@beta`.
2. Adicione suporte para o provedor `GoogleProvider`.
3. Garanta que após o login bem-sucedido, o perfil do usuário seja sincronizado com a tabela `UserProfile` no banco de dados via Prisma.
4. Teste localmente que as rotas `/api/auth/*` respondem corretamente.
```

### 2.3 Agente Frontend
```markdown
# [PROMPT] - Componente do Mapa Interativo SVG (Etapa 03)
Contexto: Implementar a interface do mapa-múndi interativo.
Tarefa:
1. Crie o componente `components/map/WorldMap.tsx` utilizando `react-simple-maps`.
2. O mapa deve carregar as cores do Tailwind CSS v4 `@theme` (Ocean) para o fundo do mar e neutros para os continentes.
3. Adicione hover states interativos em cada país com micro-animações de escala utilizando `framer-motion`.
4. Garanta responsividade completa: em mobile (`< 640px`), o mapa exibe uma lista de busca de países.
```

### 2.4 Agente de Testes
```markdown
# [PROMPT] - Testes E2E de Fluxo de Cadastro e Login (Etapa 04)
Contexto: Garantir que o fluxo de autenticação não quebre em nenhuma viewport.
Tarefa:
1. Crie o arquivo `e2e/auth.spec.ts` utilizando Playwright.
2. Escreva testes para login com credenciais válidas e fluxos de erro (credenciais inválidas, campos vazios).
3. Execute o teste utilizando o Playwright nos 3 viewports: mobile (375x667), tablet (768x1024) e desktop (1440x900).
4. Garanta que o relatório de cobertura de testes de UI esteja passando 100%.
```

### 2.5 Agente de Segurança
```markdown
# [PROMPT] - Auditoria de Segurança dos Headers e Dependências (Etapa 00-10)
Contexto: Revisar segurança antes de preparar o merge de stage para develop.
Tarefa:
1. Execute `npm audit` e corrija qualquer vulnerabilidade crítica encontrada no `package.json`.
2. Inspecione `middleware.ts` e verifique se o Content-Security-Policy (CSP) está ativo e bloqueando eval desnecessários no ambiente de homologação.
3. Garanta que não existam secrets reais persistidas localmente ou commitadas no git history usando `git log`.
```
