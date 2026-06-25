"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils/cn";
import { Button } from "./Button";

export interface SheetProps {
  /** Indica se o painel lateral está aberto */
  isOpen: boolean;
  /** Função de callback chamada para fechar o painel */
  onClose: () => void;
  /** Direção de onde o painel irá deslizar */
  side?: "left" | "right" | "bottom";
  /** Título exibido no topo do painel */
  title?: string;
  /** Conteúdo interno */
  children: React.ReactNode;
}

/**
 * Componente de Sheet (painel deslizante lateral/inferior) acessível (WCAG AA).
 * Ideal para menus mobile e formulários rápidos de configuração lateral.
 */
export function Sheet({ isOpen, onClose, side = "right", title, children }: SheetProps) {
  const [mounted, setMounted] = React.useState(false);
  const sheetRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Bloquear scroll e capturar foco
  React.useEffect(() => {
    if (!isOpen) return;

    const originalStyle = window.document.body.style.overflow;
    window.document.body.style.overflow = "hidden";

    const focusableElements = sheetRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex="0"]'
    );
    if (focusableElements && focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      if (e.key === "Tab" && focusableElements) {
        const first = focusableElements[0] as HTMLElement;
        const last = focusableElements[focusableElements.length - 1] as HTMLElement;
        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.document.body.style.overflow = originalStyle;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const sideStyles = {
    left: "top-0 left-0 h-full w-full max-w-xs border-r border-border slide-in-from-left",
    right: "top-0 right-0 h-full w-full max-w-xs border-l border-border slide-in-from-right",
    bottom: "bottom-0 left-0 w-full h-[60vh] max-h-[80vh] border-t border-border rounded-t-xl slide-in-from-bottom",
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sheet-title"
    >
      {/* Overlay de fundo */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Conteúdo do Sheet */}
      <div
        ref={sheetRef}
        tabIndex={-1}
        className={cn(
          "fixed bg-card text-card-foreground p-6 shadow-xl transition-all duration-300 z-10 flex flex-col focus:outline-hidden",
          // eslint-disable-next-line security/detect-object-injection
          sideStyles[side]
        )}
      >
        {/* Topo do Sheet */}
        <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
          <h2 id="sheet-title" className="text-lg font-bold tracking-tight">
            {title}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Fechar painel"
            className="h-8 w-8 min-h-0 min-w-0 p-0 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </Button>
        </div>

        {/* Corpo do Sheet */}
        <div className="flex-1 overflow-y-auto pr-1 text-sm leading-relaxed">{children}</div>
      </div>
    </div>,
    document.body
  );
}
