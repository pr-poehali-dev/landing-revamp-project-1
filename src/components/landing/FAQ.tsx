import { useEffect, useRef } from 'react';

const faqs = [
  { q: 'Когда и где пройдёт шоу?', a: '17 октября, с 10:00 до 18:00, во Владивостоке — в отеле «Экватор» (ул. Набережная, 20).' },
  { q: 'Нужен ли опыт работы с ИИ?', a: 'Нет. Половина зала начнёт с нуля — каждый шаг комментируем: инструмент, промпт, логика. Повторять можно прямо с телефона.' },
  { q: 'Будет ли впаривание курса?', a: 'Нет. Один раз в конце честно расскажем про школу — и всё. Остальные 8 часов — только практика.' },
  { q: 'Чем ПРЕМИУМ отличается от БАЗЫ?', a: 'Расширенные материалы, первые ряды, закрытый чат с ведущими на месяц, 2 билета на розыгрыш курса на 150 000 ₽ и билет на бесплатное посещение мастер-класса.' },
  { q: 'Чем VIP отличается от ПРЕМИУМ?', a: 'Бизнес Прожарка твоего бизнеса на сцене, личная консультация 30 минут, VIP-зона, мерч и сертификат. Мест строго ограничено.' },
  { q: 'Стоит ли брать команду?', a: <>Да — так вы разложите блоки между собой и внедрите быстрее. От 3 человек пишите Дарье: <a href="tel:+79811292499">+7 981 129-24-99</a>, TG <a href="https://t.me/DashaChernikova8" target="_blank" rel="noopener">@DashaChernikova8</a>.</> },
  { q: 'А что, если на сцене что-то не получится?', a: 'Вы увидите, как это чинят вживую. В том и шоу без ширмы.' },
];

export default function FAQ() {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const items = Array.from(list.querySelectorAll<HTMLElement>('.faq-item'));

    const handlers: { item: HTMLElement; q: HTMLElement; handler: () => void }[] = [];

    items.forEach((item) => {
      const q = item.querySelector<HTMLElement>('.faq-q');
      const a = item.querySelector<HTMLElement>('.faq-a');
      if (!q || !a) return;
      const handler = () => {
        const open = item.classList.contains('open');
        items.forEach((o) => {
          o.classList.remove('open');
          const oa = o.querySelector<HTMLElement>('.faq-a');
          if (oa) oa.style.maxHeight = '0px';
        });
        if (!open) {
          item.classList.add('open');
          a.style.maxHeight = a.scrollHeight + 'px';
        }
      };
      q.addEventListener('click', handler);
      handlers.push({ item, q, handler });
    });

    return () => {
      handlers.forEach(({ q, handler }) => q.removeEventListener('click', handler));
    };
  }, []);

  return (
    <section id="faq">
      <div className="wrap faq-grid">
        <div className="faq-left">
          <div className="eyebrow rv">// 11 · FAQ</div>
          <h2 className="h2 rv">ОТВЕЧАЕМ<br />ЧЕСТНО</h2>
          <div className="help rv">Остался вопрос — напиши Дарье:<br />TG <a href="https://t.me/DashaChernikova8" target="_blank" rel="noopener">@DashaChernikova8</a><br /><a href="tel:+79811292499">+7 981 129-24-99</a></div>
        </div>
        <div className="faq-list" ref={listRef}>
          {faqs.map((f, i) => (
            <div className="faq-item rv" key={i}>
              <button className="faq-q"><span className="qn">Q{i + 1}</span><span className="qt">{f.q}</span><span className="ic"></span></button>
              <div className="faq-a"><div className="ai"><p>{f.a}</p></div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}