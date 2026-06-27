import { setRequestLocale } from "next-intl/server";
import { countryRepository } from "@/lib/repositories/countryRepository";
import { CountriesList } from "@/components/country/CountriesList";

export const revalidate = 3600; // Cache de 1 hora

export default async function CountriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Busca todos os países no banco de dados com seus indicadores
  const countries = await countryRepository.findAll();

  // Transforma os dados para o tipo aceito pelo componente CountriesList
  const formattedCountries = countries.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    nameEn: c.nameEn,
    codeISO2: c.codeISO2,
    codeISO3: c.codeISO3,
    region: c.region,
    capital: c.capital,
    currency: c.currency,
    languages: c.languages,
    flagUrl: c.flagUrl,
    overallScore: c.overallScore,
    indicators: c.indicators.map((ind) => ({
      category: ind.category,
      score: ind.score,
    })),
  }));

  return (
    <div className="flex flex-col flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">
          {locale === "pt-BR" ? "Países para Imigração" : "Immigration Countries"}
        </h1>
        <p className="text-muted-foreground">
          {locale === "pt-BR"
            ? "Compare os principais destinos com base no custo de vida, segurança, vistos e qualidade de vida."
            : "Compare key destinations based on cost of living, safety, visas, and quality of life."}
        </p>
      </div>

      <CountriesList initialCountries={formattedCountries} locale={locale} />
    </div>
  );
}
