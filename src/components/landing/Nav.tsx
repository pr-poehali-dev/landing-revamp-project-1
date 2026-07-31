import { useEffect, useRef, useState } from 'react';
import logo from '@/assets/hackni-logo.jpg';
import { scrollToEl } from '@/lib/landingScroll';
import ThemeToggle from './ThemeToggle';
import MobileMenu from './MobileMenu';

export default function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    let lastY = 0;
    const onScroll = () => {
      const y = window.scrollY;
      nav.classList.toggle('solid', y > 40);
      if (y > 500 && y > lastY + 4 && !menuOpen) nav.classList.add('hide');
      else if (y < lastY - 4) nav.classList.remove('hide');
      lastY = y;
      const h = document.documentElement.scrollHeight - innerHeight;
      if (progressRef.current) progressRef.current.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const t = document.querySelector(id);
    if (t) scrollToEl(t as HTMLElement);
  };

  return (
    <>
      <div id="progress" ref={progressRef}></div>
      <nav id="nav" ref={navRef}>
        <div className="wrap">
          <a className="brand" href="https://chernikovgpt.ru/" target="_blank" rel="noopener">
            <img src={logo} alt="ХН" /><span>ХАКНИ<br />НЕЙРОСЕТИ</span>
          </a>
          <div className="links">
            <a href="#program" onClick={(e) => go(e, '#program')}>Программа</a>
            <a href="#speaker" onClick={(e) => go(e, '#speaker')}>Ведущий</a>
            <a href="#audience" onClick={(e) => go(e, '#audience')}>Для кого</a>
            <a href="#sponsorship" onClick={(e) => go(e, '#sponsorship')}>Партнёрство</a>
            <a href="#pricing" onClick={(e) => go(e, '#pricing')}>Тарифы</a>
            <a href="#faq" onClick={(e) => go(e, '#faq')}>FAQ</a>
          </div>
          <div className="geo">ВЛАДИВОСТОК · 43.11°N 131.88°E</div>
          <ThemeToggle />
          <a className="btn btn-sm magnetic" href="#pricing" onClick={(e) => go(e, '#pricing')}>Купить билет <span className="arr">→</span></a>
          <button
            className={`burger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={menuOpen}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}