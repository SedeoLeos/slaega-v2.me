'use client';

import { useState, useMemo } from 'react';
import { EMAIL_TEMPLATES } from '@/lib/email/templates';
import type { EmailTemplateId, EmailContext } from '@/lib/email/templates';
import { buildEmailHtml } from '@/lib/email/templates';

// ── SVG icons per template ────────────────────────────────────────────────────
const TEMPLATE_ICONS: Record<string, React.ReactNode> = {
  application: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  'follow-up': (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  networking: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  'thank-you': (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  custom: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
};

// ── Profile defaults (user can override in the form) ─────────────────────────
const DEFAULT_PROFILE = {
  senderName: 'Gedeon Leos',
  senderTitle: 'Développeur Full-stack',
  senderPortfolio: 'https://slaega.me',
  accentColor: '#4ade80',
};

type Tab = 'compose' | 'preview';
type SendStatus = 'idle' | 'sending' | 'sent' | 'error';

export default function EmailComposer() {
  // Template
  const [templateId, setTemplateId] = useState<EmailTemplateId>('application');

  // Context fields
  const [recipientName, setRecipientName] = useState('');
  const [to,           setTo          ] = useState('');
  const [company,      setCompany     ] = useState('');
  const [jobTitle,     setJobTitle    ] = useState('');
  const [tone, setTone] = useState<EmailContext['tone']>('neutral');
  const [extraContext, setExtraContext] = useState('');

  // Sender profile
  const [senderName,      setSenderName     ] = useState(DEFAULT_PROFILE.senderName);
  const [senderTitle,     setSenderTitle    ] = useState(DEFAULT_PROFILE.senderTitle);
  const [senderPortfolio, setSenderPortfolio] = useState(DEFAULT_PROFILE.senderPortfolio);
  const [accentColor,     setAccentColor    ] = useState(DEFAULT_PROFILE.accentColor);

  // Body
  const [subject, setSubject] = useState('');
  const [body,    setBody   ] = useState('');

  // UI state
  const [tab,        setTab       ] = useState<Tab>('compose');
  const [generating, setGenerating] = useState(false);
  const [genError,   setGenError  ] = useState('');
  const [sendStatus, setSendStatus] = useState<SendStatus>('idle');
  const [sendError,  setSendError ] = useState('');

  const template = useMemo(
    () => EMAIL_TEMPLATES.find((t) => t.id === templateId) ?? EMAIL_TEMPLATES[0],
    [templateId]
  );

  const ctx: EmailContext = {
    senderName,
    senderTitle,
    senderPortfolio,
    recipientName: recipientName || undefined,
    company:  company  || undefined,
    jobTitle: jobTitle || undefined,
    tone,
    extraContext: extraContext || undefined,
  };

  // Auto-fill subject when template or context changes (only if empty)
  function applyTemplate(id: EmailTemplateId) {
    setTemplateId(id);
    const tpl = EMAIL_TEMPLATES.find((t) => t.id === id)!;
    setSubject(tpl.defaultSubject(ctx));
    setBody('');
  }

  // ── AI generate ──────────────────────────────────────────────────────────────
  async function handleGenerate() {
    setGenerating(true);
    setGenError('');
    try {
      const res = await fetch('/api/admin/send-email', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ systemPrompt: template.systemPrompt(ctx) }),
      });
      const data = await res.json() as { ok?: boolean; text?: string; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? 'Erreur IA');
      setBody(data.text ?? '');
      setSubject((prev) => prev || template.defaultSubject(ctx));
    } catch (e) {
      setGenError(e instanceof Error ? e.message : 'Erreur IA');
    } finally {
      setGenerating(false);
    }
  }

  // ── Send ─────────────────────────────────────────────────────────────────────
  async function handleSend() {
    setSendStatus('sending');
    setSendError('');
    try {
      const res = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          to,
          subject,
          emailBody: body,
          senderName,
          senderTitle,
          senderPortfolio,
          accentColor,
        }),
      });
      const data = await res.json() as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? 'Erreur d\'envoi');
      setSendStatus('sent');
      // Reset after 4 s
      setTimeout(() => setSendStatus('idle'), 4000);
    } catch (e) {
      setSendError(e instanceof Error ? e.message : 'Erreur d\'envoi');
      setSendStatus('error');
    }
  }

  // ── Preview HTML ─────────────────────────────────────────────────────────────
  const previewHtml = useMemo(() => {
    if (!body) return '';
    return buildEmailHtml({ senderName, senderTitle, senderPortfolio, body, accentColor });
  }, [body, senderName, senderTitle, senderPortfolio, accentColor]);

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="grid lg:grid-cols-[340px_1fr] gap-6 items-start">

      {/* ── Left: Controls ── */}
      <div className="flex flex-col gap-4">

        {/* Template picker */}
        <Card title="Template">
          <div className="grid grid-cols-1 gap-2">
            {EMAIL_TEMPLATES.map((t) => {
              const active = templateId === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => applyTemplate(t.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    active
                      ? 'border-green-app/60 bg-green-app/10 text-white'
                      : 'border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    active ? 'bg-green-app/20 text-green-app' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {TEMPLATE_ICONS[t.id]}
                  </span>
                  <div>
                    <p className="text-sm font-semibold leading-none">{t.label}</p>
                    <p className="text-xs text-zinc-500 mt-1">{t.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Context */}
        <Card title="Contexte">
          <div className="flex flex-col gap-3">
            <Field label="Destinataire" placeholder="Marie Martin" value={recipientName} onChange={setRecipientName} />
            <Field label="Email destinataire *" placeholder="marie@company.com" value={to} onChange={setTo} type="email" />
            <Field label="Entreprise" placeholder="Acme Corp" value={company} onChange={setCompany} />
            <Field label="Poste visé" placeholder="Senior Frontend Developer" value={jobTitle} onChange={setJobTitle} />
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5">Ton</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as EmailContext['tone'])}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 outline-none focus:border-green-app/60"
              >
                <option value="neutral">Neutre / Professionnel</option>
                <option value="formal">Formel</option>
                <option value="friendly">Amical / Détendu</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5">Contexte additionnel</label>
              <textarea
                value={extraContext}
                onChange={(e) => setExtraContext(e.target.value)}
                placeholder="Ex : J'ai rencontré cette personne au DevFest…"
                rows={2}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 outline-none focus:border-green-app/60 resize-none"
              />
            </div>
          </div>
        </Card>

        {/* Sender profile */}
        <Card title="Profil expéditeur">
          <div className="flex flex-col gap-3">
            <Field label="Nom" value={senderName} onChange={setSenderName} />
            <Field label="Titre" value={senderTitle} onChange={setSenderTitle} />
            <Field label="Portfolio" value={senderPortfolio} onChange={setSenderPortfolio} />
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5">Couleur d&apos;accent</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-9 h-9 rounded-lg cursor-pointer border border-zinc-700 bg-zinc-800 p-1"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 font-mono outline-none focus:border-green-app/60"
                  maxLength={7}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* ── Right: Compose / Preview ── */}
      <div className="sticky top-6 flex flex-col gap-4">

        {/* Tabs */}
        <div className="flex gap-1 bg-zinc-900 border border-zinc-800/60 rounded-xl p-1 w-fit">
          {(['compose', 'preview'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                tab === t
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {t === 'compose' ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Composer
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Aperçu
                </>
              )}
            </button>
          ))}
        </div>

        {tab === 'compose' ? (
          <div className="flex flex-col gap-4">
            {/* Subject */}
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5 font-medium">Objet</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Objet de l'email…"
                className="w-full bg-zinc-900 border border-zinc-800/60 rounded-xl px-4 py-3 text-sm text-zinc-200 outline-none focus:border-green-app/60 transition-colors"
              />
            </div>

            {/* Body + AI generate */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-zinc-500 font-medium">Corps du message</label>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={generating}
                  className="flex items-center gap-1.5 text-xs font-semibold text-green-app hover:text-green-300 disabled:opacity-50 transition-colors"
                >
                  {generating ? (
                    <>
                      <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Génération…
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Générer avec l&apos;IA
                    </>
                  )}
                </button>
              </div>
              {genError && (
                <p className="text-xs text-red-400 mb-2">{genError}</p>
              )}
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Corps de l'email… (ou génère avec l'IA ↗)"
                rows={14}
                className="w-full bg-zinc-900 border border-zinc-800/60 rounded-xl px-4 py-3 text-sm text-zinc-200 outline-none focus:border-green-app/60 resize-y transition-colors leading-relaxed"
              />
            </div>

            {/* Send */}
            <button
              type="button"
              onClick={handleSend}
              disabled={!to || !subject || !body || sendStatus === 'sending' || sendStatus === 'sent'}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                sendStatus === 'sent'
                  ? 'bg-green-app/20 text-green-app border border-green-app/30 cursor-default'
                  : sendStatus === 'sending'
                  ? 'bg-green-app/10 text-green-app/60 border border-green-app/20 cursor-wait'
                  : 'bg-green-app text-zinc-900 hover:bg-green-300 disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
            >
              {sendStatus === 'sent' ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Email envoyé !
                </>
              ) : sendStatus === 'sending' ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Envoi…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Envoyer l&apos;email
                </>
              )}
            </button>
            {sendStatus === 'error' && sendError && (
              <p className="text-xs text-red-400 mt-1">{sendError}</p>
            )}
          </div>
        ) : (
          /* Preview */
          <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl overflow-hidden">
            {/* Meta bar */}
            <div className="px-5 py-3 border-b border-zinc-800/60 flex flex-col gap-1">
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span className="text-zinc-600">De :</span>
                <span className="text-zinc-300">{senderName} &lt;{EMAIL_FROM_DISPLAY}&gt;</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span className="text-zinc-600">À :</span>
                <span className="text-zinc-300">{to || '—'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span className="text-zinc-600">Objet :</span>
                <span className="text-zinc-300 font-medium">{subject || '—'}</span>
              </div>
            </div>

            {/* HTML preview */}
            {previewHtml ? (
              <iframe
                srcDoc={previewHtml}
                title="Aperçu email"
                className="w-full border-0"
                style={{ height: 'calc(100vh - 280px)', minHeight: '500px' }}
                sandbox="allow-same-origin"
              />
            ) : (
              <div className="flex items-center justify-center h-64 text-zinc-600 text-sm">
                Composez un message pour voir l&apos;aperçu
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const EMAIL_FROM_DISPLAY = process.env.NEXT_PUBLIC_EMAIL_FROM ?? 'votre adresse';

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800/60 rounded-2xl p-4">
      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">{title}</p>
      {children}
    </div>
  );
}

function Field({
  label, value, onChange, placeholder, type = 'text',
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-zinc-500 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 outline-none focus:border-green-app/60 transition-colors"
      />
    </div>
  );
}
