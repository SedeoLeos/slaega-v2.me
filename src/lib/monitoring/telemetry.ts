export type TelemetryEvent = {
  event: string;
  page?: string;
  locale?: string;
  payload?: Record<string, unknown>;
  timestamp: string;
};

const TELEMETRY_WEBHOOK_URL = process.env.TELEMETRY_WEBHOOK_URL;

export async function trackEvent(event: Omit<TelemetryEvent, 'timestamp'>) {
  const data: TelemetryEvent = { ...event, timestamp: new Date().toISOString() };

  console.info('[telemetry]', data);

  if (!TELEMETRY_WEBHOOK_URL) return { delivered: false };

  try {
    await fetch(TELEMETRY_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return { delivered: true };
  } catch {
    return { delivered: false };
  }
}
