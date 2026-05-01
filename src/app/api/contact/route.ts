import { NextResponse } from 'next/server';
import { trackEvent } from '@/lib/monitoring/telemetry';

export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body?.email || '').trim();
  const name = String(body?.name || '').trim();
  const message = String(body?.message || '').trim();

  if (!email || !name || !message) {
    return NextResponse.json({ ok: false, message: 'email, name and message are required' }, { status: 400 });
  }

  await trackEvent({
    event: 'contact_form_submitted',
    page: '/contact',
    payload: { email, name, messageLength: message.length },
  });

  return NextResponse.json({ ok: true });
}
