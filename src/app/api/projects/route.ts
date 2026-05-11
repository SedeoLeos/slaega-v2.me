import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { projectRepository } from "@/features/projects/repositories/project.repository";
import type {
  CreateProjectInput,
  UpdateProjectInput,
} from "@/entities/project";

/** Invalidate all project-related pages for both locales.
 * Default locale (fr) has no prefix; secondary locale (en) has /en prefix. */
function revalidateProject(slug?: string) {
  if (slug) {
    revalidatePath(`/project/${slug}`); // fr (default, no prefix)
    revalidatePath(`/en/project/${slug}`); // en
  }
  revalidatePath("/project"); // fr listing
  revalidatePath("/en/project"); // en listing
  revalidatePath("/"); // home (may show recent projects)
  revalidatePath("/en"); // en home
}

// ─── GET /api/projects ────────────────────────────────────────────────────────
// Public: published projects. With ?admin=1 + auth: all projects (incl. drafts)
export async function GET(req: NextRequest) {
  const isAdmin = req.nextUrl.searchParams.get("admin") === "1";

  if (isAdmin) {
    const session = await auth();
    if (!session)
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    const projects = await projectRepository.getAll();
    return NextResponse.json(projects);
  }

  const projects = await projectRepository.getPublished();
  return NextResponse.json(projects);
}

// ─── POST /api/projects ───────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const body = (await req.json()) as CreateProjectInput;
  const {
    title,
    date,
    categories = [],
    tags = [],
    image,
    content,
    description,
    published,
    projectUrl,
    githubUrl,
    videoUrl,
  } = body;

  if (!title?.trim() || !date?.trim() || !content?.trim()) {
    return NextResponse.json(
      { message: "title, date et content sont requis" },
      { status: 400 },
    );
  }

  const project = await projectRepository.create({
    title: title.trim(),
    date: date.trim(),
    tags,
    categories,
    image,
    content,
    description,
    published: published ?? true,
    projectUrl: projectUrl || undefined,
    githubUrl: githubUrl || undefined,
    videoUrl: videoUrl || undefined,
  });

  revalidateProject(project.slug);
  return NextResponse.json(project, { status: 201 });
}

// ─── PUT /api/projects?slug=xxx ───────────────────────────────────────────────
export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug)
    return NextResponse.json({ message: "slug requis" }, { status: 400 });

  const body = (await req.json()) as UpdateProjectInput;
  const updated = await projectRepository.update(slug, body);
  if (!updated)
    return NextResponse.json(
      { message: "Projet introuvable" },
      { status: 404 },
    );

  revalidateProject(slug);
  return NextResponse.json(updated);
}

// ─── DELETE /api/projects?slug=xxx ────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug)
    return NextResponse.json({ message: "slug requis" }, { status: 400 });

  const deleted = await projectRepository.delete(slug);
  if (deleted) revalidateProject(slug);

  return deleted
    ? NextResponse.json({ ok: true })
    : NextResponse.json({ message: "Projet introuvable" }, { status: 404 });
}
