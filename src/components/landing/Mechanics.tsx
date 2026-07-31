import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { flashEl } from '@/lib/landingUtils';

function mechTimeStr(p: number) {
  const third = (p * 3) % 1;
  const left = Math.max(0, Math.round(1800 * (1 - third)));
  const m = Math.floor(left / 60), ss = left % 60;
  return (m < 10 ? '0' : '') + m + ':' + (ss < 10 ? '0' : '') + ss;
}

export default function Mechanics() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const MOB = window.innerWidth < 960;

    const mechTrack = root.querySelector<HTMLElement>('#mech-track');
    const mechNodes = root.querySelectorAll<HTMLElement>('.mech-node');
    const mechTimerEl = root.querySelector<HTMLElement>('#mech-timer');
    const mechFill = root.querySelector<HTMLElement>('#mech-fill');
    if (!mechTrack || !mechTimerEl) return;

    let st: ScrollTrigger | null = null;

    if (!RM && !MOB) {
      const getX = () => -(mechTrack.scrollWidth - window.innerWidth);
      const anim = gsap.to(mechTrack, {
        x: getX, ease: 'none',
        scrollTrigger: {
          trigger: root, start: 'top top', end: '+=250%', pin: '.mech-stage', scrub: 0.8, invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            if (mechFill) mechFill.style.transform = `scaleX(${p})`;
            mechTimerEl.textContent = mechTimeStr(p);
            const idx = Math.min(2, Math.floor(p * 3));
            mechNodes.forEach((n, i) => n.classList.toggle('on', i <= idx));
            if (mechTimeStr(p) === '30:00' && p > 0.02) flashEl('#pl-flash', 0.15);
          },
        },
      });
      st = anim.scrollTrigger as ScrollTrigger;
    } else {
      const stage = root.querySelector<HTMLElement>('.mech-stage');
      if (stage) stage.style.height = 'auto';
      mechTrack.style.flexDirection = 'column';
      mechTrack.style.width = 'auto';
      mechTrack.style.padding = '150px 6vw 110px';
      mechTimerEl.textContent = '30:00';
      const prog = root.querySelector<HTMLElement>('.mech-prog');
      if (prog) prog.style.display = 'none';
    }

    return () => { st?.kill(); };
  }, []);

  return (
    <section id="mech" ref={rootRef}>
      <div className="mech-stage">
        <div className="mech-head">
          <div className="wrap">
            <div>
              <div className="eyebrow">// 04 · МЕХАНИКА</div>
              <h2 className="h2" style={{ marginBottom: 0 }}>ТРИ ШАГА. НОЛЬ ЗАГОТОВОК.</h2>
            </div>
            <div className="mech-timer" id="mech-timer">30:00</div>
          </div>
        </div>
        <div className="mech-track" id="mech-track">
          <div className="mech-panel">
            <div className="pnum">01</div>
            <h4>Запустили таймер</h4>
            <p>Реальная задача из зала. Никаких заготовок: зал видит пустой экран.</p>
          </div>
          <div className="mech-panel">
            <div className="pnum">02</div>
            <h4>30 минут работы вживую</h4>
            <p>Комментируем каждый шаг: инструмент, промпт, почему так. Повторяешь с телефона.</p>
          </div>
          <div className="mech-panel">
            <div className="pnum">03</div>
            <h4>Готовый результат на экране</h4>
            <p>Финальная штука, которую можно отправить клиенту прямо из зала.</p>
          </div>
          <div className="mech-panel final">
            <div className="pnum">✦</div>
            <h4>Всё — разбираем до промпта</h4>
            <p>Всё, что создаём на сцене, разбираем до промпта: уходишь с готовой инструкцией по каждому блоку.</p>
            <span className="chip fill">РАЗДАТКА ВКЛЮЧЕНА В БИЛЕТ</span>
          </div>
        </div>
        <div className="mech-prog">
          <div className="wrap">
            <div className="mech-node on" data-n="0"><i></i>01</div>
            <div className="mech-node" data-n="1"><i></i>02</div>
            <div className="mech-node" data-n="2"><i></i>03</div>
            <div className="tr"><b id="mech-fill"></b></div>
          </div>
        </div>
      </div>
    </section>
  );
}
