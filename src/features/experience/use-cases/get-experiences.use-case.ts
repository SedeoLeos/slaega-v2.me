import type { Experience } from '@/entities/experience';
import { experienceRepository } from '@/features/experience/repositories/experience.repository';

export const getExperiences = async (): Promise<Experience[]> => {
  return experienceRepository.getAll();
};
