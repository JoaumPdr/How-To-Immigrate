import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Globe, Landmark, Users2, AlertCircle } from "lucide-react";
import { countryRepository } from "../../../../lib/repositories/countryRepository";
import { getMapColor } from "../../../../lib/utils/MapColorGradient";
import { Badge } from "../../../../components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "../../../../components/ui/Card";

interface CountryPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: CountryPageProps) {
  const { slug } = await params;
  const country = await countryRepository.findBySlug(slug);

  if (!country) return { title: "País Não Encontrado" };

  return {
    title: `${country.name} - Planejamento de Imigração`,
    description: `Explore as estatísticas, mercado de trabalho, custo de vida e segurança para imigrar para o ${country.name}.`
  };
}

/**
 * Página Placeholder/Skeleton para exibir informações preliminares de um país
 * antes da implementação da página completa na Etapa 05.
 */
export default async function CountryPage({ params }: CountryPageProps) {
  const { locale, slug } = await params;
  const country = await countryRepository.findBySlug(slug);

  if (!country) {
    notFound();
  }

  const overallColor = getMapColor(country.overallScore);

  const getIndicatorScore = (category: string): number => {
    const ind = country.indicators.find((i) => i.category === category);
    return ind ? ind.score : 0;
  };

  const formattedLanguages = country.languages
    .map((l) => l.toUpperCase())
    .join(", ");

  const indicatorsList = [
    { key: "safety", label: "Segurança", desc: "Índice de segurança pública" },
    { key: "costOfLiving", label: "Custo de Vida", desc: "Índice de viabilidade econômica" },
    { key: "jobMarket", label: "Mercado de Trabalho", desc: "Oportunidades e salários" },
    { key: "visaEase", label: "Facilidade de Visto", desc: "Facilidade de legalização burocrática" },
    { key: "healthcare", label: "Saúde", desc: "Qualidade do sistema médico" },
    { key: "culturalIntegration", label: "Adaptação Cultural", desc: "Idioma e receptividade social" }
  ];

  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Botão de Retorno */}
      <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors mb-6 group">
        <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" />
        Voltar para o mapa
      </Link>

      {/* Alerta de MVP / Skeleton */}
      <div className="flex gap-3 p-4 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl text-sm mb-8">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">MVP Core:</span> Você está visualizando a página de estatísticas preliminares obtidas do banco. O guia detalhado de vistos, reviews da comunidade e o roteiro personalizado estarão disponíveis nas próximas etapas de desenvolvimento.
        </div>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Coluna da Esquerda: Ficha Rápida */}
        <div className="md:col-span-1 flex flex-col gap-6">
          <Card>
            <CardHeader className="flex flex-col gap-2 pb-2">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={country.flagUrl}
                  alt={`Flag of ${country.nameEn}`}
                  className="w-12 h-8 object-cover rounded-xs border border-border/50 shrink-0"
                />
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground">
                    {locale === "en" ? country.nameEn : country.name}
                  </h1>
                  <span className="text-xs font-mono text-muted-foreground">
                    {country.codeISO3} / {country.codeISO2}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-sm pt-4 border-t border-border/50">
              {/* Score Geral */}
              <div className="flex justify-between items-center bg-muted/30 p-3 rounded-lg border border-border/30">
                <span className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                  Score de Imigração
                </span>
                <span
                  style={{ color: overallColor }}
                  className="text-2xl font-black font-mono"
                >
                  {country.overallScore.toFixed(1)}
                </span>
              </div>

              {/* Informações Gerais */}
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>Região: <strong className="text-foreground">{country.region}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="w-4 h-4 shrink-0" />
                  <span>Capital: <strong className="text-foreground">{country.capital}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Landmark className="w-4 h-4 shrink-0" />
                  <span>Moeda: <strong className="text-foreground">{country.currency}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users2 className="w-4 h-4 shrink-0" />
                  <span>Idiomas: <strong className="text-foreground">{formattedLanguages}</strong></span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna da Direita: Indicadores e Skeleton de Conteúdo */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Indicadores Detalhados</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {indicatorsList.map((ind) => {
                  const score = getIndicatorScore(ind.key);
                  const color = getMapColor(score);
                  return (
                    <div key={ind.key} className="p-3 bg-muted/20 border border-border/50 rounded-lg flex flex-col gap-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-sm text-foreground">{ind.label}</span>
                        <Badge style={{ backgroundColor: color, color: "#fff" }} className="font-mono text-xs font-bold border-none">
                          {score}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{ind.desc}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Skeleton de Conteúdo (Simula guias e depoimentos) */}
          <Card className="opacity-80">
            <CardHeader className="pb-2">
              <div className="h-5 w-48 bg-muted rounded-md animate-pulse mb-1" />
              <div className="h-3 w-64 bg-muted rounded-md animate-pulse" />
            </CardHeader>
            <CardContent className="flex flex-col gap-4 mt-4">
              <div className="flex flex-col gap-2">
                <div className="h-4 w-full bg-muted rounded-md animate-pulse" />
                <div className="h-4 w-5/6 bg-muted rounded-md animate-pulse" />
                <div className="h-4 w-4/5 bg-muted rounded-md animate-pulse" />
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <div className="h-4 w-full bg-muted rounded-md animate-pulse" />
                <div className="h-4 w-full bg-muted rounded-md animate-pulse" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
