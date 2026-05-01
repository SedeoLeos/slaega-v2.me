import { getTranslations } from "next-intl/server";

export default async function CvGeneratorPage() {
  const t = await getTranslations("tools.cvGenerator");
  return <section className="mx-auto w-full max-w-content px-10 py-16 md:px-20"><h1 className="text-4xl font-bold">{t("title")}</h1><p className="mt-4 max-w-3xl text-base text-foreground/80">{t("description")}</p><div className="mt-8 rounded-xl border border-black/10 bg-black/[0.02] p-6"><h2 className="text-2xl font-semibold">{t("howItWorksTitle")}</h2><ul className="mt-4 list-disc space-y-2 pl-5 text-foreground/80"><li>{t("steps.0")}</li><li>{t("steps.1")}</li><li>{t("steps.2")}</li></ul></div></section>;
}
