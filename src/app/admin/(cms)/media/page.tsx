import MediaLibrary from "@/components/admin/MediaLibrary";

export const dynamic = "force-dynamic";
export const metadata = { title: "Bibliothèque média — Admin" };

export default function AdminMediaPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Bibliothèque média</h1>
        <p className="text-zinc-500 mt-1 text-sm">
          Gérez les images de votre portfolio. Ces fichiers peuvent être utilisés dans les
          projets, les expériences ou directement dans le contenu via l&apos;éditeur.
        </p>
      </div>

      <MediaLibrary />
    </div>
  );
}
