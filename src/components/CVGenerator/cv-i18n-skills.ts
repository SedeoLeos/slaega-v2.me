/**
 * Skill / tag localisation for the CV generator.
 *
 * The portfolio (DB) stores skills and project tags in mixed languages
 * (e.g. both "Paiement" and "Payment", "Afrique" and "Africa"). A generated
 * CV must be 100% in ONE language, so every DESCRIPTIVE label is normalised to
 * the CV's language via this glossary. Proper tech NAMES (NestJS, Docker,
 * PostgreSQL, AWS, k3s…) are not in the glossary and pass through unchanged.
 */

type Lang = "fr" | "en";
type Pair = { fr: string; en: string };

// Each concept listed once with its French and English form.
const GLOSSARY: Pair[] = [
  { fr: "Afrique", en: "Africa" },
  { fr: "Agrégation", en: "Aggregation" },
  { fr: "Anti-fraude", en: "Anti-fraud" },
  { fr: "Fraude", en: "Fraud" },
  { fr: "Architecture", en: "Architecture" },
  { fr: "Sauvegarde", en: "Backup" },
  { fr: "Banque", en: "Banking" },
  { fr: "Gestion d'entreprise", en: "Business Management" },
  { fr: "Cartes", en: "Cards" },
  { fr: "Cartes virtuelles", en: "Virtual Cards" },
  { fr: "Chiffrement", en: "Encryption" },
  { fr: "Cloud", en: "Cloud" },
  { fr: "Collaboration", en: "Collaboration" },
  { fr: "Conformité", en: "Compliance" },
  { fr: "Multi-plateforme", en: "Cross-platform" },
  { fr: "Tableau de bord", en: "Dashboard" },
  { fr: "Données", en: "Data" },
  { fr: "Synchronisation de données", en: "Data Sync" },
  { fr: "Intégration de données", en: "Data Integration" },
  { fr: "Déploiement", en: "Deployment" },
  { fr: "Application bureau", en: "Desktop App" },
  { fr: "Économie numérique", en: "Digital Economy" },
  { fr: "Transformation numérique", en: "Digital Transformation" },
  { fr: "Reprise après sinistre", en: "Disaster Recovery" },
  { fr: "Décaissement", en: "Disbursement" },
  { fr: "E-commerce", en: "E-commerce" },
  { fr: "Entreprise", en: "Enterprise" },
  { fr: "Entrepreneuriat", en: "Entrepreneurship" },
  { fr: "Fiabilité", en: "Reliability" },
  { fr: "Finance publique", en: "Public Finance" },
  { fr: "Inclusion financière", en: "Financial Inclusion" },
  { fr: "Gestion financière", en: "Financial Management" },
  { fr: "Formation", en: "Training" },
  { fr: "Géolocalisation", en: "Geolocation" },
  { fr: "Gouvernement", en: "Government" },
  { fr: "Gestion de stock", en: "Inventory Management" },
  { fr: "Inventaire", en: "Inventory" },
  { fr: "Santé", en: "Healthcare" },
  { fr: "Infrastructure", en: "Infrastructure" },
  { fr: "Institutionnel", en: "Institutional" },
  { fr: "Intégration", en: "Integration" },
  { fr: "Intégration système", en: "System Integration" },
  { fr: "Banque en ligne", en: "Internet Banking" },
  { fr: "Interopérabilité", en: "Interoperability" },
  { fr: "Leadership", en: "Leadership" },
  { fr: "Grand livre", en: "Ledger" },
  { fr: "Commerce local", en: "Local Business" },
  { fr: "Place de marché", en: "Marketplace" },
  { fr: "Mentorat", en: "Mentoring" },
  { fr: "Mobile", en: "Mobile" },
  { fr: "Application mobile", en: "Mobile App" },
  { fr: "Commerce mobile", en: "Mobile Commerce" },
  { fr: "Développement mobile", en: "Mobile Development" },
  { fr: "Paiement mobile", en: "Mobile Payment" },
  { fr: "Mobilité", en: "Mobility" },
  { fr: "Mutuelle", en: "Mutual Insurance" },
  { fr: "Nano-crédit", en: "Nano-credit" },
  { fr: "Navigation", en: "Navigation" },
  { fr: "Néo-banque", en: "Neo-bank" },
  { fr: "Réseau", en: "Network" },
  { fr: "Notifications", en: "Notifications" },
  { fr: "Observabilité", en: "Observability" },
  { fr: "Paiement", en: "Payment" },
  { fr: "Paiements", en: "Payments" },
  { fr: "Paiements instantanés", en: "Instant Payments" },
  { fr: "Passerelle de paiement", en: "Payment Gateway" },
  { fr: "Productivité", en: "Productivity" },
  { fr: "Administration publique", en: "Public Administration" },
  { fr: "Secteur public", en: "Public Sector" },
  { fr: "Temps réel", en: "Real-time" },
  { fr: "Réconciliation", en: "Reconciliation" },
  { fr: "Responsive", en: "Responsive" },
  { fr: "Commerce de détail", en: "Retail" },
  { fr: "Optimisation des revenus", en: "Revenue Optimization" },
  { fr: "Reverse-proxy", en: "Reverse-proxy" },
  { fr: "Sécurité", en: "Security" },
  { fr: "Auto-hébergé", en: "Self-hosted" },
  { fr: "Shopping", en: "Shopping" },
  { fr: "Stratégie", en: "Strategy" },
  { fr: "Chaîne d'approvisionnement", en: "Supply Chain" },
  { fr: "Provisioning", en: "Provisioning" },
  { fr: "Scoring", en: "Scoring" },
  { fr: "Secrets", en: "Secrets" },
  { fr: "RH & Paie", en: "HR & Payroll" },
  { fr: "Automatisation", en: "Automation" },
  { fr: "Middleware", en: "Middleware" },
  { fr: "Microservices", en: "Microservices" },
  { fr: "Multi-tenant", en: "Multi-tenant" },
  { fr: "Multi-site", en: "Multi-site" },
  { fr: "Frontend", en: "Frontend" },
  { fr: "Backend", en: "Backend" },
  { fr: "Full-Stack", en: "Full-Stack" },
];

const LOOKUP = new Map<string, Pair>();
for (const p of GLOSSARY) {
  LOOKUP.set(p.fr.toLowerCase(), p);
  LOOKUP.set(p.en.toLowerCase(), p);
}

/** Localise one label to `lang`; unknown labels (tech names) pass through. */
export function localizeSkill(label: string, lang: Lang): string {
  const hit = LOOKUP.get((label ?? "").trim().toLowerCase());
  return hit ? hit[lang] : label;
}

/** Localise a list, de-duplicating collisions (e.g. Paiement + Payment → Payment). */
export function localizeSkills(list: string[], lang: Lang): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of list ?? []) {
    const l = localizeSkill(s, lang);
    const k = l.toLowerCase();
    if (!seen.has(k)) {
      seen.add(k);
      out.push(l);
    }
  }
  return out;
}
