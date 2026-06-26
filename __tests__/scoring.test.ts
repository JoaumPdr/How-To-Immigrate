import { describe, it, expect } from "vitest";
import { calculateOverallScore, INDICATOR_WEIGHTS } from "../lib/data/scoring";

describe("Algoritmo de Scoring Ponderado", () => {
  it("deve calcular o score máximo 100 quando todos os indicadores são 100", () => {
    const indicators = Object.keys(INDICATOR_WEIGHTS).map((category) => ({
      category,
      score: 100
    }));

    const result = calculateOverallScore(indicators);
    expect(result.overallScore).toBe(100);
    expect(result.missingIndicators).toHaveLength(0);
    expect(result.indicatorsCalculated).toHaveLength(Object.keys(INDICATOR_WEIGHTS).length);
  });

  it("deve calcular o score mínimo 0 quando todos os indicadores são 0", () => {
    const indicators = Object.keys(INDICATOR_WEIGHTS).map((category) => ({
      category,
      score: 0
    }));

    const result = calculateOverallScore(indicators);
    expect(result.overallScore).toBe(0);
    expect(result.missingIndicators).toHaveLength(0);
  });

  it("deve calcular corretamente a média ponderada com valores realistas", () => {
    // Exemplo:
    // safety (peso 25%): 80 -> contribuição: 20
    // costOfLiving (peso 20%): 60 -> contribuição: 12
    // jobMarket (peso 20%): 70 -> contribuição: 14
    // visaEase (peso 15%): 90 -> contribuição: 13.5
    // healthcare (peso 10%): 85 -> contribuição: 8.5
    // culturalIntegration (peso 10%): 75 -> contribuição: 7.5
    // Soma esperada: 20 + 12 + 14 + 13.5 + 8.5 + 7.5 = 75.5
    const indicators = [
      { category: "safety", score: 80 },
      { category: "costOfLiving", score: 60 },
      { category: "jobMarket", score: 70 },
      { category: "visaEase", score: 90 },
      { category: "healthcare", score: 85 },
      { category: "culturalIntegration", score: 75 }
    ];

    const result = calculateOverallScore(indicators);
    expect(result.overallScore).toBe(75.5);
  });

  it("deve redistribuir proporcionalmente os pesos se houver indicadores ausentes", () => {
    // Exemplo: apenas safety (peso 25%) = 80 e costOfLiving (peso 20%) = 60
    // Soma dos pesos presentes: 0.25 + 0.20 = 0.45
    // Contribuição ponderada: (80 * 0.25) + (60 * 0.20) = 20 + 12 = 32
    // Média esperada: 32 / 0.45 = 71.11
    const indicators = [
      { category: "safety", score: 80 },
      { category: "costOfLiving", score: 60 }
    ];

    const result = calculateOverallScore(indicators);
    expect(result.overallScore).toBe(71.11);
    expect(result.missingIndicators).toContain("jobMarket");
    expect(result.missingIndicators).toContain("visaEase");
    expect(result.missingIndicators).toContain("healthcare");
    expect(result.missingIndicators).toContain("culturalIntegration");
  });

  it("deve retornar score 0 e lista completa de ausentes se a entrada for vazia", () => {
    const result = calculateOverallScore([]);
    expect(result.overallScore).toBe(0);
    expect(result.indicatorsCalculated).toHaveLength(0);
    expect(result.missingIndicators).toHaveLength(Object.keys(INDICATOR_WEIGHTS).length);
  });
});
