import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import logo from '@/assets/hackni-logo.jpg';
import wordmark from '@/assets/hackni-wordmark.png';
import { scrollToEl } from '@/lib/landingScroll';

export default function Footer() {
  const wordRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const fw = wordRef.current;
    if (!fw) return;

    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let st: ScrollTrigger | null = null;
    let onEnter: (() => void) | null = null;

    if (!RM) {
      const anim = gsap.fromTo(fw, { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: 'expo.out',
        scrollTrigger: { trigger: fw, start: 'top 92%', once: true },
      });
      st = anim.scrollTrigger as ScrollTrigger;

      onEnter = () => {
        gsap.to(fw, { scale: 1.02, duration: 0.35, ease: 'power2.out', yoyo: true, repeat: 1 });
      };
      fw.addEventListener('pointerenter', onEnter);
    }

    return () => {
      st?.kill();
      if (onEnter) fw.removeEventListener('pointerenter', onEnter);
    };
  }, []);

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const t = document.querySelector(id);
    if (t) scrollToEl(t as HTMLElement);
  };

  return (
    <footer>
      <div className="wrap">
        <div className="foot-nav">
          <a href="#program" onClick={(e) => go(e, '#program')}>Программа</a>
          <a href="#speaker" onClick={(e) => go(e, '#speaker')}>Ведущий</a>
          <a href="#pricing" onClick={(e) => go(e, '#pricing')}>Тарифы</a>
          <a href="#faq" onClick={(e) => go(e, '#faq')}>FAQ</a>
        </div>
        <a className="foot-word" id="foot-word" href="https://chernikovgpt.ru/" target="_blank" rel="noopener" ref={wordRef}>
          <img src={wordmark} alt="Хакни Нейросети" />
        </a>
        <div className="foot-contacts">
          <div className="fc"><div className="lab">Билеты и команды — Дарья</div><a href="tel:+79811292499">+7 981 129-24-99</a></div>
          <div className="fc"><div className="lab">Telegram</div><a href="https://t.me/DashaChernikova8" target="_blank" rel="noopener">@DashaChernikova8</a></div>
          <div className="fc"><div className="lab">Дата и место</div><span>17 октября, 10:00–18:00 · отель «Экватор»</span></div>
        </div>
        <div className="foot-meta">
          <a href="https://chernikovgpt.ru/" target="_blank" rel="noopener"><img src={logo} alt="Хакни Нейросети" /></a>
          <div className="fm">ВЛАДИВОСТОК, УЛ. НАБЕРЕЖНАЯ, 20 · 43.11°N 131.88°E · ИИ ШОУ БЕЗ ШИРМЫ · v2.0</div>
        </div>
      </div>
      <div className="foot-copy">© Школа «Хакни Нейросети» · ИИ ШОУ БЕЗ ШИРМЫ 2.0</div>
    </footer>
  );
}