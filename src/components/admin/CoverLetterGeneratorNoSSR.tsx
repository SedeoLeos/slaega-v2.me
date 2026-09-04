"use client";

// @react-pdf/renderer (PDFDownloadLink) references browser-only APIs and must
// not run during SSR — load the generator client-side only, like the CV one.
import dynamic from "next/dynamic";

const CoverLetterGenerator = dynamic(() => import("./CoverLetterGenerator"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96 text-zinc-500 text-sm animate-pulse">
      Chargement du générateur…
    </div>
  ),
});

export default CoverLetterGenerator;
