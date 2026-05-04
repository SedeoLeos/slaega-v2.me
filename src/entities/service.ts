export type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  published: boolean;
};

export type CreateServiceInput = Omit<Service, "id">;
export type UpdateServiceInput = Partial<CreateServiceInput>;
