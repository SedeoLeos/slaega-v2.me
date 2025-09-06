import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/libs/i18n/routing';
import { getMessages, setRequestLocale } from 'next-intl/server';
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer/Footer";
import { QueryClientProvider } from "@tanstack/react-query";
import Store from "@/Provider/Store";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Slaega Me",
  description: "Bienvenue sur mon portofolios",
};
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
export default async function RootLayout({
  children,
  params
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
  return (
    <html lang={locale}>
      <NextIntlClientProvider locale={locale} messages={messages}>
      <Store >
        <body
          className={`${inter.variable} ${poppins.variable} antialiased overflow-x-hidden flex flex-col items-center w-full`}
        >
          <Header />
          <main className="w-full relative overflow-hidden bg-background min-h-screen flex flex-col mt-20">
            {children}
          </main>
          <Footer />
        </body>
      </Store>
      </NextIntlClientProvider>
    </html>
  );
}
