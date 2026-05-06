import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMG = "https://cdn.poehali.dev/projects/d47b551f-c654-4b4a-9304-5aab4ecf9265/files/0eb0b4e9-9c65-4005-af17-39017402060e.jpg";

const features = [
  { icon: "Zap", label: "Быстро", desc: "Запускайте идеи в жизнь без лишнего ожидания" },
  { icon: "Layers", label: "Гибко", desc: "Любые форматы, стили и структуры под ваш проект" },
  { icon: "Sparkles", label: "Красиво", desc: "Дизайн, который запоминается с первого взгляда" },
];

export default function Index() {
  const [scrollY, setScrollY] = useState(0);
  const [visible, setVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { clearTimeout(timer); window.removeEventListener("scroll", onScroll); };
  }, []);

  return (
    <div className="landing-root">
      <div className="grain-overlay" />

      {/* Nav */}
      <nav className="landing-nav">
        <div className="nav-logo">
          <span className="logo-dot" />
          <span className="logo-text">Студия</span>
        </div>
        <div className="nav-links">
          <a href="#features" className="nav-link">Возможности</a>
          <a href="#cta" className="nav-link">Контакт</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-section" ref={heroRef}>
        <div
          className="hero-bg"
          style={{ transform: `translateY(${scrollY * 0.35}px)` }}
        >
          <img src={HERO_IMG} alt="" className="hero-bg-img" />
          <div className="hero-bg-overlay" />
        </div>

        <div className={`hero-content ${visible ? "hero-visible" : ""}`}>
          <div className="hero-tag">
            <span className="tag-dot" />
            <span>Твоя идея — наш полёт</span>
          </div>

          <h1 className="hero-title">
            <span className="title-line title-line-1">Создаём</span>
            <span className="title-line title-line-2">
              <em>сайты</em>
            </span>
            <span className="title-line title-line-3">которые живут</span>
          </h1>

          <p className="hero-subtitle">
            Превращаем смелые идеи в цифровые пространства —<br />
            с характером, душой и точностью.
          </p>

          <div className="hero-actions">
            <button className="btn-primary">
              <span>Начать проект</span>
              <Icon name="ArrowRight" size={18} />
            </button>
            <button className="btn-ghost">Смотреть работы</button>
          </div>
        </div>

        <div className="hero-scroll-hint">
          <div className="scroll-line" />
          <span>скролл</span>
        </div>

        <div className="deco deco-circle-1" />
        <div className="deco deco-circle-2" />
        <div className="deco deco-cross">+</div>
        <div className="deco deco-num">01</div>
      </section>

      {/* Features */}
      <section id="features" className="features-section">
        <div className="features-header">
          <span className="section-label">Что мы делаем</span>
          <h2 className="section-title">
            Три принципа<br /><em>нашей работы</em>
          </h2>
        </div>

        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-card" key={i} style={{ animationDelay: `${i * 0.12}s` }}>
              <div className="feature-icon-wrap">
                <Icon name={f.icon} fallback="Star" size={26} />
              </div>
              <div className="feature-num">0{i + 1}</div>
              <h3 className="feature-label">{f.label}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="cta-section">
        <div className="cta-inner">
          <div className="cta-tag">
            <span className="tag-dot tag-dot-cyan" />
            <span>Готов к запуску?</span>
          </div>
          <h2 className="cta-title">
            Давайте создадим<br /><em>что-то особенное</em>
          </h2>
          <p className="cta-sub">Расскажите о вашей идее — остальное за нами.</p>
          <button className="btn-cta">
            <span>Написать нам</span>
            <Icon name="Send" size={18} />
          </button>
        </div>
        <div className="cta-deco-ring" />
        <div className="cta-deco-ring cta-deco-ring-2" />
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-logo">
          <span className="logo-dot logo-dot-sm" />
          <span className="logo-text">Студия</span>
        </div>
        <span className="footer-copy">© 2026 — Все права защищены</span>
      </footer>
    </div>
  );
}