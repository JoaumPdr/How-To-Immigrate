"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAppStore } from "@/lib/store/useAppStore";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import Link from "next/link";

interface CountryRecommended {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  codeISO2: string;
  flagUrl: string;
  overallScore: number;
  region: string;
}

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const { user, favorites, fetchProfileAndFavorites } = useAppStore();
  const [recommended, setRecommended] = useState<CountryRecommended[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initDashboard() {
      setIsLoading(true);
      await fetchProfileAndFavorites();

      // Checar onboarding imediatamente para evitar espera por fetch de países
      const currentUser = useAppStore.getState().user;
      const hasCompleted = currentUser?.profile && currentUser.profile.onboardingStep >= 5;
      
      if (!hasCompleted) {
        router.push("/onboarding");
        return;
      }
      
      try {
        // Carregar países para simular recomendações de maior score
        const countriesRes = await fetch("/api/countries");
        if (countriesRes.ok) {
          const data = await countriesRes.json();
          // Pega os 3 países de maior overallScore que não estejam necessariamente nos favoritos
          const sorted = data
            .sort((a: CountryRecommended, b: CountryRecommended) => b.overallScore - a.overallScore)
            .slice(0, 3);
          setRecommended(sorted);
        }
      } catch (error) {
        console.error("Erro ao carregar recomendações:", error);
      } finally {
        setIsLoading(false);
      }
    }
    initDashboard();
  }, [fetchProfileAndFavorites, router]);

  // Verifica se o usuário concluiu o onboarding
  const hasCompletedOnboarding = user?.profile && user.profile.onboardingStep >= 5;

  if (isLoading || (!hasCompletedOnboarding && !isLoading)) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Cabeçalho de Boas-vindas */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
            {t("welcome", { name: user?.name || user?.email || "Viajante" })}
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            Acompanhe suas preferências e planeje suas próximas etapas de imigração.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/profile">
            <Button variant="outline" className="w-full sm:w-auto">
              Ver Perfil
            </Button>
          </Link>
          <Link href="/map">
            <Button className="w-full sm:w-auto">
              {t("exploreMap")}
            </Button>
          </Link>
        </div>
      </div>

      {/* Caso o usuário não tenha completado o Onboarding */}
      {!hasCompletedOnboarding ? (
        <Card className="border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/10">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-lg font-bold text-amber-900 dark:text-amber-200">Onboarding incompleto</h3>
              <p className="text-sm text-amber-700 dark:text-amber-400">
                {t("profileNotDone")}
              </p>
            </div>
            <Link href="/onboarding" className="inline-block">
              <Button className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-500 text-white border-0">
                {t("startOnboarding")}
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seção de Recomendações e Roadmaps - Ocupa 2 colunas em desktop */}
          <div className="lg:col-span-2 space-y-8">
            {/* Países Recomendados */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
                  {t("recommendedCountries")}
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {t("recommendedCountriesDesc")}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommended.map((country) => (
                  <Link key={country.id} href={`/countries/${country.slug}`}>
                    <Card className="hover:shadow-md transition-all border border-neutral-200 dark:border-neutral-800 cursor-pointer h-full flex flex-col justify-between hover:border-primary-500 dark:hover:border-primary-500">
                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-center justify-between gap-2">
                          <img
                            src={country.flagUrl || `https://flagcdn.com/w40/${country.codeISO2.toLowerCase()}.png`}
                            alt={`Bandeira de ${country.name}`}
                            className="w-7 h-5 object-cover rounded-xs border border-neutral-100 dark:border-neutral-900"
                          />
                          <Badge variant={country.overallScore >= 75 ? "primary" : "secondary"}>
                            Score: {country.overallScore.toFixed(1)}
                          </Badge>
                        </div>
                        <CardTitle className="text-base font-bold text-neutral-900 dark:text-neutral-50 mt-2 truncate">
                          {country.name}
                        </CardTitle>
                        <CardDescription className="text-xs truncate">{country.region}</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Progresso do Roadmap */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
                  {t("roadmapProgress")}
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Acompanhe o andamento dos seus planos de imigração salvos.
                </p>
              </div>

              <EmptyState
                title="Sem roadmaps ativos"
                description={t("noRoadmaps")}
                actionLabel={t("exploreMap")}
                onAction={() => router.push("/map")}
              />
            </div>
          </div>

          {/* Seção Lateral - Seus Favoritos (1 coluna em desktop) */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
                {t("myFavorites")}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {t("myFavoritesDesc")}
              </p>
            </div>

            {favorites.length === 0 ? (
              <Card className="border border-dashed border-neutral-300 dark:border-neutral-800">
                <CardContent className="py-8 text-center space-y-3">
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {t("noFavorites")}
                  </p>
                  <Link href="/map">
                    <Button size="sm" variant="outline">
                      {t("exploreMap")}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {favorites.map((country) => (
                  <Link key={country.id} href={`/countries/${country.slug}`} className="block">
                    <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-xs transition-all">
                      <div className="flex items-center gap-3">
                        <img
                          src={country.flagUrl || `https://flagcdn.com/w40/${country.codeISO2.toLowerCase()}.png`}
                          alt={`Bandeira de ${country.name}`}
                          className="w-6 h-4 object-cover rounded-xs border border-neutral-100 dark:border-neutral-900"
                        />
                        <span className="text-sm font-bold text-neutral-900 dark:text-neutral-50 truncate max-w-[150px]">
                          {country.name}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Score: {country.overallScore.toFixed(1)}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
