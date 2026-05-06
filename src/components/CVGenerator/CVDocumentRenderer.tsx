'use client';
/**
 * CVDocumentRenderer — thin wrapper that routes to the right react-pdf template.
 * Kept separate so PDFViewer / PDFDownloadLink can both import it.
 */
import type { CVData, CVSections, CVTemplateId } from './cv-types';
import type { CVPalette } from './cv-palettes';
import TemplateKronos from './templates/TemplateKronos';
import TemplateNexus  from './templates/TemplateNexus';
import TemplatePrism  from './templates/TemplatePrism';

type Props = {
  data: CVData;
  template: CVTemplateId;
  palette: CVPalette;
  sections: CVSections;
};

export default function CVDocumentRenderer({ data, template, palette, sections }: Props) {
  if (template === 'nexus') return <TemplateNexus  data={data} palette={palette} sections={sections} />;
  if (template === 'prism') return <TemplatePrism  data={data} palette={palette} sections={sections} />;
  return                           <TemplateKronos data={data} palette={palette} sections={sections} />;
}
