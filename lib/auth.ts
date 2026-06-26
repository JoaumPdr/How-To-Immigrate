import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { comparePassword } from "./utils/bcrypt";
import { authConfig } from "./auth.config";
import { headers } from "next/headers";

// Mapa em memória para rate limit de login: chave = IP, valor = { count, resetTime }
const loginAttempts = new Map<string, { count: number; resetTime: number }>();

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    ...authConfig.providers,
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const reqHeaders = await headers();
        const ip = reqHeaders.get("x-forwarded-for")?.split(",")[0].trim() || 
                   reqHeaders.get("x-real-ip") || 
                   "127.0.0.1";

        const now = Date.now();
        const limitWindow = 3600 * 1000; // 1 hora
        const maxAttempts = 10;

        const record = loginAttempts.get(ip);
        if (record) {
          if (now < record.resetTime) {
            if (record.count >= maxAttempts) {
              console.log(`[AUTH DIAGNOSTIC] Rate limit excedido para o IP ${ip}`);
              throw new Error("Rate limit exceeded. Max 10 login attempts per hour.");
            }
          } else {
            // Resetar janela expirada
            record.count = 0;
            record.resetTime = now + limitWindow;
          }
        } else {
          loginAttempts.set(ip, { count: 0, resetTime: now + limitWindow });
        }

        if (!credentials?.email || !credentials?.password) {
          console.log("[AUTH DIAGNOSTIC] Credenciais ausentes no request");
          return null;
        }

        console.log(`[AUTH DIAGNOSTIC] Tentativa de login para o email: ${credentials.email}`);

        try {
          const user = await prisma.user.findUnique({
            where: { email: (credentials.email as string).toLowerCase() }
          });

          if (!user) {
            console.log(`[AUTH DIAGNOSTIC] Usuário não encontrado para o email: ${credentials.email}`);
            // Incrementar contador de falhas para o IP
            const rec = loginAttempts.get(ip);
            if (rec) rec.count++;
            return null;
          }

          if (!user.passwordHash) {
            console.log(`[AUTH DIAGNOSTIC] Usuário não possui senha local (OAuth apenas): ${credentials.email}`);
            const rec = loginAttempts.get(ip);
            if (rec) rec.count++;
            return null;
          }

          const isPasswordValid = await comparePassword(
            credentials.password as string,
            user.passwordHash
          );

          if (!isPasswordValid) {
            console.log(`[AUTH DIAGNOSTIC] Senha inválida para o email: ${credentials.email}`);
            // Incrementar contador de falhas para o IP
            const rec = loginAttempts.get(ip);
            if (rec) rec.count++;
            return null;
          }

          // Login com sucesso: limpa de tentativas para esse IP
          loginAttempts.delete(ip);
          console.log(`[AUTH DIAGNOSTIC] Login bem-sucedido para o email: ${credentials.email}`);

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image
          };
        } catch (dbError) {
          console.error("[AUTH DIAGNOSTIC] Erro de banco de dados no authorize:", dbError);
          throw dbError;
        }
      }
    })
  ]
});

