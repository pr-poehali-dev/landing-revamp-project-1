import portrait from '@/assets/speaker-portrait.jpg';

export default function Speaker() {
  return (
    <section id="speaker">
      <div className="wrap spk-grid">
        <div className="spk-photo rv" data-cursor="view">
          <div className="frame"><img src={portrait} alt="Сергей Черников" /></div>
          <div className="tag a">ВЕДУЩИЙ · ОСНОВАТЕЛЬ ШКОЛЫ</div>
          <div className="tag b">17 ОКТЯБРЯ · ВЛАДИВОСТОК</div>
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