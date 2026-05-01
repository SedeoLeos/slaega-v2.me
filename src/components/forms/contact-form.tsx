'use client';

import { FormEvent, useState } from 'react';
import { useTranslations } from 'next-intl';

export default function ContactForm() {
  const t = useTranslations('contact.form');
  const [status, setStatus] = useState('');

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      email: formData.get('email'),
      name: formData.get('name'),
      message: formData.get('message'),
    };

    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setStatus(t('error'));
      return;
    }

    setStatus(t('success'));
    event.currentTarget.reset();
  };

  return (
    <form onSubmit={onSubmit} className='flex flex-col gap-7 items-center flex-1 max-w-2xl'>
      <input type='email' name='email' required className='border-zinc-400 border focus-visible:outline-2 focus-visible:outline-zinc-400' placeholder={t('email')} />
      <input type='text' name='name' required placeholder={t('name')} className='border-zinc-400 border focus-visible:outline-2 focus-visible:outline-zinc-400' />
      <textarea name='message' required placeholder={t('message')} className='border-zinc-400 border focus-visible:outline-2 focus-visible:outline-zinc-400' />
      <button type='submit' className='self-start outline-0 px-12 py-4 bg-zinc-900 text-white'>{t('submit')}</button>
      {status && <p className='text-sm text-foreground/70'>{status}</p>}
    </form>
  );
}
