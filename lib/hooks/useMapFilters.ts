import { useState, useEffect } from "react";

export interface MapFiltersConfig {
  regions: string[];
  indicators: { id: string; weight: number }[];
  scoreRanges: {
    id: string;
    labelPt: string;
    labelEn: string;
    min?: number;
    max?: number;
  }[];
}

export interface UseMapFiltersResult {
  data: MapFiltersConfig | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook para buscar as opções de filtros (regiões dinâmicas, indicadores, faixas de score).
 * GET /api/map/filters com gerenciamento de estado.
 */
export function useMapFilters(): UseMapFiltersResult {
  const [data, setData] = useState<MapFiltersConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;

    fetch("/api/map/filters")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Erro ao buscar filtros do mapa: ${res.statusText}`);
        }
        return res.json();
      })
      .then((json) => {
        if (active) {
          setData(json);
          setError(null);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return { data, loading, error };
}
