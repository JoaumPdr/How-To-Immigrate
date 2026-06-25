import { test, expect } from "@playwright/test";

test.describe("Responsividade do Shell Global (Navbar e Menu Hambúrguer)", () => {
  test("comportamento em telas desktop", async ({ page }) => {
    const viewportSize = page.viewportSize();
    const isDesktop = viewportSize ? viewportSize.width >= 768 : true;
    test.skip(!isDesktop, "Este teste é exclusivo para telas desktop.");

    // Acessa a Landing Page
    await page.goto("/pt-BR");

    // No desktop, os links principais da Navbar devem estar visíveis
    const mainNav = page.locator('nav[aria-label="Navegação Principal"]');
    await expect(mainNav).toBeVisible();

    // No desktop, o botão Hambúrguer do menu móvel deve estar oculto
    const hamburgerBtn = page.locator('button[aria-label="Abrir menu de navegação"]');
    await expect(hamburgerBtn).not.toBeVisible();
  });

  test("comportamento em telas mobile", async ({ page }) => {
    const viewportSize = page.viewportSize();
    const isMobile = viewportSize ? viewportSize.width < 768 : false;
    test.skip(!isMobile, "Este teste é exclusivo para telas mobile.");

    // Acessa a Landing Page
    await page.goto("/pt-BR");

    // No mobile, os links da Navbar principal devem estar ocultos
    const mainNav = page.locator('nav[aria-label="Navegação Principal"]');
    await expect(mainNav).not.toBeVisible();

    // No mobile, o botão Hambúrguer do menu móvel deve estar visível
    const hamburgerBtn = page.locator('button[aria-label="Abrir menu de navegação"]');
    await expect(hamburgerBtn).toBeVisible();

    // Clicar no Hambúrguer deve abrir o menu lateral (Sheet)
    await hamburgerBtn.click();

    // Verificar que o Sheet lateral com links móveis está visível
    const mobileNav = page.locator('nav[aria-label="Navegação Móvel"]');
    await expect(mobileNav).toBeVisible();
  });
});
