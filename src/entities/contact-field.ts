export type ContactFieldType = "text" | "email" | "tel" | "textarea" | "select";

export type ContactField = {
  id: string;
  name: string;
  label: string;
  type: ContactFieldType;
  placeholder: string;
  required: boolean;
  options: string[]; // for select
  order: number;
  published: boolean;
};

export type CreateContactFieldInput = Omit<ContactField, "id">;
export type UpdateContactFieldInput = Partial<CreateContactFieldInput>;
