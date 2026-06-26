/**
 * Constantes contendo os pesos para cada categoria de indicador no cálculo da média ponderada final.
 * A soma de todos os pesos totaliza 100%.
 */
export const INDICATOR_WEIGHTS: Record<string, number> = {
  safety: 0.25,                 // 25% - Critério fundamental de integridade física e paz
  costOfLiving: 0.20,           // 20% - Viabilidade econômica imediata de sustento
  jobMarket: 0.20,              // 20% - Oportunidades de emprego e renda local
  visaEase: 0.15,               // 15% - Facilidade burocrática de legalização
  healthcare: 0.10,             // 10% - Qualidade de vida relacionada a saúde
  culturalIntegration: 0.10     // 10% - Facilidade de idioma e adaptabilidade cultural
};

export interface IndicatorInput {
  category: string;
  score: number; // 0 a 100
}

export interface ScoreBreakdownItem {
  category: string;
  score: number;
  weight: number;
  weightedContribution: number;
}

export interface ScoreBreakdownResult {
  overallScore: number;
  indicatorsCalculated: ScoreBreakdownItem[];
  missingIndicators: string[];
}

/**
 * Calcula o Score Geral de um país baseado nos indicadores fornecidos e seus pesos.
 * Se algum indicador obrigatório estiver ausente, redistribui proporcionalmente os pesos
 * entre os indicadores presentes para evitar que o cálculo quebre ou seja penalizado injustamente.
 * 
 * @param indicators Lista de indicadores normalizados (0-100) do país
 */
export function calculateOverallScore(indicators: IndicatorInput[]): ScoreBreakdownResult {
  let weightedSum = 0;
  let weightSum = 0;
  const indicatorsCalculated: ScoreBreakdownItem[] = [];
  const presentCategories = new Set(indicators.map(i => i.category));
  const missingIndicators: string[] = [];

  // Identificar indicadores ausentes
  for (const category in INDICATOR_WEIGHTS) {
    if (!presentCategories.has(category)) {
      missingIndicators.push(category);
    }
  }

  // Realizar o cálculo ponderado para os indicadores presentes
  for (const ind of indicators) {
    const weight = INDICATOR_WEIGHTS[ind.category];
    if (weight === undefined) continue; // Pula categorias não cadastradas nos pesos

    const weightedContribution = ind.score * weight;
    weightedSum += weightedContribution;
    weightSum += weight;

    indicatorsCalculated.push({
      category: ind.category,
      score: ind.score,
      weight,
      weightedContribution
    });
  }

  // Fallback: se nenhum indicador válido for fornecido, retorna score 0
  if (weightSum === 0) {
    return {
      overallScore: 0,
      indicatorsCalculated: [],
      missingIndicators: Object.keys(INDICATOR_WEIGHTS)
    };
  }

  // Calcula a média ponderada final ajustada (divide pela soma dos pesos presentes)
  const rawScore = weightedSum / weightSum;
  const overallScore = Math.round(rawScore * 100) / 100; // Arredonda para 2 casas decimais

  return {
    overallScore,
    indicatorsCalculated,
    missingIndicators
  };
}
