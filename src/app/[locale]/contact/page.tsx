import type { Metadata } from "next";
import Contact from "@/components/Contact/Contact";
import { buildPageMetadata } from "@/shared/config/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, {
    path: "/contact",
    title: locale === "en" ? "Contact" : "Contact",
    description:
      locale === "en"
        ? "Get in touch with Seba Gedeon Matsoula Malonga (slaega) — software architect & full-stack developer. hello@slaega.com."
        : "Contacter Seba Gedeon Matsoula Malonga (slaega) — architecte logiciel & développeur full-stack. hello@slaega.com.",
    keywords: ["contact", "recrutement", "collaboration", "freelance"],
  });
}

export default function ContactPage() {
  return (
    <section className="w-full">
      <Contact />
    </section>
  );
}
