import { NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { z } from "zod";

const step1Schema = z.object({
  age: z.number().int().min(1, "Idade inválida").max(120, "Idade inválida"),
  nationality: z.string().min(2, "Selecione uma nacionalidade"),
});

const step2Schema = z.object({
  education: z.string().min(1, "Selecione a escolaridade"),
  profession: z.string().min(2, "Profissão deve ter pelo menos 2 caracteres"),
});

const step3Schema = z.object({
  languages: z.array(z.string()).min(1, "Selecione pelo menos um idioma"),
});

const step4Schema = z.object({
  immigrationObjective: z.string().min(1, "Selecione um objetivo"),
});

const step5Schema = z.object({
  financialSituation: z.string().min(1, "Selecione uma faixa financeira"),
});

const questionnaireSchema = z.object({
  step: z.number().int().min(1).max(5),
  data: z.any(),
});

// POST /api/user/questionnaire
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = questionnaireSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Dados da requisição inválidos", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { step, data } = result.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let validatedData: any = {};

    // Validar dados específicos de cada step
    if (step === 1) {
      const stepVal = step1Schema.safeParse(data);
      if (!stepVal.success) {
        return NextResponse.json(
          { error: "Dados inválidos para a etapa 1", details: stepVal.error.flatten().fieldErrors },
          { status: 400 }
        );
      }
      validatedData = stepVal.data;
    } else if (step === 2) {
      const stepVal = step2Schema.safeParse(data);
      if (!stepVal.success) {
        return NextResponse.json(
          { error: "Dados inválidos para a etapa 2", details: stepVal.error.flatten().fieldErrors },
          { status: 400 }
        );
      }
      validatedData = stepVal.data;
    } else if (step === 3) {
      const stepVal = step3Schema.safeParse(data);
      if (!stepVal.success) {
        return NextResponse.json(
          { error: "Dados inválidos para a etapa 3", details: stepVal.error.flatten().fieldErrors },
          { status: 400 }
        );
      }
      validatedData = stepVal.data;
    } else if (step === 4) {
      const stepVal = step4Schema.safeParse(data);
      if (!stepVal.success) {
        return NextResponse.json(
          { error: "Dados inválidos para a etapa 4", details: stepVal.error.flatten().fieldErrors },
          { status: 400 }
        );
      }
      validatedData = stepVal.data;
    } else if (step === 5) {
      const stepVal = step5Schema.safeParse(data);
      if (!stepVal.success) {
        return NextResponse.json(
          { error: "Dados inválidos para a etapa 5", details: stepVal.error.flatten().fieldErrors },
          { status: 400 }
        );
      }
      validatedData = stepVal.data;
    }

    // Buscar perfil existente
    const existingProfile = await prisma.userProfile.findUnique({
      where: { userId: session.user.id }
    });

    // O onboardingStep deve ser o maior entre o atual e o step que acabou de ser concluído.
    // Se o usuário completou o step 5, onboardingStep vai para 5.
    const currentOnboardingStep = existingProfile?.onboardingStep || 0;
    const nextOnboardingStep = Math.max(currentOnboardingStep, step);

    const updatedProfile = await prisma.userProfile.upsert({
      where: { userId: session.user.id },
      update: {
        ...validatedData,
        onboardingStep: nextOnboardingStep,
      },
      create: {
        userId: session.user.id,
        ...validatedData,
        onboardingStep: nextOnboardingStep,
      },
    });

    return NextResponse.json({
      message: `Etapa ${step} salva com sucesso`,
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Erro ao salvar etapa do questionário:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
