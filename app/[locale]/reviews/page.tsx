import { setRequestLocale } from "next-intl/server";

export default async function ReviewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-[60vh] p-8 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight mb-4">
        {locale === "pt-BR" ? "Avaliações da Comunidade" : "Community Reviews"}
      </h1>
      <p className="text-muted-foreground max-w-md">
        {locale === "pt-BR"
          ? "Esta página exibirá os relatos da comunidade na Etapa 06."
          : "This page will display community reviews in Stage 06."}
      </p>
    </div>
  );
}
