interface Visa {
  id: string;
  name: string;
  type: string;
  description: string;
  requirements: string[];
  documents: string[];
  financialRequirement: string | null;
  officialLink: string | null;
}

interface Answers {
  age: string;
  profession: string;
  language: string;
  budget: string;
}

/**
 * Função pura que determina a recomendação de visto com base no perfil do usuário.
 * Usada para recomendação e perfeitamente testável via testes unitários.
 */
export function recommendVisa(visas: Visa[], answers: Answers): Visa | null {
  if (visas.length === 0) {
    return null;
  }

  let recommended: Visa | null = null;

  // 1. Perfil para vistos de aposentadoria/renda passiva (D7, etc.)
  const retirementVisa = visas.find((v) => v.type === "retirement");
  if (retirementVisa && (answers.age === "46+" || answers.budget === "high")) {
    recommended = retirementVisa;
  }

  // 2. Perfil para vistos de alta qualificação (Express Entry, Chancenkarte, Skilled Worker, etc.)
  if (!recommended) {
    const workVisas = visas.filter((v) => v.type === "work");
    if (workVisas.length > 0) {
      if (["tech", "business"].includes(answers.profession) && ["fluent", "intermediate"].includes(answers.language)) {
        recommended = workVisas[0];
      } else {
        recommended = workVisas[workVisas.length - 1];
      }
    }
  }

  // 3. Fallback para o primeiro visto cadastrado se nenhum critério restrito bateu
  if (!recommended) {
    recommended = visas[0];
  }

  return recommended;
}
