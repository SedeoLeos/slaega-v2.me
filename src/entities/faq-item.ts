export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  order: number;
  published: boolean;
};

export type CreateFaqItemInput = Omit<FaqItem, "id">;
export type UpdateFaqItemInput = Partial<CreateFaqItemInput>;
