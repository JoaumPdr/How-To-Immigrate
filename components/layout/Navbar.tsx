"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Menu, Globe } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useSession, signOut } from "next-auth/react";

/**
 * Componente de Cabeçalho e Barra de Navegação Global.
 * Responsivo, com menu Hambúrguer para telas móveis e acessibilidade WCAG AA.
 */
export function Navbar() {
  const t = useTranslations("nav");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  const navigationItems = [
    { name: t("home"), href: "/" },
    { name: t("map"), href: "/map" },
    { name: t("countries"), href: "/countries" },
    ...(isLoggedIn
      ? [
          { name: "Dashboard", href: "/dashboard" },
          { name: "Perfil", href: "/profile" },
        ]
      : []),
    { name: t("reviews"), href: "/reviews" },
    { name: t("about"), href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <Globe className="h-6 w-6 text-primary group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-lg font-black tracking-tight bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
              HowToImmigrate
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Navegação Principal">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher />
          <ThemeToggle />
          {isLoggedIn ? (
            <Button
              variant="outline"
              size="sm"
              className="h-9 min-h-0 px-4"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              {t("home") === "Início" ? "Sair" : "Sign Out"}
            </Button>
          ) : (
            <Link href="/login">
              <Button variant="primary" size="sm" className="h-9 min-h-0 px-4">
                {t("home") === "Início" ? "Entrar" : "Sign In"}
              </Button>
            </Link>
          )}
        </div>

        {/* Actions & Hamburguer (Mobile) */}
        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Abrir menu de navegação"
            className="h-10 w-10 p-0 rounded-full flex items-center justify-center min-h-[44px] min-w-[44px]"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Drawer (Sheet) */}
      <Sheet
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        side="right"
        title="Menu"
      >
        <div className="flex flex-col gap-6 mt-4">
          <nav className="flex flex-col gap-4" aria-label="Navegação Móvel">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-semibold text-muted-foreground hover:text-foreground py-2 border-b border-border transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-4 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Idioma / Language</span>
              <LanguageSwitcher />
            </div>
            {isLoggedIn ? (
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
              >
                {t("home") === "Início" ? "Sair" : "Sign Out"}
              </Button>
            ) : (
              <Link href="/login" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="primary" className="w-full mt-2">
                  {t("home") === "Início" ? "Entrar" : "Sign In"}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </Sheet>
    </header>
  );
}

