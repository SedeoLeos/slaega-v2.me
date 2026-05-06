"use client";
/**
 * CVDocumentRenderer — thin wrapper that routes to the right react-pdf template.
 * Kept separate so PDFViewer / PDFDownloadLink can both import it.
 */
import type { CVData, CVSections, CVTemplateId } from "./cv-types";
import type { CVPalette } from "./cv-palettes";
import TemplateKronos from "./templates/TemplateKronos";
import TemplateNexus from "./templates/TemplateNexus";
import TemplatePrism from "./templates/TemplatePrism";
import TemplateDuo from "./templates/TemplateDuo";
import TemplateOrbit from "./templates/TemplateOrbit";
import TemplateNova from "./templates/TemplateNova";
import TemplatePulse from "./templates/TemplatePulse";
import TemplateSupra from "./templates/TemplateSupra";
import TemplateHello from "./templates/TemplateHello";
import TemplateMosaic from "./templates/TemplateMosaic";
import TemplateJulien from "./templates/TemplateJulien";

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
  if (template === "duo")
    return <TemplateDuo data={data} palette={palette} sections={sections} />;
  if (template === "orbit")
    return <TemplateOrbit data={data} palette={palette} sections={sections} />;
  if (template === "nova")
    return <TemplateNova data={data} palette={palette} sections={sections} />;
  if (template === "pulse")
    return <TemplatePulse data={data} palette={palette} sections={sections} />;
  if (template === "supra")
    return <TemplateSupra data={data} palette={palette} sections={sections} />;
  if (template === "hello")
    return <TemplateHello data={data} palette={palette} sections={sections} />;
  if (template === "mosaic")
    return <TemplateMosaic data={data} sections={sections} />;
  if (template === "julien")
    return <TemplateJulien data={data} palette={palette} sections={sections} />;
  return <TemplateKronos data={data} palette={palette} sections={sections} />;
}
