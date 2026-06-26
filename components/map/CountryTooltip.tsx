"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { X, ArrowRight } from "lucide-react";
import { MapCountryData } from "../../lib/hooks/useMapData";
import { getMapColor } from "../../lib/utils/MapColorGradient";

export interface CountryTooltipProps {
  country: MapCountryData | null;
  position: { x: number; y: number } | null;
  isMobile: boolean;
  onClose: () => void;
}

/**
 * Tooltip informativo flutuante exibido sobre o país hovered/tapped.
 * Possui lógica de auto-reposicionamento para não vazar da tela.
 */
export function CountryTooltip({
  country,
  position,
  isMobile,
  onClose
}: CountryTooltipProps) {
  const t = useTranslations("map");
  const locale = useLocale();
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Fechar ao clicar fora no mobile
  useEffect(() => {
    if (!isMobile || !country) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isMobile, country, onClose]);

  if (!country || !position) return null;

  // Auto-ajuste de posição para não vazar da viewport
  const tooltipWidth = 260;
  const tooltipHeight = 250;
  let leftPos = position.x + 15;
  let topPos = position.y - 15;

  if (typeof window !== "undefined") {
    // Evita transbordamento na direita
    if (leftPos + tooltipWidth > window.innerWidth) {
      leftPos = position.x - tooltipWidth - 15;
    }
    // Evita transbordamento no topo
    if (topPos < 0) {
      topPos = position.y + 15;
    }
    // Evita transbordamento na base
    if (topPos + tooltipHeight > window.innerHeight) {
      topPos = position.y - tooltipHeight - 15;
    }
    
    // Força valores mínimos para não vazar na esquerda
    leftPos = Math.max(10, leftPos);
    topPos = Math.max(10, topPos);
  }

  const overallColor = getMapColor(country.overallScore);

  const getIndicatorScore = (category: string): number => {
    const ind = country.indicators.find((i) => i.category === category);
    return ind ? ind.score : 0;
  };

  const formattedLanguages = country.languages
    .map((l) => l.toUpperCase())
    .join(", ");

  return (
    <div
      ref={tooltipRef}
      style={{
        position: "absolute",
        left: `${leftPos}px`,
        top: `${topPos}px`,
        width: `${tooltipWidth}px`
      }}
      className="z-30 p-4 bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-xl animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-3"
      role="tooltip"
    >
      {/* Header com Bandeira, Nome e Botão Fechar (Mobile) */}
      <div className="flex items-center justify-between gap-2 border-b border-border pb-2">
        <div className="flex items-center gap-2 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://flagcdn.com/w80/${country.codeISO2.toLowerCase()}.png`}
            alt={`Flag of ${country.nameEn}`}
            className="w-6 h-4 object-cover rounded-xs border border-border/50 shrink-0"
          />
          <h3 className="font-bold text-foreground text-sm truncate">
            {locale === "en" ? country.nameEn : country.name}
          </h3>
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label="Fechar"
            id="btn-close-tooltip"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Score Geral */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Score Geral:
        </span>
        <span
          style={{ color: overallColor }}
          className="text-sm font-extrabold flex items-center gap-1 font-mono"
        >
          {country.overallScore.toFixed(1)}
        </span>
      </div>

      {/* Indicadores Principais */}
      <div className="flex flex-col gap-1.5 text-[11px]">
        {/* Segurança */}
        <div className="flex justify-between items-center text-muted-foreground">
          <span>{t("safety")}</span>
          <span className="font-semibold text-foreground font-mono">
            {getIndicatorScore("safety")}
          </span>
        </div>
        {/* Custo de Vida */}
        <div className="flex justify-between items-center text-muted-foreground">
          <span>{t("costOfLiving")}</span>
          <span className="font-semibold text-foreground font-mono">
            {getIndicatorScore("costOfLiving")}
          </span>
        </div>
        {/* Mercado de Trabalho */}
        <div className="flex justify-between items-center text-muted-foreground">
          <span>{t("jobMarket")}</span>
          <span className="font-semibold text-foreground font-mono">
            {getIndicatorScore("jobMarket")}
          </span>
        </div>
        {/* Idioma */}
        <div className="flex justify-between items-center text-muted-foreground pt-1 border-t border-border/30">
          <span>Idioma:</span>
          <span className="font-medium text-foreground truncate max-w-[120px]">
            {formattedLanguages}
          </span>
        </div>
      </div>

      {/* Ação de Navegação */}
      <Link
        href={`/${locale}/country/${country.slug}`}
        className="mt-1 flex items-center justify-between text-xs font-semibold text-primary hover:text-primary/80 transition-colors pt-2 border-t border-border group"
        id={`link-details-${country.slug}`}
      >
        <span>{t("viewDetails")}</span>
        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
}
