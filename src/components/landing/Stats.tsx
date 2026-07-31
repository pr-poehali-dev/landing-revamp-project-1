import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fmtNum } from '@/lib/landingUtils';

const stats = [
  { count: 300, fmt: 'int', suffix: '', cap: 'предпринимателей в зале отеля «Экватор»', big: true },
  { count: 8, fmt: 'int', suffix: '', cap: 'инструментов освоено залом за один день' },
  { count: 8, fmt: 'int', suffix: '', cap: 'часов живой практики — ни одного слайда «про тренды»' },
  { count: 4.9, fmt: 'dec', suffix: '/5', cap: 'рейтинг школы-организатора' },
  { count: 10000, fmt: 'int', suffix: '+', cap: 'выпускников школы «Хакни Нейросети»' },
];

export default function Stats() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const triggers: ScrollTrigger[] = [];

    if (!RM) {
      const anim = gsap.fromTo(root.querySelectorAll('.stat'), { opacity: 0, y: 48, z: -80 }, {
        opacity: 1, y: 0, z: 0, duration: 0.55, ease: 'expo.out', stagger: 0.09,
        scrollTrigger: { trigger: root.querySelector('.stats-grid'), start: 'top 80%', once: true },
      });
      if (anim.scrollTrigger) triggers.push(anim.scrollTrigger);
    }

    root.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
      const target = parseFloat(el.getAttribute('data-count') || '0');
      const fmt = el.getAttribute('data-fmt') || 'int';
      const suffix = el.getAttribute('data-suffix') || '';
      const obj = { v: 0 };
      const st = ScrollTrigger.create({
        trigger: el, start: 'top 88%', once: true,
        onEnter: () => {
          if (RM) { el.textContent = String(fmtNum(target, fmt)) + suffix; return; }
          gsap.to(obj, {
            v: target, duration: 1.6, ease: 'power3.out',
            onUpdate: () => { el.textContent = String(fmtNum(obj.v, fmt)); },
            onComplete: () => {
              el.textContent = String(fmtNum(target, fmt));
              if (suffix) {
                const s = document.createElement('span');
                s.textContent = suffix;
                el.appendChild(s);
                gsap.fromTo(s, { scale: 0 }, { scale: 1, duration: 0.4, ease: 'back.out(2)' });
              }
            },
          });
        },
      });
      triggers.push(st);
    });

    const trustEl = root.querySelector('#trust');
    let trustSt: ScrollTrigger | null = null;
    if (trustEl) {
      trustSt = ScrollTrigger.create({
        trigger: trustEl, start: 'top 88%', once: true,
        onEnter: () => trustEl.classList.add('on'),
      });
      triggers.push(trustSt);
    }

    return () => { triggers.forEach((t) => t.kill()); };
  }, []);

  return (
    <section id="stats" ref={rootRef}>
      <div className="wrap">
        <div className="eyebrow rv">// 03 · ПЕРВОЕ ШОУ УЖЕ БЫЛО</div>
        <h2 className="h2 rv">ПЕРВЫЙ РАЗ — ПОЛНЫЙ ЗАЛ<br />ОТЕЛЯ «ЭКВАТОР»</h2>
        <div className="stats-grid">
          {stats.map((s, i) => (
            <div className={`stat brk${s.big ? ' big' : ''}`} key={i}>
              <i></i><i></i><i></i><i></i>
              <div className="num" data-count={s.count} data-fmt={s.fmt} data-suffix={s.suffix}>0</div>
              <div className="cap">{s.cap}</div>
            </div>
          ))}
        </div>
        <div className="trust rv" id="trust">На сцене первого шоу — зампред правительства Приморья и министр цифрового развития. Версия 2.0 — мощнее.</div>
      </div>
    </section>
  );
}