# Relatório Técnico — Etapa 00: Fundação e Infraestrutura

Este documento formaliza as decisões arquiteturais da infraestrutura técnica e de banco de dados do projeto **How To Immigrate**.

---

## 1. Convenções de Banco de Dados (Supabase & Prisma)

O banco de dados do projeto será estruturado em PostgreSQL hospedado no Supabase, gerenciado através do Prisma ORM (versão 7.x). Todas as tabelas e relacionamentos a serem criados na **Etapa 02 (Modelagem de Dados)** deverão seguir as seguintes regras:

### 1.1 Convenção de Nomenclatura
- **Tabelas no Banco (PostgreSQL):** Sempre em minúsculo e utilizando snake_case (ex: `user_profiles`, `immigration_steps`, `community_reviews`).
- **Modelos no Prisma:** Sempre em PascalCase (ex: `UserProfile`, `ImmigrationStep`, `CommunityReview`) com mapeamento explícito para o banco usando a diretiva `@@map`.
- **Campos/Colunas:** camelCase nos modelos Prisma (ex: `userId`, `createdAt`) mapeados para snake_case no banco usando `@map`.

### 1.2 Padrão de Chaves Primárias
- Todas as tabelas principais devem usar identificadores únicos globais baseados em **UUID v4**.
- Sintaxe no Prisma: `id String @id @default(uuid()) @db.Uuid`.

### 1.3 Timestamps e Auditoria
- Toda tabela/entidade deve conter os campos de auditoria temporal:
  - `createdAt` (`DateTime @default(now()) @map("created_at")`)
  - `updatedAt` (`DateTime @updatedAt @map("updated_at")`)

### 1.4 Soft Delete
- Para tabelas críticas (como `users`, `reviews` ou `comments`), o histórico não deve ser apagado fisicamente.
- Utilizar o campo opcional `deletedAt` (`DateTime? @map("deleted_at")`). As queries da aplicação devem filtrar entidades onde `deletedAt` seja nulo.

### 1.5 Convenção de Migrations
- As migrations do Prisma devem receber nomes em inglês descritivos e em minúsculo separados por hífen (ex: `20260625000000_create_users_table`).
- Nunca aplicar alterações manuais (via SQL Console do Supabase) que desviem da linha de migrations do Prisma.

---

## 2. Estrutura de Pastas do Projeto

A organização de diretórios do Next.js 15 segue a estrutura definitiva abaixo:

```
app/
  [locale]/                # Rotas internacionalizadas
    layout.tsx             # Layout raiz dinâmico com NextIntlClientProvider
    page.tsx               # Página inicial traduzida (Landing Page)
    globals.css            # Estilos globais e tokens Tailwind CSS v4
components/
  ui/                      # Componentes primitivos atômicos (Button, Input via shadcn)
  layout/                  # Componentes estruturais (Navbar, Footer, Sidebar)
  map/                     # Componentes específicos do Mapa Interativo
  country/                 # Componentes específicos das Páginas de País
  dashboard/               # Componentes de Painel e Estatísticas
lib/
  data/                    # Funções de busca e queries de dados (Server Actions/APIs)
  hooks/                   # Custom React Hooks reutilizáveis
  repositories/            # Abstrações de acesso a dados/banco (Padrão Repository)
  auth/                    # Configurações de autenticação (Auth.js v5 / NextAuth)
  store/                   # Gerenciamento de estado global com Zustand
  utils/                   # Funções auxiliares gerais (ex: cn helper)
prisma/
  schema.prisma            # Schema do banco de dados (Prisma 7.x)
i18n/
  routing.ts               # Definições de caminhos e locales do next-intl
  request.ts               # Carregador de traduções por requisição
messages/
  pt-BR.json               # Dicionário de português brasileiro
  en.json                  # Dicionário de inglês
public/                    # Assets estáticos públicos (svg, png, fonts)
scripts/                   # Scripts auxiliares de automação ou seed
middleware.ts              # Interceptador para segurança e i18n
```

### 2.1 Justificativa da Estrutura
- **i18n na raiz:** Facilita o mapeamento do plugin do `next-intl` no compilador do Next.js 15, garantindo suporte nativo a Server Components.
- **Divisão do components/:** Evita acúmulo de arquivos soltos. Separa componentes visuais simples (primitivos) de componentes altamente acoplados ao domínio do produto (como mapa ou dashboard).
- **lib/repositories/**: Permite isolar o Prisma Client das páginas do Next.js, facilitando a testabilidade e isolamento da camada de dados.

---

## 3. Contratos de Tipos (Etapa 01)

Para o desenvolvimento em paralelo do Frontend e Backend, criamos em `lib/data/types.ts` a modelagem preliminar de todas as entidades de domínio da plataforma:

1. **Country & CountryScores:** Modelagem para comparação de países, agregando notas para custo de vida, segurança, facilidade de visto, mercado de trabalho, saúde e integração cultural.
2. **UserProfile:** Dados do usuário, incluindo país-alvo de imigração e orçamento estimado.
3. **Review & ReviewCategoryScore:** Estrutura para os relatos e reviews da comunidade por múltiplos indicadores de 1 a 5 estrelas.
4. **Article:** Estrutura da base de conhecimento e guias de imigração.
5. **Roadmap & RoadmapStep:** Representação das trilhas personalizadas de tarefas passo a passo de imigração por usuário.

Esses tipos TS com JSDoc atuam como fonte da verdade estática e serão migrados e alinhados para os tipos gerados automaticamente pelo Prisma Client na **Etapa 02**.
