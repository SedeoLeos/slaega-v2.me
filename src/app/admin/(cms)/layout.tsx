import '../../globals.css';
import { Inter, Poppins } from 'next/font/google';
import Link from 'next/link';
import { auth, signOut } from '@/auth';
import { redirect } from 'next/navigation';

export const metadata = { title: 'Admin — Slaega' };

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] });
const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export default async function AdminCmsLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect('/admin/login');

  return (
    <html lang="fr">
      <body className={`${inter.variable} ${poppins.variable} antialiased`}>
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
          {/* Sidebar */}
          <aside className="w-60 flex-shrink-0 bg-zinc-900 border-r border-zinc-800 flex flex-col">
            <div className="px-6 py-5 border-b border-zinc-800">
              <Link href="/" className="text-green-400 font-bold text-xl tracking-tight">
                Slaega
              </Link>
              <p className="text-zinc-500 text-xs mt-0.5">Admin CMS</p>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1">
              <p className="text-zinc-500 text-xs uppercase tracking-wider px-3 mb-2">Contenu</p>

              <Link href="/admin" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </Link>

              <Link href="/admin/projects" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Projets
              </Link>

              <Link href="/admin/experience" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Expériences
              </Link>
            </nav>

            <div className="px-3 py-4 border-t border-zinc-800">
              <div className="flex items-center gap-3 px-3 py-2 mb-2">
                {session.user?.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={session.user.image} alt="avatar" className="w-8 h-8 rounded-full" />
                )}
                <div className="min-w-0">
                  <p className="text-sm text-zinc-200 truncate">{session.user?.name}</p>
                  <p className="text-xs text-zinc-500 truncate">{session.user?.email}</p>
                </div>
              </div>
              <form action={async () => { 'use server'; await signOut({ redirectTo: '/' }); }}>
                <button type="submit" className="w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Se déconnecter
                </button>
              </form>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
