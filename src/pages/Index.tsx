export default function Index() {
  return (
    <div className="sketch-root">
      {/* БЛОК 1 — HERO */}
      <section className="sketch-hero">
        <img
          src="https://cdn.poehali.dev/files/ddd3cd63-036a-4c83-adbd-6fe03bef555c.png"
          alt="Картиночки и Видосики — 29-30 мая"
          className="sketch-hero-img"
        />
      </section>


      {/* БЛОК 2 */}
      <section className="sketch-hero">
        <img
          src="https://cdn.poehali.dev/files/275af3e3-801d-4e5f-b248-924c60ebc9e2.png"
          alt="Ничего не понятно — слишком много нейросетей"
          className="sketch-hero-img"
        />
      </section>
      {/* БЛОК 3 */}
      <section className="sketch-hero">
        <img
          src="https://cdn.poehali.dev/files/2c3aa4d7-08de-4bce-aab0-c39fba0a29d7.png"
          alt="Было хаос и боль — Стало понятный workflow"
          className="sketch-hero-img"
        />
      </section>
    </div>
  );
}