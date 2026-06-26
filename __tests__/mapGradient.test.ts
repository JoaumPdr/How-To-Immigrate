import { describe, it, expect } from "vitest";
import { getMapColor } from "../lib/utils/MapColorGradient";

describe("Interpolação de Cores do Mapa (MapColorGradient)", () => {
  it("deve retornar a cor de fallback para valores nulos, indefinidos ou inválidos", () => {
    expect(getMapColor(null)).toBe("var(--color-border)");
    expect(getMapColor(undefined)).toBe("var(--color-border)");
    expect(getMapColor(NaN)).toBe("var(--color-border)");
  });

  it("deve retornar vermelho (hsl(0 84% 60%)) para score 0", () => {
    expect(getMapColor(0)).toBe("hsl(0 84% 60%)");
  });

  it("deve retornar laranja (hsl(38 92% 50%)) para score 50", () => {
    expect(getMapColor(50)).toBe("hsl(38 92% 50%)");
  });

  it("deve retornar verde esmeralda (hsl(142 70% 45%)) para score 100", () => {
    expect(getMapColor(100)).toBe("hsl(142 70% 45%)");
  });

  it("deve limitar (clamp) valores abaixo de 0 para score 0", () => {
    expect(getMapColor(-15)).toBe("hsl(0 84% 60%)");
  });

  it("deve limitar (clamp) valores acima de 100 para score 100", () => {
    expect(getMapColor(120)).toBe("hsl(142 70% 45%)");
  });

  it("deve retornar uma cor HSL válida para notas intermediárias", () => {
    // Score 25 está no meio entre 0 e 50.
    // hsl(19 88% 55%) aproximadamente
    const color25 = getMapColor(25);
    expect(color25).toMatch(/^hsl\(\d+\s+\d+%\s+\d+%\)$/);
    
    // Score 75 está no meio entre 50 e 100.
    // hsl(90 81% 48%) aproximadamente
    const color75 = getMapColor(75);
    expect(color75).toMatch(/^hsl\(\d+\s+\d+%\s+\d+%\)$/);
  });
});
