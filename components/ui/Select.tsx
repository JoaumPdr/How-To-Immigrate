import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Se true, exibe contorno de erro visual */
  hasError?: boolean;
}

/**
 * Componente de Seleção Dropdown (Select) baseado no elemento nativo.
 * Altamente acessível (WCAG AA), com foco e navegação de teclado nativos.
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, hasError = false, disabled, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          disabled={disabled}
          aria-invalid={hasError}
          className={cn(
            "flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer min-h-[44px]",
            hasError && "border-destructive focus-visible:ring-destructive",
            className
          )}
          {...props}
        >
          {children}
        </select>
        {/* Custom Chevron Icon */}
        <div className="absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>
    );
  }
);

Select.displayName = "Select";
