import { NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { z } from "zod";

const favoriteToggleSchema = z.object({
  countryId: z.string().uuid("countryId inválido"),
});

// GET /api/user/favorites
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const favorites = await prisma.userFavoriteCountry.findMany({
      where: { userId: session.user.id },
      include: {
        country: {
          select: {
            id: true,
            slug: true,
            name: true,
            nameEn: true,
            codeISO2: true,
            flagUrl: true,
            overallScore: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(favorites.map((f) => f.country));
  } catch (error) {
    console.error("Erro ao buscar favoritos:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// POST /api/user/favorites (Toggle favorito)
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = favoriteToggleSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { countryId } = result.data;

    // Verificar se o país existe
    const country = await prisma.country.findUnique({
      where: { id: countryId },
    });

    if (!country) {
      return NextResponse.json({ error: "País não encontrado" }, { status: 404 });
    }

    // Verificar se já está favoritado
    const existingFavorite = await prisma.userFavoriteCountry.findUnique({
      where: {
        userId_countryId: {
          userId: session.user.id,
          countryId,
        },
      },
    });

    if (existingFavorite) {
      // Remover dos favoritos
      await prisma.userFavoriteCountry.delete({
        where: {
          userId_countryId: {
            userId: session.user.id,
            countryId,
          },
        },
      });
      return NextResponse.json({ favorited: false, message: "País removido dos favoritos" });
    } else {
      // Adicionar aos favoritos
      await prisma.userFavoriteCountry.create({
        data: {
          userId: session.user.id,
          countryId,
        },
      });
      return NextResponse.json({ favorited: true, message: "País adicionado aos favoritos" });
    }
  } catch (error) {
    console.error("Erro ao gerenciar favorito:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
