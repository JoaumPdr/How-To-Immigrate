import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface LoadingSpinnerProps extends React.SVGProps<SVGSVGElement> {
  /** Tamanho do spinner */
  size?: "sm" | "md" | "lg";
}

/**
 * Componente de Loading Spinner animado e acessível.
 */
export function LoadingSpinner({ className, size = "md", ...props }: LoadingSpinnerProps) {
  const sizes = {
    sm: "h-4 w-4 stroke-[3]",
    md: "h-8 w-8 stroke-[2]",
    lg: "h-12 w-12 stroke-[1.5]",
  };

  return (
    <div className="flex items-center justify-center p-2" role="status" aria-label="Carregando">
      <svg
        // eslint-disable-next-line security/detect-object-injection
        className={cn("animate-spin text-primary", sizes[size], className)}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        {...props}
      >
        <circle
          className="opacity-10/100"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75/100"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="sr-only">Carregando...</span>
    </div>
  );
}
