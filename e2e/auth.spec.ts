import { test, expect } from "@playwright/test";

test.describe("Fluxo de Autenticação e Perfil de Usuário", () => {
  test("Deve registrar, logar, preencher onboarding parcial, recarregar para validar persistência, concluir onboarding, ver dashboard, editar perfil e excluir conta", async ({ page }) => {
    const testEmail = `test-${Date.now()}-${Math.random().toString(36).substring(2, 7)}@example.com`;
    const testPassword = "Password123!";
    const testName = "Usuário Teste Playwright";

    // 1. Registro
    await page.goto("/pt-BR/register");
    await page.fill("#name", testName);
    await page.fill("#email", testEmail);
    await page.fill("#password", testPassword);
    await page.fill("#confirmPassword", testPassword);
    await page.click("button[type='submit']");

    // Deve redirecionar para a página de login após sucesso
    await expect(page).toHaveURL(/.*\/login/, { timeout: 15000 });

    // 2. Login
    // Pequeno atraso para garantir hidratação completa dos listeners de evento
    await page.waitForTimeout(1000);
    await page.fill("#email", testEmail);
    await page.fill("#password", testPassword);
    await page.click("button[type='submit']");

    // Como o onboarding está zerado, o middleware deve redirecionar para /onboarding
    await expect(page).toHaveURL(/.*\/onboarding/, { timeout: 15000 });

    // 3. Onboarding - Passo 1 (Idade & Nacionalidade)
    await page.fill("#age", "28");
    await page.selectOption("#nationality", "Brasil");
    await page.click("button:has-text('Continuar')");

    // Deve ir para o Passo 2
    await expect(page.locator("text=Formação e Trabalho")).toBeVisible({ timeout: 15000 });

    // 4. Testar a persistência do progresso (Retomada de Abandono)
    // Recarrega a página para simular que o usuário saiu do app e voltou
    await page.reload();
    // Pequeno delay após reload para estabilização de hidratação
    await page.waitForTimeout(1000);

    // Deve reconhecer o onboardingStep=1 e colocar na etapa 2 (OnboardingStep + 1)
    await expect(page.locator("text=Formação e Trabalho")).toBeVisible({ timeout: 15000 });
    await expect(page.locator("text=Retomamos seu progresso da última etapa salva!")).toBeVisible();

    // Onboarding - Passo 2 (Escolaridade & Profissão)
    await page.click("button:has-text('Bacharelado / Graduação')");
    await page.fill("#profession", "Engenheiro de Software E2E");
    await page.click("button:has-text('Continuar')");

    // Onboarding - Passo 3 (Idiomas)
    await expect(page.locator("text=Quais línguas você fala?")).toBeVisible({ timeout: 15000 });
    await page.click("button:has-text('Português')");
    await page.click("button:has-text('Inglês')");
    await page.click("button:has-text('Continuar')");

    // Onboarding - Passo 4 (Objetivo)
    await expect(page.locator("text=Qual seu principal objetivo com a imigração?")).toBeVisible({ timeout: 15000 });
    await page.click("h3:has-text('Trabalhar no exterior')");
    await page.click("button:has-text('Continuar')");

    // Onboarding - Passo 5 (Situação Financeira)
    await expect(page.locator("text=Selecione a faixa financeira disponível para seu plano.")).toBeVisible({ timeout: 15000 });
    await page.click("h3:has-text('Entre $30.000 e $100.000 USD')");
    await page.click("button:has-text('Finalizar e Ver Recomendações')");

    // 5. Dashboard
    await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 15000 });
    await expect(page.locator("text=Seus Países Favoritos")).toBeVisible({ timeout: 15000 });
    await expect(page.locator("text=Progresso do Plano de Imigração")).toBeVisible();
    await expect(page.locator(`text=Olá, ${testName}!`)).toBeVisible();

    // 6. Perfil e Edição de Dados
    await page.click("text=Ver Perfil");
    await expect(page).toHaveURL(/.*\/profile/, { timeout: 15000 });

    // Validar que os campos estão preenchidos com os dados do onboarding
    await expect(page.locator("#name")).toHaveValue(testName);
    await expect(page.locator("#age")).toHaveValue("28");
    await expect(page.locator("#nationality")).toHaveValue("Brasil");
    await expect(page.locator("#education")).toHaveValue("bachelors");
    await expect(page.locator("#profession")).toHaveValue("Engenheiro de Software E2E");

    // Editar um campo e salvar
    await page.fill("#profession", "Engenheiro de Software Sênior E2E");
    await page.click("button:has-text('Salvar Alterações')");
    await expect(page.locator("text=Perfil atualizado com sucesso!")).toBeVisible();

    // 7. Exclusão permanente da conta (GDPR)
    await page.click("button:has-text('Excluir Conta Permanentemente')");
    await expect(page.locator("text=Tem certeza de que deseja excluir permanentemente sua conta")).toBeVisible();
    await page.click("button:has-text('Sim, excluir minha conta')");

    // Deve redirecionar para a página de login com feedback
    await expect(page).toHaveURL(/.*\/login/, { timeout: 15000 });
  });

  test("Usuário deslogado deve ser redirecionado para login ao tentar acessar rotas protegidas", async ({ page }) => {
    // Tenta acessar /dashboard
    await page.goto("/pt-BR/dashboard");
    await expect(page).toHaveURL(/.*\/login\?callbackUrl=.*/, { timeout: 15000 });

    // Tenta acessar /profile
    await page.goto("/pt-BR/profile");
    await expect(page).toHaveURL(/.*\/login\?callbackUrl=.*/, { timeout: 15000 });

    // Tenta acessar /onboarding
    await page.goto("/pt-BR/onboarding");
    await expect(page).toHaveURL(/.*\/login\?callbackUrl=.*/, { timeout: 15000 });
  });
});
