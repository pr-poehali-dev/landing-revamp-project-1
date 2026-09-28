import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Icon from '@/components/ui/icon';
import { scrollToEl } from '@/lib/landingScroll';
import chernikov from '@/assets/speaker-chernikov.jpg';
import kindurus from '@/assets/speaker-kindurus.jpg';
import zarina from '@/assets/speaker-zarina.jpg';
import tsybulskaya from '@/assets/speaker-tsybulskaya.jpg';

type Slot = {
  time: string;
  n?: string;
  kind: 'block' | 'break' | 'final';
  title: string;
  speaker?: string;
  role?: string;
  photo?: string;
  desc: string;
  benefit?: string;
  result?: string;
  bullets?: string[];
};

const schedule: Slot[] = [
  {
    time: '10:00–11:00',
    kind: 'break',
    title: 'Регистрация',
    desc: 'Сбор гостей, получение бейджей и знакомство с площадкой. До старта программы можно пообщаться с предпринимателями, экспертами и партнёрами шоу.',
    benefit: 'Первые деловые знакомства и возможность заранее найти людей с похожими задачами.',
  },
  {
    time: '11:00–11:30',
    n: '01',
    kind: 'block',
    title: 'Контент-план на месяц',
    speaker: 'Василиса Шумова',
    role: 'Эксперт по контент-маркетингу',
    desc: 'Как перестать каждый день придумывать, что опубликовать. На сцене с помощью ИИ создаём полноценный контент-план: темы, рубрики, форматы, заголовки и идеи для постов.',
    benefit: 'Хаотичное ведение соцсетей превращается в понятную систему, время на контент сокращается в разы.',
    result: 'Готовая структура контент-плана под свой бизнес или личный бренд',
  },
  {
    time: '11:30–12:00',
    n: '02',
    kind: 'block',
    title: 'ИИ-ассистент «Стилист»',
    speaker: 'Максим Гришин',
    role: 'Специалист по ИИ-решениям',
    desc: 'Создаём персонального ассистента, который анализирует внешность и задачи человека, предлагает образы и помогает с подбором гардероба. На этом примере видно, как собирать ассистентов для любой ниши.',
    benefit: 'Понимание принципов создания ИИ-консультантов, которые персонализируют рекомендации и усиливают продукт.',
    result: 'Работающий прототип цифрового ассистента',
  },
  {
    time: '12:00–12:30',
    n: '03',
    kind: 'block',
    title: 'Продающий визуал',
    speaker: 'Зарина',
    role: 'Дизайнер, эксперт по визуальному контенту',
    photo: zarina,
    desc: 'Как создавать профессиональные визуалы без съёмок, команды и долгой работы дизайнера. Разбираем продающие карточки, рекламные плакаты и реальный кейс серии постеров.',
    benefit: 'Быстрая подготовка визуалов для рекламы, соцсетей, презентаций и маркетплейсов.',
    result: 'Готовая продающая карточка или рекламный плакат',
  },
  {
    time: '12:30–13:00',
    n: '04',
    kind: 'block',
    title: 'Коммерческое предложение и продающая презентация',
    speaker: 'Андрей Киндурус',
    role: 'Эксперт по продажам и переговорам',
    photo: kindurus,
    desc: 'Превращаем информацию о компании в предложение, которое объясняет ценность и помогает продавать. Собираем структуру, формулируем аргументы, прорабатываем оффер и делаем убедительную презентацию.',
    benefit: 'Понятный алгоритм подготовки КП для клиентов, партнёров и инвесторов.',
    result: 'Готовое КП и структура презентации, которую можно отправить клиенту',
  },
  {
    time: '13:00–13:30',
    n: '05',
    kind: 'block',
    title: 'Собственный трек с помощью ИИ',
    speaker: 'Ольга Разумовская',
    role: 'Эксперт по креативным ИИ-инструментам',
    desc: 'Создаём музыкальную композицию: от идеи и текста до аранжировки и готового звучания. Гимны компаний, музыка для рекламы, мероприятий и соцсетей.',
    benefit: 'Оригинальный музыкальный материал без студии, композитора и длительного продакшена.',
    result: 'Готовый авторский трек, созданный прямо на сцене',
  },
  {
    time: '13:30–14:00',
    n: '06',
    kind: 'block',
    title: 'Продающий сайт своими руками',
    speaker: 'Сергей Черников',
    role: 'Основатель школы «Хакни Нейросети»',
    photo: chernikov,
    desc: 'Можно ли создать работающий сайт без программиста и недель разработки? Весь процесс на сцене: от идеи и структуры до текстов, оформления и публикации.',
    benefit: 'Самостоятельный быстрый запуск сайтов для продуктов, услуг и проверки бизнес-идей.',
    result: 'Готовый опубликованный сайт, созданный с нуля за время выступления',
  },
  {
    time: '14:00–14:45',
    kind: 'break',
    title: 'Обед',
    desc: 'Перерыв, общение и нетворкинг. Время обсудить увиденные инструменты и познакомиться с участниками, спикерами и партнёрами шоу.',
  },
  {
    time: '14:45–15:30',
    kind: 'break',
    title: 'Партнёрская сессия',
    desc: 'Представители компаний-партнёров рассказывают о своих продуктах и практических решениях для предпринимателей — сервисы для развития бизнеса, автоматизации и роста.',
    benefit: 'Полезные предложения, новые контакты и знакомство с компаниями, открытыми к сотрудничеству.',
  },
  {
    time: '15:30–16:00',
    n: '07',
    kind: 'block',
    title: 'Рекламный ролик с помощью ИИ',
    speaker: 'Максим Гришин',
    role: 'Специалист по ИИ-решениям',
    desc: 'Как создать рекламное видео без съёмочной группы, актёров и сложного монтажа. Весь путь от идеи и сценария до генерации кадров и сборки готового ролика.',
    benefit: 'Быстрое тестирование рекламных идей и видеоконтент для соцсетей, презентаций и кампаний.',
    result: 'Готовый рекламный ролик, созданный в режиме реального времени',
  },
  {
    time: '16:00–16:30',
    n: '08',
    kind: 'block',
    title: 'NotebookLM: персональная база знаний',
    speaker: 'Даша Цыбульская',
    role: 'Эксперт по работе с данными и ИИ',
    photo: tsybulskaya,
    desc: 'Превращаем документы, инструкции и материалы компании в интеллектуального помощника. Загружаем материалы, систематизируем информацию и учимся быстро находить ответы по проверенным источникам.',
    benefit: 'Работа с большими объёмами информации, ускорение обучения сотрудников и внутренние базы знаний.',
    result: 'Готовый помощник, который отвечает на вопросы по вашим материалам',
  },
  {
    time: '16:30–17:00',
    n: '09',
    kind: 'block',
    title: 'ИИ-агенты и мини-приложения',
    speaker: 'Сергей Черников',
    role: 'Основатель школы «Хакни Нейросети»',
    photo: chernikov,
    desc: 'Создаём решения, которые не просто отвечают, а выполняют задачи бизнеса.',
    bullets: [
      'ИИ-агенты для Telegram и MAX',
      'Сценарии автоматического общения с клиентами',
      'Примеры действующих бизнес-кейсов',
      'Мини-приложения без классического программирования',
    ],
    benefit: 'Автоматизация консультаций, обработки обращений, продаж и внутренних процессов.',
    result: 'Прототип ИИ-агента или мини-приложения под задачи вашего бизнеса',
  },
  {
    time: '17:00–17:30',
    n: '10',
    kind: 'block',
    title: 'CRM нового поколения',
    speaker: 'Команда «Интера»',
    role: 'Партнёр шоу',
    desc: 'Как выстроить работу с клиентами, не терять обращения и контролировать каждый этап продажи. CRM объединяет заявки, задачи, коммуникации и аналитику в одном пространстве.',
    benefit: 'Управляемые продажи, меньше потерянных заявок, выше эффективность команды.',
    result: 'Понятная модель внедрения CRM — от первого обращения до повторной продажи',
  },
  {
    time: '17:30',
    kind: 'final',
    title: 'Финал шоу',
    desc: 'Подводим итоги дня, благодарим спикеров и партнёров, разыгрываем подарки. После официального завершения владельцы VIP-билетов отправляются на закрытое VIP Afterparty в «ТАТЕВ» — вечернее продолжение с неформальным общением и нетворкингом.',
  },
];

export default function Program() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(1);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (RM) return;

    const triggers: ScrollTrigger[] = [];
    root.querySelectorAll<HTMLElement>('.tl-row').forEach((row, i) => {
      const anim = gsap.fromTo(row,
        { opacity: 0, x: -24 },
        {
          opacity: 1, x: 0, duration: 0.55, ease: 'expo.out', delay: (i % 4) * 0.04,
          scrollTrigger: { trigger: row, start: 'top 90%', once: true },
        },
      );
      if (anim.scrollTrigger) triggers.push(anim.scrollTrigger);
    });

    const line = root.querySelector<HTMLElement>('.tl-spine i');
    if (line) {
      const anim = gsap.fromTo(line, { scaleY: 0 }, {
        scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: root.querySelector('.tl'), start: 'top 78%', end: 'bottom 70%', scrub: 0.5 },
      });
      if (anim.scrollTrigger) triggers.push(anim.scrollTrigger);
    }

    return () => triggers.forEach((t) => t.kill());
  }, []);

  const go = (e: React.MouseEvent, sel: string) => {
    e.preventDefault();
    const t = document.querySelector(sel);
    if (t) scrollToEl(t as HTMLElement);
  };

  return (
    <section id="program" className="slice panel-sec" ref={rootRef}>
      <div className="wrap">
        <div className="eyebrow rv">// 07 · ПРОГРАММА</div>
        <h2 className="h2 rv">11 БЛОКОВ. КАЖДЫЙ —<br />ГОТОВЫЙ РЕЗУЛЬТАТ.</h2>
        <p className="prog-intro rv">
          Не лекции о будущем, а технологии в действии. Один день, 11 практических блоков и готовые решения, созданные прямо на сцене: сайты, презентации, рекламные ролики, контент-планы, треки, ИИ-ассистенты и Telegram-агенты. Вы увидите не подготовленные кейсы, а весь процесс — от первого запроса до результата.
        </p>

        <div className="tl">
          <div className="tl-spine" aria-hidden="true"><i></i></div>

          {schedule.map((s, i) => {
            const isOpen = open === i;
            const interactive = s.kind === 'block';
            return (
              <div className={`tl-row tl-${s.kind}${isOpen ? ' open' : ''}`} key={s.time + s.title}>
                <div className="tl-time">
                  <span className="tl-dot" aria-hidden="true"></span>
                  {s.time}
                </div>

                <div className="tl-card">
                  <button
                    type="button"
                    className="tl-head"
                    onClick={() => interactive && setOpen(isOpen ? null : i)}
                    aria-expanded={interactive ? isOpen : undefined}
                  >
                    <div className="tl-head-main">
                      {s.n && <span className="tl-n">{s.n}</span>}
                      <h5>{s.title}</h5>
                    </div>
                    {interactive && (
                      <span className="tl-chev" aria-hidden="true">
                        <Icon name="ChevronDown" size={18} strokeWidth={2} />
                      </span>
                    )}
                  </button>

                  {s.speaker && (
                    <div className="tl-speaker">
                      <span className={`tl-ava${s.photo ? ' has-photo' : ''}`} aria-hidden="true">
                        {s.photo
                          ? <img src={s.photo} alt="" loading="lazy" width={38} height={38} />
                          : <Icon name="User" size={18} strokeWidth={2} />}
                      </span>
                      <span className="tl-sp-text">
                        <b>{s.speaker}</b>
                        {s.role && <i>{s.role}</i>}
                      </span>
                    </div>
                  )}

                  <div className="tl-body">
                    <p className="tl-desc">{s.desc}</p>

                    {s.bullets && (
                      <ul className="tl-list">
                        {s.bullets.map((b) => (
                          <li key={b}><Icon name="Check" size={14} strokeWidth={2.5} />{b}</li>
                        ))}
                      </ul>
                    )}

                    {s.benefit && (
                      <div className="tl-benefit">
                        <span className="tl-lab">Польза</span>
                        {s.benefit}
                      </div>
                    )}

                    {s.result && (
                      <div className="tl-result">
                        <Icon name="Package" size={15} strokeWidth={2} />
                        <span><b>Унесёшь:</b> {s.result}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="prog-cta rv">
          Всё это — в каждом билете. <a href="#pricing" onClick={(e) => go(e, '#pricing')}>Выбрать тариф →</a>
        </div>
      </div>
    </section>
  );
}