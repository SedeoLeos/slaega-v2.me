import Link from 'next/link';

/**
 * Global 404 — rendered when no [locale] segment matches.
 * No next-intl context available here, so strings are hardcoded.
 * Mirrors the slaega brutalist look (deep charcoal + electric tangerine).
 */
export default function GlobalNotFound() {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          background: '#0B0B0B',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              fontSize: '11px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.45)',
              margin: 0,
            }}
          >
            <span style={{ color: '#FF5A00' }}>✦</span> erreur 404
          </p>
          <p
            style={{
              fontSize: 'clamp(5rem, 22vw, 12rem)',
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: '-0.04em',
              margin: '1.5rem 0 0',
            }}
          >
            <span style={{ color: 'rgba(255,255,255,0.12)' }}>4</span>
            <span style={{ color: '#FF5A00' }}>0</span>
            <span style={{ color: 'rgba(255,255,255,0.12)' }}>4</span>
          </p>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '1rem', letterSpacing: '-0.01em' }}>
            Page introuvable
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', marginTop: '0.5rem' }}>
            Cette page n&apos;existe pas.
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              marginTop: '1.75rem',
              background: '#FFFFFF',
              color: '#0B0B0B',
              padding: '0.9rem 2rem',
              borderRadius: '2px',
              fontWeight: 600,
              fontSize: '0.8rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            Retour à l&apos;accueil →
          </Link>
        </div>
      </body>
    </html>
  );
}
