import { useEffect, useRef } from 'react';
import logo from '@/assets/hackni-logo.jpg';
import { scrollToEl } from '@/lib/landingScroll';

export default function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    let lastY = 0;
    const onScroll = () => {
      const y = window.scrollY;
      nav.classList.toggle('solid', y > 40);
      if (y > 500 && y > lastY + 4) nav.classList.add('hide');
      else if (y < lastY - 4) nav.classList.remove('hide');
      lastY = y;
      const h = document.documentElement.scrollHeight - innerHeight;
      if (progressRef.current) progressRef.current.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
          <a className="brand" href="#hero" onClick={(e) => go(e, '#hero')}>
            <img src={logo} alt="ХН" /><span>ХАКНИ<br />НЕЙРОСЕТИ</span>
          </a>
          <div className="links">
            <a href="#program" onClick={(e) => go(e, '#program')}>Программа</a>
            <a href="#speaker" onClick={(e) => go(e, '#speaker')}>Ведущий</a>
            <a href="#pricing" onClick={(e) => go(e, '#pricing')}>Тарифы</a>
            <a href="#faq" onClick={(e) => go(e, '#faq')}>FAQ</a>
          </div>
          <div className="geo">ВЛАДИВОСТОК · 43.11°N 131.88°E</div>
          <a className="btn btn-sm magnetic" href="#pricing" onClick={(e) => go(e, '#pricing')}>Билет от 5 000 ₽ <span className="arr">→</span></a>
        </div>
      </nav>
    </>
  );
}
