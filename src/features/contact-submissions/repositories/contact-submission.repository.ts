import { db } from "@/lib/db";
import type {
  ContactSubmission,
  CreateContactSubmissionInput,
  UpdateContactSubmissionInput,
} from "@/entities/contact-submission";

function mapRow(r: {
  id: string;
  data: string;
  name: string;
  email: string;
  subject: string;
  read: boolean;
  archived: boolean;
  ip: string | null;
  userAgent: string | null;
  createdAt: Date;
}): ContactSubmission {
  let data: Record<string, string> = {};
  try {
    data = JSON.parse(r.data || "{}");
  } catch {
    data = {};
  }
  return {
    id: r.id,
    data,
    name: r.name,
    email: r.email,
    subject: r.subject,
    read: r.read,
    archived: r.archived,
    ip: r.ip,
    userAgent: r.userAgent,
    createdAt: r.createdAt.toISOString(),
  };
}

export const contactSubmissionRepository = {
  async getAll(): Promise<ContactSubmission[]> {
    const rows = await db.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
    });
    return rows.map(mapRow);
  },
  async getInbox(): Promise<ContactSubmission[]> {
    const rows = await db.contactSubmission.findMany({
      where: { archived: false },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(mapRow);
  },
  async getArchived(): Promise<ContactSubmission[]> {
    const rows = await db.contactSubmission.findMany({
      where: { archived: true },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(mapRow);
  },
  async countUnread(): Promise<number> {
    return db.contactSubmission.count({ where: { read: false, archived: false } });
  },
  async getById(id: string): Promise<ContactSubmission | null> {
    const row = await db.contactSubmission.findUnique({ where: { id } });
    return row ? mapRow(row) : null;
  },
  async create(input: CreateContactSubmissionInput): Promise<ContactSubmission> {
    const row = await db.contactSubmission.create({
      data: {
        data: JSON.stringify(input.data),
        name: input.name ?? input.data.name ?? "",
        email: input.email ?? input.data.email ?? "",
        subject: input.subject ?? input.data.subject ?? "",
        ip: input.ip ?? null,
        userAgent: input.userAgent ?? null,
      },
    });
    return mapRow(row);
  },
  async update(id: string, data: UpdateContactSubmissionInput): Promise<ContactSubmission | null> {
    const existing = await db.contactSubmission.findUnique({ where: { id } });
    if (!existing) return null;
    const row = await db.contactSubmission.update({
      where: { id },
      data: {
        ...(data.read !== undefined && { read: data.read }),
        ...(data.archived !== undefined && { archived: data.archived }),
      },
    });
    return mapRow(row);
  },
  async delete(id: string): Promise<boolean> {
    try {
      await db.contactSubmission.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  },
};
