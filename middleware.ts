import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  // Obter a resposta do middleware de tradução (next-intl)
  const response = intlMiddleware(request);

  // Adicionar cabeçalhos de segurança HTTP
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Strict-Transport-Security (STS) ativo em produção
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }

  // Content-Security-Policy (CSP) - Estruturada e compatível com desenvolvimento (Fast Refresh)
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://*.supabase.co;
    font-src 'self' data:;
    connect-src 'self' https://*.supabase.co wss://*.supabase.co;
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, " ").trim();

  response.headers.set("Content-Security-Policy", cspHeader);

  return response;
}

export const config = {
  // Matcher que intercepta rotas de internacionalização e exclui arquivos estáticos/assets
  matcher: [
    // Match de rotas internacionais
    "/",
    "/(en|pt-BR)/:path*",
    // Exclui arquivos internos do Next.js, Vercel e imagens/assets estáticos
    "/((?!api|_next/static|_next/image|_vercel|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)"
  ]
};
