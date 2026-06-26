import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import NextAuth from "next-auth";
import { authConfig } from "./lib/auth.config";

const intlMiddleware = createMiddleware(routing);
const { auth } = NextAuth(authConfig);

export default auth(async function middleware(request) {
  const session = request.auth;
  const { nextUrl } = request;

  // Extrair o pathname sem o prefixo do locale
  const pathnameWithoutLocale = nextUrl.pathname.replace(/^\/(en|pt-BR)/, "");

  const isProtected =
    pathnameWithoutLocale === "/dashboard" ||
    pathnameWithoutLocale.startsWith("/dashboard/") ||
    pathnameWithoutLocale === "/profile" ||
    pathnameWithoutLocale.startsWith("/profile/") ||
    pathnameWithoutLocale === "/onboarding" ||
    pathnameWithoutLocale.startsWith("/onboarding/");

  const isLoggedIn = !!session?.user;

  if (isProtected && !isLoggedIn) {
    const locale = nextUrl.pathname.match(/^\/(en|pt-BR)/)?.[0] || "/pt-BR";
    const callbackUrl = encodeURIComponent(nextUrl.href);
    return NextResponse.redirect(
      new URL(`${locale}/login?callbackUrl=${callbackUrl}`, request.url)
    );
  }

  // Executar o middleware de tradução
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

  // Content-Security-Policy (CSP) - Liberando flagcdn.com para as imagens das bandeiras
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://*.supabase.co https://flagcdn.com;
    font-src 'self' data:;
    connect-src 'self' https://*.supabase.co wss://*.supabase.co;
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, " ").trim();

  response.headers.set("Content-Security-Policy", cspHeader);

  return response;
});

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
