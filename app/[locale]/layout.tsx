import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SessionProvider } from "@/components/SessionProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import type { Viewport } from "next";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "How To Immigrate | O Guia Definitivo de Imigração",
    template: "%s | How To Immigrate",
  },
  description: "Compare critérios de imigração, explore o mapa interativo e planeje seu roadmap personalizado de mudança de país.",
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "How To Immigrate | O Guia Definitivo de Imigração",
    description: "Compare critérios de imigração, explore o mapa interativo e planeje seu roadmap personalizado de mudança de país.",
    url: "/",
    siteName: "How To Immigrate",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "How To Immigrate | O Guia Definitivo de Imigração",
    description: "Compare critérios de imigração, explore o mapa interativo e planeje seu roadmap personalizado de mudança de país.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Garantir que o locale recebido é válido
  if (!routing.locales.includes(locale as "en" | "pt-BR")) {
    notFound();
  }

  // Habilitar a renderização estática para o locale atual
  setRequestLocale(locale);

  // Carregar mensagens de tradução
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-200">
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NextIntlClientProvider messages={messages}>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 flex flex-col">{children}</main>
                <Footer />
              </div>
            </NextIntlClientProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
