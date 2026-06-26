"use client";

import * as React from "react";
import { SessionProvider as AuthSessionProvider } from "next-auth/react";

interface SessionProviderProps {
  children: React.ReactNode;
}

/**
 * Provedor de Sessão do NextAuth v5.
 * Fornece o contexto de autenticação para todos os componentes do lado do cliente.
 */
export function SessionProvider({ children }: SessionProviderProps) {
  return <AuthSessionProvider>{children}</AuthSessionProvider>;
}
