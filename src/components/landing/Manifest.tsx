import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Manifest() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const MOB = window.innerWidth < 960;
    const root = rootRef.current;
    if (!root) return;

    const maniScenes = root.querySelectorAll<HTMLElement>('.mani-scene');
    const maniSides = root.querySelectorAll<HTMLElement>('.mani-side');
    const maniCount = root.querySelector<HTMLElement>('#mani-count');
    const maniFill = root.querySelector<HTMLElement>('#mani-fill');

    let st: ScrollTrigger | null = null;
    let st2: ScrollTrigger | null = null;

    if (!RM) {
      gsap.set(maniScenes, { opacity: 0, y: 40, filter: MOB ? 'none' : 'blur(6px)' });
      gsap.set(maniScenes[0], { opacity: 1, y: 0, filter: 'blur(0px)' });

      const maniTl = gsap.timeline({
        scrollTrigger: {
          trigger: root, start: 'top top', end: '+=220%', pin: '.mani-stage', scrub: 0.8,
          onUpdate: (self) => {
            const p = self.progress;
            if (maniFill) maniFill.style.transform = `scaleX(${p})`;
            const idx = Math.min(3, Math.floor(p * 4));
            if (maniCount) maniCount.textContent = '0' + (idx + 1) + '/04';
            maniSides.forEach((s, i) => { s.style.opacity = i === idx ? '1' : '0'; });
          },
        },
      });
      st = maniTl.scrollTrigger as ScrollTrigger;

      for (let s = 1; s < 4; s++) {
        maniTl.to(maniScenes[s - 1], { opacity: 0, y: -40, filter: MOB ? 'none' : 'blur(6px)', duration: 1 }, s)
          .fromTo(maniScenes[s], { opacity: 0, y: 40, filter: MOB ? 'none' : 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1 }, s + 0.15);
      }
      maniTl.to('.mani-cta', { opacity: 1, duration: 0.6 }, 3.6);

      st2 = ScrollTrigger.create({
        trigger: root, start: 'top top', end: '+=220%',
        onUpdate: (self) => {
          root.querySelector('.mani-scene[data-scene="0"] .strike')?.classList.toggle('on', self.progress > 0.12);
          root.querySelector('.mani-scene[data-scene="1"] .strike')?.classList.toggle('on', self.progress > 0.42);
        },
      });
    } else {
      maniScenes.forEach((sc) => { sc.style.position = 'relative'; sc.style.opacity = '1'; });
      const stage = root.querySelector<HTMLElement>('.mani-stage');
      if (stage) { stage.style.flexDirection = 'column'; stage.style.height = 'auto'; }
      const cta = root.querySelector<HTMLElement>('.mani-cta');
      if (cta) cta.style.opacity = '1';
      root.querySelectorAll('.strike').forEach((x) => x.classList.add('on'));
    }

    return () => {
      st?.kill();
      st2?.kill();
    };
  }, []);

  return (
    <section id="manifest" ref={rootRef}>
      <div className="mani-stage">
        <div className="wrap mani-eb"><div className="eyebrow">// 02 · МАНИФЕСТ</div></div>
        <div className="mani-scene" data-scene="0">
          <h3>ЭТО <span className="strike">НЕ КОНФЕРЕНЦИЯ</span>.</h3>
        </div>
        <div className="mani-scene" data-scene="1">
          <h3>И НЕ <span className="strike s2">«ВДОХНОВЛЯЮЩИЕ ИСТОРИИ»</span>.</h3>
        </div>
        <div className="mani-scene" data-scene="2">
          <h3>ЭТО ШОУ, ГДЕ КАЖДЫЕ <span className="mani-cm">30 МИНУТ</span> ИЗ ВОЗДУХА РОЖДАЕТСЯ РЕЗУЛЬТАТ.</h3>
        </div>
        <div className="mani-scene" data-scene="3">
          <h3>ТЫ СМОТРИШЬ — И ПОНИМАЕШЬ: ЗАВТРА СДЕЛАЕШЬ ТАК ЖЕ.</h3>
          <div className="mani-cta"><a className="btn magnetic" href="#pricing">Забронировать место <span className="arr">→</span></a></div>
        </div>
        <div className="mani-side s1">НИ ОДНОГО СЛАЙДА</div>
        <div className="mani-side s2">ТОЛЬКО ПРАКТИКА</div>
        <div className="mani-side s3">НА СЦЕНЕ — ВЫПУСКНИКИ</div>
        <div className="mani-prog"><div className="tr"><i id="mani-fill"></i></div><b id="mani-count">01/04</b></div>
      </div>
    </section>
  );
}
