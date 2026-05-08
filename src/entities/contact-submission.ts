export type ContactSubmission = {
  id: string;
  data: Record<string, string>;
  name: string;
  email: string;
  subject: string;
  read: boolean;
  archived: boolean;
  ip?: string | null;
  userAgent?: string | null;
  createdAt: string; // ISO
};

export type CreateContactSubmissionInput = {
  data: Record<string, string>;
  name?: string;
  email?: string;
  subject?: string;
  ip?: string | null;
  userAgent?: string | null;
};

export type UpdateContactSubmissionInput = {
  read?: boolean;
  archived?: boolean;
};
