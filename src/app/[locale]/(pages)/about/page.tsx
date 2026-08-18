import type { Metadata } from "next";
import About from "@/components/About/About";
import { buildPageMetadata } from "@/shared/config/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, {
    path: "/about",
    title:
      locale === "en"
        ? "About — Seba Gedeon Matsoula Malonga"
        : "À propos — Seba Gedeon Matsoula Malonga",
    description:
      locale === "en"
        ? "Software architect & full-stack developer (mobile, web, backend, DevOps). The path, the values and the vision behind slaega — king sedeo leos."
        : "Architecte logiciel & développeur full-stack (mobile, web, backend, DevOps). Le parcours, les valeurs et la vision derrière slaega — king sedeo leos.",
    keywords: ["à propos", "parcours", "architecte logiciel", "full-stack", "Brazzaville"],
  });
}

export default function AboutPage() {
  return <About />;
}
