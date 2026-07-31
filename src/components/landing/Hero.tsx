import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import portrait from '@/assets/speaker-portrait.jpg';
import { particleField, makeTimer, flashEl } from '@/lib/landingUtils';
import { scrollToEl } from '@/lib/landingScroll';

interface Props {
  ready: boolean;
}

export default function Hero({ ready }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const digitsRef = useRef<(HTMLElement | null)[]>([]);
  const stateRef = useRef('30:00');
  const startedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cleanup = particleField(canvas, 160, 1);
    return cleanup;
  }, []);

  useEffect(() => {
    if (!ready || startedRef.current) return;
    startedRef.current = true;
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const setHeroTimer = (str: string) => {
      for (let i = 0; i < 5; i++) {
        if (stateRef.current[i] !== str[i]) {
          const el = digitsRef.current[i];
          const ch = str[i];
          if (!el) continue;
          if (RM) { el.textContent = ch; continue; }
          gsap.to(el, {
            yPercent: -100, duration: 0.18, ease: 'power2.in',
            onComplete: () => {
              el.textContent = ch;
              gsap.fromTo(el, { yPercent: 100 }, { yPercent: 0, duration: 0.3, ease: 'expo.out' });
            },
          });
        }
      }
      stateRef.current = str;
    };

    makeTimer(1800, setHeroTimer, () => flashEl('#pl-flash', 0.5));

    if (RM) {
      gsap.set('#hero h1 .row>span', { yPercent: 0 });
      document.querySelectorAll('#hero .rv').forEach((el) => { (el as HTMLElement).style.opacity = '1'; });
    } else {
      gsap.to('#hero h1 .row>span', { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.15, delay: 0.1 });
      gsap.fromTo('#hero-timer .dg b', { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.7, ease: 'expo.out', stagger: 0.06 });
      gsap.fromTo('#hero .rv', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08, delay: 0.35, overwrite: 'auto' });
      gsap.fromTo('.hero-portrait .frame', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'expo.out', delay: 0.5 });
    }
  }, [ready]);

  useEffect(() => {
    gsap.set('#hero h1 .row>span', { yPercent: 110 });
  }, []);

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const t = document.querySelector(id);
    if (t) scrollToEl(t as HTMLElement);
  };

  return (
    <header id="hero">
      <canvas id="particles" ref={canvasRef}></canvas>
      <div className="spot l"></div><div className="spot r"></div>
      <div className="wrap hero-inner">
        <div className="eyebrow rv">// 01 · ЖИВОЕ ИИ-ШОУ · ВЛАДИВОСТОК</div>
        <div className="showtimer" id="hero-timer" aria-label="Таймер блока: 30 минут">
          {['3', '0', ':', '0', '0'].map((d, i) => (
            <span className="dg" key={i}><b ref={(el) => (digitsRef.current[i] = el)}>{d}</b></span>
          ))}
        </div>
        <div className="timer-note rv">ровно столько длится каждый блок. И каждые 30 минут будут рождаться новые проекты</div>
        <h1>
          <span className="row"><span className="grad-text">ИИ ШОУ</span></span>
          <span className="row o"><span>БЕЗ ШИРМЫ 2.0</span></span>
        </h1>
        <div className="hero-grid">
          <div>
            <p className="lead rv">Это не конференция и не «вдохновляющие истории». Это шоу, где каждые полчаса из воздуха рождается готовый результат для бизнеса — сайт, ролик, агент, презентация инвестору. Ты смотришь — и понимаешь, что завтра сделаешь так же.</p>
            <div className="hero-cta rv">
              <a className="btn magnetic" href="#pricing" onClick={(e) => go(e, '#pricing')}>Забронировать место <span className="arr">→</span></a>
              <a className="btn btn-ghost magnetic" href="#program" onClick={(e) => go(e, '#program')}>Смотреть программу <span className="arr">↓</span></a>
            </div>
            <div className="hero-note rv">Дата и площадка — анонсируем в TG-канале <a href="https://t.me/chernikovgpt" target="_blank" rel="noopener">@chernikovgpt</a></div>
            <div className="hero-meta rv">БИЛЕТ ОТ <b>5 000 ₽</b> · <b>12 БЛОКОВ</b> ПРАКТИКИ · РОЗЫГРЫШ КУРСА НА <b>150 000 ₽</b></div>
          </div>
          <div className="hero-portrait rv" data-cursor="view">
            <div className="frame"><img src={portrait} alt="Сергей Черников — ведущий ИИ ШОУ" /></div>
            <div className="brackets"><i></i><i></i><i></i><i></i></div>
            <div className="float-tag t1">ВЕДУЩИЙ — СЕРГЕЙ ЧЕРНИКОВ</div>
            <div className="float-tag t2">ЗАЛ · 300 МЕСТ</div>
            <div className="float-tag t3">v2.0</div>
          </div>
        </div>
      </div>
      <div className="scroll-hint">ЛИСТАЙ ▾</div>
      <div className="geo-vert">43.11°N 131.88°E</div>
    </header>
  );
}