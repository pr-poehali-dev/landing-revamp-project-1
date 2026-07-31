import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function RevealAnimations() {
  useEffect(() => {
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const triggers: ScrollTrigger[] = [];

    if (!RM) {
      document.querySelectorAll<HTMLElement>('.rv').forEach((el) => {
        if (el.closest('#hero')) return;
        const anim = gsap.fromTo(el, { opacity: 0, y: 48 }, {
          opacity: 1, y: 0, duration: 0.7, ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 82%', once: true },
        });
        if (anim.scrollTrigger) triggers.push(anim.scrollTrigger);
      });
    } else {
      document.querySelectorAll<HTMLElement>('.rv').forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }

    return () => { triggers.forEach((t) => t.kill()); };
  }, []);

  return null;
}
