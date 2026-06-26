# ✈️ How To Immigrate

```text
    __  __              ______         ____                                     __  
   / / / /___ _      __/_  __/___     /  _/___ ___  ____ ___  ____ __________ _/ /__
  / /_/ / __ \ \ /| / / / / / __ \    / // __ `__ \/ __ `__ \/ __ `/ ___/ __ `/ __/ _ \
 / __  / /_/ / |/ |/ / / / / /_/ /  _/ // / / / / / / / / / / /_/ / /  / /_/ / /_/  __/
/_/ /_/\____/|__/|__/ /_/  \____/  /___/_/ /_/ /_/_/ /_/ /_/\__, /_/   \__,_/\__/\___/ 
                                                           /____/                      
```

---

**How To Immigrate** é uma plataforma moderna e interativa que permite a comparação de países para fins de imigração. O sistema consolida dados sobre custo de vida, segurança, facilidade de visto, idioma, mercado de trabalho, além de avaliações da comunidade, roadmaps personalizados e ferramentas de monetização.

---

## 🛠️ Stack Tecnológica

- **Framework Core:** Next.js 15 (App Router) em TypeScript (Strict Mode)
- **Estilização & Design System:** Tailwind CSS v4 com custom design tokens e componentes baseados no shadcn/ui
- **Banco de Dados & ORM:** Supabase (PostgreSQL) + Prisma ORM 7.x
- **Autenticação:** Auth.js v5 (`next-auth@beta`)
- **Internacionalização:** next-intl com suporte a Português do Brasil (`pt-BR`) e Inglês (`en`)
- **Estado Global:** Zustand
- **Testes Unitários:** Vitest + jsdom
- **Testes de Integração / E2E:** Playwright com cobertura multi-viewport automática
- **Qualidade & Segurança:** ESLint v9 (Flat Config) + Husky + lint-staged

---

## 🚀 Como Executar o Projeto Localmente

### 1. Requisitos Mínimos
- Node.js 20+
- npm 10+
- Repositório Git configurado

### 2. Passo a Passo do Setup

1. **Clonar o repositório:**
   ```bash
   git clone https://github.com/JoaumPdr/how-to-immigrate.git
   cd how-to-immigrate
   ```

2. **Instalar as dependências:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configurar as Variáveis de Ambiente:**
   Copie o arquivo de exemplo e preencha com suas configurações (ex: Supabase, OAuth do Google, etc.):
   ```bash
   cp .env.example .env
   ```

4. **Gerar os arquivos do cliente do Prisma:**
   ```bash
   npx prisma generate
   ```

5. **Executar as Migrations do Banco de Dados:**
   ```bash
   npx prisma migrate dev
   ```

6. **Popular o Banco com Dados Iniciais (Seed):**
   ```bash
   npm run seed
   ```

7. **Iniciar o Servidor de Desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 🧪 Rodando os Testes

- **Testes Unitários (Vitest):**
  ```bash
  npm run test
  ```
- **Testes Unitários com Watch:**
  ```bash
  npm run test:watch
  ```
- **Testes de Integração E2E (Playwright) em 3 Viewports:**
  ```bash
  npx playwright install # Executar apenas na primeira vez
  npm run test:e2e
  ```
- **Interface Visual do Playwright:**
  ```bash
  npm run test:e2e:ui
  ```

---

## 📁 Estrutura de Branches do Projeto

Este projeto utiliza um fluxo rígido de stages baseado no desenvolvimento modularizado:
- `main` — Produção.
- `develop` — Branch de integração.
- `stage/00-foundation` — Etapa atual (Fundação e Infraestrutura).
- Branches subsequentes: de `stage/01-design-system` até `stage/10-launch`.

---

## 📄 Links Úteis e Documentação Interna

- [AGENTES.md](file:///c:/Users/joaop/antigravity%20web%20projects/HowToImmigrate/AGENTES.md) — Definição da equipe de agentes e prompts.
- [design.md](file:///c:/Users/joaop/antigravity%20web%20projects/HowToImmigrate/design.md) — Design tokens e regras de responsabilidade/breakpoints.
- [RELATORIO.md](file:///c:/Users/joaop/antigravity%20web%20projects/HowToImmigrate/RELATORIO.md) — Convenções de banco de dados e estrutura de pastas.
