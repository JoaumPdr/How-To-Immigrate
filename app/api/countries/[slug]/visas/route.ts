import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;

    // Sanitização estrita contra path traversal e injeção de parâmetros
    if (!slug || !/^[a-z0-9\-]+$/i.test(slug)) {
      return NextResponse.json({ error: "Parâmetro de país inválido" }, { status: 400 });
    }

    const country = await prisma.country.findUnique({
      where: { slug },
      select: {
        visas: {
          orderBy: {
            name: "asc"
          }
        }
      }
    });

    if (!country) {
      return NextResponse.json({ error: "País não encontrado" }, { status: 404 });
    }

    return NextResponse.json(country.visas);
  } catch (error) {
    console.error("Erro ao buscar vistos:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
