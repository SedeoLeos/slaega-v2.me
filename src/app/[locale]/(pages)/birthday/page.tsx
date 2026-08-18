import type { Metadata } from "next";
import BirthdayPage from "@/components/slaega/pages/BirthdayPage";
import { buildPageMetadata } from "@/shared/config/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, {
    path: "/birthday",
    title: locale === "en" ? "Happy Birthday" : "Joyeux anniversaire",
    description:
      locale === "en"
        ? "The slaega counter — from slaega 1 to slaega 19. Born 19 August 2000: Seba Gedeon Matsoula Malonga."
        : "Le compteur slaega — de slaega 1 à slaega 19. Né le 19 août 2000 : Seba Gedeon Matsoula Malonga.",
    keywords: ["slaega19", "anniversaire", "19 août 2000"],
  });
}

export default function Page() {
  return <BirthdayPage />;
}
