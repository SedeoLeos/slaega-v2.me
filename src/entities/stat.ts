export type StatColor = "green" | "rose" | "amber" | "dark" | "sky";

export type Stat = {
  id: string;
  value: string;
  label: string;
  color: StatColor;
  order: number;
  published: boolean;
};

export type CreateStatInput = Omit<Stat, "id">;
export type UpdateStatInput = Partial<CreateStatInput>;

export type AboutBlock = {
  id: string;
  label: string;
  body: string;
  ctaText: string;
  ctaHref: string;
  published: boolean;
  order: number;
};

export type CreateAboutBlockInput = Omit<AboutBlock, "id">;
export type UpdateAboutBlockInput = Partial<CreateAboutBlockInput>;
