"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils/cn";

/**
 * Seletor de idioma estilo "pill" justaposto (PT-BR e EN).
 * Mantém o usuário na mesma rota ao realizar a troca.
 */
export function LanguageSwitcher() {
  const currentLocale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const handleLocaleChange = (newLocale: "pt-BR" | "en") => {
    if (newLocale === currentLocale) return;
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div
      className="inline-flex p-1 bg-secondary rounded-full border border-border select-none"
      role="group"
      aria-label="Seletor de idioma"
    >
      <button
        onClick={() => handleLocaleChange("pt-BR")}
        aria-current={currentLocale === "pt-BR" ? "true" : undefined}
        className={cn(
          "px-3 py-1 text-xs font-bold rounded-full transition-all focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring cursor-pointer min-h-8",
          currentLocale === "pt-BR"
            ? "bg-card text-foreground shadow-xs"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        PT
      </button>
      <button
        onClick={() => handleLocaleChange("en")}
        aria-current={currentLocale === "en" ? "true" : undefined}
        className={cn(
          "px-3 py-1 text-xs font-bold rounded-full transition-all focus:outline-hidden focus-visible:ring-2 focus-visible:ring-ring cursor-pointer min-h-8",
          currentLocale === "en"
            ? "bg-card text-foreground shadow-xs"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        EN
      </button>
    </div>
  );
}
