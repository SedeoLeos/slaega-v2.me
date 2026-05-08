import { db } from "@/lib/db";
import type {
  ContactField,
  ContactFieldType,
  CreateContactFieldInput,
  UpdateContactFieldInput,
} from "@/entities/contact-field";

function mapRow(r: {
  id: string;
  name: string;
  label: string;
  type: string;
  placeholder: string;
  required: boolean;
  options: string;
  order: number;
  published: boolean;
}): ContactField {
  let options: string[] = [];
  try {
    options = JSON.parse(r.options || "[]");
  } catch {
    options = [];
  }
  return {
    id: r.id,
    name: r.name,
    label: r.label,
    type: r.type as ContactFieldType,
    placeholder: r.placeholder,
    required: r.required,
    options,
    order: r.order,
    published: r.published,
  };
}

export const contactFieldRepository = {
  async getAll(): Promise<ContactField[]> {
    const rows = await db.contactField.findMany({ orderBy: { order: "asc" } });
    return rows.map(mapRow);
  },
  async getPublished(): Promise<ContactField[]> {
    const rows = await db.contactField.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    return rows.map(mapRow);
  },
  async getById(id: string): Promise<ContactField | null> {
    const row = await db.contactField.findUnique({ where: { id } });
    return row ? mapRow(row) : null;
  },
  async create(data: CreateContactFieldInput): Promise<ContactField> {
    const row = await db.contactField.create({
      data: {
        ...data,
        options: JSON.stringify(data.options ?? []),
      },
    });
    return mapRow(row);
  },
  async update(id: string, data: UpdateContactFieldInput): Promise<ContactField | null> {
    const existing = await db.contactField.findUnique({ where: { id } });
    if (!existing) return null;
    const row = await db.contactField.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.label !== undefined && { label: data.label }),
        ...(data.type !== undefined && { type: data.type }),
        ...(data.placeholder !== undefined && { placeholder: data.placeholder }),
        ...(data.required !== undefined && { required: data.required }),
        ...(data.options !== undefined && { options: JSON.stringify(data.options) }),
        ...(data.order !== undefined && { order: data.order }),
        ...(data.published !== undefined && { published: data.published }),
      },
    });
    return mapRow(row);
  },
  async delete(id: string): Promise<boolean> {
    try {
      await db.contactField.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  },
};
