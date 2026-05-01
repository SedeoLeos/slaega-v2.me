'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

const CATEGORIES = [
  'showcase-site', 'e-commerce', 'web-app', 'api-webservice', 'automation',
  'wordpress-site', 'data-integration', 'admin-dashboard', 'poc-prototype',
  'mobile-app', 'desktop-app', 'self-hosted-platform', 'devops-infrastructure',
  'platform-deployment', 'auth-system', 'ci-cd', 'cloud-setup',
  'monitoring-logging', 'reverse-proxy',
];

export default function NewProjectPage() {
  const router = useRouter();
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message?: string }>({ type: 'idle' });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (c: string) =>
    setSelectedCategories((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ type: 'loading' });
    const form = new FormData(e.currentTarget);
    const payload = {
      title: form.get('title'),
      date: form.get('date'),
      image: form.get('image'),
      categories: selectedCategories,
      tags: String(form.get('tags') || '').split(',').map((v) => v.trim()).filter(Boolean),
      content: form.get('content'),
    };

    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (res.ok) {
      setStatus({ type: 'success', message: `Projet créé : ${data.slug}` });
      setTimeout(() => router.push('/admin/projects'), 1500);
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
        <h1 className="text-2xl font-bold text-white">Nouveau projet</h1>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs text-zinc-400 mb-1.5">Titre *</label>
            <input name="title" required placeholder="Nom du projet" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-green-500 transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Date *</label>
            <input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Image (chemin)</label>
            <input name="image" placeholder="/images/projects/mon-projet.jpg" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-green-500 transition-colors" />
          </div>
        </div>

        <div>
          <label className="block text-xs text-zinc-400 mb-2">Catégories</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => toggleCategory(c)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  selectedCategories.includes(c)
                    ? 'bg-green-500/20 border-green-500 text-green-400'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs text-zinc-400 mb-1.5">Tags (séparés par des virgules)</label>
          <input name="tags" placeholder="React, TypeScript, Next.js" className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-green-500 transition-colors" />
        </div>

        <div>
          <label className="block text-xs text-zinc-400 mb-1.5">Contenu Markdown *</label>
          <textarea name="content" required placeholder="## Description&#10;&#10;Décrivez le projet..." rows={14} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-green-500 transition-colors font-mono text-sm resize-y" />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={status.type === 'loading'}
            className="bg-green-500 hover:bg-green-400 disabled:opacity-50 text-zinc-950 font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            {status.type === 'loading' ? 'Publication...' : 'Publier le projet'}
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
