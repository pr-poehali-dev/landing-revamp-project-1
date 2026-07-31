import Icon from '@/components/ui/icon';
import { scrollToEl } from '@/lib/landingScroll';

interface Props {
  open: boolean;
  onClose: () => void;
}

const LINKS = [
  { href: '#program', label: 'Программа' },
  { href: '#speaker', label: 'Ведущий' },
  { href: '#audience', label: 'Для кого' },
  { href: '#sponsorship', label: 'Партнёрство' },
  { href: '#pricing', label: 'Тарифы' },
  { href: '#faq', label: 'FAQ' },
];

export default function MobileMenu({ open, onClose }: Props) {
  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const t = document.querySelector(id);
    if (t) scrollToEl(t as HTMLElement);
    onClose();
  };

  return (
    <div className={`mobile-menu${open ? ' open' : ''}`}>
      <button className="mobile-menu-close" onClick={onClose} aria-label="Закрыть меню">
        <Icon name="X" size={20} strokeWidth={2} />
      </button>
      <nav className="mobile-menu-links">
        {LINKS.map((l, i) => (
          <a key={l.href} href={l.href} style={{ animationDelay: open ? `${0.05 + i * 0.05}s` : '0s' }} onClick={(e) => go(e, l.href)}>
            {l.label}
          </a>
        ))}
      </nav>
      <div className="mobile-menu-foot">
        <div className="mobile-menu-geo">ВЛАДИВОСТОК · 43.11°N 131.88°E</div>
        <a className="btn mobile-menu-cta" href="#pricing" onClick={(e) => go(e, '#pricing')}>Купить билет <span className="arr">→</span></a>
      </div>
    </div>
  );
}