"use client";

import * as React from "react";
import { Button } from "./Button";

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** Fallback personalizado opcional */
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Componente ErrorBoundary clássico para interceptar erros em tempo de renderização
 * e exibir um feedback de recuperação elegante (WCAG AA).
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary capturou um erro:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/50 max-w-md mx-auto my-4">
          <div className="mb-4 text-red-500 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-red-800 dark:text-red-300 mb-2">
            Algo deu errado
          </h3>
          <p className="text-sm text-red-600 dark:text-red-400 mb-6 leading-normal">
            Não foi possível renderizar esta parte da página. Tente recarregar ou clicar no botão abaixo.
          </p>
          <Button variant="outline" size="sm" onClick={this.handleReset} className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950">
            Tentar Novamente
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
