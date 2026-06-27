import { setRequestLocale } from "next-intl/server";
import { InteractiveMapSection } from "@/components/map/InteractiveMapSection";

export default async function MapPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex flex-col flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">
          {locale === "pt-BR" ? "Mapa Interativo" : "Interactive Map"}
        </h1>
        <p className="text-muted-foreground">
          {locale === "pt-BR"
            ? "Explore e filtre os países por score, custo de vida, segurança, idioma e muito mais."
            : "Explore and filter countries by score, cost of living, safety, language, and more."}
        </p>
      </div>

      <div className="w-full border border-border/60 rounded-2xl bg-card shadow-xs overflow-hidden">
        <InteractiveMapSection />
      </div>
    </div>
  );
}
