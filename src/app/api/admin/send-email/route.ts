import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getResend, EMAIL_FROM } from '@/lib/email/resend';
import { buildEmailHtml, buildEmailText } from '@/lib/email/templates';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: {
    to: string;
    subject: string;
    emailBody: string;
    senderName: string;
    senderTitle: string;
    senderPortfolio: string;
    accentColor?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { to, subject, emailBody, senderName, senderTitle, senderPortfolio, accentColor } = body;

  if (!to || !subject || !emailBody) {
    return NextResponse.json({ error: 'Missing required fields: to, subject, emailBody' }, { status: 400 });
  }

  // Basic email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }

  try {
    const resend = getResend();
    const html = buildEmailHtml({ senderName, senderTitle, senderPortfolio, body: emailBody, accentColor });
    const text = buildEmailText(emailBody, senderName, senderTitle, senderPortfolio);

    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject,
      html,
      text,
      replyTo: session.user?.email ?? undefined,
    });

    return NextResponse.json({ ok: true, id: result.data?.id });
  } catch (err) {
    console.error('[send-email]', err);
    const message = err instanceof Error ? err.message : 'Email send failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// AI-generate email body
export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: { systemPrompt: string; extraContext?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 503 });

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 600,
        messages: [{ role: 'user', content: body.systemPrompt }],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `AI error: ${err}` }, { status: 500 });
    }

    const data = await res.json() as { content: { type: string; text: string }[] };
    const text = data.content.find((c) => c.type === 'text')?.text ?? '';

    return NextResponse.json({ ok: true, text });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AI generation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
