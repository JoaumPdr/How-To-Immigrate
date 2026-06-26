import {
  Country as PrismaCountry,
  CountryIndicator as PrismaCountryIndicator,
  User as PrismaUser,
  UserProfile as PrismaUserProfile,
  Review as PrismaReview,
  ReviewCategoryScore as PrismaReviewCategoryScore,
  Article as PrismaArticle,
  ArticleCategory as PrismaArticleCategory,
  Roadmap as PrismaRoadmap,
  RoadmapStep as PrismaRoadmapStep,
  AffiliatePartner as PrismaAffiliatePartner
} from "@prisma/client";

/**
 * Representa um país cadastrado na plataforma para fins de comparação.
 * Estendido com as relações opcionais geradas pelo Prisma.
 */
export type Country = PrismaCountry & {
  indicators?: PrismaCountryIndicator[];
  reviews?: PrismaReview[];
  articles?: PrismaArticle[];
  roadmaps?: PrismaRoadmap[];
};

/**
 * Representa a nota normalizada e original de um país em uma determinada categoria de indicador.
 */
export type CountryIndicator = PrismaCountryIndicator;

/**
 * Representa o usuário do sistema do Auth.js.
 */
export type User = PrismaUser & {
  profile?: PrismaUserProfile | null;
  reviews?: PrismaReview[];
  roadmaps?: PrismaRoadmap[];
};

/**
 * Perfil estendido de dados demográficos e imigratórios do usuário.
 */
export type UserProfile = PrismaUserProfile;

/**
 * Representa uma avaliação detalhada de um país por um membro da comunidade.
 */
export type Review = PrismaReview & {
  scores?: PrismaReviewCategoryScore[];
  user?: PrismaUser;
  country?: PrismaCountry;
};

/**
 * Nota dada em uma subcategoria específica de uma avaliação.
 */
export type ReviewCategoryScore = PrismaReviewCategoryScore;

/**
 * Representa um artigo de guia/blog associado à base de conhecimento.
 */
export type Article = PrismaArticle & {
  category?: PrismaArticleCategory;
  country?: PrismaCountry | null;
};

/**
 * Categoria principal de agrupamento de artigos.
 */
export type ArticleCategory = PrismaArticleCategory;

/**
 * Trilha/plano de ação personalizado do usuário para imigração de um país.
 */
export type Roadmap = PrismaRoadmap & {
  steps?: PrismaRoadmapStep[];
  user?: PrismaUser;
  country?: PrismaCountry;
};

/**
 * Passo ou etapa individual a ser concluída em uma trilha de imigração.
 */
export type RoadmapStep = PrismaRoadmapStep;

/**
 * Parceiro ou anúncio de monetização e afiliados.
 */
export type AffiliatePartner = PrismaAffiliatePartner;
