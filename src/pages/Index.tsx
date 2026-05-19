import { useState } from "react";

const NAV_ITEMS = [
  { label: "🎨 О воркшопе", id: "block-1" },
  { label: "😵 Проблемы", id: "block-2" },
  { label: "✅ Было/Стало", id: "block-3" },
  { label: "⚡ День 1", id: "block-4" },
  { label: "🎬 День 2", id: "block-5" },
  { label: "🎤 Спикер", id: "block-speaker" },
  { label: "👥 Для кого", id: "block-6" },
  { label: "📅 Детали", id: "block-7" },
  { label: "🏆 Кредибильность", id: "block-8" },
  { label: "🎁 Что возьмёшь", id: "block-9" },
  { label: "❓ FAQ", id: "block-10" },
  { label: "🔥 Записаться", id: "block-11" },
];

export default function Index() {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className="sketch-root">

      {/* БАННЕР ОТМЕНЫ */}
      <div style={{
        background: "linear-gradient(135deg, #ff2d55 0%, #ff6b35 50%, #ffcc00 100%)",
        padding: "20px 24px",
        textAlign: "center",
        position: "relative",
        zIndex: 1000,
        boxShadow: "0 4px 20px rgba(255,45,85,0.4)",
        borderBottom: "3px solid #000",
      }}>
        <div style={{
          fontSize: "clamp(18px, 4vw, 28px)",
          fontWeight: 900,
          color: "#000",
          fontFamily: "inherit",
          letterSpacing: "-0.5px",
          lineHeight: 1.3,
          textTransform: "uppercase",
        }}>
          🚨 ГАЛЯ, У НАС ОТМЕНА! 🚨
        </div>
        <div style={{
          fontSize: "clamp(14px, 2.5vw, 20px)",
          fontWeight: 700,
          color: "#1a1a1a",
          marginTop: "6px",
          lineHeight: 1.4,
        }}>
          Воркшоп отменяется. Возобновим мероприятия к сентябрю — ждём вас! 🔥
        </div>
      </div>

      {/* ШАПКА */}
      <header className="sketch-header">
        <div className="sketch-header-inner">
          <div className="sketch-logo" onClick={() => scrollTo("block-1")}>
            картиночки<br />и видосики ★
          </div>

          <div className="sketch-header-right">
            <button className="sketch-reg-btn" onClick={() => scrollTo("block-11")}>
              Записаться!!!
            </button>
            <button
              className={`sketch-burger ${menuOpen ? "open" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>

        {/* Дропдаун меню */}
        {menuOpen && (
          <nav className="sketch-menu">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                className="sketch-menu-item"
                onClick={() => scrollTo(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </header>

      {/* БЛОК 1 */}
      <section id="block-1" className="sketch-hero">
        <img src="https://cdn.poehali.dev/files/ddd3cd63-036a-4c83-adbd-6fe03bef555c.png" alt="Картиночки и Видосики — 29-30 мая" className="sketch-hero-img" />
      </section>

      {/* БЛОК 2 */}
      <section id="block-2" className="sketch-hero">
        <img src="https://cdn.poehali.dev/files/275af3e3-801d-4e5f-b248-924c60ebc9e2.png" alt="Ничего не понятно — слишком много нейросетей" className="sketch-hero-img" />
      </section>

      {/* БЛОК 3 */}
      <section id="block-3" className="sketch-hero">
        <img src="https://cdn.poehali.dev/files/2c3aa4d7-08de-4bce-aab0-c39fba0a29d7.png" alt="Было хаос и боль — Стало понятный workflow" className="sketch-hero-img" />
      </section>

      {/* БЛОК 4 */}
      <section id="block-4" className="sketch-hero">
        <img src="https://cdn.poehali.dev/files/838456fd-709a-41c8-a9bd-a7b42d88300b.png" alt="День 1" className="sketch-hero-img" />
      </section>

      {/* БЛОК 5 */}
      <section id="block-5" className="sketch-hero">
        <img src="https://cdn.poehali.dev/files/fe96fb57-85e0-48fc-9fe5-0c9eddd3d914.png" alt="День 2 — снимаем видеоконтент" className="sketch-hero-img" />
      </section>

      {/* БЛОК СПИКЕР */}
      <section id="block-speaker" className="sketch-hero">
        <img src="https://cdn.poehali.dev/files/59eec9cb-8434-4134-9deb-6d61e9e12ec1.png" alt="Кто спикер — Сергей Черников" className="sketch-hero-img" />
      </section>

      {/* БЛОК 6 */}
      <section id="block-6" className="sketch-hero">
        <img src="https://cdn.poehali.dev/files/88a29e70-0393-4b4f-a6df-b01f62138213.png" alt="Для кого" className="sketch-hero-img" />
      </section>

      {/* БЛОК 7 */}
      <section id="block-7" className="sketch-hero">
        <img src="https://cdn.poehali.dev/files/17ae0254-7a75-499f-a279-47dfd6b13b90.png" alt="Детали — 29-30 мая" className="sketch-hero-img" />
      </section>

      {/* БЛОК 8 */}
      <section id="block-8" className="sketch-hero">
        <img src="https://cdn.poehali.dev/files/b41bb719-0971-4726-9682-6e41904f10e7.png" alt="Моя кредибильность" className="sketch-hero-img" />
      </section>

      {/* БЛОК 9 */}
      <section id="block-9" className="sketch-hero">
        <img src="https://cdn.poehali.dev/files/cd14699d-fefb-4560-a656-ea907b06f221.png" alt="Что унесёшь с собой" className="sketch-hero-img" />
      </section>

      {/* БЛОК 10 */}
      <section id="block-10" className="sketch-hero">
        <img src="https://cdn.poehali.dev/files/b2f9c812-1a2a-4c7f-afcb-6f5ec7644e51.png" alt="FAQ" className="sketch-hero-img" />
      </section>

      {/* БЛОК 11 */}
      <section id="block-11" className="sketch-hero sketch-hero-cta">
        <img src="https://cdn.poehali.dev/files/c4375a03-052e-4086-a010-e3cb510bdcee.png" alt="Записаться" className="sketch-hero-img" />
        <a
          href="https://torguykriptoy.getcourse.ru/KartinockiVL"
          target="_blank"
          rel="noopener noreferrer"
          className="sketch-cta-overlay"
          aria-label="Записаться на воркшоп"
        />
      </section>

    </div>
  );
}