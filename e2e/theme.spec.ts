import { test, expect } from "@playwright/test";

test.describe("Troca de Tema (Light / Dark Mode)", () => {
  test("deve alternar o tema ao clicar no botão de alternar tema e persistir após recarga", async ({ page }) => {
    // Acessa a Landing Page em português
    await page.goto("/pt-BR");
    await expect(page.locator("h1")).toContainText("Como Imigrar");

    // Localizar o botão de alternar tema na Navbar
    const themeBtn = page.locator('button[aria-label^="Ativar modo"]:visible');
    await expect(themeBtn).toBeVisible();

    // Obter o tema inicial
    const htmlElement = page.locator("html");
    const initialTheme = await htmlElement.getAttribute("class");

    // Clicar para alternar o tema
    await themeBtn.click();

    // Validar que a classe mudou no elemento html
    if (initialTheme?.includes("dark")) {
      await expect(htmlElement).not.toHaveClass(/dark/);
    } else {
      await expect(htmlElement).toHaveClass(/dark/);
    }

    // Recarregar a página para testar persistência no localStorage
    await page.reload();

    // Validar que o tema alternado foi persistido
    if (initialTheme?.includes("dark")) {
      await expect(htmlElement).not.toHaveClass(/dark/);
    } else {
      await htmlElement.waitFor({ state: "attached" });
      await expect(htmlElement).toHaveClass(/dark/);
    }
  });
});
