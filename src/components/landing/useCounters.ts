import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { fmtNum } from '@/lib/landingUtils';

export function useCounters(rootEl: HTMLElement | null) {
  useEffect(() => {
    if (!rootEl) return;
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const triggers: ScrollTrigger[] = [];

    rootEl.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
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

    return () => { triggers.forEach((t) => t.kill()); };
  }, [rootEl]);
}
