'use client';

import { FormEvent, useState } from 'react';
import { useTranslations } from 'next-intl';

export default function ProjectCreateForm() {
  const t = useTranslations('tools.contentEditor.form');
  const [status, setStatus] = useState<string>('');

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      title: form.get('title'),
      date: form.get('date'),
      image: form.get('image'),
      categories: String(form.get('categories') || '').split(',').map((v) => v.trim()).filter(Boolean),
      tags: String(form.get('tags') || '').split(',').map((v) => v.trim()).filter(Boolean),
      content: form.get('content'),
    };

    const telemetry = fetch('/api/telemetry', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'content_editor_submit', page: '/tools/content-editor' }),
    });

    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    await telemetry;

    const result = await response.json();
    setStatus(response.ok ? t('success', { slug: result.slug }) : t('error', { message: result.message || 'unknown' }));

    if (response.ok) event.currentTarget.reset();
  };

  return (
    <form onSubmit={onSubmit} className='mt-8 grid gap-4'>
      <input name='title' placeholder={t('titlePlaceholder')} className='border p-3 rounded' required />
      <input name='date' placeholder='2026-04-30' className='border p-3 rounded' required />
      <input name='image' placeholder={t('imagePlaceholder')} className='border p-3 rounded' />
      <input name='categories' placeholder={t('categoriesPlaceholder')} className='border p-3 rounded' />
      <input name='tags' placeholder={t('tagsPlaceholder')} className='border p-3 rounded' />
      <textarea name='content' placeholder={t('contentPlaceholder')} rows={8} className='border p-3 rounded' required />
      <button type='submit' className='bg-zinc-900 text-white px-5 py-3 rounded'>{t('submit')}</button>
      {status && <p className='text-sm text-foreground/80'>{status}</p>}
    </form>
  );
}
