import type { Metadata } from "next";
import { Inter, Poppins, Space_Grotesk } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/libs/i18n/routing';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer/Footer";
import SlaegaCursor from "@/components/slaega/SlaegaCursor";
import Loader from "@/components/animations/Loader";
import SmoothScroll from "@/components/animations/SmoothScroll";
import Store from "@/Provider/Store";
import { siteConfigRepository } from "@/features/site-config/repositories/site-config.repository";
import { DEFAULT_THEME } from "@/features/site-config/types";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
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
  // The accent (brand) is mode-independent; background/foreground/card/secondary
  // flip between dark (from DB) and light (derived) via html[data-theme-mode].
  const theme = (await siteConfigRepository.getTheme().catch(() => null)) ?? DEFAULT_THEME;
  const themeCss = `
    :root {
      --accent:    ${theme.accent};
      --primary:   ${theme.accent};
      --green-app: ${theme.greenApp};
    }
    :root, html[data-theme-mode="dark"] {
      --background: ${theme.background};
      --foreground: ${theme.foreground};
      --card:       ${theme.card};
      --secondary:  ${theme.secondary};
      --border:     rgba(255, 255, 255, 0.10);
    }
    html[data-theme-mode="light"] {
      --background: #FAF8F4;
      --foreground: #111111;
      --card:       #FFFFFF;
      --secondary:  #5E5E5E;
      --border:     rgba(17, 17, 17, 0.10);
    }
  `;

  // Set the mode before first paint (no flash): stored choice → system → dark.
  const modeScript = `(function(){try{var m=localStorage.getItem('theme-mode');if(m!=='light'&&m!=='dark'){m=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.setAttribute('data-theme-mode',m);}catch(e){document.documentElement.setAttribute('data-theme-mode','dark');}})();`;

  return (
    <html lang={locale} suppressHydrationWarning>
      <style dangerouslySetInnerHTML={{ __html: themeCss }} />
      <script dangerouslySetInnerHTML={{ __html: modeScript }} />
      <NextIntlClientProvider locale={locale} messages={messages}>
        <Store>
          <body className={`${inter.variable} ${poppins.variable} ${spaceGrotesk.variable} antialiased overflow-x-hidden flex flex-col items-center w-full`}>
            <Loader />
            <SmoothScroll />
            <SlaegaCursor />
            <Header />
            {children}
            <Footer />
          </body>
        </Store>
      </NextIntlClientProvider>
    </html>
  );
}
