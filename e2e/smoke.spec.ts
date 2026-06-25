import { test, expect } from "@playwright/test";

test("Homepage loads and displays Portuguese content when accessing /pt-BR", async ({ page }) => {
  // Acessar diretamente a rota em português
  await page.goto("/pt-BR");
  await expect(page).toHaveURL(/\/pt-BR/);
  
  // O título principal deve ser em português
  await expect(page.locator("h1")).toContainText("Como Imigrar");
});

test("Homepage loads and displays English content when accessing /en", async ({ page }) => {
  // Acessar diretamente a rota em inglês
  await page.goto("/en");
  await expect(page).toHaveURL(/\/en/);
  
  // O título principal deve ser em inglês
  await expect(page.locator("h1")).toContainText("How To Immigrate");
});
