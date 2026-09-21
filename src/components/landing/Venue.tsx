import Icon from '@/components/ui/icon';

export default function Venue() {
  return (
    <section id="venue">
      <div className="wrap">
        <div className="eyebrow rv">// 14 · МЕСТО ПРОВЕДЕНИЯ</div>
        <h2 className="h2 rv">ГДЕ ПРОХОДИТ ИИ ШОУ</h2>
        <div className="venue-grid">
          <div className="venue-text">
            <p className="lead rv">
              ИИ ШОУ БЕЗ ШИРМЫ 2.0 проходит во Владивостоке, Приморский край,
              в отеле «Экватор» на Спортивной набережной. Это центр города:
              рядом остановки городского транспорта и парковка, от железнодорожного
              вокзала — около 10 минут на машине.
            </p>
            <ul className="venue-facts">
              <li className="rv"><Icon name="MapPin" size={18} strokeWidth={2} /><span><b>Адрес:</b> Владивосток, ул. Набережная, 20 — отель «Экватор»</span></li>
              <li className="rv"><Icon name="CalendarDays" size={18} strokeWidth={2} /><span><b>Дата:</b> 17 октября 2026 года</span></li>
              <li className="rv"><Icon name="Clock" size={18} strokeWidth={2} /><span><b>Время:</b> с 10:00 до 18:00 (время владивостокское)</span></li>
              <li className="rv"><Icon name="Users" size={18} strokeWidth={2} /><span><b>Зал:</b> 300 мест</span></li>
              <li className="rv"><Icon name="Navigation" size={18} strokeWidth={2} /><span><b>Координаты:</b> 43.115° с. ш., 131.885° в. д.</span></li>
            </ul>
            <a
              className="btn btn-ghost magnetic rv"
              href="https://yandex.ru/maps/?text=Владивосток, Набережная 20, отель Экватор"
              target="_blank"
              rel="noopener"
            >
              Открыть в Яндекс Картах <span className="arr">→</span>
            </a>
          </div>
          <div className="venue-map rv">
            <iframe
              title="Карта: отель «Экватор», Владивосток, ул. Набережная, 20 — место проведения ИИ ШОУ БЕЗ ШИРМЫ"
              src="https://yandex.ru/map-widget/v1/?text=Владивосток%2C%20Набережная%2020%2C%20отель%20Экватор&z=16"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}