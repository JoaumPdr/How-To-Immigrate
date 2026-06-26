import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { countryRepository } from "../../../lib/repositories/countryRepository";
import { getClientIp, isRateLimited } from "../../../lib/utils/rateLimit";

export const dynamic = "force-dynamic";
export const revalidate = 21600; // Cache ISR de 6 horas (21600 segundos)

// Schema Zod para validar que a querystring não possui parâmetros extras/maliciosos
const mapQuerySchema = z.object({
  region: z.string().optional(),
  indicator: z.string().optional(),
  scoreRange: z.string().optional()
}).strict();

/**
 * @swagger
 * /api/map:
 *   get:
 *     summary: Retorna dados mínimos e otimizados para renderização do mapa-múndi
 *     description: Endpoint otimizado para payload mínimo, com cache de 6 horas e rate limiting.
 *     responses:
 *       200:
 *         description: Dados do mapa retornados com sucesso.
 *       400:
 *         description: Parâmetros de busca inválidos.
 *       429:
 *         description: Excesso de requisições.
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Aplicar Rate Limiting
    const ip = getClientIp(request);
    if (isRateLimited(ip, 120)) { // Limite de 120 requisições por minuto
      return NextResponse.json(
        { error: "Too Many Requests" },
        { status: 429 }
      );
    }

    // 2. Validar Query Params via Zod (Strict para evitar injeções e poluição de chaves)
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    const validation = mapQuerySchema.safeParse(queryParams);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid query parameters" },
        { status: 400 }
      );
    }

    const countries = await countryRepository.findMapView();
    return NextResponse.json(countries, {
      headers: {
        "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=3600"
      }
    });
  } catch (error) {
    console.error("Error fetching map view data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
