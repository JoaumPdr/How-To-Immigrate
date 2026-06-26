import "dotenv/config";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { countryRepository } from "../lib/repositories/countryRepository";
import { prisma } from "../lib/prisma";

describe("Country Repository Integration Tests", () => {
  beforeAll(async () => {
    // Garantir conexão estabelecida
    await prisma.$connect();
  });

  afterAll(async () => {
    // Fechar conexão
    await prisma.$disconnect();
  });

  it("deve retornar todos os 210 países cadastrados no seed", async () => {
    const countries = await countryRepository.findAll();
    expect(countries.length).toBeGreaterThanOrEqual(200);
    
    // Validar formato estruturado de indicators
    const firstCountry = countries[0];
    expect(firstCountry).toHaveProperty("slug");
    expect(firstCountry).toHaveProperty("indicators");
    expect(firstCountry.indicators.length).toBeGreaterThan(0);
  });

  it("deve buscar o Canadá corretamente pelo slug", async () => {
    const canada = await countryRepository.findBySlug("canada");
    expect(canada).not.toBeNull();
    expect(canada!.name).toBe("Canadá");
    expect(canada!.codeISO3).toBe("CAN");
    expect(canada!.indicators).toHaveLength(6);
  });

  it("deve retornar null para um slug de país que não existe", async () => {
    const country = await countryRepository.findBySlug("pais-que-nao-existe");
    expect(country).toBeNull();
  });

  it("deve calcular o breakdown de score corretamente para um país existente", async () => {
    const breakdown = await countryRepository.findScoreBreakdown("canada");
    expect(breakdown).not.toBeNull();
    expect(breakdown!.overallScore).toBeGreaterThan(0);
    expect(breakdown!.indicatorsCalculated.length).toBe(6);
    expect(breakdown!.missingIndicators).toHaveLength(0);
  });

  it("deve retornar null para o breakdown de um país que não existe", async () => {
    const breakdown = await countryRepository.findScoreBreakdown("pais-que-nao-existe");
    expect(breakdown).toBeNull();
  });
});
