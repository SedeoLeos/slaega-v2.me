'use client';

// This client-component wrapper is the only place allowed to use
// `dynamic + ssr:false` in the App Router — server components cannot.
import dynamic from 'next/dynamic';

const CVGeneratorClient = dynamic(
  () => import('./CVGeneratorClient'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96 text-zinc-500 text-sm animate-pulse">
        Chargement du générateur…
      </div>
    ),
  }
);

export default CVGeneratorClient;
