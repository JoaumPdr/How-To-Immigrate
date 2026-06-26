import React, { useState } from "react";
import { Info, X } from "lucide-react";
import { Button } from "../ui/Button";

export interface MapLegendProps {
  className?: string;
}

/**
 * Componente que exibe a legenda explicativa sobre o gradiente de cores dos países no mapa.
 * Apresenta uma versão compacta no mobile e expandida no desktop.
 */
export function MapLegend({ className = "" }: MapLegendProps) {
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  return (
    <div className={`z-10 ${className}`}>
      {/* Versão Desktop (sempre visível a partir de md) */}
      <div className="hidden md:flex flex-col gap-2 p-4 bg-background/95 backdrop-blur border border-border rounded-lg shadow-sm w-64">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Legenda de Score
        </h4>
        <div className="h-3 w-full rounded-full bg-gradient-to-right from-red-500 via-amber-500 to-emerald-500 bg-gradient-to-r" />
        <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
          <span>0 (Difícil)</span>
          <span>50</span>
          <span>100 (Excelente)</span>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">
          Cores baseadas na média ponderada de segurança, custos, mercado de trabalho, vistos e saúde.
        </p>
      </div>

      {/* Versão Mobile (Botão expandível flutuante para telas menores) */}
      <div className="md:hidden flex items-end justify-end">
        {!isOpenMobile ? (
          <Button
            variant="secondary"
            size="sm"
            className="flex items-center gap-1.5 shadow-md h-9 rounded-full px-3 text-xs"
            onClick={() => setIsOpenMobile(true)}
            id="btn-open-legend-mobile"
          >
            <Info className="w-4 h-4" />
            Legenda
          </Button>
        ) : (
          <div className="flex flex-col gap-2 p-3 bg-background/95 backdrop-blur border border-border rounded-lg shadow-md w-56 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex justify-between items-center">
              <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Legenda de Score
              </h4>
              <button
                onClick={() => setIsOpenMobile(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
                id="btn-close-legend-mobile"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="h-2 w-full rounded-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500" />
            <div className="flex justify-between text-[9px] font-mono text-muted-foreground">
              <span>0 (Difícil)</span>
              <span>50</span>
              <span>100 (Fácil)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
