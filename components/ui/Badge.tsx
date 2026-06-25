import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Variante visual do badge */
  variant?: "primary" | "secondary" | "outline" | "success" | "warning" | "destructive";
}

/**
 * Componente de Badge para rótulos, tags e scores visuais.
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold select-none border transition-colors";

    const variants = {
      primary: "bg-primary text-primary-foreground border-transparent hover:opacity-90",
      secondary: "bg-secondary text-secondary-foreground border-transparent hover:opacity-90",
      outline: "text-foreground border-border bg-background hover:bg-accent hover:text-accent-foreground",
      success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      destructive: "bg-destructive/10 text-destructive border-destructive/20",
    };

    // eslint-disable-next-line security/detect-object-injection
    return <span ref={ref} className={cn(baseStyles, variants[variant], className)} {...props} />;
  }
);

Badge.displayName = "Badge";
