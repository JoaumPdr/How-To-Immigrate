import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { Button } from "./Button";

export interface EmptyStateProps {
  /** Título do estado vazio */
  title: string;
  /** Mensagem complementar */
  description: string;
  /** Ícone opcional no topo */
  icon?: React.ReactNode;
  /** Rótulo do botão de ação opcional */
  actionLabel?: string;
  /** Função disparada ao clicar no botão de ação */
  onAction?: () => void;
  className?: string;
}

/**
 * Componente de Empty State para fallback em listas ou pesquisas vazias.
 */
export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center rounded-lg border border-dashed border-border bg-card text-card-foreground shadow-xs max-w-md mx-auto",
        className
      )}
    >
      {icon ? (
        <div className="mb-4 text-muted-foreground flex items-center justify-center">{icon}</div>
      ) : (
        <div className="mb-4 text-muted-foreground flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        </div>
      )}
      <h3 className="text-lg font-bold tracking-tight mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs leading-normal">{description}</p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
