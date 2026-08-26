"use client";
/**
 * CVDocumentRenderer — thin wrapper that routes to the right react-pdf template.
 * Kept separate so PDFViewer / PDFDownloadLink can both import it.
 */
import { Font } from "@react-pdf/renderer";
import type { CVData, CVSections, CVTemplateId } from "./cv-types";
import type { CVPalette } from "./cv-palettes";

// Disable react-pdf's automatic word hyphenation so names/long words wrap
// whole (e.g. "MATSOULA MALONGA") instead of breaking as "MALON-GA".
Font.registerHyphenationCallback((word) => [word]);
import TemplateKronos from "./templates/TemplateKronos";
import TemplateNexus from "./templates/TemplateNexus";
import TemplatePrism from "./templates/TemplatePrism";
import TemplateSupra from "./templates/TemplateSupra";

type Props = {
  data: CVData;
  template: CVTemplateId;
  palette: CVPalette;
  sections: CVSections;
};

export default function CVDocumentRenderer({
  data,
  template,
  palette,
  sections,
}: Props) {
  if (template === "nexus")
    return <TemplateNexus data={data} palette={palette} sections={sections} />;
  if (template === "prism")
    return <TemplatePrism data={data} palette={palette} sections={sections} />;
  if (template === "supra")
    return <TemplateSupra data={data} palette={palette} sections={sections} />;
  return <TemplateKronos data={data} palette={palette} sections={sections} />;
}
