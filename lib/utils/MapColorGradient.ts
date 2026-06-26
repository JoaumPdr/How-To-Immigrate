/**
 * Interpola uma cor HSL dinâmica entre Vermelho (score 0), Laranja/Amarelo (score 50) e Verde Esmeralda (score 100).
 * Retorna uma cor HSL em string compatível com SVG fill.
 * 
 * @param score Nota do país (0 a 100)
 * @returns Cor no formato HSL: 'hsl(H S% L%)'
 */
export function getMapColor(score: number | null | undefined): string {
  if (score === null || score === undefined || isNaN(score)) {
    // Cor neutra de fallback para países sem dados (cinza suave)
    return "var(--color-border)";
  }

  // Clampar valor entre 0 e 100
  const clScore = Math.max(0, Math.min(100, score));

  let h = 0;
  let s = 80;
  let l = 50;

  if (clScore < 50) {
    // Interpolação de 0 a 50 (Vermelho HSL(0, 84%, 60%) até Laranja HSL(38, 92%, 50%))
    const t = clScore / 50;
    h = Math.round(0 + t * 38);
    s = Math.round(84 + t * (92 - 84));
    l = Math.round(60 + t * (50 - 60));
  } else {
    // Interpolação de 50 a 100 (Laranja HSL(38, 92%, 50%) até Verde Esmeralda HSL(142, 70%, 45%))
    const t = (clScore - 50) / 50;
    h = Math.round(38 + t * (142 - 38));
    s = Math.round(92 + t * (70 - 92));
    l = Math.round(50 + t * (45 - 50));
  }

  return `hsl(${h} ${s}% ${l}%)`;
}
