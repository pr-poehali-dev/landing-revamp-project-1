import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const cards = [
  { n: '01', title: 'Сайт за 30 минут', desc: 'Лендинг: структура, тексты, дизайн, публикация.', take: 'свой сайт-шаблон и промпт-цепочку' },
  { n: '02', title: 'Ассистент-стилист', desc: 'ИИ подбирает образ и гардероб по фото и бюджету.', take: 'схему сервиса для своей ниши' },
  { n: '03', title: 'Карточки товаров, которые продают', desc: 'Название, описание, SEO, инфографика для маркетплейсов.', take: '3 готовые карточки' },
  { n: '04', title: 'Рекламный видеоролик', desc: 'Сценарий, генерация, озвучка, монтаж — за один блок.', take: 'ролик + список инструментов с тарифами' },
  { n: '05', title: 'Коммерческое предложение', desc: 'КП по фирменной анкете из 12 пунктов, которое продаёт курсы по 150 000 ₽.', take: 'анкету и структуру КП' },
  { n: '06', title: 'Презентация для инвестора', desc: 'Дек со структурой, финмоделью и визуалом.', take: 'каркас дека на 10 слайдов' },
  { n: '07', title: 'Мини-приложение', desc: 'Без строчки кода. Формат выберет зал голосованием: калькулятор, каталог или квиз.', take: 'ссылку на своё приложение' },
  { n: '08', title: 'Контент-план на 30 дней', desc: 'Темы, хуки, форматы + 3 поста прямо в блоке.', take: 'план + 3 готовых поста' },
  { n: '09', title: 'ИИ-агент в Telegram', desc: 'Бот 24/7 отвечает клиентам и ведёт к покупке — как Нейра в нашей школе.', take: 'инструкцию запуска' },
  { n: '10', title: 'Гимн компании', desc: 'Трек под бренд. Две версии.', take: 'свой трек' },
  { n: '11', title: 'Скрытый блок-сюрприз', desc: 'Про деньги и про то, что ИИ умеет уже сейчас.', take: 'узнаешь только в зале', chip: 'СЮРПРИЗ', surp: true, time: '??:??' },
];

export default function Program() {
  const galRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const gal = galRef.current;
    const track = trackRef.current;
    const progFill = fillRef.current;
    if (!gal || !track || !progFill) return;

    let pos = 0, target = 0, vel = 0, dragging = false, startX = 0, startPos = 0, moved = false;
    const maxDrag = () => Math.max(0, track.scrollWidth - gal.clientWidth + 40);

    let raf = 0;
    const render = () => {
      pos += (target - pos) * 0.12;
      track.style.transform = `translateX(${-pos}px)`;
      const m = maxDrag();
      progFill.style.transform = `scaleX(${m > 0 ? pos / m : 0})`;
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    const onDown = (e: PointerEvent) => {
      dragging = true; moved = false; startX = e.clientX; startPos = target; vel = 0;
      gal.setPointerCapture(e.pointerId);
    };
    const onMoveP = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      let nt = startPos - dx;
      const m = maxDrag();
      if (nt < 0) nt = nt * 0.3;
      if (nt > m) nt = m + (nt - m) * 0.3;
      vel = nt - target;
      target = nt;
    };
    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      const m = maxDrag();
      target = target + vel * 14;
      const cardEl = track.querySelector<HTMLElement>('.pcard');
      const cardW = (cardEl?.offsetWidth || 340) + 20;
      const snapped = Math.round(target / cardW) * cardW;
      if (Math.abs(target - snapped) / (m || 1) < 0.025) target = snapped;
      target = gsap.utils.clamp(0, m, target);
    };
    const onClickCapture = (e: MouseEvent) => { if (moved) e.preventDefault(); };
    const onKeyDown = (e: KeyboardEvent) => {
      const r = gal.getBoundingClientRect();
      if (r.top > innerHeight || r.bottom < 0) return;
      const cardEl = track.querySelector<HTMLElement>('.pcard');
      const cardW = (cardEl?.offsetWidth || 340) + 20;
      const m = maxDrag();
      if (e.key === 'ArrowRight') target = gsap.utils.clamp(0, m, target + cardW);
      if (e.key === 'ArrowLeft') target = gsap.utils.clamp(0, m, target - cardW);
    };

    gal.addEventListener('pointerdown', onDown);
    gal.addEventListener('pointermove', onMoveP);
    gal.addEventListener('pointerup', endDrag);
    gal.addEventListener('pointercancel', endDrag);
    gal.addEventListener('click', onClickCapture, true);
    window.addEventListener('keydown', onKeyDown);

    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let st: ScrollTrigger | null = null;
    if (!RM) {
      const anim = gsap.fromTo(track.querySelectorAll('.pcard'), { opacity: 0, y: 60, rotateY: 8, transformPerspective: 1200 }, {
        opacity: 1, y: 0, rotateY: 0, z: 0, duration: 0.5, ease: 'expo.out', stagger: 0.07,
        scrollTrigger: { trigger: gal, start: 'top 78%', once: true },
      });
      st = anim.scrollTrigger as ScrollTrigger;
    }

    return () => {
      cancelAnimationFrame(raf);
      gal.removeEventListener('pointerdown', onDown);
      gal.removeEventListener('pointermove', onMoveP);
      gal.removeEventListener('pointerup', endDrag);
      gal.removeEventListener('pointercancel', endDrag);
      gal.removeEventListener('click', onClickCapture, true);
      window.removeEventListener('keydown', onKeyDown);
      st?.kill();
    };
  }, []);

  return (
    <section id="program">
      <div className="wrap">
        <div className="prog-head">
          <div>
            <div className="eyebrow rv">// 05 · ПРОГРАММА</div>
            <h2 className="h2 rv">11 БЛОКОВ. КАЖДЫЙ —<br />ГОТОВЫЙ РЕЗУЛЬТАТ.</h2>
          </div>
          <div className="drag-hint rv">ТЯНИ <span className="arr">→</span></div>
        </div>
      </div>
      <div className="prog-gal" id="prog-gal" data-cursor="drag" ref={galRef}>
        <div className="prog-track" id="prog-track" ref={trackRef}>
          {cards.map((c) => (
            <div className={`pcard brk${c.surp ? ' surp' : ''}`} key={c.n}>
              <i></i><i></i><i></i><i></i>
              {c.chip && <span className="chip o">{c.chip}</span>}
              <div className="p-top"><span className="pn">{c.n}</span><span>{c.time || '30:00'}</span></div>
              <h5>{c.title}</h5>
              <div className="pd">{c.desc}</div>
              <div className="p-take">УНЕСЁШЬ:<b>{c.take}</b></div>
            </div>
          ))}
        </div>
      </div>
      <div className="wrap">
        <div className="prog-nav">
          <div className="keys">← ТЯНИ / СТРЕЛКИ</div>
          <div className="tr"><i id="prog-fill" ref={fillRef}></i></div>
        </div>
        <div className="prog-cta rv">Всё это — в каждом билете. <a href="#pricing">Выбрать тариф →</a></div>
      </div>
    </section>
  );
}