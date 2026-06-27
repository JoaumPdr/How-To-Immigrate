import { test, expect } from "@playwright/test";

test.describe("Páginas Gerais de Mapa e Países (Correção de Placeholders)", () => {
  test("deve renderizar a página de mapa dedicada com a InteractiveMapSection e sem placeholders antigos", async ({ page }) => {
    await page.goto("/pt-BR/map");

    // Valida o título e o texto de descrição reais
    await expect(page.locator("h1")).toContainText("Mapa Interativo");
    await expect(page.locator("text=Explore e filtre os países")).toBeVisible();

    // Garante que o placeholder antigo sumiu
    await expect(page.locator("text=Esta página abrigará")).not.toBeVisible();

    // Valida que o mapa em si (objeto ou SVG) é renderizado
    await expect(page.locator(".rsm-svg")).toBeVisible();
  });

  test("deve renderizar a página de lista de países com filtros e comparação e sem placeholders antigos", async ({ page }) => {
    await page.goto("/pt-BR/countries");

    // Valida título real e descrição
    await expect(page.locator("h1")).toContainText("Países para Imigração");
    await expect(page.locator("text=Compare os principais destinos")).toBeVisible();

    // Garante que o placeholder antigo sumiu
    await expect(page.locator("text=Esta página listará e comparará")).not.toBeVisible();

    // Valida a presença de busca e filtros de controle
    await expect(page.locator("input[placeholder*='Buscar país']")).toBeVisible();

    // Valida que pelo menos o Canadá (do seed) é listado na grade inicial
    await expect(page.locator("h3:has-text('Canadá')")).toBeVisible();

    // Testar busca reativa por 'Alemanha'
    await page.fill("input[placeholder*='Buscar país']", "Alemanha");
    // Canadá deve sumir e Alemanha deve aparecer
    await expect(page.locator("h3:has-text('Canadá')")).not.toBeVisible();
    await expect(page.locator("h3:has-text('Alemanha')")).toBeVisible();
  });
});
