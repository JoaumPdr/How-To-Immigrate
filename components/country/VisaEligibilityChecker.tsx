"use client";

import React, { useState } from "react";
import { ArrowLeft, ArrowRight, HelpCircle, CheckCircle, ShieldCheck, RefreshCw } from "lucide-react";
import { Button } from "../ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { cn } from "../../lib/utils/cn";
import { recommendVisa } from "../../lib/utils/visaRecommender";

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

interface VisaEligibilityCheckerProps {
  visas: Visa[];
  countryName: string;
  locale: string;
}

export function VisaEligibilityChecker({ visas, countryName, locale }: VisaEligibilityCheckerProps) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    age: "",
    profession: "",
    language: "",
    budget: ""
  });
  const [recommendation, setRecommendation] = useState<Visa | null>(null);

  const stepsList = [
    { id: 1, title: locale === "en" ? "Age Group" : "Faixa Etária" },
    { id: 2, title: locale === "en" ? "Profession" : "Profissão" },
    { id: 3, title: locale === "en" ? "Language Skills" : "Proficiência de Idioma" },
    { id: 4, title: locale === "en" ? "Financial Budget" : "Orçamento Disponível" }
  ];

  const handleSelect = (field: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (step < 4) {
      setStep((prev) => prev + 1);
    } else {
      calculateRecommendation();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setAnswers({
      age: "",
      profession: "",
      language: "",
      budget: ""
    });
    setRecommendation(null);
    setStep(1);
  };

  const calculateRecommendation = () => {
    const recommended = recommendVisa(visas, answers);
    setRecommendation(recommended);
    setStep(5);
  };

  const isNextDisabled = () => {
    if (step === 1 && !answers.age) return true;
    if (step === 2 && !answers.profession) return true;
    if (step === 3 && !answers.language) return true;
    if (step === 4 && !answers.budget) return true;
    return false;
  };

  return (
    <Card className="border border-border/40 bg-background overflow-hidden flex flex-col min-h-[380px]">
      {/* Progresso superior */}
      {step <= 4 && (
        <div className="bg-muted/30 border-b border-border/40 px-4 py-2 flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          <span>
            {locale === "en" ? `Step ${step} of 4` : `Etapa ${step} de 4`}: {stepsList[step - 1].title}
          </span>
          <div className="flex gap-1">
            {stepsList.map((s) => (
              <div
                key={s.id}
                className={cn(
                  "w-4 h-1.5 rounded-full transition-colors",
                  s.id === step
                    ? "bg-primary"
                    : s.id < step
                    ? "bg-primary/45"
                    : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>
      )}

      {/* Conteúdo das etapas */}
      <CardContent className="p-6 flex-1 flex flex-col justify-center">
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-sm md:text-base font-bold text-foreground mb-2">
              {locale === "en" ? "What is your age group?" : "Qual é a sua faixa etária?"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: "18-35", label: "18 a 35 anos" },
                { key: "36-45", label: "36 a 45 anos" },
                { key: "46+", label: "46 anos ou mais" }
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => handleSelect("age", opt.key)}
                  className={cn(
                    "p-3 rounded-lg border text-left text-xs font-semibold transition-all duration-300",
                    answers.age === opt.key
                      ? "border-primary bg-primary/5 text-primary shadow-2xs"
                      : "border-border/60 bg-background/50 hover:bg-muted/30 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-sm md:text-base font-bold text-foreground mb-2">
              {locale === "en" ? "What is your main area of profession?" : "Qual é a sua principal área de profissão?"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: "tech", label: "Tecnologia / TI / Engenharia" },
                { key: "healthcare", label: "Saúde / Medicina / Biológicas" },
                { key: "business", label: "Administração / Finanças / Negócios" },
                { key: "other", label: "Outras Áreas / Sem Qualificação Superior" }
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => handleSelect("profession", opt.key)}
                  className={cn(
                    "p-3 rounded-lg border text-left text-xs font-semibold transition-all duration-300",
                    answers.profession === opt.key
                      ? "border-primary bg-primary/5 text-primary shadow-2xs"
                      : "border-border/60 bg-background/50 hover:bg-muted/30 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-sm md:text-base font-bold text-foreground mb-2">
              {locale === "en" ? "How are your English or local language skills?" : "Como é sua proficiência em inglês ou no idioma local?"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: "fluent", label: "Fluente / Avançado (Ex: IELTS 7+ / C1)" },
                { key: "intermediate", label: "Intermediário / Independente (Ex: B1/B2)" },
                { key: "basic", label: "Básico (Ex: Comunicação essencial)" },
                { key: "none", label: "Nenhuma proficiência comprovada" }
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => handleSelect("language", opt.key)}
                  className={cn(
                    "p-3 rounded-lg border text-left text-xs font-semibold transition-all duration-300",
                    answers.language === opt.key
                      ? "border-primary bg-primary/5 text-primary shadow-2xs"
                      : "border-border/60 bg-background/50 hover:bg-muted/30 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-sm md:text-base font-bold text-foreground mb-2">
              {locale === "en" ? "What is your available immigration budget?" : "Qual é o seu orçamento disponível para imigração?"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { key: "low", label: "Baixo (Até €5.000)", desc: "Apenas taxas e passagem" },
                { key: "medium", label: "Médio (€5.000 - €15.000)", desc: "Fundos de reserva padrão" },
                { key: "high", label: "Alto (Mais de €15.000)", desc: "Suporte e investimentos" }
              ].map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => handleSelect("budget", opt.key)}
                  className={cn(
                    "p-3 rounded-lg border text-left flex flex-col gap-1 transition-all duration-300",
                    answers.budget === opt.key
                      ? "border-primary bg-primary/5 text-primary shadow-2xs"
                      : "border-border/60 bg-background/50 hover:bg-muted/30 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="text-xs font-bold text-foreground">{opt.label}</span>
                  <span className="text-[10px] text-muted-foreground">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Resultado Final */}
        {step === 5 && (
          <div className="flex flex-col items-center text-center gap-4 py-4 animate-fade-in">
            <div className="p-3 bg-primary/10 text-primary border border-primary/20 rounded-full">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <div className="flex flex-col gap-1 max-w-md">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                {locale === "en" ? "Elegibility Recommendation" : "Visto Recomendado"}
              </span>
              {recommendation ? (
                <>
                  <h3 className="text-lg font-black text-foreground">
                    {recommendation.name}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                    Com base no seu perfil (idade, profissão de {answers.profession === "tech" ? "Tecnologia" : answers.profession === "healthcare" ? "Saúde" : answers.profession === "business" ? "Negócios" : "Outros"}, e suporte financeiro {answers.budget === "high" ? "Alto" : answers.budget === "medium" ? "Médio" : "Baixo"}), identificamos que o visto <strong className="text-primary font-semibold">{recommendation.name}</strong> é a opção com maior probabilidade de elegibilidade para você no {countryName}.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-black text-foreground">
                    {locale === "en" ? "No Specific Visa Found" : "Nenhum visto específico recomendado"}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                    Não encontramos um visto cadastrado que se encaixe perfeitamente no seu perfil no momento. Recomendamos aprimorar seu nível de idioma e acumular fundos financeiros para expandir suas opções de visto para o {countryName}.
                  </p>
                </>
              )}
            </div>

            {/* Ações de Resultado */}
            <div className="flex gap-3 mt-4">
              <Button
                variant="outline"
                onClick={handleReset}
                className="gap-1.5 text-xs font-semibold"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {locale === "en" ? "Retake Quiz" : "Refazer Teste"}
              </Button>
              {recommendation?.officialLink && (
                <a
                  href={recommendation.officialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 bg-primary hover:bg-primary/95 text-primary-foreground font-bold px-4 py-2 rounded-lg text-xs transition-colors shadow-2xs"
                >
                  {locale === "en" ? "Official Guidelines" : "Ver Guia Oficial"}
                </a>
              )}
            </div>
          </div>
        )}
      </CardContent>

      {/* Rodapé Fixo / Sticky em Mobile */}
      {step <= 4 && (
        <div className="border-t border-border/40 p-4 bg-muted/10 flex justify-between gap-4 sticky bottom-0 left-0 right-0 z-20 backdrop-blur-md">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 1}
            className="gap-1 text-xs font-semibold disabled:opacity-30"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {locale === "en" ? "Back" : "Voltar"}
          </Button>
          <Button
            onClick={handleNext}
            disabled={isNextDisabled()}
            className="gap-1 text-xs font-bold bg-primary hover:bg-primary/95 text-primary-foreground shadow-2xs disabled:opacity-40"
          >
            {step === 4 ? (locale === "en" ? "See Result" : "Ver Resultado") : (locale === "en" ? "Next" : "Continuar")}
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}
    </Card>
  );
}
