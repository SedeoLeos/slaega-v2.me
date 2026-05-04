import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { trackEvent } from "@/lib/monitoring/telemetry";
import { contactSubmissionRepository } from "@/features/contact-submissions/repositories/contact-submission.repository";

// ── Public: submit a new contact message ──────────────────────────
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, message: "Body invalide" }, { status: 400 });
  }

  // Coerce all values to strings (the form is dynamic — any field can be present)
  const data: Record<string, string> = {};
  for (const [key, value] of Object.entries(body)) {
    data[key] = String(value ?? "").trim();
  }

  // Minimal validation: at least one of (email, message) must be present
  const email = (data.email ?? "").trim();
  const message = (data.message ?? "").trim();
  const name = (data.name ?? "").trim();
  if (!email && !message) {
    return NextResponse.json(
      { ok: false, message: "email ou message requis" },
      { status: 400 }
    );
  }

  // Honeypot anti-spam: if the field "website" is filled, drop silently.
  if ((data.website ?? "").length > 0) {
    return NextResponse.json({ ok: true });
  }

  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      null;
    const userAgent = req.headers.get("user-agent") ?? null;

    await contactSubmissionRepository.create({
      data,
      name,
      email,
      subject: data.subject ?? "",
      ip,
      userAgent,
    });

    await trackEvent({
      event: "contact_form_submitted",
      page: "/contact",
      payload: { email, name, messageLength: message.length },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur serveur";
    return NextResponse.json({ ok: false, message: msg }, { status: 500 });
  }
}

// ── Admin: list submissions (used by /admin/messages) ─────────────
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }
  const filter = req.nextUrl.searchParams.get("filter");
  if (filter === "archived") {
    return NextResponse.json(await contactSubmissionRepository.getArchived());
  }
  if (filter === "all") {
    return NextResponse.json(await contactSubmissionRepository.getAll());
  }
  return NextResponse.json(await contactSubmissionRepository.getInbox());
}

// ── Admin: update read/archived state ─────────────────────────────
export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ message: "ID manquant" }, { status: 400 });
  }
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ message: "Body invalide" }, { status: 400 });
  }
  const updated = await contactSubmissionRepository.update(id, body);
  if (!updated) {
    return NextResponse.json({ message: "Introuvable" }, { status: 404 });
  }
  return NextResponse.json(updated);
}

// ── Admin: delete a submission ────────────────────────────────────
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ message: "ID manquant" }, { status: 400 });
  }
  const ok = await contactSubmissionRepository.delete(id);
  return NextResponse.json({ ok });
}
