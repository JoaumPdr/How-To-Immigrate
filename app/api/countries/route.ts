import { NextResponse } from "next/server";
import { countryRepository } from "../../../lib/repositories/countryRepository";

export const revalidate = 86400; // Cache ISR de 24 horas

/**
 * @swagger
 * /api/countries:
 *   get:
 *     summary: Retorna a lista de todos os países com seus indicadores
 *     description: Retorna todos os países cadastrados na base de dados de imigração com cache ISR de 24h.
 *     responses:
 *       200:
 *         description: Lista de países obtida com sucesso.
 */
export async function GET() {
  try {
    const countries = await countryRepository.findAll();
    return NextResponse.json(countries, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600"
      }
    });
  } catch (error) {
    console.error("Error fetching countries:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
