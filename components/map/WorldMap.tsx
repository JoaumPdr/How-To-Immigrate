"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker
} from "react-simple-maps";
import { MapCountryData } from "../../lib/hooks/useMapData";
import { useMapColors } from "../../lib/hooks/useMapColors";
import { numericToIso3 } from "../../lib/utils/countryIsoMapper";
import { CountryTooltip } from "./CountryTooltip";

// Arquivo TopoJSON servido a partir da pasta public/ do Next.js
const geoUrl = "/world-110m.json";

// Coordenadas geográficas aproximadas para microestados que precisam de hit area ampliada
const MICRO_STATES = [
  { code: "SGP", name: "Singapura", coordinates: [103.851959, 1.29027] },
  { code: "LUX", name: "Luxemburgo", coordinates: [6.129583, 49.611621] },
  { code: "MLT", name: "Malta", coordinates: [14.4329, 35.9375] },
  { code: "AND", name: "Andorra", coordinates: [1.5218, 42.5063] }
];

export interface WorldMapProps {
  countries: MapCountryData[];
  activeIndicatorId: string; // 'overall' ou id do indicador
  selectedRegion: string;
  selectedScoreRange: string;
}

export function WorldMap({
  countries,
  activeIndicatorId,
  selectedRegion,
  selectedScoreRange
}: WorldMapProps) {
  const router = useRouter();
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);

  // Estados de controle de Tooltip e Interação
  const [hoveredCountry, setHoveredCountry] = useState<MapCountryData | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<MapCountryData | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Mapeia países por ISO3 para busca rápida
  const countriesMap = React.useMemo(() => {
    const map = new Map<string, MapCountryData>();
    countries.forEach((c) => map.set(c.codeISO3, c));
    return map;
  }, [countries]);

  // Hook customizado para gerar as cores
  const colors = useMapColors(countries, activeIndicatorId);

  // Detectar se é touch/mobile com base na largura da viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Filtra países no mapa de acordo com os filtros de Região e Faixas de Score
  const filteredCountryCodes = React.useMemo(() => {
    const codes = new Set<string>();
    countries.forEach((c) => {
      // 1. Filtro por Região
      if (selectedRegion !== "all" && c.region !== selectedRegion) {
        return;
      }

      // 2. Filtro por Faixa de Score
      const score = activeIndicatorId === "overall"
        ? c.overallScore
        : c.indicators.find((ind) => ind.category === activeIndicatorId)?.score ?? 0;

      if (selectedScoreRange !== "all") {
        if (selectedScoreRange === "excellent" && (score < 80 || score > 100)) return;
        if (selectedScoreRange === "good" && (score < 70 || score >= 80)) return;
        if (selectedScoreRange === "moderate" && (score < 50 || score >= 70)) return;
        if (selectedScoreRange === "hard" && (score < 0 || score >= 50)) return;
      }

      codes.add(c.codeISO3);
    });
    return codes;
  }, [countries, selectedRegion, selectedScoreRange, activeIndicatorId]);

  // Manipulador de interações no clique/tap em um país
  const handleCountryClick = (country: MapCountryData, event: React.MouseEvent) => {
    event.stopPropagation();
    
    // Obter coordenadas de clique relativas ao container
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (isMobile) {
      // No Mobile/Touch:
      if (selectedCountry?.slug === country.slug) {
        // Segundo tap no mesmo país: navega
        router.push(`/${locale}/country/${country.slug}`);
      } else {
        // Primeiro tap: abre o tooltip fixado
        setSelectedCountry(country);
        setTooltipPosition({ x, y });
      }
    } else {
      // No Desktop: clique imediato navega
      router.push(`/${locale}/country/${country.slug}`);
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (isMobile || !hoveredCountry) return;
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    setTooltipPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top - 15
    });
  };

  const handleMouseEnter = (country: MapCountryData, event: React.MouseEvent) => {
    if (isMobile) return;
    setHoveredCountry(country);
    
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    setTooltipPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top - 15
    });
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    setHoveredCountry(null);
  };

  // Limpa seleção ao clicar fora de um país
  const handleMapBackgroundClick = () => {
    if (isMobile) {
      setSelectedCountry(null);
    }
  };

  // Altura dinâmica de viewport para o mapa
  const mapHeight = isMobile ? 350 : 520;

  return (
    <div
      ref={containerRef}
      onClick={handleMapBackgroundClick}
      className="relative w-full overflow-hidden bg-slate-50 dark:bg-slate-900 border border-border rounded-2xl shadow-xs"
      style={{ height: `${mapHeight}px` }}
    >
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{
          scale: isMobile ? 120 : 160
        }}
        width={800}
        height={mapHeight}
        style={{
          width: "100%",
          height: "100%"
        }}
      >
        <ZoomableGroup
          zoom={1}
          minZoom={1}
          maxZoom={6}
          // Desativa pan com 1 dedo no mobile se o usuário tentar dar scroll na página
          filterZoomEvent={(evt: unknown) => {
            const e = evt as { type?: string };
            if (isMobile && e?.type === "wheel") return false;
            return true;
          }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const iso3 = numericToIso3(geo.id);
                const country = iso3 ? countriesMap.get(iso3) : null;
                const isFiltered = iso3 ? filteredCountryCodes.has(iso3) : false;

                // Define a cor de preenchimento do país
                let fill = "var(--color-border)";
                if (country) {
                  if (isFiltered) {
                    fill = colors[country.codeISO3] || "var(--color-border)";
                  } else {
                    // Se não passar no filtro, fica opaco/cinza
                    fill = "var(--color-secondary)";
                  }
                }

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={(e) => country && handleMouseEnter(country, e)}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onClick={(e) => country && handleCountryClick(country, e)}
                    style={{
                      default: {
                        fill: fill,
                        outline: "none",
                        stroke: "var(--color-background)",
                        strokeWidth: 0.5,
                        transition: "fill 0.2s ease"
                      },
                      hover: {
                        fill: country && isFiltered ? "var(--color-primary-foreground)" : fill,
                        outline: "none",
                        stroke: "var(--color-primary)",
                        strokeWidth: 1.0,
                        cursor: country ? "pointer" : "default"
                      },
                      pressed: {
                        fill: country && isFiltered ? "var(--color-primary)" : fill,
                        outline: "none"
                      }
                    }}
                    id={`geo-${iso3 || "unknown"}`}
                  />
                );
              })
            }
          </Geographies>

          {/* Marcadores e Hit Areas Ampliadas para microestados */}
          {MICRO_STATES.map((state) => {
            const country = countriesMap.get(state.code);
            if (!country) return null;

            const isFiltered = filteredCountryCodes.has(state.code);
            const fill = isFiltered
              ? colors[state.code] || "var(--color-primary)"
              : "var(--color-secondary)";

            return (
              <Marker
                key={state.code}
                coordinates={state.coordinates as [number, number]}
                id={`marker-${state.code}`}
              >
                {/* Hit target invisível ampliado para touch (círculo de 44px de diâmetro) */}
                <circle
                  r={22}
                  fill="transparent"
                  className="cursor-pointer"
                  onClick={(e) => handleCountryClick(country, e)}
                  onMouseEnter={(e) => handleMouseEnter(country, e)}
                  onMouseLeave={handleMouseLeave}
                  style={{ pointerEvents: "all" }}
                />
                {/* Ponto indicador visível na escala de cores */}
                <circle
                  r={isMobile ? 3.5 : 4.5}
                  fill={fill}
                  stroke="#ffffff"
                  strokeWidth={1}
                  className="pointer-events-none"
                />
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

      {/* Tooltip flutuante/tapped */}
      <CountryTooltip
        country={isMobile ? selectedCountry : hoveredCountry}
        position={tooltipPosition}
        isMobile={isMobile}
        onClose={() => setSelectedCountry(null)}
      />
    </div>
  );
}
