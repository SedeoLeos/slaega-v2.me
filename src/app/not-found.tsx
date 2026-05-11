import Link from 'next/link';

/**
 * Global 404 — rendered when no [locale] segment matches.
 * No next-intl context available here, so strings are hardcoded.
 */
export default function GlobalNotFound() {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          fontFamily: 'system-ui, sans-serif',
          background: '#dcded0',
          color: '#0e0e0e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ fontSize: '7rem', fontWeight: 800, lineHeight: 1, margin: 0, opacity: 0.12 }}>
            404
          </p>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '1rem' }}>
            Page introuvable
          </h1>
          <p style={{ opacity: 0.55, marginTop: '0.5rem' }}>
            Cette page n&apos;existe pas.
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-block',
              marginTop: '1.5rem',
              background: '#0e0e0e',
              color: '#dcded0',
              padding: '0.75rem 2rem',
              borderRadius: '999px',
              fontWeight: 600,
              fontSize: '0.875rem',
              textDecoration: 'none',
            }}
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </body>
    </html>
  );
}
