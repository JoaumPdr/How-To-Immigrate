import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../../lib/prisma";
import { INDICATOR_WEIGHTS } from "../../../../lib/data/scoring";
import { getClientIp, isRateLimited } from "../../../../lib/utils/rateLimit";

export const dynamic = "force-dynamic";
export const revalidate = 21600; // Cache ISR de 6 horas

// Schema Zod restritivo (nenhum parâmetro de busca permitido)
const filterQuerySchema = z.object({}).strict();

/**
 * @swagger
 * /api/map/filters:
 *   get:
 *     summary: Retorna as opções de filtros do mapa interativo
 *     description: Retorna regiões únicas presentes no banco, indicadores com pesos e faixas de score. Protegido com rate limiting e Zod.
 *     responses:
 *       200:
 *         description: Opções de filtros retornadas com sucesso.
 *       400:
 *         description: Parâmetros inválidos.
 *       429:
 *         description: Excesso de requisições.
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Aplicar Rate Limiting
    const ip = getClientIp(request);
    if (isRateLimited(ip, 60)) {
      return NextResponse.json(
        { error: "Too Many Requests" },
        { status: 429 }
      );
    }

    // 2. Validar Query Params via Zod (Strict)
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    const validation = filterQuerySchema.safeParse(queryParams);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid query parameters" },
        { status: 400 }
      );
    }
    // Obter regiões únicas de forma dinâmica do banco de dados
    const regionsResult = await prisma.country.groupBy({
      by: ["region"],
      _count: {
        id: true
      }
    });

    const regions = regionsResult.map((r) => r.region).filter(Boolean);

    const indicators = Object.keys(INDICATOR_WEIGHTS).map((key) => ({
      id: key,
      weight: INDICATOR_WEIGHTS[key as keyof typeof INDICATOR_WEIGHTS]
    }));

    const scoreRanges = [
      { id: "all", labelPt: "Todos", labelEn: "All" },
      { id: "excellent", labelPt: "Excelente (80-100)", labelEn: "Excellent (80-100)", min: 80, max: 100 },
      { id: "good", labelPt: "Bom (70-79)", labelEn: "Good (70-79)", min: 70, max: 79.99 },
      { id: "moderate", labelPt: "Moderado (50-69)", labelEn: "Moderate (50-69)", min: 50, max: 69.99 },
      { id: "hard", labelPt: "Desafiador (0-49)", labelEn: "Difficult (0-49)", min: 0, max: 49.99 }
    ];

    return NextResponse.json(
      {
        regions,
        indicators,
        scoreRanges
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=3600"
        }
      }
    );
  } catch (error) {
    console.error("Error fetching map filters:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
