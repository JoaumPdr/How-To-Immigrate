import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Habilitar a renderização estática para o locale atual
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const tCommon = await getTranslations("common");

  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen px-4 py-12 relative overflow-hidden bg-slate-950">
      {/* Background gradients for premium aesthetic */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

      <main className="flex flex-col items-center justify-center max-w-4xl text-center z-10">
        <span className="px-3 py-1 text-xs font-semibold uppercase tracking-widest text-indigo-400 border border-indigo-400/20 bg-indigo-950/30 rounded-full mb-6">
          🚀 Stage 00 — Foundation
        </span>
        
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 bg-gradient-to-r from-indigo-400 via-emerald-400 to-amber-400 bg-clip-text text-transparent">
          {t("title")}
        </h1>
        
        <p className="max-w-2xl text-lg sm:text-xl text-slate-400 leading-relaxed mb-10">
          {t("subtitle")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-md">
          <a
            href={`/${locale}/map`}
            className="flex items-center justify-center w-full sm:w-auto h-12 px-8 font-semibold rounded-full text-slate-950 bg-gradient-to-r from-indigo-400 to-emerald-400 hover:opacity-90 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)]"
          >
            {locale === "pt-BR" ? "Explorar Mapa" : "Explore Map"}
          </a>
          <a
            href="https://github.com/JoaumPdr/how-to-immigrate"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full sm:w-auto h-12 px-8 font-semibold rounded-full border border-slate-800 text-slate-300 hover:bg-slate-900/50 hover:border-slate-700 active:scale-[0.98] transition-all"
          >
            GitHub
          </a>
        </div>
      </main>

      <footer className="absolute bottom-8 text-center text-xs text-slate-600 z-10">
        © 2026 How To Immigrate. {tCommon("loading")}
      </footer>
    </div>
  );
}
