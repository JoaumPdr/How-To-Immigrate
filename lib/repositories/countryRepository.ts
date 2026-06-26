import { prisma } from "../prisma";
import { calculateOverallScore, ScoreBreakdownResult } from "../data/scoring";

export interface CountryWithIndicators {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  codeISO2: string;
  codeISO3: string;
  region: string;
  capital: string;
  currency: string;
  languages: string[];
  flagUrl: string;
  overallScore: number;
  indicators: {
    id: string;
    category: string;
    score: number;
    rawValue: number;
    source: string;
  }[];
}

export const countryRepository = {
  /**
   * Retorna a lista completa de países com seus indicadores.
   * Ideal para renderização no mapa global e listagens.
   */
  async findAll(): Promise<CountryWithIndicators[]> {
    return prisma.country.findMany({
      include: {
        indicators: {
          select: {
            id: true,
            category: true,
            score: true,
            rawValue: true,
            source: true
          }
        }
      },
      orderBy: {
        name: "asc"
      }
    }) as unknown as Promise<CountryWithIndicators[]>;
  },

  /**
   * Busca um país específico pelo slug.
   * Retorna null caso o país não seja encontrado.
   * 
   * @param slug Identificador único do país
   */
  async findBySlug(slug: string): Promise<CountryWithIndicators | null> {
    return prisma.country.findUnique({
      where: { slug },
      include: {
        indicators: {
          select: {
            id: true,
            category: true,
            score: true,
            rawValue: true,
            source: true
          }
        }
      }
    }) as unknown as Promise<CountryWithIndicators | null>;
  },

  /**
   * Retorna o breakdown detalhado do cálculo de score geral de um país.
   * Retorna null caso o país não exista.
   * 
   * @param slug Identificador único do país
   */
  async findScoreBreakdown(slug: string): Promise<ScoreBreakdownResult | null> {
    const country = await this.findBySlug(slug);
    if (!country) return null;

    const indicatorsInput = country.indicators.map(ind => ({
      category: ind.category,
      score: ind.score
    }));

    return calculateOverallScore(indicatorsInput);
  }
};
