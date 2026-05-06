import { siteConfigRepository } from "@/features/site-config/repositories/site-config.repository";
import ThemeEditor from "@/components/admin/ThemeEditor";

export const metadata = { title: "Thème du portfolio — Admin" };

export default async function ThemePage() {
  const theme = await siteConfigRepository.getTheme();

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-zinc-100">Thème du portfolio</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Personnalisez les couleurs globales du portfolio public.
          Les modifications sont appliquées instantanément à la prochaine visite.
        </p>
      </div>

      <ThemeEditor initialTheme={theme} />
    </div>
  );
}
