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
    subtitle: 'Статус №1 на мероприятии.',
    intro: 'Один партнёр в своей нише — конкуренты из вашей отрасли рядом представлены не будут.',
    features: [
      'Максимальная видимость бренда — название компании рядом с названием мероприятия («при поддержке…») на сайте, в анонсах, на рекламных баннерах и главной заставке события',
      'Голос со сцены — приветственное слово или выступление на 5–10 минут перед всем залом',
      'Лучшее место в зале — отдельный брендированный стенд на самой заметной точке площадки',
      'Присутствие везде, где смотрит гость — крупный логотип на главном баннере, экране во время программы и на браслетах всех 250–300 участников',
      'Присутствие в медиаполе — 2–3 публикации о бренде в соцсетях мероприятия до и после события (список площадок и охваты — по согласованию)',
      'Закрытый нетворкинг — личное пространство на мероприятии: обед и знакомство с другими спонсорами и организаторами в VIP-зоне',
      'Полная отчётность — пост-ивент отчёт с числом гостей, обратной связью, фото- и видеоматериалами; база контактов участников — по согласованию и с соблюдением политики конфиденциальности',
      'Билеты для команды и партнёров — 10 билетов тарифа «Премиум» общей стоимостью 75 000 ₽',
      'Прямой контакт с залом — возможность разыграть подарки для участников лично со сцены',
      'Статус и репутация — почётная грамота как официальному спонсору мероприятия',
      'Бонус на будущее — скидка 30% на обучение в школе «Хакни Нейросети»',
      'Экспертная поддержка бизнеса — личная консультация 1 час с Сергеем Черниковым по внедрению ИИ в ваши бизнес-процессы',
      'Готовый рекламный актив — разработка имиджевого ролика о вашем бренде длительностью 30 секунд',
      'Неформальное общение — участие в After Party мероприятия',
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
    subtitle: 'Доступный вход в деловое сообщество конференции.',
    intro: 'Доступный вход в деловое сообщество конференции с реальной пользой для бренда.',
    features: [
      'Присутствие на всех носителях — логотип на сайте мероприятия и в официальной программе',
      'Нативная реклама руками гостей — логотип на фотозоне — участники фотографируются на её фоне и публикуют фото в соцсетях, что органично продвигает бренд',
      'Прямой контакт с аудиторией — стенд для раздаточных материалов или продающий островок',
      'Голос на сцене — выступление в формате интерактива с другими спонсорами — возможность заявить о бизнесе и предложении',
      'Присутствие в медиаполе — 2 публикации о бренде в соцсетях мероприятия до и после события (список площадок и охваты — по согласованию)',
      'Билеты для команды — 5 билетов тарифа «База» общей стоимостью 25 000 ₽',
      'Прямой контакт с залом — возможность разыграть подарки для участников лично со сцены',
      'Базовая отчётность — статистика после мероприятия — количество гостей, общий охват, скрины публикаций',
      'Статус и репутация — почётная грамота как официальному партнёру мероприятия',
      'Бонус на будущее — скидка 15% на обучение в школе «Хакни Нейросети»',
      'Прямой канал к клиенту — раздаточный материал бренда (подарок, скидка, спецпредложение) в пакете каждого участника при регистрации',
      'Нетворкинг — участие в общем обеде и знакомство с другими спонсорами и организаторами',
      'Неформальное общение — участие в After Party мероприятия',
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
        <div className="eyebrow rv">// 10 · ПАРТНЁРСТВО</div>
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
              <a className="btn magnetic" href="https://t.me/chernikova_dary" target="_blank" rel="noopener">Обсудить с Дарьей <span className="arr">→</span></a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}