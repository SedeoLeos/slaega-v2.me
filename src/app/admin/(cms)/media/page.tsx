import MediaLibrary from "@/components/admin/MediaLibrary";

export const dynamic = "force-dynamic";
export const metadata = { title: "Bibliothèque média — Admin" };

export default function AdminMediaPage() {
  const provider = (process.env.STORAGE_PROVIDER ?? "local").toLowerCase();
  const isS3 = provider === "s3" || provider === "r2" || provider === "minio";
  const bucket = process.env.STORAGE_BUCKET;
  const endpoint = process.env.STORAGE_ENDPOINT;

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Bibliothèque média</h1>
            <p className="text-zinc-500 mt-1 text-sm">
              Gérez les images de votre portfolio. Réutilisables dans projets, expériences et contenu.
            </p>
          </div>

          {/* Storage indicator */}
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${
              isS3
                ? "bg-sky-500/10 border-sky-500/30 text-sky-400"
                : "bg-green-app/10 border-green-app/30 text-green-app"
            }`}
            title={isS3 ? `${endpoint ?? "AWS S3"} · bucket: ${bucket}` : "public/uploads/"}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isS3 ? "bg-sky-400" : "bg-green-app"}`} />
            {isS3 ? `Object Storage${bucket ? ` · ${bucket}` : ""}` : "Local filesystem"}
          </div>
        </div>
      </div>

      <MediaLibrary />
    </div>
  );
}
