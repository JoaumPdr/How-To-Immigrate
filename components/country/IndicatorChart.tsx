"use client";

import React, { useEffect, useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from "recharts";
import { getMapColor } from "../../lib/utils/MapColorGradient";
import { Badge } from "../ui/Badge";

interface IndicatorChartProps {
  indicators: {
    category: string;
    score: number;
    rawValue: number;
    source: string;
  }[];
  locale: string;
}

const CATEGORY_MAP: Record<string, { pt: string; en: string }> = {
  safety: { pt: "Segurança", en: "Safety" },
  costOfLiving: { pt: "Custo de Vida", en: "Cost of Living" },
  jobMarket: { pt: "Trabalho", en: "Job Market" },
  visaEase: { pt: "Visto", en: "Visa Ease" },
  healthcare: { pt: "Saúde", en: "Healthcare" },
  culturalIntegration: { pt: "Adaptação", en: "Integration" }
};

export function IndicatorChart({ indicators, locale }: IndicatorChartProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 450); // Fallback ativado abaixo de 450px para maior segurança
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const data = indicators.map((ind) => {
    const labels = CATEGORY_MAP[ind.category] || { pt: ind.category, en: ind.category };
    return {
      subject: locale === "en" ? labels.en : labels.pt,
      score: ind.score,
      rawValue: ind.rawValue,
      color: getMapColor(ind.score)
    };
  });

  // Fallback para Mobile / Telas Estreitas
  if (isMobile) {
    return (
      <div className="flex flex-col gap-4 p-4 border border-border/40 rounded-xl bg-background/50">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
          {locale === "en" ? "Key Indicators" : "Principais Indicadores"}
        </h3>
        <div className="flex flex-col gap-4">
          {data.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs font-medium text-foreground">
                <span>{item.subject}</span>
                <span style={{ color: item.color }} className="font-mono font-bold">
                  {item.score}/100
                </span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${item.score}%`,
                    backgroundColor: item.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[300px] flex items-center justify-center relative bg-background/40 border border-border/20 rounded-xl p-2">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="var(--color-border)" strokeWidth={1} />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 11, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 9 }}
            axisLine={false}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="var(--color-primary)"
            fill="var(--color-primary)"
            fillOpacity={0.15}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
