import { NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { z } from "zod";

const profileUpdateSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres").optional(),
  age: z.number().int().min(1, "Idade inválida").max(120, "Idade inválida").optional().nullable(),
  nationality: z.string().optional().nullable(),
  education: z.string().optional().nullable(),
  profession: z.string().optional().nullable(),
  languages: z.array(z.string()).optional(),
  immigrationObjective: z.string().optional().nullable(),
  financialSituation: z.string().optional().nullable(),
});

// GET /api/user/profile
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        profile: true,
        favorites: {
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
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      profile: user.profile,
      favorites: user.favorites.map((f) => f.country),
    });
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// PUT /api/user/profile
export async function PUT(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = profileUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, ...profileData } = result.data;

    // Atualizar User e UserProfile em uma transação
    const updatedUser = await prisma.$transaction(async (tx) => {
      // 1. Atualizar nome do usuário se fornecido
      if (name !== undefined) {
        await tx.user.update({
          where: { id: session.user.id },
          data: { name },
        });
      }

      // 2. Atualizar ou criar o perfil do usuário
      const profile = await tx.userProfile.upsert({
        where: { userId: session.user.id },
        update: {
          ...profileData,
        },
        create: {
          userId: session.user.id,
          ...profileData,
          onboardingStep: 0,
        },
      });

      return { name, profile };
    });

    return NextResponse.json({
      message: "Perfil atualizado com sucesso",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// DELETE /api/user/profile (Exclusão definitiva de conta)
export async function DELETE() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    // A exclusão em cascata configurada no Prisma apagará todas as tabelas relacionadas:
    // UserProfile, Account, Session, Authenticator, Review, Roadmap, UserFavoriteCountry,
    // UserRoadmapProgress, UserSearchHistory.
    await prisma.user.delete({
      where: { id: session.user.id },
    });

    return NextResponse.json({
      message: "Sua conta e todos os dados associados foram excluídos permanentemente de nossos servidores.",
    });
  } catch (error) {
    console.error("Erro ao excluir conta:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
