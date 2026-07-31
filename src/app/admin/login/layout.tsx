import { Inter, Space_Grotesk } from 'next/font/google';
import '../../globals.css';

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] });
const spaceGrotesk = Space_Grotesk({
  variable: '--font-space',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
});

// Standalone layout for login page — overrides admin/layout.tsx
// No auth check here (would cause infinite redirect loop)
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${spaceGrotesk.variable} antialiased bg-[#0B0B0B] text-white`}>
        {children}
      </body>
    </html>
  );
}
