import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { applyTheme, getInitialTheme, ThemeName } from '@/lib/theme';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeName>('dark');

  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const toggle = () => {
    const next: ThemeName = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
  };

  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
      data-cursor="view"
    >
      <Icon name={theme === 'dark' ? 'Sun' : 'Moon'} size={17} strokeWidth={2} />
    </button>
  );
}
