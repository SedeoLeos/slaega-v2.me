export type AboutHighlightGroup = {
  title: string;
  items: string[];
};

export type AboutPage = {
  id: string;
  label: string;
  title: string;
  intro: string;
  body: string;
  highlights: AboutHighlightGroup[];
  ctaText: string;
  ctaHref: string;
  published: boolean;
};

export type CreateAboutPageInput = Omit<AboutPage, "id">;
export type UpdateAboutPageInput = Partial<CreateAboutPageInput>;
