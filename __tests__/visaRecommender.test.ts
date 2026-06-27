import { describe, it, expect } from "vitest";
import { recommendVisa } from "../lib/utils/visaRecommender";

const mockVisas = [
  {
    id: "visa-1",
    name: "Skilled Worker Visa (Work)",
    type: "work",
    description: "Work visa for qualified professionals.",
    requirements: ["Offer"],
    documents: ["Passport"],
    financialRequirement: null,
    officialLink: null
  },
  {
    id: "visa-2",
    name: "D7 Passive Income Visa",
    type: "retirement",
    description: "For retirees and passive income holders.",
    requirements: ["Income proof"],
    documents: ["Passport"],
    financialRequirement: "€9,840/year",
    officialLink: null
  }
];

describe("recommendVisa utility function", () => {
  it("should return null if the visas array is empty", () => {
    const result = recommendVisa([], {
      age: "18-35",
      profession: "tech",
      language: "fluent",
      budget: "medium"
    });
    expect(result).toBeNull();
  });

  it("should recommend retirement/passive income visa if age is 46+", () => {
    const result = recommendVisa(mockVisas, {
      age: "46+",
      profession: "other",
      language: "basic",
      budget: "medium"
    });
    expect(result).toBeDefined();
    expect(result?.type).toBe("retirement");
    expect(result?.id).toBe("visa-2");
  });

  it("should recommend retirement/passive income visa if budget is high", () => {
    const result = recommendVisa(mockVisas, {
      age: "18-35",
      profession: "other",
      language: "none",
      budget: "high"
    });
    expect(result).toBeDefined();
    expect(result?.type).toBe("retirement");
    expect(result?.id).toBe("visa-2");
  });

  it("should recommend highly skilled work visa for tech professionals with high language level", () => {
    const result = recommendVisa(mockVisas, {
      age: "18-35",
      profession: "tech",
      language: "fluent",
      budget: "medium"
    });
    expect(result).toBeDefined();
    expect(result?.type).toBe("work");
    expect(result?.id).toBe("visa-1");
  });

  it("should fall back to the first visa available if no specific profile rules match", () => {
    const result = recommendVisa(mockVisas, {
      age: "18-35",
      profession: "other",
      language: "none",
      budget: "low"
    });
    expect(result).toBeDefined();
    expect(result?.id).toBe("visa-1");
  });
});
