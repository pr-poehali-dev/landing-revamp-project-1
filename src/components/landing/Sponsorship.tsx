import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface Tier {
  key: string;
  n: string;
  title: string;
  desc: string;
}

const tiers: Tier[] = [
  { key: 'general', n: '01', title: 'ГЕНЕРАЛЬНЫЙ ПАРТНЁР', desc: 'Максимум внимания зала и сцены — ваш бренд рядом с главным событием ИИ-рынка Владивостока.' },
  { key: 'official', n: '02', title: 'ОФИЦИАЛЬНЫЙ ПАРТНЁР', desc: 'Присутствие в ключевых точках шоу и прямой контакт с аудиторией предпринимателей.' },
  { key: 'info', n: '03', title: 'ИНФОРМАЦИОННЫЙ ПАРТНЁР', desc: 'Обмен охватами и совместное продвижение на всех этапах подготовки к шоу.' },
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
              <div className="spons-num">{t.n}</div>
              <h4>{t.title}</h4>
              <p>{t.desc}</p>
              <span className="spons-link">Узнать подробнее <span className="arr">→</span></span>
            </button>
          ))}
        </div>
      </div>

      <div className={`spons-modal-overlay${openTier ? ' open' : ''}`} onClick={() => setOpenTier(null)}>
        {openTier && (
          <div className="spons-modal" onClick={(e) => e.stopPropagation()}>
            <button className="spons-modal-close" onClick={() => setOpenTier(null)} aria-label="Закрыть">×</button>
            <div className="eyebrow">// {openTier.n} · ПАРТНЁРСТВО</div>
            <h3>{openTier.title}</h3>
            <div className="spons-modal-placeholder">
              <span className="mono">ТЕКСТ ПРЕДЛОЖЕНИЯ ГОТОВИТСЯ</span>
              <p>Здесь появятся условия, форматы интеграции и выгоды статуса «{openTier.title.toLowerCase()}».</p>
            </div>
            <a className="btn magnetic" href="https://t.me/DashaChernikova8" target="_blank" rel="noopener">Обсудить с Дарьей <span className="arr">→</span></a>
          </div>
        )}
      </div>
    </section>
  );
}