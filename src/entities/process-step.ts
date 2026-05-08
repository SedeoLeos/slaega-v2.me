export type ProcessStep = {
  id: string;
  stepNumber: number;
  label: string;
  title: string;
  description: string;
  order: number;
  published: boolean;
};

export type CreateProcessStepInput = Omit<ProcessStep, "id">;
export type UpdateProcessStepInput = Partial<CreateProcessStepInput>;
