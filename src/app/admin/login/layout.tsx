import { Inter } from 'next/font/google';
import '../../globals.css';

const inter = Inter({ subsets: ['latin'] });

// Standalone layout for login page — overrides admin/layout.tsx
// No auth check here (would cause infinite redirect loop)
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-zinc-950 text-zinc-100`}>
        {children}
      </body>
    </html>
  );
}
