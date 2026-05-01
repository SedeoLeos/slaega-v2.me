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
};
