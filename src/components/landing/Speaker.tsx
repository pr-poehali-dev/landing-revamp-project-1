import { useEffect, useState, CSSProperties } from 'react';
import portrait from '@/assets/speaker-portrait.jpg';
import portraitAlt from '@/assets/speaker-portrait-alt.jpg';

export default function Speaker() {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const iv = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 300);
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  return (
    <section id="speaker">
      <div className="wrap spk-grid">
        <div className="spk-photo rv" data-cursor="view">
          <div className={`spk-photo-main${glitch ? ' is-glitch' : ''}`}>
            <div className="frame" style={{ '--alt-img': `url(${portraitAlt})` } as CSSProperties}>
              <img className="gl-base" src={portrait} alt="Сергей Черников" />
              <div className="gl-slice gl-slice-1" />
              <div className="gl-slice gl-slice-2" />
              <div className="gl-slice gl-slice-3" />
              <div className="gl-scan" />
            </div>
            <div className="tag a">ВЕДУЩИЙ · ОСНОВАТЕЛЬ ШКОЛЫ</div>
            <div className="tag b">17 ОКТЯБРЯ · ВЛАДИВОСТОК</div>
          </div>
        </div>
        <div>
          <div className="eyebrow rv">// 06 · ВЕДУЩИЙ</div>
          <h2 className="h2 rv">СЕРГЕЙ ЧЕРНИКОВ</h2>
          <div className="spk-sub rv">ОСНОВАТЕЛЬ ШКОЛЫ «ХАКНИ НЕЙРОСЕТИ»</div>
          <p className="spk-bio rv">Сооснователь и CEO IT-компании Super-SMM. 6+ лет внедрения ИИ в бизнес. Путь — от грузчика и директора сахарного производства до собственных ИИ-продуктов GPT-BOSS и MultiChat.</p>
          <ul className="spk-facts">
            <li className="rv">Школа «Хакни Нейросети»: рейтинг 4.9/5, 10 000+ выпускников</li>
            <li className="rv">Спикер «Опоры России» и форума «Бизнес у моря»</li>
            <li className="rv">Свои ИИ-продукты: GPT-BOSS и MultiChat</li>
            <li className="rv">На сцене — выпускники школы, а не «звёзды со слайдами»</li>
          </ul>
          <div className="spk-quote rv">
            <span className="qm">”</span>
            <p>ИИ — продуктивный инструмент, который избавляет от рутины. На что раньше уходили часы, ИИ делает за секунду. Главное — использовать его как инструмент, а не для создания контент-мусора.</p>
          </div>
        </div>
      </div>
    </section>
  );
}