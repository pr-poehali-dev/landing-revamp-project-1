import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { getLenis } from '@/lib/landingScroll';

const tickItems = [
  'продающий сайт', 'рекламный ролик', 'ИИ-агенты и мини-приложения', 'авторский трек',
  'коммерческое предложение', 'продающая презентация', 'контент-план на месяц',
  'ИИ-ассистент «Стилист»', 'продающий визуал', 'персональная база знаний', 'CRM нового поколения',
];

export default function Ticker() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let half = '';
    for (let r = 0; r < 2; r++) {
      tickItems.forEach((t) => { half += `<span>${t}</span><span class="sep">✦</span>`; });
    }
    track.innerHTML = half + half;

    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lenis = getLenis();
    if (RM || !lenis) return;

    const skewSetter = gsap.quickSetter(track, 'skewX', 'deg');
    const onScroll = (e: { velocity?: number }) => {
      const v = gsap.utils.clamp(-6, 6, (e.velocity || 0) * -0.25);
      skewSetter(v);
    };
    lenis.on('scroll', onScroll);
    const interval = window.setInterval(() => skewSetter(0), 200);
    return () => {
      lenis.off('scroll', onScroll);
      window.clearInterval(interval);
    };
  }, []);

  return (
    <div className="ticker"><div className="tk-track" id="ticker-track" ref={trackRef}></div></div>
  );
}