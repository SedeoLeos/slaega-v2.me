import fs from 'fs';
import path from 'path';
import type { Experience } from '@/entities/experience';

const EXPERIENCE_DIR = path.join(process.cwd(), 'src', 'content', 'experience');

function ensureDir() {
  if (!fs.existsSync(EXPERIENCE_DIR)) fs.mkdirSync(EXPERIENCE_DIR, { recursive: true });
}

export const experienceRepository = {
  getAll(): Experience[] {
    ensureDir();
    const files = fs.readdirSync(EXPERIENCE_DIR).filter((f) => f.endsWith('.json'));
    const experiences = files.map((f) => {
      const raw = fs.readFileSync(path.join(EXPERIENCE_DIR, f), 'utf-8');
      return JSON.parse(raw) as Experience;
    });
    return experiences.sort((a, b) => {
      const aDate = a.current ? '9999-99' : (a.endDate ?? '0000-00');
      const bDate = b.current ? '9999-99' : (b.endDate ?? '0000-00');
      return bDate.localeCompare(aDate);
    });
  },

  getById(id: string): Experience | null {
    ensureDir();
    const filePath = path.join(EXPERIENCE_DIR, `${id}.json`);
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Experience;
  },

  save(exp: Experience): void {
    ensureDir();
    const filePath = path.join(EXPERIENCE_DIR, `${exp.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(exp, null, 2), 'utf-8');
  },

  delete(id: string): boolean {
    const filePath = path.join(EXPERIENCE_DIR, `${id}.json`);
    if (!fs.existsSync(filePath)) return false;
    fs.unlinkSync(filePath);
    return true;
  },
};
