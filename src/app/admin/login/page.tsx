import { signIn } from '@/auth';

const space = { fontFamily: 'var(--font-space), ui-sans-serif, system-ui, sans-serif' };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0B0B0B] p-6 font-[var(--font-inter)] text-white">
      {/* Grid texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
          maskImage: 'radial-gradient(circle at 50% 45%, black 0%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 45%, black 0%, transparent 75%)',
        }}
      />
      {/* Tangerine glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(255,90,0,0.10) 0%, transparent 65%)' }}
      />

      <div className="relative z-10 w-full max-w-[420px]">
        {/* Badge */}
        <div className="mb-10 flex justify-center">
          <span
            style={space}
            className="inline-flex items-center gap-2 rounded-[2px] border border-white/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#FF5A00]" />
            admin // cms
          </span>
        </div>

        {/* Wordmark */}
        <div className="mb-10 text-center">
          <h1 style={space} className="text-6xl font-bold lowercase tracking-tighter text-white">
            slaega<span className="text-[#FF5A00]">.</span>
          </h1>
          <p className="mt-3 text-sm text-white/45">Tableau de bord — accès restreint</p>
        </div>

        {/* Card */}
        <div className="rounded-[3px] border border-white/10 bg-[#121212] p-8">
          <p
            style={space}
            className="mb-6 text-center text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40"
          >
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
              style={space}
              className="group flex w-full items-center justify-center gap-3 rounded-[2px] bg-white px-5 py-4 text-sm font-semibold uppercase tracking-widest text-[#0B0B0B] transition-colors hover:bg-[#FF5A00] active:scale-[0.99]"
            >
              <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              Continuer avec GitHub
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </form>

          {params.error && (
            <div className="mt-5 flex items-center gap-2 rounded-[2px] border border-[#FF5A00]/30 bg-[#FF5A00]/10 px-4 py-3 text-xs text-[#FF5A00]">
              <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Accès refusé — seul le propriétaire peut se connecter.
            </div>
          )}
        </div>

        {/* Footer note */}
        <p className="mt-8 text-center text-[11px] uppercase tracking-[0.25em] text-white/25">
          Seba Gedeon · king sedeo leos
        </p>
      </div>
    </div>
  );
}
