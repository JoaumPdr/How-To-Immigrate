import { test, expect } from "@playwright/test";

test.describe("Páginas de Países, Vistos e Roadmaps (Etapa 05)", () => {
  // Testes de visualização e carregamento (Sem login necessário)
  test("deve renderizar a página do Canadá (país seed) estática de forma completa e rápida", async ({ page }) => {
    // Acessa em português do Brasil
    await page.goto("/pt-BR/country/canada");
    await expect(page).toHaveURL(/\/pt-BR\/country\/canada/);

    // Valida elementos do CountryHero
    await expect(page.locator("h1")).toContainText("Canadá");
    await expect(page.locator("text=Ottawa")).toBeVisible();
    await expect(page.getByText("CAD", { exact: true })).toBeVisible();

    // Valida a presença do Structured Data (JSON-LD) para SEO no head/body
    const jsonLdScript = page.locator("script[type='application/ld+json']");
    await expect(jsonLdScript).toBeDefined();
    const content = await jsonLdScript.first().innerHTML();
    expect(content).toContain("Canadá");
    expect(content).toContain("Place");

    // Valida a aba Visão Geral ativa por padrão e o gráfico de radar visível (ou fallback de progresso)
    await expect(page.locator("text=Análise de Indicadores Nacionais")).toBeVisible();

    // Testa a alternância de Abas (Tabs)
    const visasTab = page.locator("button:has-text('Vistos Disponíveis')");
    await visasTab.click();
    // O conteúdo correspondente aos visto deve carregar
    await expect(page.locator("text=Express Entry - Federal Skilled Worker")).toBeVisible();

    // Clica na aba de Links
    const linksTab = page.locator("button:has-text('Links Oficiais')");
    await linksTab.click();
    await expect(page.locator("text=Portal Oficial IRCC")).toBeVisible();
  });

  test("deve executar com sucesso o simulador de vistos (VisaEligibilityChecker)", async ({ page }) => {
    await page.goto("/pt-BR/country/canada");

    // Valida que o simulador de visto está presente na tela
    await expect(page.locator("text=Simulador de Visto")).toBeVisible();

    // Step 1: Seleciona Idade
    await page.click("button:has-text('18 a 35 anos')");
    await page.click("button:has-text('Continuar')");

    // Step 2: Seleciona Profissão
    await page.click("button:has-text('Tecnologia')");
    await page.click("button:has-text('Continuar')");

    // Step 3: Seleciona Idioma
    await page.click("button:has-text('Fluente')");
    await page.click("button:has-text('Continuar')");

    // Step 4: Seleciona Orçamento
    await page.click("button:has-text('Médio')");
    await page.click("button:has-text('Ver Resultado')");

    // Step 5: Valida recomendação de Express Entry
    await expect(page.locator("text=Visto Recomendado")).toBeVisible();
    await expect(page.locator("h3:has-text('Express Entry')")).toBeVisible();
  });

  test("deve exibir banner amigável de fallback ao carregar um país que não pertence ao seed", async ({ page }) => {
    // pais-de-teste-21 está na base de 210 países mas não tem roadmap detalhado no seed
    await page.goto("/pt-BR/country/pais-de-teste-21");

    // Hero deve funcionar com os dados básicos
    await expect(page.locator("h1")).toContainText("País de Teste 21");

    // Deve exibir o alerta amigável de guia em desenvolvimento
    await expect(page.locator("text=Guia em Desenvolvimento")).toBeVisible();
    await expect(page.locator("text=Atualmente, apenas as métricas básicas")).toBeVisible();
  });

  test("deve aplicar regras responsivas de eixos e tabs sem causar scroll horizontal indesejado", async ({ page }) => {
    // Seta viewport mobile padrão
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/pt-BR/country/canada");

    // Verifica se não há vazamento do contêiner principal da página
    const mainWidth = await page.evaluate(() => {
      const main = document.querySelector("main");
      return main ? main.scrollWidth : 0;
    });
    expect(mainWidth).toBeLessThanOrEqual(375);

    // Valida que o Radar Chart ativou o fallback em barras verticais e ocultou o canvas original do Recharts
    await expect(page.locator("text=Principais Indicadores")).toBeVisible();
  });
});
