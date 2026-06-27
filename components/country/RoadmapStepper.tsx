"use client";

import React, { useState } from "react";
import { CheckCircle2, Circle, ChevronDown, ChevronUp, FileText, ExternalLink, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { cn } from "../../lib/utils/cn";

interface Visa {
  id: string;
  name: string;
  type: string;
}

interface RoadmapStep {
  id: string;
  order: number;
  title: string;
  description: string;
  status: string;
  visaType: string | null;
  documents: string[];
  officialLink: string | null;
  visaId: string | null;
  visa: Visa | null;
}

interface RoadmapStepperProps {
  steps: RoadmapStep[];
  initialCompletedStepIds: string[];
  locale: string;
}

export function RoadmapStepper({ steps, initialCompletedStepIds, locale }: RoadmapStepperProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [completedSteps, setCompletedSteps] = useState<string[]>(initialCompletedStepIds);
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({
    [steps[0]?.id]: true // Expande o primeiro passo por padrão
  });

  const toggleExpand = (stepId: string) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  const handleCheckboxChange = async (stepId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Evita expandir/colapsar ao clicar no checkbox

    if (!session) {
      // Se não autenticado, redireciona para login
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    const isCompleted = completedSteps.includes(stepId);
    // Atualização otimista do estado local
    if (isCompleted) {
      setCompletedSteps((prev) => prev.filter((id) => id !== stepId));
    } else {
      setCompletedSteps((prev) => [...prev, stepId]);
    }

    try {
      const res = await fetch("/api/user/roadmap/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          stepId,
          completed: !isCompleted
        })
      });

      if (!res.ok) {
        throw new Error("Erro na resposta da API");
      }
    } catch (err) {
      console.error("Falha ao salvar progresso do roadmap:", err);
      // Reverte o estado em caso de falha de rede/servidor
      if (isCompleted) {
        setCompletedSteps((prev) => [...prev, stepId]);
      } else {
        setCompletedSteps((prev) => prev.filter((id) => id !== stepId));
      }
    }
  };

  const totalSteps = steps.length;
  const completedCount = steps.filter((s) => completedSteps.includes(s.id)).length;
  const progressPercentage = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Barra de Progresso do Usuário */}
      {session && (
        <div className="p-4 border border-border/50 rounded-xl bg-muted/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {locale === "en" ? "Your Roadmap Progress" : "Seu Progresso no Guia"}
            </span>
            <span className="font-mono text-sm font-bold text-primary">
              {progressPercentage}% ({completedCount}/{totalSteps})
            </span>
          </div>
          <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Lista Vertical de Passos */}
      <div className="relative pl-8 border-l border-border/80 ml-4 flex flex-col gap-6">
        {steps.map((step, idx) => {
          const isDone = completedSteps.includes(step.id);
          const isExpanded = !!expandedSteps[step.id];

          return (
            <div key={step.id} className="relative group">
              {/* Indicador Flutuante Lateral */}
              <div
                onClick={(e) => handleCheckboxChange(step.id, e)}
                className={cn(
                  "absolute -left-[45px] top-1.5 w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer transition-all duration-300",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  isDone
                    ? "bg-primary border-primary text-primary-foreground shadow-xs scale-105"
                    : "bg-background border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                )}
                title={session ? (isDone ? "Marcar como incompleto" : "Marcar como concluído") : "Faça login para salvar progresso"}
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 fill-primary-foreground stroke-primary" />
                ) : (
                  <Circle className="w-4 h-4 stroke-2" />
                )}
              </div>

              {/* Card do Passo */}
              <div
                className={cn(
                  "border rounded-xl transition-all duration-300 overflow-hidden cursor-pointer",
                  isExpanded
                    ? "bg-background border-border/80 shadow-xs"
                    : "bg-background/60 hover:bg-background border-border/40 hover:border-border"
                )}
                onClick={() => toggleExpand(step.id)}
              >
                {/* Cabeçalho do Passo */}
                <div className="p-4 flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[10px] font-bold text-primary uppercase tracking-wider">
                      {locale === "en" ? `Step ${idx + 1}` : `Passo ${idx + 1}`}
                    </span>
                    <h3 className={cn(
                      "text-sm font-bold tracking-tight transition-colors",
                      isDone ? "text-muted-foreground line-through decoration-muted-foreground/30" : "text-foreground"
                    )}>
                      {step.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {step.visa && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full">
                        <ShieldCheck className="w-3 h-3" />
                        {step.visa.name}
                      </span>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    )}
                  </div>
                </div>

                {/* Detalhes do Passo (Framer Motion) */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-4 pb-4 pt-2 border-t border-border/40 bg-muted/5 flex flex-col gap-4 text-xs md:text-sm">
                        <p className="text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>

                        {/* Documentos Necessários */}
                        {step.documents.length > 0 && (
                          <div className="flex flex-col gap-2 p-3 bg-muted/20 border border-border/30 rounded-lg">
                            <span className="font-bold flex items-center gap-1.5 text-foreground text-xs uppercase tracking-wider">
                              <FileText className="w-3.5 h-3.5 text-primary" />
                              {locale === "en" ? "Required Documents" : "Documentos Exigidos"}
                            </span>
                            <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-1.5 text-xs">
                              {step.documents.map((doc, docIdx) => (
                                <li key={docIdx}>{doc}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Botão de Link Governamental */}
                        {step.officialLink && (
                          <a
                            href={step.officialLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 font-semibold text-primary hover:text-primary-hover transition-colors text-xs self-start"
                            onClick={(e) => e.stopPropagation()} // Evita colapsar ao clicar no link
                          >
                            {locale === "en" ? "Official Guide Link" : "Acessar Canal Oficial"}
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
