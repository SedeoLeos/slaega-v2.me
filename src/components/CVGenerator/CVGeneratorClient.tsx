'use client';

import { useState, useRef } from 'react';

type CVData = {
  keywords: string[];
  experiences: Array<{
    id: string; company: string; role: string; startDate: string;
    endDate: string | null; current: boolean; description: string;
    skills: string[]; location: string; score: number;
  }>;
  projects: Array<{ title: string; desc: string; tags: string[]; slug: string; score: number }>;
  relevantSkills: string[];
  allSkills: string[];
  jobTitle: string;
};

function formatMonth(date: string | null, current: boolean) {
  if (current) return "Aujourd'hui";
  if (!date) return '';
  const [y, m] = date.split('-');
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  return `${months[parseInt(m) - 1]} ${y}`;
}

export default function CVGeneratorClient() {
  const [jobOffer, setJobOffer] = useState('');
  const [cv, setCv] = useState<CVData | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState('');
  const printRef = useRef<HTMLDivElement>(null);

  const generate = async () => {
    if (jobOffer.trim().length < 50) {
      setError("L'offre est trop courte (min 50 caractères)");
      return;
    }
    setStatus('loading');
    setError('');
    const res = await fetch('/api/cv-generator', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobOffer }),
    });
    const data = await res.json();
    if (res.ok) { setCv(data.cv); setStatus('idle'); }
    else { setError(data.message ?? 'Erreur'); setStatus('error'); }
  };

  const print = () => window.print();

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Input panel */}
      <div>
        <label className="block text-sm font-semibold mb-2">Offre d'emploi</label>
        <textarea
          value={jobOffer}
          onChange={(e) => setJobOffer(e.target.value)}
          placeholder="Colle ici l'offre d'emploi complète..."
          rows={16}
          className="w-full bg-background border border-foreground/15 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-green-app transition-colors resize-y font-mono"
        />
        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={generate}
            disabled={status === 'loading'}
            className="bg-foreground text-background font-semibold px-5 py-2.5 rounded-lg text-sm hover:opacity-80 disabled:opacity-40 transition-opacity"
          >
            {status === 'loading' ? 'Génération...' : 'Générer le CV'}
          </button>
          {cv && (
            <button
              onClick={print}
              className="border border-foreground/20 text-foreground/70 font-medium px-5 py-2.5 rounded-lg text-sm hover:border-foreground/50 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Imprimer / PDF
            </button>
          )}
        </div>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        {cv && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            <span className="text-xs text-foreground/50">Mots-clés détectés :</span>
            {cv.keywords.map((k) => (
              <span key={k} className="text-xs bg-green-app/10 text-green-app border border-green-app/20 px-2 py-0.5 rounded-full">{k}</span>
            ))}
          </div>
        )}
      </div>

      {/* CV Preview */}
      <div>
        {!cv ? (
          <div className="h-full min-h-64 border border-dashed border-foreground/15 rounded-xl flex items-center justify-center">
            <p className="text-foreground/30 text-sm">Le CV généré apparaîtra ici</p>
          </div>
        ) : (
          <div ref={printRef} className="bg-white text-zinc-900 rounded-xl border border-foreground/10 p-8 print:rounded-none print:border-none print:shadow-none shadow-sm">
            {/* CV Header */}
            <div className="border-b border-zinc-200 pb-5 mb-5">
              <h1 className="text-2xl font-bold text-zinc-900">Seba Gedeon</h1>
              <p className="text-green-700 font-medium mt-0.5">{cv.jobTitle}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-zinc-500">
                <span>smatsoula19@gmail.com</span>
                <span>github.com/slaega</span>
              </div>
            </div>

            {/* Skills */}
            <div className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Compétences</h2>
              <div className="flex flex-wrap gap-1.5">
                {cv.allSkills.map((s) => (
                  <span key={s} className={`text-xs px-2 py-0.5 rounded border ${cv.relevantSkills.includes(s) ? 'bg-green-50 border-green-300 text-green-800 font-medium' : 'bg-zinc-50 border-zinc-200 text-zinc-600'}`}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience */}
            {cv.experiences.length > 0 && (
              <div className="mb-5">
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">Expériences</h2>
                <div className="space-y-4">
                  {cv.experiences.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-sm text-zinc-900">{exp.role}</p>
                          <p className="text-xs text-zinc-500">{exp.company} · {exp.location}</p>
                        </div>
                        <p className="text-xs text-zinc-400 flex-shrink-0 ml-2">
                          {formatMonth(exp.startDate, false)} — {formatMonth(exp.endDate, exp.current)}
                        </p>
                      </div>
                      <p className="text-xs text-zinc-600 mt-1 leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {cv.projects.length > 0 && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">Projets sélectionnés</h2>
                <div className="space-y-3">
                  {cv.projects.slice(0, 4).map((p) => (
                    <div key={p.slug}>
                      <p className="font-semibold text-sm text-zinc-900">{p.title}</p>
                      <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{p.desc}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {p.tags.slice(0, 4).map((t) => (
                          <span key={t} className="text-xs text-zinc-400">{t}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
