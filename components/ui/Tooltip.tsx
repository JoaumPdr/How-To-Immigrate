"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface TooltipProps {
  /** Texto descritivo exibido dentro da dica (tooltip) */
  content: string;
  /** Elemento acionador */
  children: React.ReactNode;
  /** Classes adicionais para customizar o balão */
  className?: string;
}

/**
 * Componente de Tooltip simples e acessível (WCAG AA).
 * Exibe descrições flutuantes no foco de teclado e no hover de mouse.
 */
export function Tooltip({ content, children, className }: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const id = React.useId();

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <div
        className="inline-flex"
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        aria-describedby={id}
      >
        {children}
      </div>

      {isVisible && (
        <div
          id={id}
          role="tooltip"
          className={cn(
            "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-30 px-3 py-1.5 text-xs font-medium text-slate-100 bg-slate-900 border border-slate-800 rounded-md shadow-md animate-fade-in max-w-xs text-center break-words select-none whitespace-nowrap pointer-events-none",
            className
          )}
        >
          {content}
          {/* Tooltip Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  );
}
