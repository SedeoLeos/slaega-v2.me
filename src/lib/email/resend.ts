import { Resend } from 'resend';

// Lazily instantiated so missing env vars don't crash at import time
let _resend: Resend | null = null;

export function getResend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error('RESEND_API_KEY is not set in environment variables');
    _resend = new Resend(key);
  }
  return _resend;
}

export const EMAIL_FROM = process.env.EMAIL_FROM ?? 'onboarding@resend.dev';
