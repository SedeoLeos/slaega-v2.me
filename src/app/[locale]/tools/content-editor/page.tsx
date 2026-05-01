import { getTranslations } from "next-intl/server";
import ProjectCreateForm from "@/features/projects/components/project-create-form";

export default async function ContentEditorPage() {
  const t = await getTranslations("tools.contentEditor");

  return (
    <section className="mx-auto w-full max-w-content px-10 py-16 md:px-20">
      <h1 className="text-4xl font-bold">{t("title")}</h1>
      <p className="mt-4 max-w-3xl text-base text-foreground/80">{t("description")}</p>
      <div className="mt-8 rounded-xl border border-black/10 bg-black/[0.02] p-6">
        <p className="text-foreground/80">{t("newProjectHint")}</p>
        <ProjectCreateForm />
      </div>
    </section>
  );
}
