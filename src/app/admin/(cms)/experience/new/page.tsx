'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function NewExperiencePage() {
  const router = useRouter();
  const [current, setCurrent] = useState(false);
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message?: string }>({ type: 'idle' });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ type: 'loading' });
    const form = new FormData(e.currentTarget);
    const payload = {
      company: form.get('company'),
      role: form.get('role'),
      startDate: form.get('startDate'),
      endDate: current ? null : form.get('endDate'),
      current,
      description: form.get('description'),
      skills: String(form.get('skills') || '').split(',').map((s) => s.trim()).filter(Boolean),
      location: form.get('location'),
      companyUrl: form.get('companyUrl'),
    };

    const res = await fetch('/api/experience', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (res.ok) {
      setStatus({ type: 'success', message: 'Expérience enregistrée !' });
      setTimeout(() => router.push('/admin/experience'), 1500);
    } else {
      setStatus({ type: 'error', message: data.message ?? 'Erreur inconnue' });
    }
  };

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <button onClick={() => router.back()} className="text-zinc-400 hover:text-white text-sm flex items-center gap-1 mb-4 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </button>
        <h1 className="text-2xl font-bold text-white">Nouvelle expérience</h1>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Entreprise *</label>
            <input name="company" required placeholder="Nom de l'entreprise" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-green-500 transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Poste *</label>
            <input name="role" required placeholder="Ex: Ingénieur Full-Stack" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-green-500 transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Début *</label>
            <input name="startDate" type="month" required className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Fin</label>
            <input name="endDate" type="month" disabled={current} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors disabled:opacity-40" />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Localisation</label>
            <input name="location" placeholder="Paris, France / Remote" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-green-500 transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">URL de l'entreprise</label>
            <input name="companyUrl" type="url" placeholder="https://..." className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-green-500 transition-colors" />
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => setCurrent((p) => !p)}
            className={`w-10 h-6 rounded-full transition-colors flex items-center px-1 ${current ? 'bg-green-500' : 'bg-zinc-700'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${current ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
          <span className="text-sm text-zinc-300">Poste actuel</span>
        </label>

        <div>
          <label className="block text-xs text-zinc-400 mb-1.5">Description *</label>
          <textarea name="description" required placeholder="Décrivez vos missions et réalisations..." rows={5} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-green-500 transition-colors resize-y" />
        </div>

        <div>
          <label className="block text-xs text-zinc-400 mb-1.5">Compétences (séparées par des virgules)</label>
          <input name="skills" placeholder="React, Node.js, TypeScript, Docker" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-green-500 transition-colors" />
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={status.type === 'loading'}
            className="bg-green-500 hover:bg-green-400 disabled:opacity-50 text-zinc-950 font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            {status.type === 'loading' ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          {status.message && (
            <p className={`text-sm ${status.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
              {status.message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
