import { useMemo } from "react";
import { MapCountryData } from "./useMapData";
import { getMapColor } from "../utils/MapColorGradient";

/**
 * Hook para gerar e memoizar as cores de preenchimento de cada país com base no indicador selecionado.
 * 
 * @param countries Lista de países obtidos da API do mapa
 * @param activeIndicatorId Indicador de foco ('overall' ou uma categoria como 'safety', 'costOfLiving', etc.)
 * @returns Um objeto mapeando o código ISO3 de cada país para sua cor HSL correspondente
 */
export function useMapColors(
  countries: MapCountryData[],
  activeIndicatorId: string
): Record<string, string> {
  return useMemo(() => {
    const colors: Record<string, string> = {};

    for (const country of countries) {
      let score: number | null = null;

      if (activeIndicatorId === "overall") {
        score = country.overallScore;
      } else {
        const ind = country.indicators.find((i) => i.category === activeIndicatorId);
        score = ind ? ind.score : null;
      }

      colors[country.codeISO3] = getMapColor(score);
    }

    return colors;
  }, [countries, activeIndicatorId]);
}
