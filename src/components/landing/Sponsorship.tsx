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

interface CompareRow {
  label: string;
  official: string;
  general: string;
}

const compareRows: CompareRow[] = [
  { label: 'Эксклюзивность в нише', official: '—', general: '✓' },
  { label: 'Логотип на сайте и в программе', official: '✓', general: '✓' },
  { label: 'Логотип на бейджах/браслетах гостей', official: '—', general: '✓' },
  { label: 'Стенд / промо-зона', official: 'Малый, раздаточные материалы', general: 'Отдельный, лучшее место в зале' },
  { label: 'Выступление на сцене', official: 'Интерактивный формат', general: 'Интерактивный формат и Персональный, 5–10 минут' },
  { label: 'Публикации в соцсетях', official: '2 поста', general: '2–3 поста + рассылка' },
  { label: 'Билеты для команды', official: '5 (База, 25 000 ₽)', general: '10 (Премиум, 75 000 ₽)' },
  { label: 'Личный нетворкинг с гостями', official: 'Общий обед', general: 'VIP-зона, обед, знакомства' },
  { label: 'Пост-ивент отчёт', official: 'Базовая статистика', general: 'Полный отчёт + база контактов' },
  { label: 'Скидка на обучение в школе', official: '15%', general: '30%' },
  { label: 'Консультация от экспертов компании «Хакни Нейросети»', official: '1 час с сотрудником компании «Хакни Нейросети»', general: '1 час лично с Сергеем Черниковым' },
  { label: 'Рекламный ролик о бренде', official: '—', general: '✓' },
  { label: 'Розыгрыш подарков со сцены', official: '✓', general: '✓' },
  { label: 'After Party', official: '✓', general: '✓' },
];

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
  const [compareOpen, setCompareOpen] = useState(false);

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
    if (!openTier && !compareOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpenTier(null); setCompareOpen(false); }
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [openTier, compareOpen]);

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
        <button className="spons-compare-btn rv" onClick={() => setCompareOpen(true)}>
          <Icon name="Rows3" size={18} strokeWidth={2} />
          Сравнить пакеты
        </button>
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
              <div className="chat-notify">
                <span className="cn-txt">Связаться с Дарьей</span>
                <div className="cn-links">
                  <a className="cn-link" href="https://t.me/chernikova_dary" target="_blank" rel="noopener" aria-label="Написать в Telegram">
                    <Icon name="Send" size={18} strokeWidth={2} />
                  </a>
                  <a className="cn-link" href="https://max.ru/u/f9LHodD0cOKBLVDjyIazOQYrynC-NgyWbNi2E6gOfAgMljaJllQCdC9fb4g" target="_blank" rel="noopener" aria-label="Написать в МАХ">
                    <Icon name="MessageCircle" size={18} strokeWidth={2} />
                  </a>
                  <a className="cn-link" href="tel:+79811292499" aria-label="Позвонить">
                    <Icon name="Phone" size={18} strokeWidth={2} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={`spons-modal-overlay${compareOpen ? ' open' : ''}`} onClick={() => setCompareOpen(false)}>
        {compareOpen && (
          <div className="spons-modal spons-compare-modal" onClick={(e) => e.stopPropagation()}>
            <button className="spons-modal-close" onClick={() => setCompareOpen(false)} aria-label="Закрыть">×</button>
            <div className="spons-modal-scroll" data-lenis-prevent>
              <div className="eyebrow">// СРАВНЕНИЕ ПАКЕТОВ</div>
              <h3>Сравнение пакетов</h3>

              <div className="spons-compare-table-wrap">
                <table className="spons-compare-table">
                  <thead>
                    <tr>
                      <th>Что входит</th>
                      <th>Партнёр<br /><span className="spons-compare-price">100 000 ₽</span></th>
                      <th>Генеральный спонсор<br /><span className="spons-compare-price">500 000 ₽</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {compareRows.map((r, i) => (
                      <tr key={i}>
                        <td>{r.label}</td>
                        <td data-label="Партнёр — 100 000 ₽">{r.official}</td>
                        <td data-label="Генеральный — 500 000 ₽">{r.general}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h4 className="spons-compare-h4">Почему это выгодное вложение</h4>
              <p className="spons-modal-intro">Похожие события на 250–300 гостей в мире продают партнёрство в диапазоне от 45 000 до 270 000 ₽ на входном уровне и от 450 000 до 1 350 000 ₽ на топ-уровне. Наши тарифы находятся в консервативной части этого диапазона — это значит, что вы получаете доступ к качественной аудитории по цене ниже рыночной, а с ростом узнаваемости конференции ценность вашего партнёрства будет расти.</p>

              <h4 className="spons-compare-h4">Готовы к партнёрству без оплаты деньгами?</h4>
              <p className="spons-modal-intro">Если вашему бренду удобнее участвовать услугами или продуктом, мы открыты к бартеру:</p>
              <ul className="spons-modal-features spons-compare-bullets">
                <li>кофе-брейк, еда, напитки — статус «партнёр кофе-брейка» с логотипом и упоминанием</li>
                <li>площадка, техника, транспорт — статус технического партнёра</li>
                <li>подарки и сертификаты для гостей — брендинг и раздача на входе</li>
              </ul>

              <h4 className="spons-compare-h4">Как начать сотрудничество</h4>
              <p className="spons-modal-intro">Мы готовы обсудить индивидуальные условия и адаптировать пакет под задачи именно вашего бизнеса. Свяжитесь с нами, чтобы забронировать место в числе партнёров конференции — количество спонсорских мест ограничено.</p>
              <p className="spons-compare-org">Организатор: Сергей Черников, школа «Хакни Нейросети», Владивосток<br />Телефон <a href="tel:+79811292499">+7 981 129-24-99</a>, Дарья</p>

              <div className="chat-notify">
                <span className="cn-txt">Связаться с Дарьей</span>
                <div className="cn-links">
                  <a className="cn-link" href="https://t.me/chernikova_dary" target="_blank" rel="noopener" aria-label="Написать в Telegram">
                    <Icon name="Send" size={18} strokeWidth={2} />
                  </a>
                  <a className="cn-link" href="https://max.ru/u/f9LHodD0cOKBLVDjyIazOQYrynC-NgyWbNi2E6gOfAgMljaJllQCdC9fb4g" target="_blank" rel="noopener" aria-label="Написать в МАХ">
                    <Icon name="MessageCircle" size={18} strokeWidth={2} />
                  </a>
                  <a className="cn-link" href="tel:+79811292499" aria-label="Позвонить">
                    <Icon name="Phone" size={18} strokeWidth={2} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}