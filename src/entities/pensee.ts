export type PenseeKind = "pensee" | "croyance" | "vision" | "chanson";

export type Pensee = {
  id: string;
  kind: PenseeKind;
  title: string;
  subtitle: string;
  body: string;
  order: number;
  published: boolean;
};

export type CreatePenseeInput = Omit<Pensee, "id">;
export type UpdatePenseeInput = Partial<CreatePenseeInput>;

export const PENSEE_KINDS: { value: PenseeKind; label: string; blurb: string }[] = [
  { value: "croyance", label: "Croyance", blurb: "Ce en quoi je crois" },
  { value: "vision", label: "Vision de l'humanité", blurb: "Ma vision du monde et des hommes" },
  { value: "pensee", label: "Pensée", blurb: "Réflexions, notes, idées" },
  { value: "chanson", label: "Chanson", blurb: "Les écrits de mes sons" },
];

export function penseeKindLabel(kind: string): string {
  return PENSEE_KINDS.find((k) => k.value === kind)?.label ?? "Pensée";
}
