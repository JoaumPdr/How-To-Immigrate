import React from "react";
import { MapPin, Globe, Landmark, Users2, Star } from "lucide-react";
import { getMapColor } from "../../lib/utils/MapColorGradient";
import { FavoriteButton } from "./FavoriteButton";
import { Card, CardContent } from "../ui/Card";

interface CountryHeroProps {
  country: {
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
  };
  locale: string;
}

export function CountryHero({ country, locale }: CountryHeroProps) {
  const overallColor = getMapColor(country.overallScore);
  const formattedLanguages = country.languages
    .map((l) => l.toUpperCase())
    .join(", ");

  const title = locale === "en" ? country.nameEn : country.name;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-linear-to-b from-muted/50 to-background p-6 md:p-8 mb-8">
      {/* Background decoration elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-accent/5 blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        {/* Info lateral */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={country.flagUrl}
            alt={`Flag of ${country.nameEn}`}
            className="w-20 h-14 object-cover rounded-lg border border-border shadow-xs shrink-0"
          />
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                {title}
              </h1>
              <FavoriteButton country={country} />
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-muted-foreground">
              <span className="font-mono bg-muted px-2 py-0.5 rounded-md text-xs border border-border/40">
                {country.codeISO3} / {country.codeISO2}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {country.region}
              </span>
            </div>
          </div>
        </div>

        {/* Score geral de imigração */}
        <div className="flex items-center gap-4 shrink-0 bg-background/60 backdrop-blur-xs p-4 rounded-xl border border-border/80 shadow-2xs self-start md:self-auto">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Score Geral
            </span>
            <span className="text-xs text-muted-foreground mt-0.5">
              {locale === "en" ? "Immigration Potential" : "Potencial de Imigração"}
            </span>
          </div>
          <div className="flex items-center justify-center">
            <div
              style={{ borderColor: overallColor, color: overallColor }}
              className="text-3xl font-black font-mono border-4 rounded-full w-16 h-16 flex items-center justify-center shadow-xs"
            >
              {country.overallScore.toFixed(1)}
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Informações Rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-border/40">
        <div className="flex flex-col gap-1 bg-background/40 p-3 rounded-lg border border-border/20">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1.5">
            <Globe className="w-3 h-3 text-primary" />
            {locale === "en" ? "Capital" : "Capital"}
          </span>
          <span className="font-semibold text-foreground text-sm truncate">{country.capital}</span>
        </div>
        <div className="flex flex-col gap-1 bg-background/40 p-3 rounded-lg border border-border/20">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1.5">
            <Landmark className="w-3 h-3 text-primary" />
            {locale === "en" ? "Currency" : "Moeda"}
          </span>
          <span className="font-semibold text-foreground text-sm truncate">{country.currency}</span>
        </div>
        <div className="flex flex-col gap-1 bg-background/40 p-3 rounded-lg border border-border/20">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1.5">
            <Users2 className="w-3 h-3 text-primary" />
            {locale === "en" ? "Languages" : "Idiomas"}
          </span>
          <span className="font-semibold text-foreground text-sm truncate" title={formattedLanguages}>
            {formattedLanguages}
          </span>
        </div>
        <div className="flex flex-col gap-1 bg-background/40 p-3 rounded-lg border border-border/20">
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1.5">
            <Star className="w-3 h-3 text-primary" />
            {locale === "en" ? "Ranking" : "Classificação"}
          </span>
          <span className="font-semibold text-foreground text-sm">
            {country.overallScore >= 85 ? (locale === "en" ? "Excellent" : "Excelente") : country.overallScore >= 70 ? (locale === "en" ? "Good" : "Bom") : (locale === "en" ? "Moderate" : "Moderado")}
          </span>
        </div>
      </div>
    </div>
  );
}
