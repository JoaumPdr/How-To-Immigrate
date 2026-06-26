"use client";

import React, { useState } from "react";
import { useMapData } from "../../lib/hooks/useMapData";
import { useMapFilters } from "../../lib/hooks/useMapFilters";
import { MapFilters } from "./MapFilters";
import { WorldMap } from "./WorldMap";
import { MapLegend } from "./MapLegend";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { EmptyState } from "../ui/EmptyState";

/**
 * Componente contêiner da seção interativa do mapa.
 * Lida com o ciclo de vida dos dados, carregamentos, erros e sincronia de estados dos filtros.
 */
export function InteractiveMapSection() {
  const { data: countries, loading: loadingData, error: errorData } = useMapData();
  const { data: filterConfig, loading: loadingFilters, error: errorFilters } = useMapFilters();

  // Estados locais para controle de filtros
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedIndicator, setSelectedIndicator] = useState("overall");
  const [selectedScoreRange, setSelectedScoreRange] = useState("all");

  const isLoading = loadingData || loadingFilters;
  const isError = errorData || errorFilters;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-slate-50 dark:bg-slate-900/20 border border-border rounded-2xl min-h-[400px]">
        <LoadingSpinner className="w-10 h-10 text-primary" />
        <span className="text-sm text-muted-foreground mt-4 font-medium animate-pulse">
          Carregando dados geo-estatísticos...
        </span>
      </div>
    );
  }

  if (isError || !filterConfig) {
    return (
      <div className="flex items-center justify-center p-12 bg-slate-50 dark:bg-slate-900/20 border border-border rounded-2xl min-h-[400px]">
        <EmptyState
          title="Erro ao carregar o mapa"
          description="Não foi possível estabelecer conexão com o banco de dados para buscar os indicadores do mapa."
          actionLabel="Tentar novamente"
          onAction={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Barra de Filtros */}
      <MapFilters
        regions={filterConfig.regions}
        selectedRegion={selectedRegion}
        onSelectRegion={setSelectedRegion}
        selectedIndicator={selectedIndicator}
        onSelectIndicator={setSelectedIndicator}
        selectedScoreRange={selectedScoreRange}
        onSelectScoreRange={setSelectedScoreRange}
      />

      {/* Container de Visualização do Mapa e Legenda */}
      <div className="relative w-full flex flex-col gap-4">
        <WorldMap
          countries={countries}
          activeIndicatorId={selectedIndicator}
          selectedRegion={selectedRegion}
          selectedScoreRange={selectedScoreRange}
        />

        {/* Legenda flutuante no canto inferior esquerdo do container (desktop) ou inline (mobile) */}
        <div className="absolute bottom-4 left-4 z-10 pointer-events-auto">
          <MapLegend />
        </div>
      </div>
    </div>
  );
}
