import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { hashPassword } from "../../../../lib/utils/bcrypt";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Endereço de e-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

// POST /api/auth/register
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, password } = result.data;

    // Verificar se o e-mail já está cadastrado
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Este endereço de e-mail já está cadastrado" },
        { status: 400 }
      );
    }

    // Criar hash da senha
    const passwordHash = await hashPassword(password);

    // Criar o usuário e inicializar o UserProfile correspondente
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email: email.toLowerCase(),
          passwordHash,
        },
      });

      await tx.userProfile.create({
        data: {
          userId: user.id,
          onboardingStep: 0,
        },
      });
    });

    return NextResponse.json(
      { message: "Usuário registrado com sucesso" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro no registro do usuário:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor durante o cadastro" },
      { status: 500 }
    );
  }
}
