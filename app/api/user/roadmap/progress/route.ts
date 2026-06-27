import { NextResponse } from "next/server";
import { auth } from "../../../../../lib/auth";
import { prisma } from "../../../../../lib/prisma";
import { z } from "zod";

const progressSchema = z.object({
  stepId: z.string().uuid(),
  completed: z.boolean()
});

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const result = progressSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Dados de requisição inválidos" }, { status: 400 });
    }

    const { stepId, completed } = result.data;

    // Garante que o step existe
    const step = await prisma.roadmapStep.findUnique({
      where: { id: stepId }
    });

    if (!step) {
      return NextResponse.json({ error: "Passo do roadmap não encontrado" }, { status: 404 });
    }

    // Cria ou atualiza o progresso
    const progress = await prisma.userRoadmapProgress.upsert({
      where: {
        userId_stepId: {
          userId: session.user.id,
          stepId: stepId
        }
      },
      update: {
        completed: completed
      },
      create: {
        userId: session.user.id,
        stepId: stepId,
        completed: completed
      }
    });

    // Recalcula a porcentagem de progresso do roadmap para este usuário e país
    // Para isso, precisamos do roadmap associado a este step
    const stepWithRoadmap = await prisma.roadmapStep.findUnique({
      where: { id: stepId },
      select: {
        roadmap: {
          select: {
            id: true,
            countryId: true,
            steps: {
              select: {
                id: true
              }
            }
          }
        }
      }
    });

    if (stepWithRoadmap?.roadmap) {
      const roadmapId = stepWithRoadmap.roadmap.id;
      const totalSteps = stepWithRoadmap.roadmap.steps.length;
      const stepIds = stepWithRoadmap.roadmap.steps.map(s => s.id);

      const completedCount = await prisma.userRoadmapProgress.count({
        where: {
          userId: session.user.id,
          stepId: { in: stepIds },
          completed: true
        }
      });

      const percentage = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

      // Cria ou atualiza o progresso do usuário no Roadmap do país
      // No schema original do Prisma, a relação entre User e Roadmap é feita por uma FK userId em Roadmap.
      // Mas o Roadmap é público (UserId opcional). Para o usuário específico ter seu próprio progresso,
      // podemos criar um registro de Roadmap associado ao usuário ou apenas retornar o cálculo.
      // O schema do Prisma possui Roadmap.userId opcional. Se for o roadmap pessoal do usuário:
      const userRoadmap = await prisma.roadmap.findFirst({
        where: {
          userId: session.user.id,
          countryId: stepWithRoadmap.roadmap.countryId
        }
      });

      if (userRoadmap) {
        await prisma.roadmap.update({
          where: { id: userRoadmap.id },
          data: { progressPercentage: percentage }
        });
      } else {
        // Cria um clone do roadmap público associado a este usuário
        await prisma.roadmap.create({
          data: {
            userId: session.user.id,
            countryId: stepWithRoadmap.roadmap.countryId,
            progressPercentage: percentage
          }
        });
      }
    }

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error("Erro ao salvar progresso do roadmap:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
