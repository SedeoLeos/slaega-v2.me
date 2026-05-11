import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { experienceRepository } from "@/features/experience/repositories/experience.repository";
import { revalidateExperience } from "@/lib/revalidation";
import type { CreateExperienceInput, UpdateExperienceInput } from "@/entities/experience";
// ─── GET /api/experience ──────────────────────────────────────────────────────
export async function GET() {
  const experiences = await experienceRepository.getAll();
  return NextResponse.json(experiences);
}

// ─── POST /api/experience ─────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const body = (await req.json()) as CreateExperienceInput;
  const { company, role, startDate, description } = body;

  if (!company || !role || !startDate || !description) {
    return NextResponse.json({ message: "Champs requis manquants" }, { status: 400 });
  }

  const experience = await experienceRepository.create(body);
  revalidateExperience()
  return NextResponse.json(experience, { status: 201 });
}

// ─── PUT /api/experience?id=xxx ───────────────────────────────────────────────
export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ message: "id requis" }, { status: 400 });

  const body = (await req.json()) as UpdateExperienceInput;
  const updated = await experienceRepository.update(id, body);
  if (!updated) return NextResponse.json({ message: "Expérience introuvable" }, { status: 404 });
  revalidateExperience()
  return NextResponse.json(updated);
}

// ─── DELETE /api/experience?id=xxx ───────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ message: "id requis" }, { status: 400 });

  const deleted = await experienceRepository.delete(id);
  if (!deleted) return NextResponse.json({ message: "Expérience introuvable" }, { status: 404 });
  revalidateExperience()
  return NextResponse.json({ ok: true });
}
