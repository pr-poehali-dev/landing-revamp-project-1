import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Audience() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let st: ScrollTrigger | null = null;
    if (!RM) {
      const anim = gsap.fromTo(root.querySelectorAll('.aud'), { opacity: 0, y: 48, z: -100 }, {
        opacity: 1, y: 0, z: 0, duration: 0.55, ease: 'expo.out', stagger: 0.1,
        scrollTrigger: { trigger: root.querySelector('.aud-grid'), start: 'top 80%', once: true },
      });
      st = anim.scrollTrigger as ScrollTrigger;
    }
    return () => { st?.kill(); };
  }, []);

  return (
    <section id="audience" ref={rootRef}>
      <div className="wrap">
        <div className="eyebrow rv">// 08 · ДЛЯ КОГО</div>
        <h2 className="h2 rv">ПРИХОДИ, ЕСЛИ ТЫ —</h2>
        <div className="aud-grid">
          <div className="aud brk">
            <i></i><i></i><i></i><i></i>
            <div className="anum">01</div>
            <svg viewBox="0 0 44 44"><rect x="8" y="14" width="28" height="20" rx="3"/><path d="M16 14v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3"/><path d="M8 22h28"/></svg>
            <h5>Предприниматель</h5>
            <p>Продажи и автоматизация. Увидишь 12 инструментов за день — билет окупится за неделю.</p>
          </div>
          <div className="aud brk">
            <i></i><i></i><i></i><i></i>
            <div className="anum">02</div>
            <svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="13"/><circle cx="22" cy="22" r="6"/><line x1="22" y1="3" x2="22" y2="9"/><line x1="22" y1="35" x2="22" y2="41"/><line x1="3" y1="22" x2="9" y2="22"/><line x1="35" y1="22" x2="41" y2="22"/></svg>
            <h5>Маркетолог / таргетолог</h5>
            <p>Система контента без выгорания: план на 30 дней, ролики, карточки — всё на практике.</p>
          </div>
          <div className="aud brk">
            <i></i><i></i><i></i><i></i>
            <div className="anum">03</div>
            <svg viewBox="0 0 44 44"><path d="M30 6l8 8-18 18-9 1 1-9L30 6z"/><path d="M26 10l8 8"/><path d="M11 33l-3 8 8-3"/></svg>
            <h5>Дизайнер / видеомейкер / фрилансер</h5>
            <p>Делай то же самое в 7+ раз быстрее — и бери за это дороже.</p>
          </div>
          <div className="aud skep brk">
            <i></i><i></i><i></i><i></i>
            <div className="anum">04</div>
            <svg viewBox="0 0 44 44"><path d="M22 4l14 5v10c0 9-6 17-14 21-8-4-14-12-14-21V9l14-5z"/><path d="M15 17l14 14"/><path d="M29 17L15 31"/></svg>
            <h5>Скептик</h5>
            <p>«ИИ — игрушка»? Приходи. Посмотрим на тебя после блока «приложение за 30 минут».</p>
            <div className="skep-note">СПОРИМ? ПРОВЕРИМ НА МЕСТЕ</div>
          </div>
        </div>
      </div>
    </section>
  );
}