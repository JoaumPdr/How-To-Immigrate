import { test, expect } from "@playwright/test";

test.describe("Troca de Idioma (PT-BR <-> EN)", () => {
  test("deve trocar de idioma e manter a persistência após o recarregamento", async ({ page }) => {
    const viewportSize = page.viewportSize();
    const isMobile = viewportSize ? viewportSize.width < 768 : false;

    // 1. Acessa diretamente a rota em português
    await page.goto("/pt-BR");
    await expect(page).toHaveURL(/\/pt-BR/);
    await expect(page.locator("h1")).toContainText("Como Imigrar");

    if (isMobile) {
      // Abre o menu móvel primeiro em telas pequenas
      const hamburgerBtn = page.locator('button[aria-label="Abrir menu de navegação"]');
      await hamburgerBtn.click();
    }

    // Encontra o seletor de idioma EN no escopo correto
    const switchEnBtn = isMobile
      ? page.getByRole("dialog").getByRole("button", { name: "EN", exact: true })
      : page.getByRole("banner").getByRole("button", { name: "EN", exact: true });
    await expect(switchEnBtn).toBeVisible();

    // 2. Clica em EN para mudar para Inglês
    await switchEnBtn.click();
    
    // Valida redirecionamento de URL e tradução de textos
    await expect(page).toHaveURL(/\/en/);
    await expect(page.locator("h1")).toContainText("How To Immigrate");

    // 3. Recarrega a página para testar se a persistência de idioma está funcionando
    await page.reload();
    await expect(page).toHaveURL(/\/en/);
    await expect(page.locator("h1")).toContainText("How To Immigrate");

    if (isMobile) {
      // Abre o menu móvel de novo para voltar ao PT
      const hamburgerBtn = page.locator('button[aria-label="Abrir menu de navegação"]');
      await hamburgerBtn.click();
    }

    // Retorna para o Português clicando em PT no escopo correto
    const switchPtBtn = isMobile
      ? page.getByRole("dialog").getByRole("button", { name: "PT", exact: true })
      : page.getByRole("banner").getByRole("button", { name: "PT", exact: true });
    await switchPtBtn.click();
    await expect(page).toHaveURL(/\/pt-BR/);
    await expect(page.locator("h1")).toContainText("Como Imigrar");
  });
});
