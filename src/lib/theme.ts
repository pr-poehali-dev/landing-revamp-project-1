export type ThemeName = 'dark' | 'light';

const STORAGE_KEY = 'iishow-theme';
export const THEME_EVENT = 'iishow:themechange';

export function getInitialTheme(): ThemeName {
  if (typeof window === 'undefined') return 'dark';
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return 'dark';
}

export function applyTheme(theme: ThemeName) {
  const root = document.documentElement;
  root.classList.toggle('theme-light', theme === 'light');
  window.localStorage.setItem(STORAGE_KEY, theme);
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: theme }));
}

export function getCurrentTheme(): ThemeName {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.classList.contains('theme-light') ? 'light' : 'dark';
}
