import { NextResponse } from "next/server";
import { z } from "zod";
import { countryRepository } from "../../../../../lib/repositories/countryRepository";

const slugSchema = z.string().regex(/^[a-z0-9-]+$/);

/**
 * @swagger
 * /api/countries/{slug}/score:
 *   get:
 *     summary: Retorna o breakdown de pontuação de um país
 *     description: Retorna os pesos de cada categoria de indicador, o score ponderado e as notas de cálculo.
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: O slug único do país (ex: canada)
 *     responses:
 *       200:
 *         description: Breakdown do score calculado e retornado com sucesso.
 *       400:
 *         description: Slug inválido fornecido.
 *       404:
 *         description: País não encontrado.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const validationResult = slugSchema.safeParse(slug);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid slug format. Expected lowercase alphanumeric with hyphens." },
        { status: 400 }
      );
    }

    const breakdown = await countryRepository.findScoreBreakdown(validationResult.data);
    if (!breakdown) {
      return NextResponse.json(
        { error: "Country not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(breakdown);
  } catch (error) {
    console.error("Error fetching score breakdown by slug:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
