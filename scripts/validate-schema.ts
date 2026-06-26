import "dotenv/config";
import { PrismaClient } from "@prisma/client";

import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function validate() {
  console.log("🔍 Iniciando validação do banco de dados...");
  
  // 1. Validar quantidade mínima de países
  const count = await prisma.country.count();
  console.log(`- Total de países cadastrados: ${count}`);
  if (count < 200) {
    throw new Error(`Validação falhou: esperado pelo menos 200 países, encontrado ${count}`);
  }

  // 2. Buscar países com seus indicadores
  const countries = await prisma.country.findMany({
    include: { indicators: true }
  });

  const categories = ["safety", "costOfLiving", "jobMarket", "visaEase", "healthcare", "culturalIntegration"];

  for (const c of countries) {
    // 3. Validar slugs únicos (garantido por chave primária/Unique do Prisma, mas bom checar)
    if (!c.slug) {
      throw new Error(`Validação falhou: país com id ${c.id} não possui slug`);
    }

    // 4. Validar indicadores obrigatórios
    const indCategories = c.indicators.map(i => i.category);
    for (const cat of categories) {
      if (!indCategories.includes(cat)) {
        throw new Error(`Validação falhou: país ${c.slug} está sem o indicador obrigatório "${cat}"`);
      }
    }

    // 5. Validar notas no range [0, 100]
    for (const ind of c.indicators) {
      if (ind.score < 0 || ind.score > 100) {
        throw new Error(`Validação falhou: indicador "${ind.category}" do país ${c.slug} possui nota inválida: ${ind.score}`);
      }
    }

    // 6. Validar overallScore no range [0, 100]
    if (c.overallScore < 0 || c.overallScore > 100) {
      throw new Error(`Validação falhou: overallScore do país ${c.slug} está fora do limite [0, 100]: ${c.overallScore}`);
    }
  }

  console.log("🎉 Validação concluída com sucesso! Banco de dados consistente e íntegro.");
}

validate()
  .catch((e) => {
    console.error("❌ Erro de validação:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
