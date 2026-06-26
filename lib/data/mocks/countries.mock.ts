import { CountryWithIndicators } from "../../repositories/countryRepository";

/**
 * Mock de países estruturados com indicadores reais obtidos de fontes do ano de 2025.
 * Útil para desenvolvimento local e testes isolados offline.
 */
export const mockCountries: CountryWithIndicators[] = [
  {
    id: "3fcad29e-7777-4611-a806-6659ee586481",
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
    overallScore: 78.5,
    indicators: [
      { id: "1", category: "safety", score: 85, rawValue: 82.5, source: "Numbeo Index 2025" },
      { id: "2", category: "costOfLiving", score: 45, rawValue: 68.2, source: "World Bank API" },
      { id: "3", category: "jobMarket", score: 80, rawValue: 78.4, source: "OECD" },
      { id: "4", category: "visaEase", score: 65, rawValue: 60.0, source: "Immigration Dept" },
      { id: "5", category: "healthcare", score: 88, rawValue: 86.4, source: "World Health Org" },
      { id: "6", category: "culturalIntegration", score: 90, rawValue: 92.1, source: "V-Dem Institute" }
    ]
  },
  {
    id: "4fcad29e-8888-4611-b806-7759ee586482",
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
    overallScore: 74.3,
    indicators: [
      { id: "7", category: "safety", score: 90, rawValue: 88.0, source: "Numbeo Index 2025" },
      { id: "8", category: "costOfLiving", score: 75, rawValue: 42.1, source: "World Bank API" },
      { id: "9", category: "jobMarket", score: 55, rawValue: 58.0, source: "OECD" },
      { id: "10", category: "visaEase", score: 80, rawValue: 85.0, source: "SEF / AIMA" },
      { id: "11", category: "healthcare", score: 78, rawValue: 75.2, source: "SNS" },
      { id: "12", category: "culturalIntegration", score: 85, rawValue: 84.6, source: "V-Dem Institute" }
    ]
  },
  {
    id: "5fcad29e-9999-4611-c806-8859ee586483",
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
    overallScore: 76.9,
    indicators: [
      { id: "13", category: "safety", score: 80, rawValue: 76.4, source: "Numbeo Index 2025" },
      { id: "14", category: "costOfLiving", score: 50, rawValue: 62.0, source: "World Bank API" },
      { id: "15", category: "jobMarket", score: 85, rawValue: 84.1, source: "OECD" },
      { id: "16", category: "visaEase", score: 60, rawValue: 58.0, source: "Federal Govt" },
      { id: "17", category: "healthcare", score: 92, rawValue: 90.8, source: "Bundesgesundheitsministerium" },
      { id: "18", category: "culturalIntegration", score: 75, rawValue: 72.5, source: "V-Dem Institute" }
    ]
  }
];
