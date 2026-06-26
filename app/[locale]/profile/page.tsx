"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAppStore } from "@/lib/store/useAppStore";
import { signOut } from "next-auth/react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";

interface CountryOption {
  id: string;
  name: string;
  nameEn: string;
  codeISO2: string;
}

export default function ProfilePage() {
  const t = useTranslations("profile");
  const tOnboarding = useTranslations("onboarding");
  const router = useRouter();
  const { user, fetchProfileAndFavorites, clearAuth } = useAppStore();

  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [nationality, setNationality] = useState("");
  const [education, setEducation] = useState("");
  const [profession, setProfession] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const educationOptions = [
    { value: "high_school", label: tOnboarding("educationLevels.high_school") },
    { value: "technical", label: tOnboarding("educationLevels.technical") },
    { value: "bachelors", label: tOnboarding("educationLevels.bachelors") },
    { value: "masters", label: tOnboarding("educationLevels.masters") },
    { value: "phd", label: tOnboarding("educationLevels.phd") },
  ];

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      await fetchProfileAndFavorites();
      
      // Inicializar dados do formulário
      const currentUser = useAppStore.getState().user;
      if (currentUser) {
        setName(currentUser.name || "");
        if (currentUser.profile) {
          const p = currentUser.profile;
          if (p.age) setAge(p.age);
          if (p.nationality) setNationality(p.nationality);
          if (p.education) setEducation(p.education);
          if (p.profession) setProfession(p.profession);
        }
      }

      try {
        const countriesRes = await fetch("/api/countries");
        if (countriesRes.ok) {
          const data = await countriesRes.json();
          const sorted = data.sort((a: CountryOption, b: CountryOption) => a.name.localeCompare(b.name));
          setCountries(sorted);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do perfil:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [fetchProfileAndFavorites]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage("");

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          age: age === "" ? null : Number(age),
          nationality,
          education,
          profession,
        }),
      });

      if (response.ok) {
        setSaveMessage(t("saveSuccess"));
        await fetchProfileAndFavorites();
      } else {
        const data = await response.json();
        setSaveMessage(data.error || "Erro ao salvar alterações.");
      }
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      setSaveMessage("Erro de conexão com o servidor.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        
        // Criar blob de download JSON
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `user-profile-data-${user?.id || "export"}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Erro ao exportar dados:", error);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "DELETE",
      });

      if (response.ok) {
        setShowDeleteModal(false);
        clearAuth();
        // Desconectar o usuário do NextAuth e redirecionar
        await signOut({ callbackUrl: "/login?message=account_deleted" });
      } else {
        alert("Erro ao excluir conta. Tente novamente mais tarde.");
        setIsDeleting(false);
      }
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      setIsDeleting(false);
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50">
          {t("title")}
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-1">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Seção Principal de Edição */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border border-neutral-200 dark:border-neutral-800">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Informações Básicas</CardTitle>
              <CardDescription>Mantenha seus dados atualizados.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                {saveMessage && (
                  <div className={`rounded-md p-3 text-sm border ${
                    saveMessage.includes("sucesso")
                      ? "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-900/50"
                      : "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50"
                  }`}>
                    {saveMessage}
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Nome
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="age" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {tOnboarding("age")}
                    </label>
                    <Input
                      id="age"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="nationality" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {tOnboarding("nationality")}
                    </label>
                    <Select
                      id="nationality"
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                    >
                      <option value="">Selecione...</option>
                      {countries.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="education" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {tOnboarding("education")}
                  </label>
                  <Select
                    id="education"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    {educationOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="profession" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    {tOnboarding("profession")}
                  </label>
                  <Input
                    id="profession"
                    type="text"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                  />
                </div>

                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Barra Lateral de Segurança, Exportação & Ações Adicionais */}
        <div className="space-y-6">
          {/* Exportação LGPD/GDPR */}
          <Card className="border border-neutral-200 dark:border-neutral-800">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-bold">{t("exportData")}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-xs text-neutral-500 dark:text-neutral-400">
              {t("exportDataDesc")}
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button variant="outline" size="sm" className="w-full" onClick={handleExportData}>
                {t("exportData")}
              </Button>
            </CardFooter>
          </Card>

          {/* Exclusão Permanente de Conta */}
          <Card className="border border-red-200 dark:border-red-950 bg-red-50/50 dark:bg-red-950/10">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-bold text-red-700 dark:text-red-400">
                {t("deleteAccount")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-xs text-red-600/80 dark:text-red-400/80">
              {t("deleteAccountDesc")}
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button
                variant="outline"
                size="sm"
                className="w-full border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-100/50 dark:hover:bg-red-950/50"
                onClick={() => setShowDeleteModal(true)}
              >
                {t("deleteAccount")}
              </Button>
            </CardFooter>
          </Card>

          {/* Botão para refazer onboarding */}
          <Card className="border border-neutral-200 dark:border-neutral-800">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-bold">Onboarding de Recomendações</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-xs text-neutral-500 dark:text-neutral-400">
              Se você quiser atualizar suas preferências completas para recalcular recomendações personalizadas.
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => router.push("/onboarding")}
              >
                Refazer Onboarding
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Modal de Confirmação para Exclusão Definitiva de Conta */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title={t("deleteConfirmTitle")}
      >
        <div className="space-y-4 pt-2">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {t("deleteConfirmText")}
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              disabled={isDeleting}
              onClick={() => setShowDeleteModal(false)}
            >
              {t("buttonCancelDelete")}
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white border-0"
              disabled={isDeleting}
              onClick={handleDeleteAccount}
            >
              {isDeleting ? "Excluindo..." : t("buttonConfirmDelete")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
