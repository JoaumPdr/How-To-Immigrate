/**
 * Representa os scores detalhados de um país por diferentes critérios.
 * Todos os scores variam em uma escala de 0 a 100.
 */
export interface CountryScores {
  /** Custo de vida estimado (100 = extremamente barato, 0 = extremamente caro) */
  costOfLiving: number;
  /** Índice de segurança do país (100 = extremamente seguro) */
  safety: number;
  /** Facilidade de obtenção de vistos/imigração legal (100 = muito fácil) */
  visaEase: number;
  /** Oportunidades no mercado de trabalho e taxa de emprego (100 = excelente) */
  jobMarket: number;
  /** Índice de qualidade do sistema de saúde pública/privada (100 = excelente) */
  healthcare: number;
  /** Facilidade de adaptação cultural e receptividade local (100 = excelente) */
  culturalIntegration: number;
}

/**
 * Representa um país cadastrado na plataforma para fins de comparação.
 */
export interface Country {
  /** Identificador único do país (slug de URL, ex: "canada") */
  slug: string;
  /** Nome do país (ex: "Canadá") */
  name: string;
  /** Código ISO Alpha-3 de 3 letras do país (ex: "CAN") */
  code: string;
  /** Nome da capital do país */
  capital: string;
  /** Continente onde o país está localizado */
  continent: string;
  /** Idioma oficial ou predominante do país */
  language: string;
  /** Clima predominante do país (ex: "Temperado", "Tropical") */
  climate: string;
  /** Moeda local utilizada (ex: "CAD") */
  currency: string;
  /** Link da imagem da bandeira oficial do país */
  flagUrl: string;
  /** Pontuações detalhadas do país nos critérios de imigração */
  scores: CountryScores;
  /** Média ponderada geral de todos os scores (0 a 100) */
  overallScore: number;
}

/**
 * Representa o perfil de um usuário cadastrado no sistema.
 */
export interface UserProfile {
  /** Identificador único do usuário (UUID v4) */
  id: string;
  /** Nome completo do usuário */
  name: string;
  /** Endereço de email do usuário */
  email: string;
  /** URL da imagem do avatar do usuário */
  avatarUrl?: string;
  /** Slug do país de destino que o usuário está planejando imigrar (opcional) */
  targetCountrySlug?: string;
  /** Orçamento mensal estimado em dólares (USD) para imigração */
  monthlyBudgetUsd?: number;
  /** Data de criação do perfil do usuário */
  createdAt: Date;
  /** Data da última atualização do perfil */
  updatedAt: Date;
}

/**
 * Pontuações atribuídas a um país em uma avaliação da comunidade.
 * Varia em uma escala de 1 a 5 estrelas.
 */
export interface ReviewCategoryScore {
  /** Custo de vida (1 a 5) */
  costOfLiving: number;
  /** Segurança (1 a 5) */
  safety: number;
  /** Receptividade com imigrantes (1 a 5) */
  receptivity: number;
  /** Qualidade de vida geral (1 a 5) */
  qualityOfLife: number;
}

/**
 * Representa uma avaliação (review) de um país escrita por um membro da comunidade.
 */
export interface Review {
  /** Identificador único da avaliação (UUID v4) */
  id: string;
  /** Identificador do usuário que escreveu a avaliação */
  userId: string;
  /** Nome do autor da avaliação */
  authorName: string;
  /** URL do avatar do autor da avaliação */
  authorAvatarUrl?: string;
  /** Slug do país sendo avaliado (ex: "portugal") */
  countrySlug: string;
  /** Comentário/conteúdo detalhado da avaliação */
  content: string;
  /** Pontuações de avaliação detalhadas por categoria */
  scores: ReviewCategoryScore;
  /** Pontuação média geral da avaliação (1 a 5) */
  overallRating: number;
  /** Status do autor no país (ex: "Expatriado", "Estudante", "Naturalizado") */
  authorStatus: string;
  /** Quantidade de pessoas que acharam este review útil */
  helpfulCount: number;
  /** Indica se a avaliação foi moderada e aprovada */
  isApproved: boolean;
  /** Data em que a avaliação foi escrita */
  createdAt: Date;
}

/**
 * Representa um artigo da base de conhecimento da plataforma.
 */
export interface Article {
  /** Identificador único do artigo (UUID v4) */
  id: string;
  /** Slug de URL para o artigo (ex: "vistos-estudo-canada") */
  slug: string;
  /** Título principal do artigo */
  title: string;
  /** Resumo/descrição curta do artigo para listagem */
  summary: string;
  /** Conteúdo textual completo em formato Markdown */
  content: string;
  /** Categoria do artigo (ex: "Vistos", "Custo de Vida", "Trabalho") */
  category: string;
  /** Slug do país associado a este artigo (opcional) */
  countrySlug?: string;
  /** Tags associadas para busca */
  tags: string[];
  /** Nome do autor do artigo */
  authorName: string;
  /** Tempo estimado de leitura do artigo em minutos */
  readTimeMinutes: number;
  /** Data em que o artigo foi publicado */
  publishedAt: Date;
}

/**
 * Representa uma etapa/passo individual de um Roadmap de imigração.
 */
export interface RoadmapStep {
  /** Identificador único do passo (UUID v4) */
  id: string;
  /** Ordem sequencial do passo (começando em 1) */
  order: number;
  /** Título descritivo da etapa (ex: "Reunir documentação para o visto") */
  title: string;
  /** Descrição detalhada contendo orientações */
  description: string;
  /** Status do passo (ex: "pending", "in_progress", "completed") */
  status: "pending" | "in_progress" | "completed";
  /** Links ou referências de artigos de apoio relacionados a este passo */
  relatedArticleUrls?: string[];
}

/**
 * Representa o Roadmap (plano de ação) de imigração personalizado de um usuário.
 */
export interface Roadmap {
  /** Identificador único do roadmap (UUID v4) */
  id: string;
  /** ID do usuário dono do roadmap */
  userId: string;
  /** Slug do país de destino associado ao roadmap */
  countrySlug: string;
  /** Passos detalhados a serem seguidos pelo usuário */
  steps: RoadmapStep[];
  /** Percentual geral de conclusão do roadmap (0 a 100) */
  progressPercentage: number;
  /** Data da última atualização do roadmap */
  updatedAt: Date;
}
