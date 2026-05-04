import "../../globals.css";
import { Inter, Poppins } from "next/font/google";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Toaster from "@/components/admin/Toaster";
import AdminNavItem from "@/components/admin/AdminNavItem";

export const metadata = { title: "Admin — Slaega" };

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default async function AdminCmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <html lang="fr" className="h-full">
      <body
        className={`${inter.variable} ${poppins.variable} antialiased h-full bg-zinc-950 text-zinc-100`}
      >
        <div className="flex h-full">
          {/* ── Sidebar ── */}
          <aside className="w-64 flex-shrink-0 flex flex-col bg-zinc-900 border-r border-zinc-800/60">
            {/* Logo */}
            <div className="px-5 py-5 border-b border-zinc-800/60 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-green-app flex items-center justify-center flex-shrink-0 shadow-sm shadow-green-app/30">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-none">Slaega</p>
                <p className="text-zinc-500 text-xs mt-0.5">CMS Admin</p>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
              <p className="text-zinc-600 text-[10px] uppercase tracking-widest px-3 mb-2 font-medium">
                Contenu
              </p>

              <AdminNavItem href="/admin" exact>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </AdminNavItem>

              <AdminNavItem href="/admin/projects">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Projets
              </AdminNavItem>

              <AdminNavItem href="/admin/experience">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Expériences
              </AdminNavItem>

              <AdminNavItem href="/admin/about">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                À propos
              </AdminNavItem>

              <AdminNavItem href="/admin/services">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Services
              </AdminNavItem>

              <AdminNavItem href="/admin/messages">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Messages reçus
              </AdminNavItem>

              <div className="pt-4">
                <p className="text-zinc-600 text-[10px] uppercase tracking-widest px-3 mb-2 font-medium">
                  Page d&apos;accueil
                </p>

                <AdminNavItem href="/admin/stats">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  Stats banner
                </AdminNavItem>

                <AdminNavItem href="/admin/banner-about">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Carte à propos
                </AdminNavItem>

              </div>

              <div className="pt-4">
                <p className="text-zinc-600 text-[10px] uppercase tracking-widest px-3 mb-2 font-medium">
                  Médias
                </p>

                <AdminNavItem href="/admin/media">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Bibliothèque média
                </AdminNavItem>
              </div>

              <div className="pt-4">
                <p className="text-zinc-600 text-[10px] uppercase tracking-widest px-3 mb-2 font-medium">
                  Outils
                </p>

                <AdminNavItem href="/admin/cv-generator">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Générateur de CV
                </AdminNavItem>
              </div>

              <div className="pt-4">
                <p className="text-zinc-600 text-[10px] uppercase tracking-widest px-3 mb-2 font-medium">
                  Aperçu
                </p>
                <AdminNavItem href="/" external>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Voir le portfolio
                </AdminNavItem>
              </div>
            </nav>

            {/* User section */}
            <div className="px-3 py-3 border-t border-zinc-800/60">
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
                {session.user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt="avatar"
                    className="w-8 h-8 rounded-full ring-2 ring-zinc-700"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                    <span className="text-zinc-300 text-xs font-medium">
                      {session.user?.name?.[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-zinc-200 truncate font-medium leading-none">
                    {session.user?.name}
                  </p>
                  <p className="text-xs text-zinc-500 truncate mt-0.5">
                    {session.user?.email}
                  </p>
                </div>
              </div>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Se déconnecter
                </button>
              </form>
            </div>
          </aside>

          {/* ── Main ── */}
          <main className="flex-1 overflow-auto min-h-full bg-zinc-950">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
