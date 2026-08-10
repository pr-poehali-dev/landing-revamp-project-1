import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Icon from '@/components/ui/icon';

interface Tier {
  key: string;
  n: string;
  icon: string;
  title: string;
  cardDesc: string;
  subtitle: string;
  intro: string;
  features: string[];
  price: string;
  note: string;
}

const tiers: Tier[] = [
  {
    key: 'general',
    n: '01',
    icon: 'Crown',
    title: 'ГЕНЕРАЛЬНЫЙ ПАРТНЁР',
    cardDesc: 'Максимум внимания зала и сцены — ваш бренд рядом с главным событием ИИ-рынка Владивостока.',
    subtitle: 'Один бренд. Максимум внимания зала.',
    intro: 'Эксклюзивный статус — на мероприятие приглашается только один генеральный партнёр. Ваш бренд становится неотделим от названия события и получает прямой контакт с 300 предпринимателями, маркетологами и владельцами бизнеса в самой горячей точке региона по теме ИИ.',
    features: [
      'Название бренда в официальном имени мероприятия: «ИИ ШОУ БЕЗ ШИРМЫ 2.0 при поддержке [Ваш бренд]»',
      'Логотип на главном экране сцены весь день и на всех рекламных материалах — сайте, афишах, билетах',
      'Личное выступление представителя бренда на сцене до 10 минут перед полным залом',
      'Устное упоминание бренда ведущим Сергеем Черниковым минимум в 3 из 11 блоков программы',
      'Брендированная зона в фойе на протяжении всего дня',
      'Логотип на баннере партнёров мероприятия',
      'Вручение подарка от бренда во время розыгрыша курса на 150 000 ₽ на глазах у всего зала',
      'Отдельный анонс партнёрства в TG-канале @chernikovgpt',
      'Видеозапись выступления бренда для использования в собственных соцсетях',
      'Упоминание в пресс-релизах по итогам мероприятия',
      '10 билетов уровня ПРЕМИУМ или VIP для сотрудников и клиентов',
    ],
    price: '500 000 ₽',
    note: 'Только один слот на мероприятие.',
  },
  {
    key: 'official',
    n: '02',
    icon: 'Handshake',
    title: 'ОФИЦИАЛЬНЫЙ ПАРТНЁР',
    cardDesc: 'Присутствие в ключевых точках шоу и прямой контакт с аудиторией предпринимателей.',
    subtitle: 'Узнаваемость бренда там, где смотрит вся аудитория.',
    intro: 'Пакет для компаний, которым важен прямой физический контакт с целевой аудиторией без необходимости готовить сценическое выступление. Доступно ограниченное количество слотов.',
    features: [
      'Логотип на сайте мероприятия в разделе партнёров и на баннерах в зале',
      'Устное упоминание бренда ведущим в одном из 11 блоков программы',
      'Ваши промо-материалы — в раздатке, которую получает каждый участник',
      'Место на промо-стойке в фойе для взаимодействия с гостями',
      'Упоминание в сторис и постах TG-канала @chernikovgpt перед мероприятием',
      'Право разместить брендированные материалы (флаеры, промокоды, мерч) на местах в зале',
      '5 билетов уровня БАЗА или ПРЕМИУМ для сотрудников и клиентов',
    ],
    price: '100 000 ₽',
    note: 'Ограниченное количество слотов — 10 партнёров на мероприятие.',
  },
  {
    key: 'info',
    n: '03',
    icon: 'Megaphone',
    title: 'ИНФОРМАЦИОННЫЙ ПАРТНЁР',
    cardDesc: 'Обмен охватами и совместное продвижение на всех этапах подготовки к шоу.',
    subtitle: 'Эксклюзивный контент со сцены, где рождаются результаты.',
    intro: 'Для медиа, блогеров и профильных Telegram-каналов. Бартерное сотрудничество: обмен охватами вместо денежного взноса — доступ к статусному контенту и эксперту с многотысячной аудиторией.',
    features: [
      'Логотип СМИ/канала на сайте мероприятия и в описании к видео с шоу',
      'Взаимный анонс мероприятия — публикация в вашем канале и ответное упоминание в TG-канале @chernikovgpt',
      'Аккредитация на мероприятие с правом съёмки и интервью со спикером и участниками',
      'Эксклюзивное интервью с Сергеем Черниковым до или после шоу',
      'Упоминание как информационного партнёра в постах по итогам мероприятия',
      '2 билета уровня БАЗА для представителей редакции',
    ],
    price: 'Бартер, без денежного взноса',
    note: 'Объём прав определяется охватом вашего канала.',
  },
];

export default function Sponsorship() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [openTier, setOpenTier] = useState<Tier | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let st: ScrollTrigger | null = null;
    if (!RM) {
      const anim = gsap.fromTo(root.querySelectorAll('.spons-card'), { opacity: 0, y: 48, z: -80 }, {
        opacity: 1, y: 0, z: 0, duration: 0.55, ease: 'expo.out', stagger: 0.1,
        scrollTrigger: { trigger: root.querySelector('.spons-grid'), start: 'top 80%', once: true },
      });
      st = anim.scrollTrigger as ScrollTrigger;
    }
    return () => { st?.kill(); };
  }, []);

  useEffect(() => {
    if (!openTier) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenTier(null); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [openTier]);

  return (
    <section id="sponsorship" ref={rootRef}>
      <div className="wrap">
        <div className="eyebrow rv">// 09 · ПАРТНЁРСТВО</div>
        <h2 className="h2 rv">СТАНЬТЕ ЧАСТЬЮ<br />ШОУ БЕЗ ШИРМЫ</h2>
        <p className="lead rv" style={{ maxWidth: 680 }}>300 предпринимателей в одном зале, аудитория без воды и живой контакт с рынком ИИ. Выберите формат — расскажем, что внутри.</p>
        <div className="spons-grid">
          {tiers.map((t) => (
            <button className="spons-card brk" key={t.key} onClick={() => setOpenTier(t)} data-cursor="view">
              <i></i><i></i><i></i><i></i>
              <span className="spons-badge">
                <span className="spons-badge-ring"></span>
                <Icon name={t.icon} size={22} strokeWidth={2} />
              </span>
              <div className="spons-num">{t.n}</div>
              <h4>{t.title}</h4>
              <p>{t.cardDesc}</p>
              <span className="spons-link">Узнать подробнее <span className="arr">→</span></span>
            </button>
          ))}
        </div>
      </div>

      <div className={`spons-modal-overlay${openTier ? ' open' : ''}`} onClick={() => setOpenTier(null)}>
        {openTier && (
          <div className="spons-modal" onClick={(e) => e.stopPropagation()}>
            <button className="spons-modal-close" onClick={() => setOpenTier(null)} aria-label="Закрыть">×</button>
            <div className="spons-modal-scroll" data-lenis-prevent>
              <div className="eyebrow">// {openTier.n} · ПАРТНЁРСТВО</div>
              <h3><Icon name={openTier.icon} size={24} strokeWidth={2} className="spons-modal-icon" /> {openTier.title}</h3>
              <div className="spons-modal-subtitle">{openTier.subtitle}</div>
              <p className="spons-modal-intro">{openTier.intro}</p>
              <div className="spons-modal-features-label mono">ЧТО ВХОДИТ В ПАКЕТ</div>
              <ul className="spons-modal-features">
                {openTier.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
              <div className="spons-modal-price-row">
                <div className="spons-modal-price">
                  <div className="lab mono">СТОИМОСТЬ</div>
                  <div className="val">{openTier.price}</div>
                </div>
                <div className="spons-modal-note">{openTier.note}</div>
              </div>
              <a className="btn magnetic" href="https://t.me/DashaChernikova8" target="_blank" rel="noopener">Обсудить с Дарьей <span className="arr">→</span></a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}