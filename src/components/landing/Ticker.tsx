import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { getLenis } from '@/lib/landingScroll';

const tickItems = [
  'сайт за 30 минут', 'рекламный ролик', 'ИИ-агент в Telegram', 'гимн компании',
  'КП, которое продаёт', 'презентация для инвестора', 'контент-план на 30 дней',
  'мини-приложение', 'карточки товаров', 'бизнес прожарка live',
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
