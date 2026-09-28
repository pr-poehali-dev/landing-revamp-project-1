import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function RevealAnimations() {
  useEffect(() => {
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const triggers: ScrollTrigger[] = [];

    if (RM) {
      document.querySelectorAll<HTMLElement>('.rv').forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    const ctx = gsap.context(() => {
      document.querySelectorAll<HTMLElement>('.rv').forEach((el) => {
        if (el.closest('#hero')) return;
        const anim = gsap.fromTo(el, { opacity: 0, y: 48 }, {
          opacity: 1, y: 0, duration: 0.7, ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 82%', once: true },
        });
        if (anim.scrollTrigger) triggers.push(anim.scrollTrigger);
      });

      document.querySelectorAll<HTMLElement>('section.slice').forEach((sec) => {
        if (sec.id === 'first-show') return;

        const anim = gsap.fromTo(sec,
          { '--slice-open': 0 },
          {
            '--slice-open': 1,
            ease: 'none',
            scrollTrigger: { trigger: sec, start: 'top 92%', end: 'top 42%', scrub: 0.6 },
          },
        );
        if (anim.scrollTrigger) triggers.push(anim.scrollTrigger);

        const seam = gsap.fromTo(sec,
          { '--seam-x': -1 },
          {
            '--seam-x': 0,
            duration: 1.1,
            ease: 'expo.out',
            scrollTrigger: { trigger: sec, start: 'top 88%', once: true },
          },
        );
        if (seam.scrollTrigger) triggers.push(seam.scrollTrigger);
      });

      document.querySelectorAll<HTMLElement>('.h2').forEach((h) => {
        if (h.closest('#hero')) return;
        const anim = gsap.fromTo(h,
          { letterSpacing: '0.06em', opacity: 0, y: 30 },
          {
            letterSpacing: '-0.01em', opacity: 1, y: 0,
            duration: 1, ease: 'expo.out',
            scrollTrigger: { trigger: h, start: 'top 86%', once: true },
          },
        );
        if (anim.scrollTrigger) triggers.push(anim.scrollTrigger);
      });

      const parallaxSets: [string, number][] = [
        ['.site-texture', 90],
      ];
      parallaxSets.forEach(([sel, dist]) => {
        const el = document.querySelector<HTMLElement>(sel);
        if (!el) return;
        const anim = gsap.to(el, {
          backgroundPositionY: `${dist * 6}px`,
          ease: 'none',
          scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1.2 },
        });
        if (anim.scrollTrigger) triggers.push(anim.scrollTrigger);
      });
    });

    return () => {
      triggers.forEach((t) => t.kill());
      ctx.revert();
    };
  }, []);

  return null;
}
