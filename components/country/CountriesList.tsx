"use client";

import React, { useState, useMemo } from "react";
import { Link } from "@/i18n/routing";
import { Search, SlidersHorizontal, LayoutGrid, Table, ArrowUpRight, HelpCircle } from "lucide-react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import { getMapColor } from "../../lib/utils/MapColorGradient";
import { cn } from "../../lib/utils/cn";

interface Country {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  codeISO2: string;
  codeISO3: string;
  region: string;
  capital: string;
  currency: string;
  languages: string[];
  flagUrl: string;
  overallScore: number;
  indicators: {
    category: string;
    score: number;
  }[];
}

interface CountriesListProps {
  initialCountries: Country[];
  locale: string;
}

const REGIONS = [
  { id: "all", labelPt: "Todas as Regiões", labelEn: "All Regions" },
  { id: "Europe", labelPt: "Europa", labelEn: "Europe" },
  { id: "North America", labelPt: "América do Norte", labelEn: "North America" },
  { id: "Central & South America", labelPt: "América Central e do Sul", labelEn: "Central & South America" },
  { id: "Asia", labelPt: "Ásia", labelEn: "Asia" },
  { id: "Oceania", labelPt: "Oceania", labelEn: "Oceania" },
  { id: "Africa & Middle East", labelPt: "África e Oriente Médio", labelEn: "Africa & Middle East" }
];

const SCORE_RANGES = [
  { id: "all", labelPt: "Qualquer Pontuação", labelEn: "Any Score" },
  { id: "excellent", labelPt: "Excelente (80+)", labelEn: "Excellent (80+)" },
  { id: "good", labelPt: "Bom (60-79)", labelEn: "Good (60-79)" },
  { id: "regular", labelPt: "Regular (40-59)", labelEn: "Regular (40-59)" },
  { id: "difficult", labelPt: "Difícil (<40)", labelEn: "Difficult (<40)" }
];

export function CountriesList({ initialCountries, locale }: CountriesListProps) {
  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedScoreRange, setSelectedScoreRange] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "score" | "cost" | "safety">("score");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Auxiliar para obter a nota de uma categoria específica
  const getCategoryScore = (country: Country, category: string): number => {
    const indicator = country.indicators.find((ind) => ind.category === category);
    return indicator ? indicator.score : 0;
  };

  // Filtragem dos países
  const filteredCountries = useMemo(() => {
    return initialCountries.filter((country) => {
      // 1. Busca textual
      const countryName = locale === "en" ? country.nameEn : country.name;
      const matchesSearch =
        countryName.toLowerCase().includes(search.toLowerCase()) ||
        country.capital.toLowerCase().includes(search.toLowerCase()) ||
        country.codeISO3.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;

      // 2. Filtro de Região
      if (selectedRegion !== "all" && country.region !== selectedRegion) {
        return false;
      }

      // 3. Filtro de Faixa de Score
      if (selectedScoreRange !== "all") {
        const score = country.overallScore;
        if (selectedScoreRange === "excellent" && score < 80) return false;
        if (selectedScoreRange === "good" && (score < 60 || score >= 80)) return false;
        if (selectedScoreRange === "regular" && (score < 40 || score >= 60)) return false;
        if (selectedScoreRange === "difficult" && score >= 40) return false;
      }

      return true;
    });
  }, [initialCountries, search, selectedRegion, selectedScoreRange, locale]);

  // Ordenação dos países
  const sortedCountries = useMemo(() => {
    const sorted = [...filteredCountries];
    sorted.sort((a, b) => {
      let valA: string | number = a.name;
      let valB: string | number = b.name;

      if (sortBy === "name") {
        valA = locale === "en" ? a.nameEn : a.name;
        valB = locale === "en" ? b.nameEn : b.name;
      } else if (sortBy === "score") {
        valA = a.overallScore;
        valB = b.overallScore;
      } else if (sortBy === "cost") {
        valA = getCategoryScore(a, "costOfLiving");
        valB = getCategoryScore(b, "costOfLiving");
      } else if (sortBy === "safety") {
        valA = getCategoryScore(a, "safety");
        valB = getCategoryScore(b, "safety");
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredCountries, sortBy, sortOrder, locale]);

  const toggleSort = (type: typeof sortBy) => {
    if (sortBy === type) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(type);
      setSortOrder(type === "name" ? "asc" : "desc"); // nomes asc, scores desc por padrão
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setSelectedRegion("all");
    setSelectedScoreRange("all");
    setSortBy("score");
    setSortOrder("desc");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Controles de Busca e Filtro */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={locale === "en" ? "Search country or capital..." : "Buscar país ou capital..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              variant="outline"
              onClick={() => setShowFilters((prev) => !prev)}
              className={cn("gap-2", showFilters && "bg-muted border-primary/40")}
            >
              <SlidersHorizontal className="w-4 h-4" />
              {locale === "en" ? "Filters" : "Filtros"}
              {(selectedRegion !== "all" || selectedScoreRange !== "all") && (
                <span className="w-2 h-2 rounded-full bg-primary" />
              )}
            </Button>
            <div className="flex border border-border rounded-lg p-0.5 bg-muted/30">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-1.5 rounded-md transition-all",
                  viewMode === "grid" ? "bg-background text-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
                )}
                aria-label="View as grid"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={cn(
                  "p-1.5 rounded-md transition-all",
                  viewMode === "table" ? "bg-background text-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground"
                )}
                aria-label="View as table"
              >
                <Table className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Gaveta de filtros expansível */}
        {showFilters && (
          <Card className="border border-border bg-muted/10">
            <CardContent className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {/* Região */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {locale === "en" ? "Region" : "Região"}
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {REGIONS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {locale === "en" ? r.labelEn : r.labelPt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Faixa de Score */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {locale === "en" ? "Immigration Score" : "Score de Imigração"}
                </label>
                <select
                  value={selectedScoreRange}
                  onChange={(e) => setSelectedScoreRange(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {SCORE_RANGES.map((sr) => (
                    <option key={sr.id} value={sr.id}>
                      {locale === "en" ? sr.labelEn : sr.labelPt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Botões */}
              <div className="flex items-end justify-start sm:justify-end gap-2">
                <Button variant="outline" size="sm" onClick={handleResetFilters} className="w-full sm:w-auto">
                  {locale === "en" ? "Clear Filters" : "Limpar Filtros"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Estatísticas Rápidas */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {locale === "en"
            ? `Found ${sortedCountries.length} countries`
            : `Encontrados ${sortedCountries.length} países`}
        </span>
        <div className="flex items-center gap-1">
          <span>{locale === "en" ? "Sorted by:" : "Ordenado por:"}</span>
          <button
            onClick={() => toggleSort("score")}
            className={cn(
              "font-semibold hover:underline",
              sortBy === "score" ? "text-primary" : "text-muted-foreground"
            )}
          >
            {locale === "en" ? "Score" : "Pontuação"}
            {sortBy === "score" && (sortOrder === "asc" ? " ↑" : " ↓")}
          </button>
          <span>•</span>
          <button
            onClick={() => toggleSort("name")}
            className={cn(
              "font-semibold hover:underline",
              sortBy === "name" ? "text-primary" : "text-muted-foreground"
            )}
          >
            {locale === "en" ? "Name" : "Nome"}
            {sortBy === "name" && (sortOrder === "asc" ? " ↑" : " ↓")}
          </button>
          <span>•</span>
          <button
            onClick={() => toggleSort("cost")}
            className={cn(
              "font-semibold hover:underline",
              sortBy === "cost" ? "text-primary" : "text-muted-foreground"
            )}
          >
            {locale === "en" ? "Cost" : "Custo"}
            {sortBy === "cost" && (sortOrder === "asc" ? " ↑" : " ↓")}
          </button>
        </div>
      </div>

      {/* Lista de Países */}
      {sortedCountries.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-border rounded-xl text-muted-foreground">
          <HelpCircle className="w-8 h-8 mx-auto mb-2 text-muted-foreground/60" />
          <p className="text-sm font-semibold">
            {locale === "en" ? "No countries match your filters." : "Nenhum país corresponde aos seus filtros."}
          </p>
          <Button variant="ghost" onClick={handleResetFilters} className="mt-2 text-xs text-primary hover:underline hover:bg-transparent">
            {locale === "en" ? "Reset all filters" : "Resetar todos os filtros"}
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        /* Visualização: GRADE DE CARDS */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sortedCountries.map((country) => {
            const countryName = locale === "en" ? country.nameEn : country.name;
            const cardBgColor = getMapColor(country.overallScore);
            return (
              <Card key={country.slug} isHoverable className="flex flex-col h-full overflow-hidden border border-border/40">
                <CardContent className="p-0 flex flex-col h-full">
                  {/* Header do Card com bandeira e score */}
                  <div className="p-4 flex items-center justify-between gap-4 border-b border-border/20 bg-muted/10">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={country.flagUrl}
                        alt={`Flag of ${country.nameEn}`}
                        className="w-10 h-7 object-cover rounded-md border border-border/40"
                      />
                      <div className="min-w-0">
                        <h3 className="font-bold text-foreground truncate leading-tight">{countryName}</h3>
                        <span className="text-[10px] text-muted-foreground block truncate">{country.region}</span>
                      </div>
                    </div>
                    {/* Badge do Score */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0 border shadow-2xs"
                      style={{
                        backgroundColor: cardBgColor,
                        borderColor: cardBgColor
                      }}
                      title={`Overall Score: ${country.overallScore}`}
                    >
                      {country.overallScore}
                    </div>
                  </div>

                  {/* Detalhes Rápidos de Indicadores */}
                  <div className="p-4 flex-1 grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                    {/* Custo de Vida */}
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        {locale === "en" ? "Cost of Living" : "Custo de Vida"}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden shrink-0">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${getCategoryScore(country, "costOfLiving")}%`,
                              backgroundColor: getMapColor(getCategoryScore(country, "costOfLiving"))
                            }}
                          />
                        </div>
                        <span className="font-semibold text-foreground">{getCategoryScore(country, "costOfLiving")}</span>
                      </div>
                    </div>

                    {/* Segurança */}
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        {locale === "en" ? "Safety" : "Segurança"}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden shrink-0">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${getCategoryScore(country, "safety")}%`,
                              backgroundColor: getMapColor(getCategoryScore(country, "safety"))
                            }}
                          />
                        </div>
                        <span className="font-semibold text-foreground">{getCategoryScore(country, "safety")}</span>
                      </div>
                    </div>

                    {/* Idioma */}
                    <div className="flex flex-col gap-0.5 col-span-2">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                        {locale === "en" ? "Official Languages" : "Idiomas Oficiais"}
                      </span>
                      <span className="text-foreground font-medium truncate">
                        {country.languages.join(", ")}
                      </span>
                    </div>
                  </div>

                  {/* Ação */}
                  <div className="p-4 pt-0">
                    <Link href={`/country/${country.slug}`} className="w-full">
                      <Button variant="outline" size="sm" className="w-full gap-1.5 hover:bg-primary hover:text-primary-foreground group">
                        {locale === "en" ? "View Immigration Guide" : "Ver Guia de Imigração"}
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Visualização: TABELA COMPARATIVA */
        <div className="w-full overflow-x-auto border border-border rounded-xl bg-card">
          <table className="w-full text-sm text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="p-4 font-bold text-muted-foreground w-1/3">{locale === "en" ? "Country" : "País"}</th>
                <th className="p-4 font-bold text-muted-foreground text-center">{locale === "en" ? "Overall Score" : "Score Geral"}</th>
                <th className="p-4 font-bold text-muted-foreground text-center">{locale === "en" ? "Cost of Living" : "Custo de Vida"}</th>
                <th className="p-4 font-bold text-muted-foreground text-center">{locale === "en" ? "Safety" : "Segurança"}</th>
                <th className="p-4 font-bold text-muted-foreground text-center">{locale === "en" ? "Work Market" : "Mercado de Trabalho"}</th>
                <th className="p-4 font-bold text-muted-foreground text-right">{locale === "en" ? "Action" : "Ação"}</th>
              </tr>
            </thead>
            <tbody>
              {sortedCountries.map((country) => {
                const countryName = locale === "en" ? country.nameEn : country.name;
                const scoreColor = getMapColor(country.overallScore);
                return (
                  <tr key={country.slug} className="border-b border-border/40 hover:bg-muted/10 transition-colors">
                    <td className="p-4 font-semibold text-foreground">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={country.flagUrl}
                          alt={`Flag of ${country.nameEn}`}
                          className="w-7 h-5 object-cover rounded-md border border-border/40 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="truncate block font-bold leading-tight">{countryName}</span>
                          <span className="text-[10px] text-muted-foreground block truncate">{country.region}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center font-bold">
                      <span
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-white font-extrabold text-xs shadow-2xs border"
                        style={{
                          backgroundColor: scoreColor,
                          borderColor: scoreColor
                        }}
                      >
                        {country.overallScore}
                      </span>
                    </td>
                    <td className="p-4 text-center font-semibold text-foreground">
                      {getCategoryScore(country, "costOfLiving")}
                    </td>
                    <td className="p-4 text-center font-semibold text-foreground">
                      {getCategoryScore(country, "safety")}
                    </td>
                    <td className="p-4 text-center font-semibold text-foreground">
                      {getCategoryScore(country, "jobMarket")}
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/country/${country.slug}`}>
                        <Button variant="ghost" size="sm" className="gap-1 text-primary hover:bg-primary/10">
                          {locale === "en" ? "Guide" : "Guia"}
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
