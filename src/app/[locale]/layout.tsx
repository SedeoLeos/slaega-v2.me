import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/libs/i18n/routing';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer/Footer";
import Store from "@/Provider/Store";
import { siteConfigRepository } from "@/features/site-config/repositories/site-config.repository";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: {
      default: t("siteTitle"),
      template: t("titleTemplate"),
    },
    description: t("description"),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  // ── Dynamic theme: read from DB, inject as CSS custom properties ────────────
  const theme = await siteConfigRepository.getTheme().catch(() => null);
  const themeCss = theme
    ? `:root {
        --background: ${theme.background};
        --foreground: ${theme.foreground};
        --green-app:  ${theme.greenApp};
        --card:       ${theme.card};
        --accent:     ${theme.accent};
        --primary:    ${theme.accent};
        --secondary:  ${theme.secondary};
      }`
    : "";

  return (
    <html lang={locale}>
      {themeCss && <style dangerouslySetInnerHTML={{ __html: themeCss }} />}
      <NextIntlClientProvider locale={locale} messages={messages}>
        <Store>
          <body className={`${inter.variable} ${poppins.variable} antialiased overflow-x-hidden flex flex-col items-center w-full`}>
            <Header />
            {children}
            <Footer />
          </body>
        </Store>
      </NextIntlClientProvider>
    </html>
  );
}
