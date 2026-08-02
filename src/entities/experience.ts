export type ExperienceI18n = {
  en?: { role?: string; description?: string; location?: string };
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  startDate: string; // YYYY-MM
  endDate: string | null; // YYYY-MM or null if current
  current: boolean;
  description: string;
  skills: string[];
  location: string;
  companyUrl?: string;
  translations?: ExperienceI18n;
};

export type CreateExperienceInput = Omit<Experience, "id">;
export type UpdateExperienceInput = Partial<CreateExperienceInput>;
