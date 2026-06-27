import React from "react";
import { FileText, ShieldAlert, Award, Landmark, ExternalLink } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";

interface Visa {
  id: string;
  name: string;
  type: string;
  description: string;
  requirements: string[];
  documents: string[];
  financialRequirement: string | null;
  officialLink: string | null;
}

interface VisaCardProps {
  visa: Visa;
  locale: string;
}

const TYPE_TRANSLATIONS: Record<string, { pt: string; en: string }> = {
  work: { pt: "Trabalho", en: "Work" },
  study: { pt: "Estudo", en: "Study" },
  investment: { pt: "Investimento", en: "Investment" },
  retirement: { pt: "Aposentadoria / Renda", en: "Retirement / Passive Income" }
};

export function VisaCard({ visa, locale }: VisaCardProps) {
  const typeText = TYPE_TRANSLATIONS[visa.type] || { pt: visa.type, en: visa.type };
  const typeLabel = locale === "en" ? typeText.en : typeText.pt;

  return (
    <Card className="flex flex-col h-full bg-background border border-border/40 hover:border-border/80 transition-all duration-300 shadow-2xs hover:shadow-xs group">
      <CardHeader className="flex flex-col gap-2.5 pb-3">
        <div className="flex justify-between items-start gap-3">
          <Badge className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 font-bold uppercase tracking-wider text-[10px]">
            {typeLabel}
          </Badge>
        </div>
        <CardTitle className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
          {visa.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 text-xs md:text-sm flex-1 pt-0">
        <p className="text-muted-foreground leading-relaxed text-xs">
          {visa.description}
        </p>

        {/* Requisitos de Elegibilidade */}
        {visa.requirements.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="font-bold text-foreground text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-primary" />
              {locale === "en" ? "Eligibility Requirements" : "Requisitos de Elegibilidade"}
            </span>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground text-xs pl-0.5 leading-relaxed">
              {visa.requirements.map((req, idx) => (
                <li key={idx} className="marker:text-primary/70">{req}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Documentos */}
        {visa.documents.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="font-bold text-foreground text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-primary" />
              {locale === "en" ? "Required Documents" : "Documentos Básicos"}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {visa.documents.map((doc, idx) => (
                <Badge key={idx} variant="outline" className="text-[10px] bg-muted/30 font-medium px-2 py-0.5 border-border/40">
                  {doc}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Requisito Financeiro */}
        {visa.financialRequirement && (
          <div className="flex gap-2 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-emerald-600 dark:text-emerald-400 mt-auto">
            <Landmark className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5">
              <span className="font-bold uppercase tracking-wider text-[10px]">
                {locale === "en" ? "Financial Solvency" : "Solvência Financeira"}
              </span>
              <span className="text-xs leading-relaxed text-muted-foreground font-medium">
                {visa.financialRequirement}
              </span>
            </div>
          </div>
        )}

        {/* Link Oficial */}
        {visa.officialLink && (
          <div className="pt-2 border-t border-border/40 mt-2">
            <a
              href={visa.officialLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-primary hover:text-primary-hover transition-colors text-xs"
            >
              {locale === "en" ? "Access Government Portal" : "Acessar Portal do Governo"}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
