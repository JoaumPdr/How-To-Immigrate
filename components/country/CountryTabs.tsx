"use client";

import React, { useState, useRef, useEffect } from "react";
import { IndicatorChart } from "./IndicatorChart";
import { RoadmapStepper } from "./RoadmapStepper";
import { VisaCard } from "./VisaCard";
import { OfficialLinksSection } from "./OfficialLinksSection";
import { VisaEligibilityChecker } from "./VisaEligibilityChecker";
import { cn } from "../../lib/utils/cn";
import {
  FileText,
  Map,
  ShieldCheck,
  DollarSign,
  Briefcase,
  Activity,
  GraduationCap,
  Home,
  Link2,
  AlertTriangle
} from "lucide-react";

interface Visa {
  id: string;
  name: string;
  type: string;
  description: string;
  requirements: string[];
  documents: string[];
  financialRequirement: string | null;
  officialLink: string | null;
}

interface OfficialLink {
  id: string;
  title: string;
  url: string;
  type: string;
  language: string;
}

interface RoadmapStep {
  id: string;
  order: number;
  title: string;
  description: string;
  status: string;
  visaType: string | null;
  documents: string[];
  officialLink: string | null;
  visaId: string | null;
  visa: { id: string; name: string; type: string } | null;
}

interface CountryDetail {
  id: string;
  overview: string;
  costOfLiving: string;
  jobMarket: string;
  healthcare: string;
  education: string;
  housing: string;
  overviewEn: string;
  costOfLivingEn: string;
  jobMarketEn: string;
  healthcareEn: string;
  educationEn: string;
  housingEn: string;
}

interface CountryTabsProps {
  country: {
    id: string;
    slug: string;
    name: string;
    nameEn: string;
    indicators: { category: string; score: number; rawValue: number; source: string }[];
    visas: Visa[];
    officialLinks: OfficialLink[];
    detail: CountryDetail | null;
    roadmaps: { steps: RoadmapStep[] }[];
  };
  initialCompletedStepIds: string[];
  locale: string;
}

export function CountryTabs({ country, initialCompletedStepIds, locale }: CountryTabsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const tabContainerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  const tabs = [
    { id: "overview", label: locale === "en" ? "Overview" : "Visão Geral", icon: FileText },
    { id: "roadmap", label: locale === "en" ? "Roadmap" : "Guia Passo a Passo", icon: Map },
    { id: "visas", label: locale === "en" ? "Visas" : "Vistos Disponíveis", icon: ShieldCheck },
    { id: "costOfLiving", label: locale === "en" ? "Cost of Living" : "Custo de Vida", icon: DollarSign },
    { id: "jobMarket", label: locale === "en" ? "Job Market" : "Trabalho", icon: Briefcase },
    { id: "healthcare", label: locale === "en" ? "Healthcare" : "Saúde", icon: Activity },
    { id: "education", label: locale === "en" ? "Education" : "Educação", icon: GraduationCap },
    { id: "housing", label: locale === "en" ? "Housing" : "Moradia", icon: Home },
    { id: "links", label: locale === "en" ? "Official Links" : "Links Oficiais", icon: Link2 }
  ];

  // Rola automaticamente a aba ativa para o centro no mobile
  useEffect(() => {
    if (activeTabRef.current && tabContainerRef.current) {
      const container = tabContainerRef.current;
      const tab = activeTabRef.current;
      const scrollPosition = tab.offsetLeft - container.offsetWidth / 2 + tab.offsetWidth / 2;
      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth"
      });
    }
  }, [activeTab]);

  const steps = country.roadmaps[0]?.steps || [];
  const textDetail = country.detail;

  const getLocalizedText = (field: keyof CountryDetail) => {
    if (!textDetail) return "";
    if (locale === "en") {
      const enField = `${String(field)}En` as keyof CountryDetail;
      return textDetail[enField] || textDetail[field] || "";
    }
    return textDetail[field] || "";
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Barra de Navegação das Tabs com Scroll Horizontal */}
      <div className="relative border-b border-border/60 pb-px">
        {/* Indicadores de Gradiente nas pontas para demonstrar scroll horizontal */}
        <div className="absolute left-0 bottom-0 top-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none md:hidden z-10" />
        <div className="absolute right-0 bottom-0 top-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none md:hidden z-10" />

        <div
          ref={tabContainerRef}
          className="flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-none px-4 md:px-0 py-1"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                ref={isActive ? activeTabRef : null}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "snap-center shrink-0 flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg border transition-all duration-300 select-none",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  isActive
                    ? "bg-primary border-primary text-primary-foreground shadow-xs scale-[1.02]"
                    : "bg-background/40 hover:bg-background border-border/40 hover:border-border text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Conteúdo Ativo */}
      <div className="min-h-[250px] focus:outline-none">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Gráfico de Radar de Notas */}
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-bold text-foreground">
                  {locale === "en" ? "Country Performance Breakdown" : "Análise de Indicadores Nacionais"}
                </h3>
                <IndicatorChart indicators={country.indicators} locale={locale} />
              </div>

              {/* Guia de Visão Geral Textual */}
              {textDetail ? (
                <div className="whitespace-pre-line text-muted-foreground leading-relaxed text-xs md:text-sm bg-muted/5 border border-border/20 rounded-xl p-5 md:p-6 mt-2">
                  {getLocalizedText("overview")}
                </div>
              ) : (
                <div className="p-6 text-center border border-dashed border-border rounded-xl text-muted-foreground text-sm">
                  {locale === "en" ? "Detailed overview pending." : "Visão geral detalhada não cadastrada."}
                </div>
              )}
            </div>

            {/* Widget Lateral do Quiz de Vistos */}
            <div className="lg:col-span-1 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <h3 className="text-sm font-bold text-foreground">
                  {locale === "en" ? "Visa Eligibility Quiz" : "Simulador de Visto"}
                </h3>
                <p className="text-[11px] text-muted-foreground leading-normal">
                  {locale === "en"
                    ? "Find out the best immigration pathway for your profile."
                    : "Descubra qual visto é o mais adequado para o seu perfil e objetivos."}
                </p>
              </div>
              <VisaEligibilityChecker
                visas={country.visas}
                countryName={locale === "en" ? country.nameEn : country.name}
                locale={locale}
              />
            </div>
          </div>
        )}

        {activeTab === "roadmap" && (
          <div className="max-w-3xl mx-auto flex flex-col gap-4">
            <div className="flex flex-col gap-1 mb-4">
              <h3 className="text-base font-bold text-foreground">
                {locale === "en" ? "Step-by-Step Immigration Guide" : "Roteiro Oficial de Imigração"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {locale === "en"
                  ? "Follow these sequential steps to establish yourself legally in the country."
                  : "Siga estas etapas essenciais em sequência para obter sua autorização de residência definitiva."}
              </p>
            </div>
            {steps.length > 0 ? (
              <RoadmapStepper steps={steps} initialCompletedStepIds={initialCompletedStepIds} locale={locale} />
            ) : (
              <div className="p-8 text-center border border-dashed border-border rounded-xl text-muted-foreground text-sm">
                {locale === "en" ? "No roadmap available yet." : "Nenhum roteiro disponível para este país no momento."}
              </div>
            )}
          </div>
        )}

        {activeTab === "visas" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-bold text-foreground">
                {locale === "en" ? "Available Visa Modalities" : "Modalidades de Vistos Governamentais"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {locale === "en"
                  ? "Explore the requirements, costs, and criteria of current legal immigration options."
                  : "Conheça os custos, requisitos e facilidades dos vistos vigentes para imigração legal."}
              </p>
            </div>
            {country.visas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {country.visas.map((visa) => (
                  <VisaCard key={visa.id} visa={visa} locale={locale} />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center border border-dashed border-border rounded-xl text-muted-foreground text-sm">
                {locale === "en" ? "No visas registered for this country." : "Nenhum visto governamental disponível cadastrado."}
              </div>
            )}
          </div>
        )}

        {["costOfLiving", "jobMarket", "healthcare", "education", "housing"].map((sectionKey) => {
          if (activeTab !== sectionKey) return null;
          const sectionText = getLocalizedText(sectionKey as keyof CountryDetail);

          return (
            <div key={sectionKey} className="max-w-4xl mx-auto flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold text-foreground capitalize">
                  {tabs.find((t) => t.id === sectionKey)?.label}
                </h3>
              </div>
              {sectionText ? (
                <div className="whitespace-pre-line text-muted-foreground leading-relaxed text-xs md:text-sm bg-muted/5 border border-border/20 rounded-xl p-5 md:p-6">
                  {sectionText}
                </div>
              ) : (
                <div className="p-8 text-center border border-dashed border-border rounded-xl text-muted-foreground text-sm">
                  {locale === "en"
                    ? "Content will be updated soon."
                    : "Conteúdo detalhado sendo catalogado pela comunidade."}
                </div>
              )}
            </div>
          );
        })}

        {activeTab === "links" && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-bold text-foreground">
                {locale === "en" ? "Official Government Portals" : "Canais Governamentais Oficiais"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {locale === "en"
                  ? "Access the direct public portals for official, secure forms and applications."
                  : "Acesse diretamente os portais de embaixadas, consulados e ministérios de imigração."}
              </p>
            </div>
            <OfficialLinksSection links={country.officialLinks} locale={locale} />
          </div>
        )}
      </div>
    </div>
  );
}
