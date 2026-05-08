'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type AdminTheme = 'dark' | 'light';

const AdminThemeContext = createContext<{
  theme: AdminTheme;
  toggle: () => void;
}>({ theme: 'dark', toggle: () => {} });

export function useAdminTheme() {
  return useContext(AdminThemeContext);
}

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<AdminTheme>('dark');

  useEffect(() => {
    const stored = localStorage.getItem('admin-theme') as AdminTheme | null;
    if (stored === 'light' || stored === 'dark') setTheme(stored);
  }, []);

  // Also propagate to <body> so bg-zinc-950 on body gets overridden
  useEffect(() => {
    document.body.setAttribute('data-admin-theme', theme);
    return () => document.body.removeAttribute('data-admin-theme');
  }, [theme]);

  function toggle() {
    setTheme((prev) => {
      const next: AdminTheme = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('admin-theme', next);
      return next;
    });
  }

  return (
    <AdminThemeContext.Provider value={{ theme, toggle }}>
      <div data-admin-theme={theme} className="contents">
        {children}
      </div>
    </AdminThemeContext.Provider>
  );
}
