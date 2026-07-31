import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import logo from '@/assets/hackni-logo.jpg';

interface Props {
  onDone: () => void;
}

export default function Preloader({ onDone }: Props) {
  const plRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const load = { s: 1800 };
    const pl = plRef.current;
    const plNum = numRef.current;
    if (!pl || !plNum) return;

    gsap.to(load, {
      s: 0, duration: RM ? 0.1 : 2.2, ease: 'power2.inOut',
      onUpdate: () => {
        const m = Math.floor(load.s / 60), ss = Math.floor(load.s % 60);
        plNum.textContent = (m < 10 ? '0' : '') + m + ':' + (ss < 10 ? '0' : '') + ss;
      },
      onComplete: () => {
        if (flashRef.current && !RM) {
          gsap.fromTo(flashRef.current, { opacity: 0 }, { opacity: 0.6, duration: 0.12, yoyo: true, repeat: 1, ease: 'power1.inOut' });
        }
        plNum.textContent = 'СТАРТ';
        gsap.fromTo(plNum, { letterSpacing: '.2em' }, { letterSpacing: '.04em', duration: 0.3 });
        gsap.to(pl, {
          yPercent: -100, duration: RM ? 0.1 : 0.7, ease: 'power4.inOut', delay: 0.35,
          onComplete: () => {
            pl.style.display = 'none';
            onDone();
          },
        });
      },
    });
  }, [onDone]);

  return (
    <>
      <div id="pl-flash" ref={flashRef}></div>
      <div id="preloader" ref={plRef}>
        <div className="pl-mark">
          <svg className="pl-ring" viewBox="0 0 120 120">
            <circle className="bg" cx="60" cy="60" r="56"></circle>
            <circle className="fg" cx="60" cy="60" r="56"></circle>
          </svg>
          <img src={logo} alt="Хакни Нейросети" />
        </div>
        <div id="pl-label">ХАКНИ НЕЙРОСЕТИ · ПРЕДСТАВЛЯЕТ</div>
        <div id="pl-num" ref={numRef}>30:00</div>
      </div>
    </>
  );
}
