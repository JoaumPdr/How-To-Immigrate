import { setRequestLocale } from "next-intl/server";

export default async function CountriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-[60vh] p-8 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight mb-4">
        {locale === "pt-BR" ? "Países para Imigração" : "Immigration Countries"}
      </h1>
      <p className="text-muted-foreground max-w-md">
        {locale === "pt-BR"
          ? "Esta página listará e comparará os países na Etapa 05."
          : "This page will list and compare countries in Stage 05."}
      </p>
    </div>
  );
}
