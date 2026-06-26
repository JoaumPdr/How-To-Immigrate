import { setRequestLocale } from "next-intl/server";

export default async function MapPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-[60vh] p-8 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight mb-4">
        {locale === "pt-BR" ? "Mapa Interativo" : "Interactive Map"}
      </h1>
      <p className="text-muted-foreground max-w-md">
        {locale === "pt-BR"
          ? "Esta página abrigará o mapa-múndi interativo na Etapa 03."
          : "This page will house the interactive world map in Stage 03."}
      </p>
    </div>
  );
}
