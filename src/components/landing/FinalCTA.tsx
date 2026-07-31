import { useEffect, useRef } from 'react';
import { particleField, makeTimer, flashEl } from '@/lib/landingUtils';

export default function FinalCTA() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cleanup = particleField(canvas, 90, 0.7);
    return cleanup;
  }, []);

  useEffect(() => {
    const timerEl = timerRef.current;
    if (!timerEl) return;
    let sec = 0;
    const t = makeTimer(1800, (str) => {
      timerEl.textContent = str;
      sec++;
      if (sec % 30 === 0) flashEl('#final-flash', 1);
    }, () => flashEl('#final-flash', 1));
    return () => t.stop();
  }, []);

  return (
    <section id="final">
      <canvas id="particles2" ref={canvasRef}></canvas>
      <div className="spot l"></div><div className="spot r"></div><div className="spot c"></div>
      <div id="final-flash"></div>
      <div className="final-corner c1">// 12 · РЕШЕНИЕ</div>
      <div className="final-corner c2">ЗАЛ · 300 МЕСТ</div>
      <div className="final-corner c3">ОТ 5 000 ₽</div>
      <div className="final-corner c4">РОЗЫГРЫШ 150 000 ₽</div>
      <div className="wrap final-inner">
        <div className="final-timer" id="final-timer" ref={timerRef}>30:00</div>
        <div className="final-timer-label">КАЖДЫЙ БЛОК НАЧИНАЕТСЯ С ЭТИХ ЦИФР</div>
        <h2>
          <span className="row2 rv" style={{ display: 'block' }}>ПОКА ТЫ ДУМАЕШЬ —</span>
          <span className="row2 rv cy" style={{ display: 'block' }}>ТВОЙ КОНКУРЕНТ УЖЕ ЗАПИСАЛСЯ</span>
          <span className="row2 rv" style={{ display: 'block' }}>НА СЕНТЯБРЬСКИЙ ПОТОК.</span>
        </h2>
        <p className="lead rv">Один день. 12 результатов, созданных у тебя на глазах. Билет стоит как ужин на двоих — навыки останутся навсегда.</p>
        <div className="final-cta rv">
          <a className="btn btn-primary-big magnetic" href="https://t.me/DashaChernikova8" target="_blank" rel="noopener" style={{ fontSize: 17, padding: '20px 40px' }}>Забронировать место — от 5 000 ₽ <span className="arr">→</span></a>
          <a className="btn btn-ghost magnetic" href="https://t.me/DashaChernikova8" target="_blank" rel="noopener">Задать вопрос Дарье <span className="arr">→</span></a>
        </div>
        <div className="final-meta rv">ВЛАДИВОСТОК · ЗАЛ 300 МЕСТ · ДАТА И ПЛОЩАДКА — В TG-КАНАЛЕ <a href="https://t.me/chernikovgpt" target="_blank" rel="noopener">@chernikovgpt</a></div>
      </div>
    </section>
  );
}