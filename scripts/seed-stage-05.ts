import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

interface SeedVisaData {
  name: string;
  type: string;
  description: string;
  requirements: string[];
  documents: string[];
  financialRequirement: string;
  officialLink: string;
}

interface SeedLinkData {
  title: string;
  url: string;
  type: string;
  language: string;
}

interface SeedStepData {
  order: number;
  title: string;
  description: string;
  status: string;
  visaType: string;
  documents: string[];
  officialLink: string;
}

interface SeedCountryConfig {
  slug: string;
  name: string;
  nameEn: string;
  codeISO2: string;
  codeISO3: string;
  region: string;
  capital: string;
  currency: string;
  languages: string[];
  flagUrl: string;
  overallScore: number;
  visa: SeedVisaData;
  links: SeedLinkData[];
  steps: SeedStepData[];
}

const seedCountries: SeedCountryConfig[] = [
  {
    slug: "canada",
    name: "Canadá",
    nameEn: "Canada",
    codeISO2: "CA",
    codeISO3: "CAN",
    region: "North America",
    capital: "Ottawa",
    currency: "CAD",
    languages: ["en", "fr"],
    flagUrl: "https://flagcdn.com/w320/ca.png",
    overallScore: 88.5,
    visa: {
      name: "Express Entry - Federal Skilled Worker",
      type: "work",
      description: "O Express Entry é o principal sistema canadense para atrair profissionais qualificados de todo o mundo de forma rápida e permanente.",
      requirements: [
        "Proficiência comprovada em inglês ou francês (nível mínimo CLB 7)",
        "Pelo menos 1 ano de experiência de trabalho contínua e qualificada",
        "Avaliação de Credenciais de Educação (ECA) para diplomas não-canadenses"
      ],
      documents: ["Passaporte", "Exame de Idioma", "Relatório ECA", "Atestado de Antecedentes Criminais", "Comprovante de Fundos"],
      financialRequirement: "Fundos mínimos de assentamento de aprox. $14,000 CAD para o aplicante principal.",
      officialLink: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html"
    },
    links: [
      { title: "Portal Oficial IRCC", url: "https://www.canada.ca/en/immigration-refugees-citizenship.html", type: "immigration", language: "en" },
      { title: "Consulado Geral do Canadá no Brasil", url: "https://www.canadainternational.gc.ca/brazil-bresil/", type: "consulate", language: "pt" },
      { title: "Embaixada do Canadá", url: "https://www.international.gc.ca/country-pays/brazil-bresil/", type: "embassy", language: "pt" }
    ],
    steps: [
      { order: 1, title: "Avaliação de Elegibilidade e Teste de Idioma", description: "Verifique se pontua no sistema FSW (mínimo 67/100) e realize um exame de idioma aceito (IELTS ou CELPIP).", status: "not_started", visaType: "Express Entry", documents: ["Passaporte", "Exame de Idioma"], officialLink: "https://www.canada.ca/" },
      { order: 2, title: "Obtenção de Relatório ECA", description: "Envie seus diplomas para uma instituição designada (como WES) para obter a equivalência canadense.", status: "not_started", visaType: "Express Entry", documents: ["Diplomas e Históricos"], officialLink: "https://www.wes.org/ca/" },
      { order: 3, title: "Criação de Perfil no Pool", description: "Crie a sua conta no portal do IRCC e submeta o seu perfil com as suas pontuações do CRS (Comprehensive Ranking System).", status: "not_started", visaType: "Express Entry", documents: ["ECA", "IELTS"], officialLink: "https://www.canada.ca/" },
      { order: 4, title: "Recebimento do Convite para Aplicar (ITA)", description: "Aguarde os sorteios periódicos do pool. Ao atingir a nota de corte, você receberá o ITA para enviar o pedido completo.", status: "not_started", visaType: "Express Entry", documents: ["Atestados Médicos", "Antecedentes"], officialLink: "https://www.canada.ca/" },
      { order: 5, title: "Desembarque no Canadá", description: "Após aprovação do visto de residência permanente, realize o desembarque (landing) no Canadá para receber seu PR Card.", status: "not_started", visaType: "Express Entry", documents: ["COPR (Confirmation of PR)"], officialLink: "https://www.canada.ca/" }
    ]
  },
  {
    slug: "portugal",
    name: "Portugal",
    nameEn: "Portugal",
    codeISO2: "PT",
    codeISO3: "PRT",
    region: "Europe",
    capital: "Lisboa",
    currency: "EUR",
    languages: ["pt"],
    flagUrl: "https://flagcdn.com/w320/pt.png",
    overallScore: 84.2,
    visa: {
      name: "Visto D7 - Rendimentos Próprios",
      type: "retirement",
      description: "Destinado a aposentados, pensionistas e pessoas que possuem rendimentos passivos comprovados de bens móveis, imóveis ou propriedade intelectual.",
      requirements: [
        "Comprovante de rendimentos passivos mínimos anuais de €9,840 para o aplicante principal",
        "NIF português e conta bancária aberta em Portugal com saldo depositado",
        "Contrato de arrendamento de longo prazo ou comprovativo de alojamento"
      ],
      documents: ["Passaporte", "Comprovante de Rendimentos", "Contrato de Aluguel", "NIF", "Seguro de Viagem"],
      financialRequirement: "Mínimo de €9,840 anuais para o titular, €4,920 para o segundo adulto e €2,952 por criança.",
      officialLink: "https://vistos.mne.gov.pt/pt/vistos-nacionais/documentacao-instrutoria/residencia-para-reformados-religiosos-e-pessoas-com-rendimentos"
    },
    links: [
      { title: "Portal de Vistos do MNE", url: "https://vistos.mne.gov.pt/", type: "immigration", language: "pt" },
      { title: "Consulado Geral de Portugal", url: "https://consuladoportugalsp.org.br/", type: "consulate", language: "pt" },
      { title: "Portal de Serviços Públicos de Portugal", url: "https://eportugal.gov.pt/", type: "embassy", language: "pt" }
    ],
    steps: [
      { order: 1, title: "Obtenção do NIF e Abertura de Conta Bancária", description: "Solicite o seu NIF (Número de Identificação Fiscal) e abra uma conta bancária em Portugal por meio de procuração ou pessoalmente.", status: "not_started", visaType: "Visto D7", documents: ["Passaporte", "Comprovativo de Endereço"], officialLink: "https://eportugal.gov.pt/" },
      { order: 2, title: "Arrendamento de Imóvel", description: "Garanta uma morada física estável em Portugal através de um contrato de arrendamento mínimo de 12 meses.", status: "not_started", visaType: "Visto D7", documents: ["Contrato de Arrendamento"], officialLink: "https://www.idealista.pt/" },
      { order: 3, title: "Submissão de Visto no País de Origem", description: "Agende e entregue toda a documentação comprobatória e formulários no consulado de Portugal no seu país de residência.", status: "not_started", visaType: "Visto D7", documents: ["Extratos Bancários", "NIF", "Antecedentes Criminais"], officialLink: "https://vistos.mne.gov.pt/" },
      { order: 4, title: "Entrevista no AIMA/SEF", description: "Ao chegar em Portugal com o visto de curta duração, compareça ao agendamento no órgão de imigração para coletar dados biométricos.", status: "not_started", visaType: "Visto D7", documents: ["Visto no Passaporte", "Comprovantes de Entrada"], officialLink: "https://aima.gov.pt/" },
      { order: 5, title: "Retirada da Autorização de Residência", description: "Após a aprovação na entrevista, aguarde o envio postal do seu cartão físico de residência temporária válido por 2 anos.", status: "not_started", visaType: "Visto D7", documents: ["Passaporte", "Taxa Paga"], officialLink: "https://aima.gov.pt/" }
    ]
  },
  {
    slug: "germany",
    name: "Alemanha",
    nameEn: "Germany",
    codeISO2: "DE",
    codeISO3: "DEU",
    region: "Europe",
    capital: "Berlim",
    currency: "EUR",
    languages: ["de"],
    flagUrl: "https://flagcdn.com/w320/de.png",
    overallScore: 86.9,
    visa: {
      name: "Chancenkarte - Opportunity Card",
      type: "work",
      description: "O novo sistema baseado em pontos da Alemanha que permite a profissionais qualificados entrarem no país para buscar emprego.",
      requirements: [
        "Diploma universitário ou qualificação técnica equivalente reconhecida na Alemanha",
        "Nível B1 de Alemão ou B2 de Inglês",
        "Atingir pelo menos 6 pontos na tabela de qualificação (idade, idioma, experiência)"
      ],
      documents: ["Passaporte", "Diploma Reconhecido", "Certificado de Idioma", "Conta Bloqueada", "Curriculum Vitae"],
      financialRequirement: "Comprovação de meios de subsistência de pelo menos €12,300 em uma conta bloqueada (Blocked Account).",
      officialLink: "https://www.make-it-in-germany.com/en/visa-residence/types/opportunity-card"
    },
    links: [
      { title: "Portal Make it in Germany", url: "https://www.make-it-in-germany.com/", type: "immigration", language: "en" },
      { title: "Embaixada e Consulados da Alemanha no Brasil", url: "https://brasil.diplo.de/", type: "consulate", language: "pt" },
      { title: "Portal Anabin (Reconhecimento de Diplomas)", url: "https://anabin.kmk.org/", type: "immigration", language: "de" }
    ],
    steps: [
      { order: 1, title: "Reconhecimento de Ocupação e Diploma", description: "Verifique no banco de dados Anabin se seu diploma estrangeiro é classificado como equivalente (H+).", status: "not_started", visaType: "Chancenkarte", documents: ["Diploma Universitário"], officialLink: "https://anabin.kmk.org/" },
      { order: 2, title: "Abertura de Conta Bloqueada", description: "Crie uma conta em provedores autorizados (como Fintiba ou Expatrio) e deposite o valor exigido pelo governo alemão.", status: "not_started", visaType: "Chancenkarte", documents: ["Passaporte", "Comprovante Financeiro"], officialLink: "https://www.fintiba.com/" },
      { order: 3, title: "Cálculo de Pontos e Agendamento", description: "Reúna comprovantes de proficiência de idiomas e experiência para somar 6 pontos e agende o visto no Consulado.", status: "not_started", visaType: "Chancenkarte", documents: ["Formulário Consular", "Certificado de Idiomas"], officialLink: "https://brasil.diplo.de/" },
      { order: 4, title: "Viagem e Registro de Endereço (Anmeldung)", description: "Após chegada na Alemanha, registre seu endereço residencial na prefeitura local (Bürgeramt) para receber seu ID de impostos.", status: "not_started", visaType: "Chancenkarte", documents: ["Contrato de Aluguel", "Passaporte"], officialLink: "https://www.berlin.de/" },
      { order: 5, title: "Busca de Vaga e Conversão de Visto", description: "Utilize o prazo de 1 ano para encontrar um emprego qualificado de tempo integral e converta o Chancenkarte em visto de trabalho regular.", status: "not_started", visaType: "Chancenkarte", documents: ["Contrato de Trabalho"], officialLink: "https://www.make-it-in-germany.com/" }
    ]
  },
  {
    slug: "ireland",
    name: "Irlanda",
    nameEn: "Ireland",
    codeISO2: "IE",
    codeISO3: "IRL",
    region: "Europe",
    capital: "Dublin",
    currency: "EUR",
    languages: ["en"],
    flagUrl: "https://flagcdn.com/w320/ie.png",
    overallScore: 82.5,
    visa: {
      name: "Critical Skills Employment Permit",
      type: "work",
      description: "Permissão de trabalho destinada a atrair profissionais altamente qualificados para setores com escassez crítica de mão de obra na Irlanda.",
      requirements: [
        "Oferta de emprego elegível com duração mínima de 2 anos na lista de Profissões Críticas",
        "Salário mínimo de €32,000 ou €64,000 dependendo do nível de qualificação e ocupação",
        "Diploma universitário relevante para a função proposta"
      ],
      documents: ["Passaporte", "Contrato de Trabalho", "Diploma", "Certificado de Patrocínio da Empresa"],
      financialRequirement: "Contrato de trabalho com salário compatível; não exige fundos de bloqueio extras.",
      officialLink: "https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/permit-types/critical-skills-employment-permit/"
    },
    links: [
      { title: "Irish Immigration Service", url: "https://www.irishimmigration.ie/", type: "immigration", language: "en" },
      { title: "Department of Enterprise, Trade and Employment", url: "https://enterprise.gov.ie/", type: "immigration", language: "en" },
      { title: "Embaixada da Irlanda", url: "https://www.dfa.ie/irish-embassy/brazil/", type: "embassy", language: "pt" }
    ],
    steps: [
      { order: 1, title: "Busca de Vagas na Critical Skills List", description: "Candidate-se e obtenha uma oferta de trabalho em um cargo listado na Critical Skills List da Irlanda.", status: "not_started", visaType: "Critical Skills", documents: ["Currículo", "Cartas de Apresentação"], officialLink: "https://enterprise.gov.ie/" },
      { order: 2, title: "Submissão da Permissão de Trabalho", description: "O empregador ou o candidato submete a petição online no sistema EPOS e paga a taxa de processamento de €1,000.", status: "not_started", visaType: "Critical Skills", documents: ["Contrato de Trabalho", "Histórico Profissional"], officialLink: "https://epos.djei.ie/" },
      { order: 3, title: "Solicitação de Visto de Entrada", description: "Se você for nacional de um país que exige visto de entrada (como Índia), submeta o pedido online no portal AVATS.", status: "not_started", visaType: "Critical Skills", documents: ["Passaporte", "Permissão Emitida"], officialLink: "https://www.irishimmigration.ie/" },
      { order: 4, title: "Registro e Emissão do IRP Card", description: "Após chegada na Irlanda, agende um horário na imigração para coletar biometria e obter o cartão de residência (IRP).", status: "not_started", visaType: "Critical Skills", documents: ["Passaporte", "Carta de Permissão", "Contrato"], officialLink: "https://www.irishimmigration.ie/" },
      { order: 5, title: "PPS Number e Registro de Impostos", description: "Solicite o PPS Number junto ao governo irlandês para se registrar no órgão de arrecadação de impostos (Revenue).", status: "not_started", visaType: "Critical Skills", documents: ["IRP Card", "Comprovante de Endereço"], officialLink: "https://www.gov.ie/" }
    ]
  },
  {
    slug: "netherlands",
    name: "Holanda",
    nameEn: "Netherlands",
    codeISO2: "NL",
    codeISO3: "NLD",
    region: "Europe",
    capital: "Amsterdã",
    currency: "EUR",
    languages: ["nl"],
    flagUrl: "https://flagcdn.com/w320/nl.png",
    overallScore: 87.1,
    visa: {
      name: "Highly Skilled Migrant Visa",
      type: "work",
      description: "Destinado a profissionais estrangeiros com talentos e qualificações específicas contratados por empresas holandesas reconhecidas.",
      requirements: [
        "Oferta de emprego com um empregador reconhecido pela IND (órgão de imigração)",
        "Salário que atenda aos patamares mínimos exigidos anualmente (ex: €5,331 mensais para maiores de 30 anos)",
        "Contrato de trabalho ou termo de nomination assinado"
      ],
      documents: ["Passaporte", "Contrato de Trabalho", "Declaração de Antecedentes Criminais", "Diploma"],
      financialRequirement: "Comprovação de salário mensal mínimo de acordo com a idade nos moldes estipulados pela IND.",
      officialLink: "https://ind.nl/en/work/working-as-a-highly-skilled-migrant"
    },
    links: [
      { title: "IND - Immigratie- en Naturalisatiedienst", url: "https://ind.nl/en", type: "immigration", language: "en" },
      { title: "Embaixada e Consulados dos Países Baixos", url: "https://www.holandaevoce.nl/", type: "consulate", language: "pt" },
      { title: "Portal de Empregos da Holanda", url: "https://www.werk.nl/", type: "immigration", language: "nl" }
    ],
    steps: [
      { order: 1, title: "Obtenção de Contrato Patrocinado", description: "Consiga um contrato de trabalho com um empregador que seja patrocinador reconhecido pela IND na Holanda.", status: "not_started", visaType: "Highly Skilled Migrant", documents: ["Contrato de Trabalho"], officialLink: "https://ind.nl/en/public-register-recognised-sponsors" },
      { order: 2, title: "Aplicação do Visto pela Empresa (TEV)", description: "A empresa iniciará o processo de visto de entrada (MVV) e permissão de residência diretamente com a IND holandesa.", status: "not_started", visaType: "Highly Skilled Migrant", documents: ["Formulários IND"], officialLink: "https://ind.nl/" },
      { order: 3, title: "Retirada do MVV no Consulado", description: "Após a aprovação provisória da IND, agende e compareça ao consulado da Holanda no seu país de origem para colar o adesivo MVV no passaporte.", status: "not_started", visaType: "Highly Skilled Migrant", documents: ["Passaporte", "Carta de Aprovação IND"], officialLink: "https://www.holandaevoce.nl/" },
      { order: 4, title: "Registro Municipal (BSN)", description: "Ao desembarcar na Holanda, realize seu registro no conselho municipal da prefeitura local para obter o seu número BSN de impostos.", status: "not_started", visaType: "Highly Skilled Migrant", documents: ["Contrato de Trabalho", "Certidão de Nascimento Traduzida"], officialLink: "https://www.amsterdam.nl/" },
      { order: 5, title: "Coleta do Cartão de Residência", description: "Agende uma visita ao escritório da IND para tirar suas impressões digitais, foto e coletar o cartão de residência física de 5 anos.", status: "not_started", visaType: "Highly Skilled Migrant", documents: ["Passaporte", "Confirmação de Registro"], officialLink: "https://ind.nl/" }
    ]
  },
  {
    slug: "australia",
    name: "Austrália",
    nameEn: "Australia",
    codeISO2: "AU",
    codeISO3: "AUS",
    region: "Oceania",
    capital: "Camberra",
    currency: "AUD",
    languages: ["en"],
    flagUrl: "https://flagcdn.com/w320/au.png",
    overallScore: 89.0,
    visa: {
      name: "Skilled Independent Visa (Subclass 189)",
      type: "work",
      description: "Um visto de residência permanente baseado em pontos para profissionais estrangeiros que não possuem patrocínio de estado, território ou empregador.",
      requirements: [
        "Profissão listada na Skilled Occupation List (SOL)",
        "Avaliação de habilidades profissional positiva por um órgão avaliador oficial",
        "Pontuação mínima de 65 pontos no teste de imigração australiano"
      ],
      documents: ["Passaporte", "Skills Assessment", "Certificado IELTS/PTE", "Diplomas", "Histórico de Emprego"],
      financialRequirement: "Fundos suficientes para se manter até a inserção no mercado de trabalho.",
      officialLink: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189"
    },
    links: [
      { title: "Department of Home Affairs", url: "https://immi.homeaffairs.gov.au/", type: "immigration", language: "en" },
      { title: "Consulado Geral da Austrália", url: "https://brazil.embassy.gov.au/", type: "consulate", language: "pt" },
      { title: "SkillSelect Portal", url: "https://immi.homeaffairs.gov.au/visas/working-in-australia/skillselect", type: "immigration", language: "en" }
    ],
    steps: [
      { order: 1, title: "Verificação da Lista de Profissões", description: "Certifique-se de que a sua ocupação acadêmica ou técnica está na lista oficial de ocupações elegíveis.", status: "not_started", visaType: "Subclass 189", documents: ["Currículo"], officialLink: "https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list" },
      { order: 2, title: "Skills Assessment e Teste de Inglês", description: "Submeta seu histórico de trabalho e qualificações para a autoridade avaliadora da Austrália e faça um exame de inglês.", status: "not_started", visaType: "Subclass 189", documents: ["Histórico Escolar", "IELTS/PTE", "Cartas de Referência"], officialLink: "https://immi.homeaffairs.gov.au/" },
      { order: 3, title: "Submissão de Manifestação de Interesse (EOI)", description: "Crie a sua petição no portal SkillSelect detalhando seus pontos de idade, qualificações e idiomas falados.", status: "not_started", visaType: "Subclass 189", documents: ["Skills Assessment", "Inglês"], officialLink: "https://immi.homeaffairs.gov.au/visas/working-in-australia/skillselect" },
      { order: 4, title: "Recebimento do ITA e Envio de Visto", description: "Se selecionado no pool, você tem 60 dias para formalizar o pedido de visto no portal ImmiAccount.", status: "not_started", visaType: "Subclass 189", documents: ["Antecedentes Criminais", "Exames Médicos"], officialLink: "https://online.immi.homeaffairs.gov.au/" },
      { order: 5, title: "Concessão do Visto e Mudança", description: "Aguarde a decisão final do governo. Após a concessão, mude-se para a Austrália com todos os privilégios de residente permanente.", status: "not_started", visaType: "Subclass 189", documents: ["Visto Grant Letter"], officialLink: "https://immi.homeaffairs.gov.au/" }
    ]
  },
  {
    slug: "new-zealand",
    name: "Nova Zelândia",
    nameEn: "New Zealand",
    codeISO2: "NZ",
    codeISO3: "NZL",
    region: "Oceania",
    capital: "Wellington",
    currency: "NZD",
    languages: ["en", "mi"],
    flagUrl: "https://flagcdn.com/w320/nz.png",
    overallScore: 87.8,
    visa: {
      name: "Accredited Employer Work Visa (AEWV)",
      type: "work",
      description: "O visto temporário de trabalho padrão da Nova Zelândia, focado em associar trabalhadores qualificados estrangeiros a empregadores licenciados no país.",
      requirements: [
        "Oferta de trabalho de um empregador neozelandês que seja credenciado junto à Imigração",
        "Salário mínimo equivalente à taxa de mercado mediana local",
        "Qualificações e/ou experiência prática de trabalho condizentes com a vaga ofertada"
      ],
      documents: ["Passaporte", "Contrato de Emprego", "Job Check aprovado pelo governo", "Atestados Médicos", "Antecedentes"],
      financialRequirement: "Salário de oferta de emprego que deve atingir o patamar neozelandês aceito por hora.",
      officialLink: "https://www.immigration.govt.nz/new-zealand-visas/visas/visa/accredited-employer-work-visa"
    },
    links: [
      { title: "Immigration New Zealand", url: "https://www.immigration.govt.nz/", type: "immigration", language: "en" },
      { title: "Consulado Geral da Nova Zelândia", url: "https://www.mfat.govt.nz/en/countries-and-regions/americas/brazil/", type: "consulate", language: "en" },
      { title: "Careers New Zealand", url: "https://www.careers.govt.nz/", type: "immigration", language: "en" }
    ],
    steps: [
      { order: 1, title: "Busca de Vagas com Empregador Credenciado", description: "Encontre um emprego e certifique-se de que a empresa contratante possui o credenciamento de contratação estrangeira na imigração.", status: "not_started", visaType: "AEWV", documents: ["Currículo"], officialLink: "https://www.immigration.govt.nz/" },
      { order: 2, title: "Aprovação do Job Check pelo Empregador", description: "A empresa contratante deve passar pela etapa de teste de mercado (Job Check) para comprovar a falta de nacionais para a vaga.", status: "not_started", visaType: "AEWV", documents: ["Evidência de Busca Local"], officialLink: "https://www.immigration.govt.nz/" },
      { order: 3, title: "Aplicação do Visto Online", description: "Após receber o convite para aplicar do empregador, preencha o formulário e faça o upload de seus comprovantes acadêmicos e profissionais.", status: "not_started", visaType: "AEWV", documents: ["Contrato de Trabalho", "Laudo Médico"], officialLink: "https://www.immigration.govt.nz/new-zealand-visas/apply-for-a-visa" },
      { order: 4, title: "Decisão do Pedido e Viagem", description: "Aguarde a análise online. Ao ser aprovado, prepare as passagens aéreas e viaje dentro do prazo indicado no visto digital (e-Visa).", status: "not_started", visaType: "AEWV", documents: ["e-Visa"], officialLink: "https://www.immigration.govt.nz/" },
      { order: 5, title: "Emissão de IRD Number e Abertura de Conta", description: "Chegando à Nova Zelândia, solicite o seu IRD (código fiscal) e abra uma conta bancária local para receber seus salários.", status: "not_started", visaType: "AEWV", documents: ["Comprovante de Residência", "Passaporte"], officialLink: "https://www.ird.govt.nz/" }
    ]
  },
  {
    slug: "spain",
    name: "Espanha",
    nameEn: "Spain",
    codeISO2: "ES",
    codeISO3: "ESP",
    region: "Europe",
    capital: "Madri",
    currency: "EUR",
    languages: ["es"],
    flagUrl: "https://flagcdn.com/w320/es.png",
    overallScore: 83.0,
    visa: {
      name: "Digital Nomad Visa (Teletrabajo Internacional)",
      type: "work",
      description: "Permite a profissionais estrangeiros residirem na Espanha trabalhando de forma remota para empresas sediadas fora do território espanhol.",
      requirements: [
        "Comprovar que trabalha remotamente de forma estável para empresas estrangeiras por pelo menos 3 meses",
        "Diploma de ensino superior ou comprovação de pelo menos 3 anos de experiência laboral relevante",
        "Renda mensal mínima de pelo menos 200% do salário mínimo espanhol (aprox. €2,640 mensais)"
      ],
      documents: ["Passaporte", "Contrato de Prestação de Serviços ou CLT", "Certificado de Idioma/Diplomas", "Seguro de Saúde Privado"],
      financialRequirement: "Rendimento estável de €31,680 anuais para o solicitante principal.",
      officialLink: "https://www.exteriores.gob.es/Consulados/saopaulo/es/ServiciosConsulares/Paginas/index.aspx"
    },
    links: [
      { title: "Portal de Inmigración de España", url: "https://extranjeros.inclusion.gob.es/", type: "immigration", language: "es" },
      { title: "Consulado Geral da Espanha", url: "https://www.exteriores.gob.es/Consulados/saopaulo/", type: "consulate", language: "es" },
      { title: "UGE - Unidad de Grandes Empresas", url: "https://extranjeros.inclusion.gob.es/es/UnidadGrandesEmpresas/", type: "immigration", language: "es" }
    ],
    steps: [
      { order: 1, title: "Obtenção do NIE e Formulário do Seguro", description: "Solicite o NIE (Número de Identidad de Extranjero) junto ao Consulado e contrate um seguro médico privado espanhol sem coparticipação.", status: "not_started", visaType: "Nômade Digital", documents: ["Passaporte", "Formulário NIE"], officialLink: "https://www.exteriores.gob.es/" },
      { order: 2, title: "Comprovação de Trabalho Remoto", description: "Consiga cartas timbradas da empresa atestando a autorização de trabalho remoto na Espanha e comprove faturamento mínimo.", status: "not_started", visaType: "Nômade Digital", documents: ["Contrato Social", "Carta da Empresa", "Extratos Bancários"], officialLink: "https://www.exteriores.gob.es/" },
      { order: 3, title: "Submissão Consular ou de Residência", description: "Envie os documentos via Consulado no Brasil (visto de 1 ano) ou aplique diretamente na Espanha através da UGE (permissão de 3 anos).", status: "not_started", visaType: "Nômade Digital", documents: ["Ficha de Inscrição", "Taxa Modelo 790"], officialLink: "https://extranjeros.inclusion.gob.es/" },
      { order: 4, title: "Entrada na Espanha e Empadronamiento", description: "Chegando à Espanha, registre a sua moradia oficial na prefeitura local (Ayuntamiento) para obter o Certificado de Empadronamiento.", status: "not_started", visaType: "Nômade Digital", documents: ["Contrato de Aluguel", "Passaporte"], officialLink: "https://www.madrid.es/" },
      { order: 5, title: "Coleta do Cartão TIE", description: "Agende a emissão do cartão físico na polícia nacional (Toma de Huellas) para receber a sua Tarjeta de Identidad de Extranjero.", status: "not_started", visaType: "Nômade Digital", documents: ["Empadronamiento", "Foto", "Taxa de Polícia"], officialLink: "https://www.policia.es/" }
    ]
  },
  {
    slug: "united-states",
    name: "Estados Unidos",
    nameEn: "United States",
    codeISO2: "US",
    codeISO3: "USA",
    region: "North America",
    capital: "Washington D.C.",
    currency: "USD",
    languages: ["en"],
    flagUrl: "https://flagcdn.com/w320/us.png",
    overallScore: 85.0,
    visa: {
      name: "EB-2 NIW - National Interest Waiver",
      type: "work",
      description: "Permite que profissionais altamente qualificados obtenham residência permanente (Green Card) nos EUA sem necessidade de oferta de emprego formal.",
      requirements: [
        "Possuir grau acadêmico avançado (Mestrado/Doutorado) ou Bacharelado com mais de 5 anos de experiência progressiva",
        "Demonstrar que sua atuação profissional proposta tem mérito substancial e importância nacional para os EUA",
        "Apresentar plano de negócios detalhado que comprove o impacto positivo para a economia ou sociedade americana"
      ],
      documents: ["Passaporte", "Diplomas Traduzidos", "Cartas de Recomendação", "Plano de Negócios (Business Plan)", "Petições I-140"],
      financialRequirement: "Sem fundos de poupança bloqueados obrigatórios; no entanto, custos advocatícios e taxas consulares podem passar de $10,000 USD.",
      officialLink: "https://www.uscis.gov/working-in-the-united-states/permanent-workers/employment-based-immigration-second-preference-eb-2"
    },
    links: [
      { title: "USCIS Portal Oficial", url: "https://www.uscis.gov/", type: "immigration", language: "en" },
      { title: "Embaixada e Consulados dos EUA no Brasil", url: "https://br.usembassy.gov/pt/", type: "consulate", language: "pt" },
      { title: "Visa Bulletins (Calendário de Vistos)", url: "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html", type: "immigration", language: "en" }
    ],
    steps: [
      { order: 1, title: "Montagem da Petição Técnica", description: "Reúna as cartas de recomendação de colegas da indústria, diplomas acadêmicos avaliados por consultoria americana e escreva a petição jurídica.", status: "not_started", visaType: "EB-2 NIW", documents: ["Diplomas", "Cartas de Recomendação"], officialLink: "https://www.uscis.gov/" },
      { order: 2, title: "Envio do Formulário I-140 para o USCIS", description: "Submeta o Formulário I-140 de trabalhador imigrante com todas as evidências de importância nacional do seu plano de atuação profissional.", status: "not_started", visaType: "EB-2 NIW", documents: ["Formulário I-140", "Taxa de Análise"], officialLink: "https://www.uscis.gov/" },
      { order: 3, title: "Acompanhamento do Visa Bulletin", description: "Monitore a data de prioridade de corte no boletim de vistos do Departamento de Estado para saber quando sua petição será elegível para processamento final.", status: "not_started", visaType: "EB-2 NIW", documents: ["Carta de Aprovação I-797"], officialLink: "https://travel.state.gov/" },
      { order: 4, title: "Processamento Consular (NVC)", description: "Ao receber o sinal verde da data de prioridade, preencha o Formulário DS-260, envie os documentos civis e pague as taxas de visto.", status: "not_started", visaType: "EB-2 NIW", documents: ["Formulário DS-260", "Exames Médicos do Painel"], officialLink: "https://travel.state.gov/" },
      { order: 5, title: "Entrevista Consular e Green Card", description: "Compareça ao Consulado Americano para a entrevista final. Ao ser aprovado, você receberá o visto de entrada e o Green Card será emitido após a chegada.", status: "not_started", visaType: "EB-2 NIW", documents: ["Passaporte", "Envelope Consular Selado"], officialLink: "https://br.usembassy.gov/" }
    ]
  },
  {
    slug: "united-kingdom",
    name: "Reino Unido",
    nameEn: "United Kingdom",
    codeISO2: "GB",
    codeISO3: "GBR",
    region: "Europe",
    capital: "Londres",
    currency: "GBP",
    languages: ["en"],
    flagUrl: "https://flagcdn.com/w320/gb.png",
    overallScore: 84.8,
    visa: {
      name: "Skilled Worker Visa",
      type: "work",
      description: "Permite a profissionais estrangeiros residirem e trabalharem de forma legal no Reino Unido a convite de uma empresa patrocinadora licenciada.",
      requirements: [
        "Oferta de emprego elegível com Certificado de Patrocínio (CoS) emitido pelo Home Office",
        "Nível B1 de Proficiência em Inglês aprovado pelo SELT (Secure English Language Test)",
        "Salário mínimo de acordo com a vaga (mínimo geral anual de £38,700)"
      ],
      documents: ["Passaporte", "Certificado de Patrocínio (CoS)", "Certificado de Inglês SELT", "Comprovante de Fundos Pessoais"],
      financialRequirement: "Salário anual superior a £38,700 ou de acordo com a ocupação. Além disso, pelo menos £1,270 em conta pessoal (a menos que a empresa dê garantia).",
      officialLink: "https://www.gov.uk/skilled-worker-visa"
    },
    links: [
      { title: "GOV.UK Visas and Immigration", url: "https://www.gov.uk/browse/visas-immigration", type: "immigration", language: "en" },
      { title: "Home Office Sponsoring Register", url: "https://www.gov.uk/government/publications/register-of-licensed-sponsors-workers", type: "immigration", language: "en" },
      { title: "Embaixada do Reino Unido no Brasil", url: "https://www.gov.uk/world/organisations/british-embassy-brazil.pt", type: "consulate", language: "pt" }
    ],
    steps: [
      { order: 1, title: "Obtenção do Certificado de Patrocínio (CoS)", description: "Candidate-se a vagas elegíveis e receba a aprovação de patrocínio e o código de referência CoS da empresa contratante.", status: "not_started", visaType: "Skilled Worker", documents: ["Contrato de Trabalho"], officialLink: "https://www.gov.uk/" },
      { order: 2, title: "Realização do Teste de Inglês SELT", description: "Agende e seja aprovado em um centro de idiomas autorizado pelo Home Office no exame de proficiência exigido.", status: "not_started", visaType: "Skilled Worker", documents: ["Passaporte", "Exame de Inglês"], officialLink: "https://www.ieltsessentials.com/" },
      { order: 3, title: "Submissão Online do Pedido", description: "Preencha o formulário eletrônico no portal oficial GOV.UK e efetue o pagamento da taxa do IHS (Immigration Health Surcharge).", status: "not_started", visaType: "Skilled Worker", documents: ["CoS", "SELT Score"], officialLink: "https://www.gov.uk/apply-to-come-to-the-uk" },
      { order: 4, title: "Coleta de Biometria Consular", description: "Agende a sua biometria em centros autorizados de visto (como VFS Global) para colher fotos e impressões digitais.", status: "not_started", visaType: "Skilled Worker", documents: ["Passaporte", "Comprovante de Agendamento"], officialLink: "https://www.vfsglobal.co.uk/" },
      { order: 5, title: "Emissão de Visto e Retirada do BRP", description: "Viaje para o Reino Unido no prazo inicial e compareça ao posto dos correios (Post Office) designado para retirar o seu cartão BRP definitivo.", status: "not_started", visaType: "Skilled Worker", documents: ["Passaporte com Vignette", "Carta de Decisão"], officialLink: "https://www.gov.uk/" }
    ]
  },
  {
    slug: "france",
    name: "França",
    nameEn: "France",
    codeISO2: "FR",
    codeISO3: "FRA",
    region: "Europe",
    capital: "Paris",
    currency: "EUR",
    languages: ["fr"],
    flagUrl: "https://flagcdn.com/w320/fr.png",
    overallScore: 83.5,
    visa: {
      name: "Passeport Talent - Salarié Qualifié",
      type: "work",
      description: "O visto francês simplificado para profissionais internacionais qualificados que desejam trabalhar em cargos de alta especialização na França.",
      requirements: [
        "Contrato de trabalho em empresa francesa com duração superior a 3 meses",
        "Diploma de graduação equivalente a nível Master francês ou superior",
        "Salário bruto anual de pelo menos 1.8 vezes o SMIC mínimo (aprox. €41,000)"
      ],
      documents: ["Passaporte", "Contrato de Trabalho Cerfa", "Diploma de Master", "Curriculum Vitae", "Certidão de Casamento/Nascimento Traduzida"],
      financialRequirement: "Salário anual bruto mínimo correspondente a aprox. €41,000.",
      officialLink: "https://france-visas.gouv.fr/en/web/france-visas/international-talents"
    },
    links: [
      { title: "France-Visas Portal", url: "https://france-visas.gouv.fr/", type: "immigration", language: "en" },
      { title: "Consulado Geral da França", url: "https://saopaulo.consulfrance.org/", type: "consulate", language: "pt" },
      { title: "Service-Public France", url: "https://www.service-public.fr/", type: "embassy", language: "fr" }
    ],
    steps: [
      { order: 1, title: "Obtenção do Contrato e Formulário Cerfa", description: "Consiga a vaga e assine o contrato de trabalho contendo o preenchimento do formulário oficial Cerfa do Passeport Talent pela empresa.", status: "not_started", visaType: "Passeport Talent", documents: ["Contrato de Trabalho"], officialLink: "https://france-visas.gouv.fr/" },
      { order: 2, title: "Registro e Inscrição no France-Visas", description: "Crie a sua petição eletrônica no portal de imigração do governo da França e emita a guia de taxas consulares.", status: "not_started", visaType: "Passeport Talent", documents: ["Formulários France-Visas"], officialLink: "https://france-visas.gouv.fr/" },
      { order: 3, title: "Agendamento no Consulado", description: "Marque um horário presencial na representação diplomática francesa ou centro de vistos e entregue os dossiês traduzidos.", status: "not_started", visaType: "Passeport Talent", documents: ["Passaporte", "Diplomas", "Fotos"], officialLink: "https://france-visas.gouv.fr/" },
      { order: 4, title: "Validação do Visto VLS-TS", description: "Após receber o visto provisório e viajar para a França, valide o seu e-visto no portal da OFII nas primeiras semanas de moradia.", status: "not_started", visaType: "Passeport Talent", documents: ["Visto de Entrada", "Passaporte"], officialLink: "https://administration-etrangers-en-france.interieur.gouv.fr/" },
      { order: 5, title: "Coleta do Título de Residência", description: "Agende a sua visita na prefeitura (Préfecture) do seu departamento municipal de moradia para retirar o cartão de residente permanente.", status: "not_started", visaType: "Passeport Talent", documents: ["Validação OFII", "Taxas de Selo"], officialLink: "https://www.service-public.fr/" }
    ]
  }
];

// 9 países adicionais para fechar os 20 países do seed
const additionalCountries = [
  { slug: "belgium", name: "Bélgica", nameEn: "Belgium", codeISO2: "BE", codeISO3: "BEL", region: "Europe", capital: "Bruxelas", currency: "EUR", languages: ["nl", "fr", "de"], flagUrl: "https://flagcdn.com/w320/be.png", overallScore: 82.0, visaName: "Single Permit", visaType: "work", officialLink: "https://dofi.ibz.be/" },
  { slug: "switzerland", name: "Suíça", nameEn: "Switzerland", codeISO2: "CH", codeISO3: "CHE", region: "Europe", capital: "Berna", currency: "CHF", languages: ["de", "fr", "it", "rm"], flagUrl: "https://flagcdn.com/w320/ch.png", overallScore: 91.5, visaName: "Third-State National Work Permit", visaType: "work", officialLink: "https://www.sem.admin.ch/" },
  { slug: "norway", name: "Noruega", nameEn: "Norway", codeISO2: "NO", codeISO3: "NOR", region: "Europe", capital: "Oslo", currency: "NOK", languages: ["no"], flagUrl: "https://flagcdn.com/w320/no.png", overallScore: 90.0, visaName: "Skilled Worker Residence Permit", visaType: "work", officialLink: "https://www.udi.no/" },
  { slug: "sweden", name: "Suécia", nameEn: "Sweden", codeISO2: "SE", codeISO3: "SWE", region: "Europe", capital: "Estocolmo", currency: "SEK", languages: ["sv"], flagUrl: "https://flagcdn.com/w320/se.png", overallScore: 88.0, visaName: "Swedish Work Permit", visaType: "work", officialLink: "https://www.migrationsverket.se/" },
  { slug: "finland", name: "Finlândia", nameEn: "Finland", codeISO2: "FI", codeISO3: "FIN", region: "Europe", capital: "Helsinque", currency: "EUR", languages: ["fi", "sv"], flagUrl: "https://flagcdn.com/w320/fi.png", overallScore: 89.2, visaName: "Specialist Residence Permit", visaType: "work", officialLink: "https://migri.fi/" },
  { slug: "denmark", name: "Dinamarca", nameEn: "Denmark", codeISO2: "DK", codeISO3: "DNK", region: "Europe", capital: "Copenhague", currency: "DKK", languages: ["da"], flagUrl: "https://flagcdn.com/w320/dk.png", overallScore: 90.5, visaName: "Pay Limit Scheme", visaType: "work", officialLink: "https://www.nyidanmark.dk/" },
  { slug: "japan", name: "Japão", nameEn: "Japan", codeISO2: "JP", codeISO3: "JPN", region: "Asia", capital: "Tóquio", currency: "JPY", languages: ["ja"], flagUrl: "https://flagcdn.com/w320/jp.png", overallScore: 81.0, visaName: "Highly Skilled Professional Visa", visaType: "work", officialLink: "https://www.mofa.go.jp/" },
  { slug: "south-korea", name: "Coreia do Sul", nameEn: "South Korea", codeISO2: "KR", codeISO3: "KOR", region: "Asia", capital: "Seul", currency: "KRW", languages: ["ko"], flagUrl: "https://flagcdn.com/w320/kr.png", overallScore: 78.5, visaName: "E-7 Foreign Skilled Professional Visa", visaType: "work", officialLink: "https://www.visa.go.kr/" },
  { slug: "united-arab-emirates", name: "EAU / Dubai", nameEn: "United Arab Emirates", codeISO2: "AE", codeISO3: "ARE", region: "Asia", capital: "Abu Dhabi", currency: "AED", languages: ["ar"], flagUrl: "https://flagcdn.com/w320/ae.png", overallScore: 80.2, visaName: "Green Visa for Skilled Employees", visaType: "work", officialLink: "https://icp.gov.ae/" }
];

function generateMarkdownDetail(countryName: string, isEn: boolean) {
  if (isEn) {
    return {
      overview: `# Welcome to ${countryName}\n\nThis is a complete guide to immigrating to ${countryName}. Here you will find official information, steps to follow, cost of living, visa options, and much more. ${countryName} is known for its excellent standard of living and security.`,
      costOfLiving: `## Cost of Living in ${countryName}\n\nThe cost of living in ${countryName} is balanced relative to average wages. High expenditures on rent in major cities are offset by public services and high quality of life.\n\n*   **Housing:** Rents vary greatly depending on proximity to major centers.\n*   **Groceries:** Local products are very affordable.\n*   **Public Services:** Highly optimized and affordable public transportation network.`,
      jobMarket: `## Job Market in ${countryName}\n\nThe labor market in ${countryName} is dynamic, especially in technology, engineering, healthcare, and finance. International professionals are highly valued.\n\n*   **High Demand Areas:** Software Engineering, Medical Care, System Analysis, Technical Management.\n*   **Languages:** Good command of local language or English is crucial.\n*   **Work Culture:** Respect for work-life balance is highly valued.`,
      healthcare: `## Healthcare System in ${countryName}\n\n${countryName} offers high-quality healthcare. Expats can access either a comprehensive public system or opt for private health insurance.\n\n*   **Coverage:** Wide coverage for both urgent care and medical consultations.\n*   **Access:** Direct access for foreign workers from day one of registration.`,
      education: `## Education System in ${countryName}\n\nThe education system in ${countryName} is world-class, including excellent public schools and globally ranked universities.\n\n*   **Primary/Secondary:** Excellent infrastructure and free schools for residents.\n*   **Higher Education:** World-renowned public universities with very competitive fees.`,
      housing: `## Housing and Rental in ${countryName}\n\nFinding accommodation in ${countryName} requires planning. Rental prices vary by city, and it is recommended to search well in advance.\n\n*   **Search Tips:** Use trusted local websites and have proof of income and identity documents ready.\n*   **Deposits:** Typically 1 to 3 months of rent.`,
    };
  } else {
    return {
      overview: `# Bem-vindo ao ${countryName}\n\nEste é um guia completo para imigrar para o ${countryName}. Aqui você encontrará informações oficiais, passos a seguir, custo de vida, opções de visto e muito mais. O ${countryName} se destaca por sua excelente qualidade de vida e segurança.`,
      costOfLiving: `## Custo de Vida no ${countryName}\n\nO custo de vida no ${countryName} é equilibrado em relação aos salários médios. Gastos elevados com aluguel em grandes centros são compensados por serviços públicos de qualidade e alto padrão de vida.\n\n*   **Moradia:** O aluguel varia muito dependendo da proximidade com os grandes centros.\n*   **Alimentação:** Supermercados locais oferecem boas opções a custos moderados.\n*   **Transporte:** Transporte público altamente otimizado e subsidiado em várias regiões.`,
      jobMarket: `## Mercado de Trabalho no ${countryName}\n\nO mercado de trabalho no ${countryName} é dinâmico, especialmente em tecnologia, engenharia, saúde e finanças. Profissionais internacionais são altamente valorizados.\n\n*   **Áreas em Alta:** Desenvolvimento de software, enfermagem/medicina, análise de sistemas e engenharia mecânica.\n*   **Idiomas:** Domínio do idioma local ou do inglês é fundamental para boas oportunidades.\n*   **Cultura:** Forte foco no equilíbrio entre vida pessoal e trabalho.`,
      healthcare: `## Sistema de Saúde no ${countryName}\n\nO ${countryName} oferece atendimento à saúde de alta qualidade. Expatriados podem acessar tanto o sistema público quanto o seguro de saúde privado.\n\n*   **Cobertura:** Serviços de atendimento médico geral e consultas especializadas cobertos pelo sistema.\n*   **Acesso:** Trabalhadores contribuintes têm acesso ao sistema de forma imediata.`,
      education: `## Sistema Educacional no ${countryName}\n\nO sistema educacional no ${countryName} é de classe mundial, incluindo excelentes escolas públicas e universidades ranqueadas globalmente.\n\n*   **Básico:** Escolas públicas gratuitas com excelentes níveis de ensino.\n*   **Superior:** Universidades públicas gratuitas ou com propinas anuais muito baratas.`,
      housing: `## Moradia e Aluguel no ${countryName}\n\nEncontrar moradia no ${countryName} exige planejamento. Os preços de aluguel variam por cidade, e recomenda-se pesquisar com bastante antecedência.\n\n*   **Como Buscar:** Recomenda-se portais imobiliários locais de confiança e ter fiadores ou depósitos de garantia.\n*   **Caução:** Geralmente exigido o valor de 1 a 3 aluguéis adiantados.`,
    };
  }
}

async function runSeed() {
  console.log("🚀 Iniciando seed da Etapa 05 para os 20 países...");

  // 1. Processa os países principais detalhados
  for (const c of seedCountries) {
    console.log(`📌 Processando país principal: ${c.name} (${c.slug})`);

    // Garante que o país existe na tabela Country
    let dbCountry = await prisma.country.findUnique({
      where: { slug: c.slug }
    });

    if (!dbCountry) {
      dbCountry = await prisma.country.create({
        data: {
          slug: c.slug,
          name: c.name,
          nameEn: c.nameEn,
          codeISO2: c.codeISO2,
          codeISO3: c.codeISO3,
          region: c.region,
          capital: c.capital,
          currency: c.currency,
          languages: c.languages,
          flagUrl: c.flagUrl,
          overallScore: c.overallScore
        }
      });
      // Cria indicadores padrão
      const categories = ["safety", "costOfLiving", "jobMarket", "visaEase", "healthcare", "culturalIntegration"];
      for (const cat of categories) {
        await prisma.countryIndicator.create({
          data: {
            countryId: dbCountry.id,
            category: cat,
            rawValue: 70 + Math.random() * 15,
            score: Math.round(75 + Math.random() * 15),
            source: "Fontes Consolidadas 2025"
          }
        });
      }
    }

    // Deleta os dados antigos do país para garantir idempotência
    await prisma.visa.deleteMany({ where: { countryId: dbCountry.id } });
    await prisma.officialLink.deleteMany({ where: { countryId: dbCountry.id } });
    await prisma.roadmap.deleteMany({ where: { countryId: dbCountry.id } });
    await prisma.countryDetail.deleteMany({ where: { countryId: dbCountry.id } });

    // Cria os detalhes (CountryDetail)
    const ptDetails = generateMarkdownDetail(c.name, false);
    const enDetails = generateMarkdownDetail(c.nameEn, true);
    await prisma.countryDetail.create({
      data: {
        countryId: dbCountry.id,
        overview: ptDetails.overview,
        overviewEn: enDetails.overview,
        costOfLiving: ptDetails.costOfLiving,
        costOfLivingEn: enDetails.costOfLiving,
        jobMarket: ptDetails.jobMarket,
        jobMarketEn: enDetails.jobMarket,
        healthcare: ptDetails.healthcare,
        healthcareEn: enDetails.healthcare,
        education: ptDetails.education,
        educationEn: enDetails.education,
        housing: ptDetails.housing,
        housingEn: enDetails.housing
      }
    });

    // Cria o visto (Visa)
    const visa = await prisma.visa.create({
      data: {
        countryId: dbCountry.id,
        name: c.visa.name,
        type: c.visa.type,
        description: c.visa.description,
        requirements: c.visa.requirements,
        documents: c.visa.documents,
        financialRequirement: c.visa.financialRequirement,
        officialLink: c.visa.officialLink
      }
    });

    // Cria os links oficiais (OfficialLink)
    for (const link of c.links) {
      await prisma.officialLink.create({
        data: {
          countryId: dbCountry.id,
          title: link.title,
          url: link.url,
          type: link.type,
          language: link.language
        }
      });
    }

    // Cria o roadmap e seus passos
    const roadmap = await prisma.roadmap.create({
      data: {
        countryId: dbCountry.id,
        progressPercentage: 0
      }
    });

    for (const step of c.steps) {
      await prisma.roadmapStep.create({
        data: {
          roadmapId: roadmap.id,
          order: step.order,
          title: step.title,
          description: step.description,
          status: step.status,
          visaType: step.visaType,
          documents: step.documents,
          officialLink: step.officialLink,
          visaId: step.order === 3 || step.order === 4 ? visa.id : null // Associa o visto a passos específicos do meio
        }
      });
    }
  }

  // 2. Processa os países adicionais
  for (const c of additionalCountries) {
    console.log(`📌 Processando país adicional: ${c.name} (${c.slug})`);

    let dbCountry = await prisma.country.findUnique({
      where: { slug: c.slug }
    });

    if (!dbCountry) {
      dbCountry = await prisma.country.create({
        data: {
          slug: c.slug,
          name: c.name,
          nameEn: c.nameEn,
          codeISO2: c.codeISO2,
          codeISO3: c.codeISO3,
          region: c.region,
          capital: c.capital,
          currency: c.currency,
          languages: c.languages,
          flagUrl: c.flagUrl,
          overallScore: c.overallScore
        }
      });
      // Cria indicadores padrão
      const categories = ["safety", "costOfLiving", "jobMarket", "visaEase", "healthcare", "culturalIntegration"];
      for (const cat of categories) {
        await prisma.countryIndicator.create({
          data: {
            countryId: dbCountry.id,
            category: cat,
            rawValue: 65 + Math.random() * 20,
            score: Math.round(70 + Math.random() * 20),
            source: "Fontes Consolidadas 2025"
          }
        });
      }
    }

    // Deleta os dados antigos do país para garantir idempotência
    await prisma.visa.deleteMany({ where: { countryId: dbCountry.id } });
    await prisma.officialLink.deleteMany({ where: { countryId: dbCountry.id } });
    await prisma.roadmap.deleteMany({ where: { countryId: dbCountry.id } });
    await prisma.countryDetail.deleteMany({ where: { countryId: dbCountry.id } });

    // Cria os detalhes (CountryDetail)
    const ptDetails = generateMarkdownDetail(c.name, false);
    const enDetails = generateMarkdownDetail(c.nameEn, true);
    await prisma.countryDetail.create({
      data: {
        countryId: dbCountry.id,
        overview: ptDetails.overview,
        overviewEn: enDetails.overview,
        costOfLiving: ptDetails.costOfLiving,
        costOfLivingEn: enDetails.costOfLiving,
        jobMarket: ptDetails.jobMarket,
        jobMarketEn: enDetails.jobMarket,
        healthcare: ptDetails.healthcare,
        healthcareEn: enDetails.healthcare,
        education: ptDetails.education,
        educationEn: enDetails.education,
        housing: ptDetails.housing,
        housingEn: enDetails.housing
      }
    });

    // Cria o visto (Visa)
    const visa = await prisma.visa.create({
      data: {
        countryId: dbCountry.id,
        name: c.visaName,
        type: c.visaType,
        description: `O visto ${c.visaName} é a opção padrão para imigrantes qualificados que desejam se mudar para o ${c.name}.`,
        requirements: ["Proficiência no idioma oficial do país ou inglês", "Contrato ou proposta formal de trabalho", "Diplomas e currículo comprovados"],
        documents: ["Passaporte", "Contrato de Trabalho", "Exames Médicos"],
        financialRequirement: "Comprovação de rendimentos condizentes com o custo de vida do país.",
        officialLink: c.officialLink
      }
    });

    // Cria os links oficiais (OfficialLink)
    await prisma.officialLink.create({
      data: {
        countryId: dbCountry.id,
        title: "Portal Oficial de Imigração",
        url: c.officialLink,
        type: "immigration",
        language: "en"
      }
    });
    await prisma.officialLink.create({
      data: {
        countryId: dbCountry.id,
        title: `Consulado Geral de ${c.name}`,
        url: c.officialLink,
        type: "consulate",
        language: "pt"
      }
    });
    await prisma.officialLink.create({
      data: {
        countryId: dbCountry.id,
        title: `Embaixada de ${c.name}`,
        url: c.officialLink,
        type: "embassy",
        language: "pt"
      }
    });

    // Cria o roadmap e seus passos
    const roadmap = await prisma.roadmap.create({
      data: {
        countryId: dbCountry.id,
        progressPercentage: 0
      }
    });

    const stepTitles = [
      "Verificação de Requisitos Acadêmicos e Idioma",
      "Busca de Vagas e Contrato com Empregador Local",
      "Preparação do Dossiê e Submissão Consular",
      "Viagem e Registro na Prefeitura Municipal do Destino",
      "Emissão de Registro Fiscal e Cartão de Residência Física"
    ];

    for (let i = 0; i < stepTitles.length; i++) {
      await prisma.roadmapStep.create({
        data: {
          roadmapId: roadmap.id,
          order: i + 1,
          title: stepTitles[i],
          description: `Etapa essencial do processo migratório para o ${c.name}: ${stepTitles[i]}. Requer atenção aos prazos e documentos exigidos.`,
          status: "not_started",
          visaType: c.visaName,
          documents: i === 2 ? ["Passaporte", "Contrato", "Seguro"] : [],
          officialLink: c.officialLink,
          visaId: i === 2 ? visa.id : null
        }
      });
    }
  }

  console.log("✅ Seed do estágio 05 concluído com sucesso!");
}

runSeed()
  .catch((err) => {
    console.error("❌ Erro durante o seed do estágio 05:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    pool.end();
  });
