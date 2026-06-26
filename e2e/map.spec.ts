import { test, expect } from "@playwright/test";

test.describe("Visualização e Interação do Mapa Interativo", () => {
  
  test.beforeEach(async ({ page }) => {
    // Acessa a Landing Page em português
    await page.goto("/pt-BR");
  });

  test("deve renderizar o mapa interativo e a legenda na página inicial", async ({ page }) => {
    // O container do mapa deve estar visível
    const mapContainer = page.locator(".relative.w-full.overflow-hidden.bg-slate-50");
    await expect(mapContainer).toBeVisible();

    // O SVG do mapa deve estar na tela
    const svgMap = mapContainer.locator("svg");
    await expect(svgMap).toBeVisible();

    // Países como Canadá (CAN) ou Portugal (PRT) devem estar desenhados no SVG
    const canadaGeo = page.locator("#geo-CAN");
    await expect(canadaGeo).toBeVisible();

    // A legenda do mapa deve estar presente de acordo com o viewport
    const viewportSize = page.viewportSize();
    const isMobile = viewportSize ? viewportSize.width < 768 : false;

    if (isMobile) {
      // No mobile, o botão de abrir legenda deve estar visível
      const btnOpenLegendMobile = page.locator("#btn-open-legend-mobile");
      await expect(btnOpenLegendMobile).toBeVisible();
      
      // Abre a legenda
      await btnOpenLegendMobile.click();
      
      // O contêiner da legenda móvel deve aparecer (filtramos o texto visível)
      const visibleLegendText = page.locator("text=Legenda de Score").filter({ visible: true });
      await expect(visibleLegendText).toBeVisible();
      
      // Fecha a legenda
      await page.locator("#btn-close-legend-mobile").click();
      await expect(btnOpenLegendMobile).toBeVisible();
      await expect(visibleLegendText).not.toBeVisible();
    } else {
      // No desktop, o contêiner de legenda desktop deve estar visível direto
      const legendDesktopContainer = page.locator(".hidden.md\\:flex.flex-col.gap-2");
      await expect(legendDesktopContainer).toBeVisible();
      await expect(legendDesktopContainer).toContainText("Legenda de Score");
    }
  });

  test("deve exibir filtros inline no desktop e ocultar botão mobile", async ({ page }) => {
    const viewportSize = page.viewportSize();
    const isDesktop = viewportSize ? viewportSize.width >= 768 : true;
    test.skip(!isDesktop, "Este teste é exclusivo para telas desktop/tablet.");

    // No desktop, os filtros devem ser inline
    const selectRegion = page.locator("#select-region");
    await expect(selectRegion).toBeVisible();

    const selectIndicator = page.locator("#select-indicator");
    await expect(selectIndicator).toBeVisible();

    // Botão de abrir filtros mobile deve estar oculto
    const btnOpenFiltersMobile = page.locator("#btn-open-filters-mobile");
    await expect(btnOpenFiltersMobile).not.toBeVisible();
  });

  test("deve exibir botão de filtros e abrir via Sheet no mobile", async ({ page }) => {
    const viewportSize = page.viewportSize();
    const isMobile = viewportSize ? viewportSize.width < 768 : false;
    test.skip(!isMobile, "Este teste é exclusivo para telas mobile.");

    // No mobile, os filtros inline devem estar ocultos
    const desktopFiltersContainer = page.locator(".hidden.md\\:flex.items-center.gap-6");
    await expect(desktopFiltersContainer).not.toBeVisible();

    // Botão para abrir filtros mobile deve estar visível
    const btnOpenFiltersMobile = page.locator("#btn-open-filters-mobile");
    await expect(btnOpenFiltersMobile).toBeVisible();

    // Clicar no botão de filtros deve abrir o Sheet
    await btnOpenFiltersMobile.click();

    // O seletor de região no Sheet móvel deve estar visível agora
    const selectRegionMobile = page.locator("#select-region").filter({ visible: true });
    await expect(selectRegionMobile).toBeVisible();
  });

  test("deve exibir tooltip ao passar o mouse sobre o país no desktop e navegar ao clicar", async ({ page }) => {
    const viewportSize = page.viewportSize();
    const isDesktop = viewportSize ? viewportSize.width >= 768 : true;
    test.skip(!isDesktop, "Este teste é exclusivo para telas desktop.");

    const canadaGeo = page.locator("#geo-CAN");
    await expect(canadaGeo).toBeVisible();

    // Simular o hover sobre o país (Canadá)
    await canadaGeo.hover();

    // O tooltip do país deve aparecer
    const tooltip = page.locator("[role='tooltip']");
    await expect(tooltip).toBeVisible();

    // Deve conter dados básicos do Canadá
    await expect(tooltip.locator("h3")).toContainText("Canadá");
    await expect(tooltip).toContainText("Score Geral");

    // Clicar no país deve navegar para a página de detalhes
    await canadaGeo.click();

    // Validar que navegou
    await expect(page).toHaveURL(/\/pt-BR\/country\/canada/);

    // Deve carregar o esqueleto/alerta honesto da página de país
    await expect(page.locator("h1")).toContainText("Canadá");
    await expect(page.locator("text=MVP Core").first()).toBeVisible();
  });

  test("deve exibir tooltip no primeiro toque e navegar no segundo toque/clique no mobile", async ({ page }) => {
    const viewportSize = page.viewportSize();
    const isMobile = viewportSize ? viewportSize.width < 768 : false;
    test.skip(!isMobile, "Este teste é exclusivo para telas mobile.");

    const canadaGeo = page.locator("#geo-CAN");
    await expect(canadaGeo).toBeVisible();

    // Primeiro toque (click no mobile): Abre o tooltip
    await canadaGeo.click();

    // O tooltip deve ficar visível e fixado
    const tooltip = page.locator("[role='tooltip']");
    await expect(tooltip).toBeVisible();
    await expect(tooltip.locator("h3")).toContainText("Canadá");

    // No mobile, clicar no mesmo país novamente ou clicar no botão "Ver detalhes" navega
    const detailsLink = page.locator("#link-details-canada");
    await expect(detailsLink).toBeVisible();
    
    // Clicar no link de detalhes para navegar
    await detailsLink.click();

    // Validar que navegou
    await expect(page).toHaveURL(/\/pt-BR\/country\/canada/);
    await expect(page.locator("h1")).toContainText("Canadá");
  });

  test("deve fechar tooltip ao clicar fora no mobile", async ({ page }) => {
    const viewportSize = page.viewportSize();
    const isMobile = viewportSize ? viewportSize.width < 768 : false;
    test.skip(!isMobile, "Este teste é exclusivo para telas mobile.");

    const canadaGeo = page.locator("#geo-CAN");
    await expect(canadaGeo).toBeVisible();

    // Abre o tooltip clicando no país
    await canadaGeo.click();
    const tooltip = page.locator("[role='tooltip']");
    await expect(tooltip).toBeVisible();

    // Clicar fora do mapa ou no fundo do mapa fecha o tooltip.
    // Vamos clicar no container externo do mapa
    const mapContainer = page.locator(".relative.w-full.overflow-hidden.bg-slate-50");
    // Clica com uma folga (offset) para não pegar nenhum país
    await mapContainer.click({ position: { x: 10, y: 10 } });

    // O tooltip deve sumir
    await expect(tooltip).not.toBeVisible();
  });

  test("garante ausência de overflow horizontal", async ({ page }) => {
    // A largura do document body não pode ser maior que o viewport
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = page.viewportSize()?.width || 0;
    
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth);
  });
});
