import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Globe, Plane, Shield, DollarSign, Briefcase } from "lucide-react";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Habilitar a renderização estática para o locale atual
  setRequestLocale(locale);

  const t = await getTranslations("home");

  // Dados mockados de países para renderizar no design system
  const featuredCountries = [
    {
      name: locale === "pt-BR" ? "Canadá" : "Canada",
      slug: "canada",
      continent: locale === "pt-BR" ? "América do Norte" : "North America",
      overallScore: 88,
      visaEase: "Alta / High",
      safety: 90,
      cost: "Alto / High",
      description: locale === "pt-BR" 
        ? "Excelente mercado de trabalho e qualidade de vida, com visto de estudo estruturado."
        : "Excellent job market and quality of life, with a structured study visa pathway.",
    },
    {
      name: "Portugal",
      slug: "portugal",
      continent: locale === "pt-BR" ? "Europa" : "Europe",
      overallScore: 84,
      visaEase: "Muito Alta / Very High",
      safety: 92,
      cost: "Baixo / Low",
      description: locale === "pt-BR"
        ? "Clima agradável, custo de vida acessível e facilidade de idioma para brasileiros."
        : "Pleasant climate, affordable cost of living, and easy integration for expats.",
    },
    {
      name: locale === "pt-BR" ? "Japão" : "Japan",
      slug: "japan",
      continent: locale === "pt-BR" ? "Ásia" : "Asia",
      overallScore: 81,
      visaEase: "Média / Medium",
      safety: 98,
      cost: "Médio / Medium",
      description: locale === "pt-BR"
        ? "Segurança inigualável, cultura milenar e visto de trabalho sob demanda."
        : "Unmatched safety, rich ancient culture, and work visas available under demand.",
    },
  ];

  return (
    <div className="flex flex-col flex-1 relative overflow-hidden bg-background">
      {/* Decorações de gradiente premium no fundo */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      {/* 1. Hero Section */}
      <section className="relative px-6 py-20 md:py-32 flex flex-col items-center justify-center text-center">
        <div className="mx-auto max-w-4xl flex flex-col items-center gap-6">
          <Badge variant="success" className="px-3 py-1 font-semibold uppercase tracking-wider mb-2">
            ✈️ {locale === "pt-BR" ? "Escolha seu destino" : "Choose your destination"}
          </Badge>
          
          <h1 className="text-4xl sm:text-7xl font-black tracking-tight leading-tight mb-4">
            {t("title")}{" "}
            <span className="bg-gradient-to-r from-primary via-indigo-500 to-emerald-500 bg-clip-text text-transparent">
              {locale === "pt-BR" ? "Sem Complicação" : "Made Simple"}
            </span>
          </h1>

          <p className="max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
            {t("subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-md mt-6">
            <Link href="/map" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full h-12 shadow-lg shadow-primary/20">
                {locale === "pt-BR" ? "Abrir Mapa Interativo" : "Open Interactive Map"}
              </Button>
            </Link>
            <Link href="/countries" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full h-12">
                {locale === "pt-BR" ? "Ver Países" : "View Countries"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Seção Informativa & Mapa Placeholder */}
      <section className="px-6 py-16 bg-slate-50 dark:bg-slate-900/20 border-y border-border">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Texto Descritivo */}
            <div className="flex flex-col gap-6 text-left">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {locale === "pt-BR" 
                  ? "Explore o Mundo através dos Critérios que Importam" 
                  : "Explore the World by Criteria That Matter"}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {locale === "pt-BR"
                  ? "Nossa plataforma consolida dados atualizados sobre os destinos mais buscados para imigração. Filtre e classifique países de acordo com suas preferências financeiras, profissionais e de estilo de vida."
                  : "Our platform aggregates up-to-date data on the most popular immigration destinations. Filter and rank countries based on your financial, career, and lifestyle preferences."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card">
                  <Shield className="h-5 w-5 text-emerald-500 mt-1 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm">{locale === "pt-BR" ? "Segurança" : "Safety"}</h4>
                    <p className="text-xs text-muted-foreground">{locale === "pt-BR" ? "Dados de criminalidade" : "Crime index statistics"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card">
                  <DollarSign className="h-5 w-5 text-amber-500 mt-1 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm">{locale === "pt-BR" ? "Custo de Vida" : "Cost of Living"}</h4>
                    <p className="text-xs text-muted-foreground">{locale === "pt-BR" ? "Cálculo de aluguel e gastos" : "Housing and spending estimates"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card">
                  <Briefcase className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm">{locale === "pt-BR" ? "Trabalho" : "Job Market"}</h4>
                    <p className="text-xs text-muted-foreground">{locale === "pt-BR" ? "Demandas de contratação" : "In-demand career options"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card">
                  <Plane className="h-5 w-5 text-indigo-500 mt-1 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm">{locale === "pt-BR" ? "Vistos facilitados" : "Visa Pathways"}</h4>
                    <p className="text-xs text-muted-foreground">{locale === "pt-BR" ? "Opções de vistos e residência" : "Student, digital nomad, and worker options"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mapa Estático / Ilustrativo */}
            <div className="relative rounded-2xl overflow-hidden border border-border bg-card shadow-2xl p-4 flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px]">
              {/* Overlay Glassmorphism */}
              <div className="absolute inset-0 bg-slate-950/5 dark:bg-slate-950/20 backdrop-blur-xs pointer-events-none" />
              
              <Globe className="h-24 w-24 text-primary animate-pulse mb-6" />
              <h3 className="text-xl font-bold tracking-tight mb-2">
                {locale === "pt-BR" ? "Mapa Interativo Visual" : "Interactive Visual Map"}
              </h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm mb-6 leading-relaxed">
                {locale === "pt-BR"
                  ? "Na Etapa 03, você poderá interagir diretamente com um mapa vetorial completo contendo todos os indicadores de imigração."
                  : "In Stage 03, you will be able to directly interact with a full vector map containing all immigration indicators."}
              </p>
              <Link href="/map">
                <Button variant="outline" className="gap-2">
                  <Plane className="h-4 w-4" />
                  {locale === "pt-BR" ? "Conhecer o Mapa" : "Explore Map"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Países em Destaque */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight mb-12">
            {locale === "pt-BR" ? "Destinos em Destaque" : "Featured Destinations"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCountries.map((country) => (
              <Card key={country.slug} isHoverable className="text-left flex flex-col h-full">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{country.continent}</Badge>
                    <Badge variant="success" className="px-2 py-0.5">
                      Score {country.overallScore}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl">{country.name}</CardTitle>
                  <CardDescription>{country.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-2 mt-2">
                    <div className="flex justify-between text-sm py-1 border-b border-border">
                      <span className="text-muted-foreground">{locale === "pt-BR" ? "Facilidade de Visto" : "Visa Ease"}</span>
                      <span className="font-semibold">{country.visaEase}</span>
                    </div>
                    <div className="flex justify-between text-sm py-1 border-b border-border">
                      <span className="text-muted-foreground">{locale === "pt-BR" ? "Segurança" : "Safety"}</span>
                      <span className="font-semibold">{country.safety}/100</span>
                    </div>
                    <div className="flex justify-between text-sm py-1">
                      <span className="text-muted-foreground">{locale === "pt-BR" ? "Custo de Vida" : "Cost of Living"}</span>
                      <span className="font-semibold">{country.cost}</span>
                    </div>
                  </div>
                </CardContent>
                <div className="p-6 pt-0 border-t border-border mt-auto">
                  <Link href={`/countries/${country.slug}`} className="w-full block">
                    <Button variant="ghost" size="sm" className="w-full mt-4 justify-between group">
                      <span>{locale === "pt-BR" ? "Ver detalhes" : "View details"}</span>
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
