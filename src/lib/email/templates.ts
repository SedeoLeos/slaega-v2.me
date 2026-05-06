// ── Email template types ──────────────────────────────────────────────────────
export type EmailTemplateId =
  | 'application'    // Candidature spontanée
  | 'follow-up'      // Relance après candidature
  | 'networking'     // Prise de contact / networking
  | 'thank-you'      // Remerciement après entretien
  | 'custom';        // Libre

export interface EmailTemplateInfo {
  id: EmailTemplateId;
  label: string;
  desc: string;
  icon: string;
  defaultSubject: (ctx: EmailContext) => string;
  systemPrompt: (ctx: EmailContext) => string;
}

export interface EmailContext {
  senderName: string;    // "Gedeon Leos"
  senderTitle: string;   // "Développeur Full-stack"
  senderPortfolio: string; // "https://slaega.me"
  recipientName?: string; // "Marie Martin"
  company?: string;       // "Acme Corp"
  jobTitle?: string;      // "Senior Frontend Developer"
  tone?: 'formal' | 'friendly' | 'neutral'; // default neutral
  extraContext?: string;  // anything extra
}

export const EMAIL_TEMPLATES: EmailTemplateInfo[] = [
  {
    id: 'application',
    label: 'Candidature',
    desc: 'Postuler à une offre d\'emploi',
    icon: '📩',
    defaultSubject: (c) => `Candidature — ${c.jobTitle ?? 'Développeur'} chez ${c.company ?? 'votre entreprise'}`,
    systemPrompt: (c) => `Tu rédiges un email de candidature professionnel.
Expéditeur : ${c.senderName} (${c.senderTitle}).
Portfolio : ${c.senderPortfolio}.
Destinataire : ${c.recipientName ?? 'le/la recruteur(se)'} chez ${c.company ?? 'l\'entreprise'}.
Poste visé : ${c.jobTitle ?? 'développeur(se)'}.
Ton : ${c.tone ?? 'neutre et professionnel'}.
${c.extraContext ? `Contexte supplémentaire : ${c.extraContext}` : ''}
Rédige un email en français, sans objet (juste le corps), avec une accroche forte, une présentation concise, et une invitation à se rencontrer. Max 200 mots.`,
  },
  {
    id: 'follow-up',
    label: 'Relance',
    desc: 'Relancer après candidature ou entretien',
    icon: '🔔',
    defaultSubject: (c) => `Relance — ${c.jobTitle ?? 'ma candidature'} chez ${c.company ?? 'votre entreprise'}`,
    systemPrompt: (c) => `Tu rédiges un email de relance professionnel et poli.
Expéditeur : ${c.senderName} (${c.senderTitle}).
Destinataire : ${c.recipientName ?? 'le/la recruteur(se)'} chez ${c.company ?? 'l\'entreprise'}.
Poste : ${c.jobTitle ?? 'développeur(se)'}.
Ton : ${c.tone ?? 'neutre, chaleureux et bref'}.
${c.extraContext ? `Contexte : ${c.extraContext}` : ''}
Écris une relance concise (max 100 mots) en français, sans objet, avec politesse et fermeté. Rappelle ta candidature et demande un retour.`,
  },
  {
    id: 'networking',
    label: 'Networking',
    desc: 'Prise de contact professionnelle',
    icon: '🤝',
    defaultSubject: (c) => `Prise de contact — ${c.senderName}`,
    systemPrompt: (c) => `Tu rédiges un email de networking professionnel.
Expéditeur : ${c.senderName} (${c.senderTitle}).
Portfolio : ${c.senderPortfolio}.
Destinataire : ${c.recipientName ?? 'un professionnel'} chez ${c.company ?? 'son entreprise'}.
Ton : ${c.tone ?? 'friendly et direct'}.
${c.extraContext ? `Contexte : ${c.extraContext}` : ''}
Rédige en français, sans objet, une prise de contact naturelle et humaine qui présente brièvement l'expéditeur, exprime de l'intérêt sincère pour le travail du destinataire, et propose un échange (call ou café virtuel). Max 150 mots.`,
  },
  {
    id: 'thank-you',
    label: 'Remerciement',
    desc: 'Après un entretien',
    icon: '🙏',
    defaultSubject: (c) => `Merci pour l'entretien — ${c.jobTitle ?? 'votre temps'} chez ${c.company ?? 'votre entreprise'}`,
    systemPrompt: (c) => `Tu rédiges un email de remerciement post-entretien.
Expéditeur : ${c.senderName} (${c.senderTitle}).
Destinataire : ${c.recipientName ?? 'l\'interlocuteur(trice)'} chez ${c.company ?? 'l\'entreprise'}.
Ton : ${c.tone ?? 'chaleureux et professionnel'}.
${c.extraContext ? `Contexte de l'entretien : ${c.extraContext}` : ''}
Rédige en français, sans objet, un email de remerciement sincère (max 120 mots) qui remercie pour le temps accordé, réaffirme la motivation pour le poste, et attend la suite.`,
  },
  {
    id: 'custom',
    label: 'Personnalisé',
    desc: 'Email libre, ton propre contexte',
    icon: '✏️',
    defaultSubject: (_c) => '',
    systemPrompt: (c) => `Tu rédiges un email professionnel.
Expéditeur : ${c.senderName} (${c.senderTitle}).
${c.extraContext ? `Instructions : ${c.extraContext}` : 'Rédige un email professionnel concis en français.'}`,
  },
];

// ── HTML email builder ────────────────────────────────────────────────────────
export interface EmailHtmlOptions {
  senderName: string;
  senderTitle: string;
  senderPortfolio: string;
  body: string;           // Plain text / markdown-like body (paragraphs separated by \n\n)
  accentColor?: string;   // Hex color, default #4ade80
}

/** Build a branded, responsive HTML email string */
export function buildEmailHtml({
  senderName,
  senderTitle,
  senderPortfolio,
  body,
  accentColor = '#4ade80',
}: EmailHtmlOptions): string {
  // Convert \n\n into <p> blocks, \n into <br>
  const htmlBody = body
    .split('\n\n')
    .map((para) => `<p style="margin:0 0 16px 0;line-height:1.7;">${para.replace(/\n/g, '<br>')}</p>`)
    .join('');

  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Email de ${senderName}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

<!-- Wrapper -->
<table cellpadding="0" cellspacing="0" width="100%" style="background:#f4f4f5;padding:32px 16px;">
<tr><td align="center">

  <!-- Card -->
  <table cellpadding="0" cellspacing="0" width="600" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,.08);">

    <!-- Header band -->
    <tr>
      <td style="background:#18181b;padding:28px 32px;">
        <table cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td>
              <!-- Accent dot + name -->
              <div style="display:inline-flex;align-items:center;gap:10px;">
                <div style="width:10px;height:10px;border-radius:50%;background:${accentColor};flex-shrink:0;"></div>
                <span style="color:#ffffff;font-weight:700;font-size:16px;letter-spacing:-.3px;">${senderName}</span>
              </div>
              <div style="color:#71717a;font-size:12px;margin-top:4px;padding-left:20px;">${senderTitle}</div>
            </td>
            <td align="right" style="vertical-align:top;">
              <a href="${senderPortfolio}" style="color:${accentColor};font-size:11px;text-decoration:none;font-weight:600;letter-spacing:.5px;text-transform:uppercase;">${senderPortfolio.replace(/^https?:\/\//, '')}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Accent line -->
    <tr>
      <td style="background:${accentColor};height:3px;padding:0;"></td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="padding:36px 32px 28px;">
        <div style="color:#18181b;font-size:15px;">${htmlBody}</div>
      </td>
    </tr>

    <!-- Signature -->
    <tr>
      <td style="padding:0 32px 32px;">
        <table cellpadding="0" cellspacing="0" style="border-top:1px solid #e4e4e7;padding-top:20px;width:100%;">
          <tr>
            <td>
              <p style="margin:0;font-weight:700;color:#18181b;font-size:14px;">${senderName}</p>
              <p style="margin:4px 0 0;color:#71717a;font-size:12px;">${senderTitle}</p>
              <a href="${senderPortfolio}" style="color:${accentColor};font-size:12px;text-decoration:none;margin-top:4px;display:inline-block;">${senderPortfolio}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background:#f4f4f5;padding:16px 32px;border-top:1px solid #e4e4e7;">
        <p style="margin:0;color:#a1a1aa;font-size:11px;text-align:center;">
          Email envoyé via le portfolio de ${senderName} &middot; ${year}
        </p>
      </td>
    </tr>

  </table>
</td></tr>
</table>

</body>
</html>`;
}

/** Plain-text fallback */
export function buildEmailText(body: string, senderName: string, senderTitle: string, senderPortfolio: string): string {
  return `${body}\n\n--\n${senderName}\n${senderTitle}\n${senderPortfolio}`;
}
