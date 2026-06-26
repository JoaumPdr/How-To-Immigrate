"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { SlidersHorizontal } from "lucide-react";
import { Select } from "../ui/Select";
import { Sheet } from "../ui/Sheet";
import { Button } from "../ui/Button";

export interface MapFiltersProps {
  regions: string[];
  selectedRegion: string;
  onSelectRegion: (region: string) => void;

  selectedIndicator: string;
  onSelectIndicator: (indicator: string) => void;

  selectedScoreRange: string;
  onSelectScoreRange: (range: string) => void;
}

interface FilterFieldsProps {
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
  selectedIndicator: string;
  onSelectIndicator: (indicator: string) => void;
  selectedScoreRange: string;
  onSelectScoreRange: (range: string) => void;
  regions: string[];
  indicators: { id: string; label: string }[];
  scoreRanges: { id: string; label: string }[];
  t: (key: string) => string;
  onClose: () => void;
}

function FilterFields({
  selectedRegion,
  onSelectRegion,
  selectedIndicator,
  onSelectIndicator,
  selectedScoreRange,
  onSelectScoreRange,
  regions,
  indicators,
  scoreRanges,
  t,
  onClose
}: FilterFieldsProps) {
  return (
    <>
      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {t("region")}
        </label>
        <Select
          value={selectedRegion}
          onChange={(e) => {
            onSelectRegion(e.target.value);
            onClose();
          }}
          id="select-region"
          aria-label={t("region")}
        >
          <option value="all">{t("allRegions")}</option>
          {regions.map((reg) => (
            <option key={reg} value={reg}>
              {reg}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {t("indicator")}
        </label>
        <Select
          value={selectedIndicator}
          onChange={(e) => {
            onSelectIndicator(e.target.value);
            onClose();
          }}
          id="select-indicator"
          aria-label={t("indicator")}
        >
          {indicators.map((ind) => (
            <option key={ind.id} value={ind.id}>
              {ind.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col gap-1.5 w-full">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {t("scoreRange")}
        </label>
        <Select
          value={selectedScoreRange}
          onChange={(e) => {
            onSelectScoreRange(e.target.value);
            onClose();
          }}
          id="select-score-range"
          aria-label={t("scoreRange")}
        >
          {scoreRanges.map((rng) => (
            <option key={rng.id} value={rng.id}>
              {rng.label}
            </option>
          ))}
        </Select>
      </div>
    </>
  );
}

/**
 * Componente de filtros para o mapa interativo.
 * Renderiza horizontalmente no desktop e abre via Sheet deslizante no mobile.
 */
export function MapFilters({
  regions,
  selectedRegion,
  onSelectRegion,
  selectedIndicator,
  onSelectIndicator,
  selectedScoreRange,
  onSelectScoreRange
}: MapFiltersProps) {
  const t = useTranslations("map");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const indicators = [
    { id: "overall", label: t("overallScore") },
    { id: "safety", label: t("safety") },
    { id: "costOfLiving", label: t("costOfLiving") },
    { id: "jobMarket", label: t("jobMarket") },
    { id: "visaEase", label: t("visaEase") },
    { id: "healthcare", label: t("healthcare") },
    { id: "culturalIntegration", label: t("culturalIntegration") }
  ];

  const scoreRanges = [
    { id: "all", label: t("allScores") },
    { id: "excellent", label: "Excelente (80-100)" },
    { id: "good", label: "Bom (70-79)" },
    { id: "moderate", label: "Moderado (50-69)" },
    { id: "hard", label: "Desafiador (0-49)" }
  ];

  const handleClose = () => {
    setIsSheetOpen(false);
  };

  const fieldsProps = {
    selectedRegion,
    onSelectRegion,
    selectedIndicator,
    onSelectIndicator,
    selectedScoreRange,
    onSelectScoreRange,
    regions,
    indicators,
    scoreRanges,
    t,
    onClose: handleClose
  };

  return (
    <div className="w-full">
      {/* Versão Desktop (Horizontal Inline) */}
      <div className="hidden md:flex items-center gap-6 p-4 bg-card border border-border rounded-xl shadow-xs">
        <FilterFields {...fieldsProps} onClose={() => {}} />
      </div>

      {/* Versão Mobile (Botão + Sheet Drawer) */}
      <div className="md:hidden flex items-center justify-between w-full p-3 bg-card border border-border rounded-xl">
        <span className="text-sm font-semibold text-foreground">
          {t("filterTitle")}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsSheetOpen(true)}
          className="flex items-center gap-1.5 h-9"
          id="btn-open-filters-mobile"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {t("filters")}
        </Button>

        <Sheet
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          side="bottom"
          title={t("filterTitle")}
        >
          <div className="flex flex-col gap-5 pt-2 pb-6">
            <FilterFields {...fieldsProps} />
          </div>
        </Sheet>
      </div>
    </div>
  );
}
