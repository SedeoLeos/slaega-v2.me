'use client';

import { useEffect, useState } from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import CVDocumentRenderer from '../CVDocumentRenderer';
import { defaultSections, type CVData } from '../cv-types';
import { DEFAULT_PALETTE } from '../cv-palettes';

// Public CVs always render with the default design (Kronos + default palette).
export default function PublicCvViewer({
  id,
  title,
  onClose,
}: {
  id: string;
  title: string;
  onClose: () => void;
}) {
  const [cv, setCv] = useState<CVData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch(`/api/cv-generator/public?id=${encodeURIComponent(id)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        if (alive) setCv((d?.cv?.data as CVData) ?? null);
      })
      .catch(() => alive && setError(true));
    return () => {
      alive = false;
    };
  }, [id]);

  const doc = cv ? (
    <CVDocumentRenderer data={cv} template="kronos" palette={DEFAULT_PALETTE} sections={defaultSections()} />
  ) : null;

  const fileName = `cv-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'slaega'}.pdf`;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 md:px-8">
        <p className="min-w-0 truncate font-space text-sm font-semibold text-white">{title}</p>
        <div className="flex items-center gap-2">
          {doc && (
            <PDFDownloadLink
              document={doc}
              fileName={fileName}
              className="rounded-[2px] bg-white px-4 py-2 font-space text-xs font-semibold uppercase tracking-widest text-black transition-colors hover:bg-[#FF5A00]"
            >
              {({ loading }) => (loading ? '…' : 'Télécharger')}
            </PDFDownloadLink>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-[2px] border border-white/20 px-4 py-2 font-space text-xs uppercase tracking-widest text-white transition-colors hover:border-[#FF5A00] hover:text-[#FF5A00]"
          >
            Fermer ✕
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 overflow-hidden bg-neutral-900">
        {error ? (
          <div className="flex h-full items-center justify-center text-white/60">CV indisponible.</div>
        ) : !doc ? (
          <div className="flex h-full items-center justify-center text-white/60">
            <span className="animate-pulse font-space text-sm uppercase tracking-widest">Chargement…</span>
          </div>
        ) : (
          <PDFViewer width="100%" height="100%" showToolbar={false}>
            {doc}
          </PDFViewer>
        )}
      </div>
    </div>
  );
}
