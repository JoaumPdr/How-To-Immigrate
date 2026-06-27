import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { countryRepository } from "../../../../lib/repositories/countryRepository";
import { auth } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { CountryHero } from "../../../../components/country/CountryHero";
import { CountryTabs } from "../../../../components/country/CountryTabs";

interface CountryPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

// Slugs oficiais dos 20 países seed
const SEED_SLUGS = [
  "canada", "portugal", "germany", "ireland", "netherlands",
  "australia", "new-zealand", "spain", "united-states", "united-kingdom",
  "france", "belgium", "switzerland", "norway", "sweden",
  "finland", "denmark", "japan", "south-korea", "united-arab-emirates"
];

/**
 * Geração Estática de Parâmetros (SSG) para os 20 países do seed.
 * Isso garante que essas páginas sejam compiladas de forma estática no build do Next.js.
 */
export async function generateStaticParams() {
  const locales = ["pt-BR", "en"];
  const params: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    for (const slug of SEED_SLUGS) {
      params.push({ locale, slug });
    }
  }

  return params;
}

/**
 * Geração dinâmica de tags de SEO e OpenGraph para indexação
 */
export async function generateMetadata({ params }: CountryPageProps) {
  const { slug, locale } = await params;

  // Sanitização estrita do slug contra path traversal
  if (!slug || !/^[a-z0-9\-]+$/i.test(slug)) {
    return { title: "País Não Encontrado" };
  }

  const country = await countryRepository.findBySlug(slug);
  if (!country) return { title: "País Não Encontrado" };

  const countryName = locale === "en" ? country.nameEn : country.name;

  return {
    title: `${countryName} - Planejamento e Guia de Imigração | How To Immigrate`,
    description: locale === "en"
      ? `Complete step-by-step guide to immigrate to ${countryName}. Discover required visas, official links, cost of living, and safety metrics.`
      : `Guia passo a passo completo para imigrar para o ${countryName}. Descubra os vistos exigidos, canais oficiais, custo de vida e segurança.`,
    openGraph: {
      title: `${countryName} - Guia de Imigração`,
      description: `Estatísticas detalhadas e roadmap de visto para o ${countryName}.`,
      images: [
        {
          url: country.flagUrl,
          alt: `Flag of ${countryName}`
        }
      ]
    }
  };
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { locale, slug } = await params;

  // Sanitização estrita contra path traversal
  if (!slug || !/^[a-z0-9\-]+$/i.test(slug)) {
    notFound();
  }

  // Busca todos os dados em uma única query otimizada
  const country = await countryRepository.findDetailBySlug(slug);

  if (!country) {
    notFound();
  }

  const session = await auth();
  let initialCompletedStepIds: string[] = [];

  // Se o usuário estiver logado, busca o progresso dos passos do roadmap no banco
  if (session?.user?.id) {
    const userProgress = await prisma.userRoadmapProgress.findMany({
      where: {
        userId: session.user.id,
        completed: true
      },
      select: {
        stepId: true
      }
    });
    initialCompletedStepIds = userProgress.map((p) => p.stepId);
  }

  const isSeedCountry = SEED_SLUGS.includes(slug);
  const countryName = locale === "en" ? country.nameEn : country.name;

  // Injeção de Structured Data (JSON-LD) para otimizar SEO público
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": countryName,
    "description": locale === "en"
      ? `Immigration guide and visa details for ${countryName}`
      : `Guia de imigração e detalhes de vistos para ${countryName}`,
    "image": country.flagUrl,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": country.codeISO2
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Script JSON-LD injetado no corpo para indexação SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Botão de Retorno */}
      <div className="mb-6">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform" />
          {locale === "en" ? "Back to map" : "Voltar para o mapa"}
        </Link>
      </div>

      {/* Banner de Fallback Elegante para Países Não-Seed */}
      {!isSeedCountry && (
        <div className="flex gap-3 p-4 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl text-xs md:text-sm mb-6 animate-fade-in">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">{locale === "en" ? "Roadmap In Development" : "Guia em Desenvolvimento"}:</span>{" "}
            {locale === "en"
              ? `Currently, only basic immigration metrics are available for ${countryName}. Our community is working to map out official step-by-step guides, visas, and housing details for this country.`
              : `Atualmente, apenas as métricas básicas de imigração estão disponíveis para o ${countryName}. Nossa comunidade está trabalhando para mapear guias governamentais passo a passo, vistos e moradia.`}
          </div>
        </div>
      )}

      {/* Hero do País */}
      <CountryHero country={country} locale={locale} />

      {/* Abas e Conteúdos */}
      <CountryTabs
        country={{
          ...country,
          visas: country.visas || [],
          officialLinks: country.officialLinks || [],
          roadmaps: country.roadmaps || []
        }}
        initialCompletedStepIds={initialCompletedStepIds}
        locale={locale}
      />
    </main>
  );
}
