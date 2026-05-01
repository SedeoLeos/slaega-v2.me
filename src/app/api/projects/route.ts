import fs from 'node:fs';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { trackEvent } from '@/lib/monitoring/telemetry';

const PROJECTS_DIRECTORY = path.join(process.cwd(), 'src/content/project');

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export async function POST(request: Request) {
  const body = await request.json();
  const title = String(body?.title || '').trim();
  const date = String(body?.date || '').trim();
  const categories = Array.isArray(body?.categories) ? body.categories.map(String) : [];
  const tags = Array.isArray(body?.tags) ? body.tags.map(String) : [];
  const image = String(body?.image || '/img.jpg').trim();
  const content = String(body?.content || '').trim();

  if (!title || !date || !content) {
    return NextResponse.json({ ok: false, message: 'title, date and content are required' }, { status: 400 });
  }

  const slug = slugify(title);
  const filePath = path.join(PROJECTS_DIRECTORY, `${slug}.mdx`);

  if (fs.existsSync(filePath)) {
    return NextResponse.json({ ok: false, message: 'project already exists' }, { status: 409 });
  }

  const frontmatter = `---\ntitle: "${title}"\ndate: "${date}"\ntags: [${tags.map((t) => `"${t}"`).join(', ')}]\ncategories: [${categories.map((c) => `"${c}"`).join(', ')}]\nimage: "${image}"\n---\n\n`;

  fs.writeFileSync(filePath, `${frontmatter}${content}\n`, 'utf-8');

  await trackEvent({ event: 'project_created', page: '/tools/content-editor', payload: { slug, title } });

  return NextResponse.json({ ok: true, slug });
}
