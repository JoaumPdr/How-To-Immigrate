import { useState, useEffect } from "react";

export interface MapCountryData {
  slug: string;
  name: string;
  nameEn: string;
  codeISO2: string;
  codeISO3: string;
  region: string;
  languages: string[];
  overallScore: number;
  indicators: { category: string; score: number }[];
}

export interface UseMapDataResult {
  data: MapCountryData[];
  loading: boolean;
  error: Error | null;
}

/**
 * Hook para buscar a lista simplificada e otimizada de países para o mapa.
 * GET /api/map com gerenciamento de estado de carregamento e erro.
 */
export function useMapData(): UseMapDataResult {
  const [data, setData] = useState<MapCountryData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;

    fetch("/api/map")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Erro ao buscar dados do mapa: ${res.statusText}`);
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
