import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Declaração de extensão de tipos do NextAuth para expor o id do usuário na sessão
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & import("next-auth").DefaultSession["user"]
  }
}

export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock-google-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-google-client-secret"
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  }
};
