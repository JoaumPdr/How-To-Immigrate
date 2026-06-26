import { NextResponse } from "next/server";
import { z } from "zod";
import { countryRepository } from "../../../../lib/repositories/countryRepository";

const slugSchema = z.string().regex(/^[a-z0-9-]+$/);

/**
 * @swagger
 * /api/countries/{slug}:
 *   get:
 *     summary: Retorna os detalhes de um país específico
 *     description: Retorna as informações gerais e todos os indicadores cadastrados do país.
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: O slug único do país (ex: canada)
 *     responses:
 *       200:
 *         description: País encontrado e retornado com sucesso.
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

    const country = await countryRepository.findBySlug(validationResult.data);
    if (!country) {
      return NextResponse.json(
        { error: "Country not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(country);
  } catch (error) {
    console.error("Error fetching country by slug:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
