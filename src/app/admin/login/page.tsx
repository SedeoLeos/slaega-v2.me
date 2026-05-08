import { signIn } from '@/auth';

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">

      {/* Grid texture — utilise la couleur de bordure du thème */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Radial glow center — accent vert du thème */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(5,121,107,0.07) 0%, transparent 65%)',
        }}
      />

      {/* Card */}
      <div className="relative w-full max-w-[400px] z-10">

        {/* Badge */}
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase border border-green-app/30 text-green-app bg-green-app/8">
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            ADMIN // CMS
          </span>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-foreground">
            Slaega
          </h1>
          <p className="text-sm text-secondary">
            Tableau de bord — accès restreint
          </p>
        </div>

        {/* Login card */}
        <div className="rounded-2xl p-8 bg-card border border-border">

          {/* Label */}
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-5 text-center text-secondary">
            Authentification
          </p>

          <form
            action={async () => {
              'use server';
              await signIn('github', {
                redirectTo: params.callbackUrl ?? '/admin',
              });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 py-3.5 px-5 rounded-xl font-semibold text-sm transition-all duration-200 bg-foreground text-background hover:opacity-85 active:scale-[0.98]"
            >
              {/* GitHub icon */}
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              Continuer avec GitHub
            </button>
          </form>

          {params.error && (
            <div className="mt-5 flex items-center gap-2 px-4 py-3 rounded-lg text-xs border border-red-500/20 bg-red-500/8 text-red-600">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Accès refusé — seul le propriétaire peut se connecter.
            </div>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-[11px] mt-6 tracking-wide text-secondary opacity-50">
          Accès limité au propriétaire du portfolio
        </p>
      </div>
    </div>
  );
}
