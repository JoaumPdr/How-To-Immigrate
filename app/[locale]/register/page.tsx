"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import Link from "next/link";

export default function RegisterPage() {
  const t = useTranslations("auth");
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = "O nome é obrigatório";
    } else if (name.length < 2) {
      newErrors.name = "O nome deve ter pelo menos 2 caracteres";
    }

    if (!email) {
      newErrors.email = "O e-mail é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "E-mail inválido";
    }

    if (!password) {
      newErrors.password = "A senha é obrigatória";
    } else if (password.length < 6) {
      newErrors.password = "A senha deve ter pelo menos 6 caracteres";
    }

    // eslint-disable-next-line security/detect-possible-timing-attacks
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!validate()) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMsg(t("successRegister"));
        router.push("/login");
      } else {
        setErrorMsg(data.error || t("errorGeneric"));
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
      setErrorMsg(t("errorGeneric"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg border border-neutral-200 dark:border-neutral-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-center text-neutral-900 dark:text-neutral-50">
            {t("registerTitle")}
          </CardTitle>
          <CardDescription className="text-center text-sm text-neutral-500 dark:text-neutral-400">
            Crie sua conta para começar seu planejamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="rounded-md bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="rounded-md bg-green-50 dark:bg-green-950/30 p-3 text-sm text-green-600 dark:text-green-400 border border-green-200 dark:border-green-900/50">
                {successMsg}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {t("name")}
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Ex: João Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                hasError={!!errors.name}
              />
              {errors.name && <p className="text-xs text-red-600 dark:text-red-400">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {t("email")}
              </label>
              <Input
                id="email"
                type="email"
                placeholder="nome@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                hasError={!!errors.email}
              />
              {errors.email && <p className="text-xs text-red-600 dark:text-red-400">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {t("password")}
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                hasError={!!errors.password}
              />
              {errors.password && <p className="text-xs text-red-600 dark:text-red-400">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {t("confirmPassword")}
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                hasError={!!errors.confirmPassword}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            <Button type="submit" className="w-full mt-2" disabled={isLoading}>
              {isLoading ? t("buttonRegister") + "..." : t("buttonRegister")}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-neutral-300 dark:border-neutral-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-neutral-50 dark:bg-neutral-900 px-2 text-neutral-500 dark:text-neutral-400">
                Ou continue com
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2 border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {t("googleButton")}
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-neutral-200 dark:border-neutral-800 pt-4">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {t("hasAccount")}{" "}
            <Link href="/login" className="font-semibold text-primary-600 hover:underline dark:text-primary-400">
              {t("loginLink")}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
