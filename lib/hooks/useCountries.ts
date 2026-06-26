import { useState, useEffect } from "react";
import { CountryWithIndicators } from "../repositories/countryRepository";

export interface UseCountriesResult {
  data: CountryWithIndicators[];
  loading: boolean;
  error: Error | null;
}

/**
 * Hook para obter a lista de todos os países cadastrados e seus indicadores.
 * Realiza uma requisição GET para /api/countries com cache local durante o ciclo do componente.
 * 
 * @returns Um objeto contendo a lista de países (data), status de carregamento (loading) e erros (error)
 */
export function useCountries(): UseCountriesResult {
  const [data, setData] = useState<CountryWithIndicators[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;

    fetch("/api/countries")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Erro ao buscar países: ${res.statusText}`);
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
