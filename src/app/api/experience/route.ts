import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { experienceRepository } from '@/features/experience/repositories/experience.repository';
import type { Experience } from '@/entities/experience';

export async function GET() {
  const experiences = experienceRepository.getAll();
  return NextResponse.json(experiences);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });

  const body = await req.json();
  const { company, role, startDate, endDate, current, description, skills, location, companyUrl } = body;

  if (!company || !role || !startDate || !description) {
    return NextResponse.json({ message: 'Champs requis manquants' }, { status: 400 });
  }

  const id = `${company.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${startDate.replace('-', '')}`;

  if (experienceRepository.getById(id)) {
    return NextResponse.json({ message: 'Une expérience avec cet identifiant existe déjà' }, { status: 409 });
  }

  const experience: Experience = {
    id,
    company,
    role,
    startDate,
    endDate: current ? null : (endDate ?? null),
    current: Boolean(current),
    description,
    skills: Array.isArray(skills) ? skills : String(skills || '').split(',').map((s) => s.trim()).filter(Boolean),
    location: location ?? '',
    companyUrl: companyUrl ?? '',
  };

  experienceRepository.save(experience);
  return NextResponse.json({ ok: true, id }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ message: 'ID manquant' }, { status: 400 });

  const deleted = experienceRepository.delete(id);
  return deleted
    ? NextResponse.json({ ok: true })
    : NextResponse.json({ message: 'Non trouvé' }, { status: 404 });
}
