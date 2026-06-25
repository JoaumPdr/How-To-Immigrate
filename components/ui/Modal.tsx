"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils/cn";
import { Button } from "./Button";

export interface ModalProps {
  /** Indica se o modal está aberto */
  isOpen: boolean;
  /** Função de callback chamada para fechar o modal */
  onClose: () => void;
  /** Título exibido no topo do modal */
  title?: string;
  /** Conteúdo do modal */
  children: React.ReactNode;
  /** Classes CSS adicionais para o container do modal */
  className?: string;
}

/**
 * Componente de Modal acessível (WCAG AA) com Portal, Focus Trap,
 * escuta da tecla ESC e bloqueio de rolagem do body.
 */
export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  const [mounted, setMounted] = React.useState(false);
  const modalRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Controlar o foco e o scroll do body
  React.useEffect(() => {
    if (!isOpen) return;

    // Bloquear scroll
    const originalStyle = window.document.body.style.overflow;
    window.document.body.style.overflow = "hidden";

    // Focar no container do modal
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex="0"]'
    );
    if (focusableElements && focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
    }

    // Escuta de teclado
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

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Overlay de fundo escurecido */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Conteúdo do Modal */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className={cn(
          "relative w-full max-w-lg rounded-xl border border-border bg-card text-card-foreground p-6 shadow-xl transition-all duration-300 z-10 focus:outline-hidden",
          className
        )}
      >
        {/* Topo do Modal */}
        <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
          <h2 id="modal-title" className="text-xl font-bold tracking-tight">
            {title}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Fechar diálogo"
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

        {/* Corpo do Modal */}
        <div className="text-sm text-foreground leading-relaxed">{children}</div>
      </div>
    </div>,
    document.body
  );
}
