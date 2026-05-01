import { NextResponse } from 'next/server';
import { trackEvent } from '@/lib/monitoring/telemetry';

export async function POST(request: Request) {
  const body = await request.json();
  const event = typeof body?.event === 'string' ? body.event : 'unknown_event';
  const page = typeof body?.page === 'string' ? body.page : undefined;
  const locale = typeof body?.locale === 'string' ? body.locale : undefined;
  const payload = typeof body?.payload === 'object' && body.payload ? body.payload : undefined;

  const result = await trackEvent({ event, page, locale, payload });

  return NextResponse.json({ ok: true, ...result });
}
