import { useState, useEffect } from "react";
import { ScoreBreakdownResult } from "../data/scoring";

export interface UseCountryScoreResult {
  data: ScoreBreakdownResult | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook para obter o detalhamento e os pesos da pontuação (score breakdown) de um país.
 * Realiza uma requisição GET para /api/countries/[slug]/score.
 * 
 * @param slug O identificador de URL do país (ex: "canada")
 * @returns Um objeto contendo o detalhamento da pontuação (data), status de carregamento (loading) e erros (error)
 */
export function useCountryScore(slug: string | null | undefined): UseCountryScoreResult {
  const [data, setData] = useState<ScoreBreakdownResult | null>(null);
  const [loading, setLoading] = useState<boolean>(!!slug);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!slug) {
      Promise.resolve().then(() => {
        setData(null);
        setLoading(false);
        setError(null);
      });
      return;
    }

    let active = true;
    Promise.resolve().then(() => {
      setLoading(true);
    });

    fetch(`/api/countries/${slug}/score`)
      .then((res) => {
        if (res.status === 404) {
          throw new Error("Breakdown de pontuação não encontrado");
        }
        if (!res.ok) {
          throw new Error(`Erro ao buscar breakdown de pontuação: ${res.statusText}`);
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
          setData(null);
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
  }, [slug]);

  return { data, loading, error };
}
