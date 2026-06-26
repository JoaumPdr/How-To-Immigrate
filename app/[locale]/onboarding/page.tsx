"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAppStore } from "@/lib/store/useAppStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";


interface CountryOption {
  id: string;
  name: string;
  nameEn: string;
  codeISO2: string;
}

export default function OnboardingPage() {
  const t = useTranslations("onboarding");
  const router = useRouter();
  const { fetchProfileAndFavorites, setOnboardingStep } = useAppStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showResumeAlert, setShowResumeAlert] = useState(false);

  // Form states
  const [age, setAge] = useState<number | "">("");
  const [nationality, setNationality] = useState("");
  const [education, setEducation] = useState("");
  const [profession, setProfession] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [immigrationObjective, setImmigrationObjective] = useState("");
  const [financialSituation, setFinancialSituation] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const languageOptions = [
    { value: "Portuguese", label: "Português" },
    { value: "English", label: "Inglês" },
    { value: "Spanish", label: "Espanhol" },
    { value: "French", label: "Francês" },
    { value: "German", label: "Alemão" },
    { value: "Italian", label: "Italiano" },
    { value: "Japanese", label: "Japonês" },
    { value: "Chinese", label: "Chinês" },
  ];

  const educationOptions = [
    { value: "high_school", label: t("educationLevels.high_school") },
    { value: "technical", label: t("educationLevels.technical") },
    { value: "bachelors", label: t("educationLevels.bachelors") },
    { value: "masters", label: t("educationLevels.masters") },
    { value: "phd", label: t("educationLevels.phd") },
  ];

  const objectiveOptions = [
    { value: "work", label: t("objectives.work"), desc: "Vistos de trabalho, sponsor, vagas internacionais" },
    { value: "study", label: t("objectives.study"), desc: "Graduação, pós-graduação, cursos de idiomas" },
    { value: "investment", label: t("objectives.investment"), desc: "Visto gold, nômade digital, empreendedorismo" },
    { value: "family", label: t("objectives.family"), desc: "Casamento, parentesco direto, reagrupamento" },
    { value: "retirement", label: t("objectives.retirement"), desc: "Aposentadoria, rendimentos passivos próprios" },
  ];

  const financialOptions = [
    { value: "low", label: t("finances.low"), desc: "Orçamento enxuto, focado em vistos de baixo custo" },
    { value: "medium", label: t("finances.medium"), desc: "Orçamento moderado, cobre taxas e reserva inicial" },
    { value: "high", label: t("finances.high"), desc: "Orçamento confortável para mudanças planejadas" },
    { value: "very_high", label: t("finances.very_high"), desc: "Ideal para vistos de investidor e residência direta" },
  ];

  // Carregar dados de perfil e países
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        // Puxa o perfil atualizado do Zustand
        await fetchProfileAndFavorites();

        // Inicializar os dados do formulário a partir do perfil recém-carregado
        const currentUser = useAppStore.getState().user;
        if (currentUser?.profile) {
          const p = currentUser.profile;
          if (p.age) setAge(p.age);
          if (p.nationality) setNationality(p.nationality);
          if (p.education) setEducation(p.education);
          if (p.profession) setProfession(p.profession);
          if (p.languages) setSelectedLanguages(p.languages);
          if (p.immigrationObjective) setImmigrationObjective(p.immigrationObjective);
          if (p.financialSituation) setFinancialSituation(p.financialSituation);

          // Se o onboarding já foi concluído, manda direto pro dashboard
          if (p.onboardingStep >= 5) {
            router.push("/dashboard");
            return;
          }

          // Retomada: se o onboardingStep gravado for maior que 0, avança pro passo correto
          if (p.onboardingStep > 0 && p.onboardingStep < 5) {
            setCurrentStep(p.onboardingStep + 1);
            setShowResumeAlert(true);
            setTimeout(() => setShowResumeAlert(false), 5000);
          }
        }

        // Puxa os países da API
        const countriesRes = await fetch("/api/countries");
        if (countriesRes.ok) {
          const data = await countriesRes.json();
          // Ordenar alfabeticamente
          const sorted = data.sort((a: CountryOption, b: CountryOption) => a.name.localeCompare(b.name));
          setCountries(sorted);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do onboarding:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [fetchProfileAndFavorites, router]);

  const validateStep = () => {
    const newErrors: { [key: string]: string } = {};

    if (currentStep === 1) {
      if (!age) newErrors.age = "A idade é obrigatória";
      else if (Number(age) < 1 || Number(age) > 120) newErrors.age = "Idade inválida";

      if (!nationality) newErrors.nationality = "A nacionalidade é obrigatória";
    } else if (currentStep === 2) {
      if (!education) newErrors.education = "A escolaridade é obrigatória";
      if (!profession.trim()) newErrors.profession = "A profissão é obrigatória";
    } else if (currentStep === 3) {
      if (selectedLanguages.length === 0) newErrors.languages = "Selecione pelo menos um idioma";
    } else if (currentStep === 4) {
      if (!immigrationObjective) newErrors.immigrationObjective = "O objetivo é obrigatório";
    } else if (currentStep === 5) {
      if (!financialSituation) newErrors.financialSituation = "A faixa financeira é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep()) return;

    setIsSaving(true);
    let stepData: Record<string, unknown> = {};

    if (currentStep === 1) stepData = { age: Number(age), nationality };
    else if (currentStep === 2) stepData = { education, profession };
    else if (currentStep === 3) stepData = { languages: selectedLanguages };
    else if (currentStep === 4) stepData = { immigrationObjective };
    else if (currentStep === 5) stepData = { financialSituation };

    try {
      const response = await fetch("/api/user/questionnaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: currentStep,
          data: stepData,
        }),
      });

      if (response.ok) {
        setOnboardingStep(currentStep);
        if (currentStep < 5) {
          setCurrentStep(currentStep + 1);
        } else {
          // Último passo finalizado, ir para o dashboard
          router.push("/dashboard");
        }
      } else {
        const data = await response.json();
        setErrors({ api: data.error || "Erro ao salvar dados do questionário" });
      }
    } catch (error) {
      console.error("Erro ao salvar etapa:", error);
      setErrors({ api: "Erro de conexão com o servidor." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const toggleLanguage = (lang: string) => {
    if (selectedLanguages.includes(lang)) {
      setSelectedLanguages(selectedLanguages.filter((l) => l !== lang));
    } else {
      setSelectedLanguages([...selectedLanguages, lang]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[85vh] justify-between max-w-2xl mx-auto px-4 py-8 relative">
      <div>
        {/* Barra de Progresso Compacta no Topo */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-2">
            <span>{t("title")}</span>
            <span>Etapa {currentStep} de 5</span>
          </div>
          <div className="h-2 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-600 dark:bg-primary-500 transition-all duration-300 ease-out"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Alerta de Retomada */}
        {showResumeAlert && (
          <div className="mb-6 rounded-md bg-blue-50 dark:bg-blue-950/30 p-3 text-xs text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50 animate-pulse">
            {t("resumeMessage")}
          </div>
        )}

        {errors.api && (
          <div className="mb-6 rounded-md bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50">
            {errors.api}
          </div>
        )}

        {/* Step Contents */}
        <div className="space-y-6">
          {/* STEP 1 */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">{t("step1Title")}</h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{t("step1Desc")}</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="age" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {t("age")}
                </label>
                <Input
                  id="age"
                  type="number"
                  inputMode="numeric"
                  placeholder="Ex: 28"
                  value={age}
                  onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))}
                  hasError={!!errors.age}
                />
                {errors.age && <p className="text-xs text-red-600 dark:text-red-400">{errors.age}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="nationality" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {t("nationality")}
                </label>
                <Select
                  id="nationality"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  hasError={!!errors.nationality}
                >
                  <option value="">Selecione...</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </Select>
                {errors.nationality && <p className="text-xs text-red-600 dark:text-red-400">{errors.nationality}</p>}
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">{t("step2Title")}</h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{t("step2Desc")}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {t("education")}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {educationOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setEducation(opt.value)}
                      className={`flex h-12 items-center justify-between px-4 rounded-md border text-sm font-medium transition-all ${
                        education === opt.value
                          ? "border-primary-600 bg-primary-50 text-primary-900 dark:border-primary-500 dark:bg-primary-950/20 dark:text-primary-300"
                          : "border-neutral-200 bg-white hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800/50 text-neutral-700 dark:text-neutral-300"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {education === opt.value && (
                        <svg className="h-5 w-5 text-primary-600 dark:text-primary-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
                {errors.education && <p className="text-xs text-red-600 dark:text-red-400">{errors.education}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="profession" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {t("profession")}
                </label>
                <Input
                  id="profession"
                  type="text"
                  placeholder="Ex: Engenheiro de Software"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  hasError={!!errors.profession}
                />
                {errors.profession && <p className="text-xs text-red-600 dark:text-red-400">{errors.profession}</p>}
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">{t("step3Title")}</h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{t("step3Desc")}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {t("languages")}
                </label>
                <div className="flex flex-wrap gap-2 pt-2">
                  {languageOptions.map((lang) => {
                    const isSelected = selectedLanguages.includes(lang.value);
                    return (
                      <button
                        key={lang.value}
                        type="button"
                        onClick={() => toggleLanguage(lang.value)}
                        className={`flex h-11 items-center justify-center px-5 rounded-full border text-sm font-semibold transition-all cursor-pointer min-h-[44px] ${
                          isSelected
                            ? "bg-primary-600 border-primary-600 text-white dark:bg-primary-500 dark:border-primary-500"
                            : "border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
                        }`}
                      >
                        {lang.label}
                      </button>
                    );
                  })}
                </div>
                {errors.languages && <p className="text-xs text-red-600 dark:text-red-400">{errors.languages}</p>}
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">{t("step4Title")}</h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{t("step4Desc")}</p>
              </div>

              <div className="space-y-3">
                {objectiveOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setImmigrationObjective(opt.value)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      immigrationObjective === opt.value
                        ? "border-primary-600 bg-primary-50/50 dark:border-primary-500 dark:bg-primary-950/10"
                        : "border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-neutral-900 dark:text-neutral-50">{opt.label}</h3>
                      <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                        immigrationObjective === opt.value
                          ? "border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400"
                          : "border-neutral-300"
                      }`}>
                        {immigrationObjective === opt.value && (
                          <div className="h-2.5 w-2.5 bg-primary-600 dark:bg-primary-400 rounded-full" />
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{opt.desc}</p>
                  </button>
                ))}
                {errors.immigrationObjective && (
                  <p className="text-xs text-red-600 dark:text-red-400">{errors.immigrationObjective}</p>
                )}
              </div>
            </div>
          )}

          {/* STEP 5 */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">{t("step5Title")}</h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{t("step5Desc")}</p>
              </div>

              <div className="space-y-3">
                {financialOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setFinancialSituation(opt.value)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      financialSituation === opt.value
                        ? "border-primary-600 bg-primary-50/50 dark:border-primary-500 dark:bg-primary-950/10"
                        : "border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-neutral-900 dark:text-neutral-50">{opt.label}</h3>
                      <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                        financialSituation === opt.value
                          ? "border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400"
                          : "border-neutral-300"
                      }`}>
                        {financialSituation === opt.value && (
                          <div className="h-2.5 w-2.5 bg-primary-600 dark:bg-primary-400 rounded-full" />
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{opt.desc}</p>
                  </button>
                ))}
                {errors.financialSituation && (
                  <p className="text-xs text-red-600 dark:text-red-400">{errors.financialSituation}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ações Fixas no Rodapé com Layout Sticky Responsivo */}
      <div className="sticky bottom-0 bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 mt-8 flex items-center justify-between gap-4 z-10 w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)]">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1 || isSaving}
          className="flex-1 sm:flex-initial"
        >
          {t("btnBack")}
        </Button>
        <Button
          type="button"
          onClick={handleNext}
          disabled={isSaving}
          className="flex-1 sm:flex-initial"
        >
          {isSaving ? "Salvando..." : currentStep === 5 ? t("finish") : t("btnNext")}
        </Button>
      </div>
    </div>
  );
}
