import { useState, useEffect } from "react";
import { CountryWithIndicators } from "../repositories/countryRepository";

export interface UseCountryResult {
  data: CountryWithIndicators | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook para obter as informações detalhadas e indicadores de um país específico pelo slug.
 * Realiza uma requisição GET para /api/countries/[slug].
 * 
 * @param slug O identificador de URL do país (ex: "canada")
 * @returns Um objeto contendo os detalhes do país (data), status de carregamento (loading) e erros (error)
 */
export function useCountry(slug: string | null | undefined): UseCountryResult {
  const [data, setData] = useState<CountryWithIndicators | null>(null);
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

    fetch(`/api/countries/${slug}`)
      .then((res) => {
        if (res.status === 404) {
          throw new Error("País não encontrado");
        }
        if (!res.ok) {
          throw new Error(`Erro ao buscar país: ${res.statusText}`);
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
