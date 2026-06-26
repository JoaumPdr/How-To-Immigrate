"use client";

import * as React from "react";

interface SessionProviderProps {
  children: React.ReactNode;
}

/**
 * Provedor de sessão placeholder para a Etapa 01.
 * Será substituído pela integração real com NextAuth na Etapa 04.
 */
export function SessionProvider({ children }: SessionProviderProps) {
  return <>{children}</>;
}
