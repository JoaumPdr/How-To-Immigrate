import React from "react";
import { ExternalLink, Globe, Landmark, MapPin, LucideIcon } from "lucide-react";

interface OfficialLink {
  id: string;
  title: string;
  url: string;
  type: string;
  language: string;
}

interface OfficialLinksSectionProps {
  links: OfficialLink[];
  locale: string;
}

const TYPE_CONFIGS: Record<string, { label: { pt: string; en: string }; icon: LucideIcon; color: string }> = {
  immigration: {
    label: { pt: "Imigração Geral", en: "General Immigration" },
    icon: Globe,
    color: "text-blue-500 bg-blue-500/10 border-blue-500/20"
  },
  embassy: {
    label: { pt: "Embaixada Oficial", en: "Official Embassy" },
    icon: Landmark,
    color: "text-purple-500 bg-purple-500/10 border-purple-500/20"
  },
  consulate: {
    label: { pt: "Consulado Geral", en: "Consulate General" },
    icon: MapPin,
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
  }
};

export function OfficialLinksSection({ links, locale }: OfficialLinksSectionProps) {
  if (links.length === 0) {
    return (
      <div className="p-6 text-center border border-dashed border-border rounded-xl text-muted-foreground text-sm">
        {locale === "en" ? "No official links registered." : "Nenhum canal governamental oficial cadastrado."}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {links.map((link) => {
        const config = TYPE_CONFIGS[link.type] || {
          label: { pt: link.type, en: link.type },
          icon: ExternalLink,
          color: "text-muted-foreground bg-muted border-border/40"
        };
        const Icon = config.icon;
        const typeLabel = locale === "en" ? config.label.en : config.label.pt;

        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-4 p-4 border border-border/40 bg-background hover:bg-muted/10 rounded-xl hover:border-border transition-all duration-300 group hover:shadow-2xs"
          >
            {/* Ícone Indicador de Categoria */}
            <div className={`p-2.5 rounded-lg border ${config.color} shrink-0`}>
              <Icon className="w-5 h-5" />
            </div>

            {/* Texto do Link */}
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider">
                {typeLabel} ({link.language.toUpperCase()})
              </span>
              <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-tight truncate">
                {link.title}
              </h4>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                {locale === "en" ? "Visit website" : "Visitar portal"}
                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </div>
          </a>
        );
      })}
    </div>
  );
}
