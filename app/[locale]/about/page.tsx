import { setRequestLocale } from "next-intl/server";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-[60vh] p-8 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight mb-4">
        {locale === "pt-BR" ? "Sobre o HowToImmigrate" : "About HowToImmigrate"}
      </h1>
      <p className="text-muted-foreground max-w-md">
        {locale === "pt-BR"
          ? "Esta página trará mais informações institucionais sobre a plataforma na Etapa 08."
          : "This page will bring more institutional information about the platform in Stage 08."}
      </p>
    </div>
  );
}
