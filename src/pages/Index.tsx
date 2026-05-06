export default function Index() {
  return (
    <div className="sketch-root">
      {/* БЛОК 1 — HERO */}
      <section className="sketch-hero">
        <img
          src="https://cdn.poehali.dev/projects/d47b551f-c654-4b4a-9304-5aab4ecf9265/bucket/aaa2115e-d57b-4882-ab83-cbb496463613.png"
          alt="Картиночки и Видосики"
          className="sketch-hero-img"
        />
      </section>
      {/* БЛОК 2 */}
      <section className="sketch-hero">
        <img
          src="https://cdn.poehali.dev/projects/d47b551f-c654-4b4a-9304-5aab4ecf9265/bucket/78305ec8-1bc6-47e2-a42f-dfc6a4065128.png"
          alt="Проблемы с нейросетями"
          className="sketch-hero-img"
        />
      </section>
      {/* БЛОК 3 */}
      <section className="sketch-hero">
        <img
          src="https://cdn.poehali.dev/files/ab32ef52-b456-4663-8405-98b1732f2beb.png"
          alt="Было хаос и боль — Стало понятный workflow"
          className="sketch-hero-img"
        />
      </section>
    </div>
  );
}