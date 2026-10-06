import { scrollToEl } from '@/lib/landingScroll';
import iphone from '@/assets/iphone.png';

export default function IphonePrize() {
  const go = (e: React.MouseEvent) => {
    e.preventDefault();
    const t = document.querySelector('#pricing');
    if (t) scrollToEl(t as HTMLElement);
  };

  return (
    <section id="iphone-prize" aria-label="Розыгрыш iPhone 18">
      <div className="wrap">
        <div className="ipz rv">
          <div className="ipz-text">
            <div className="ipz-eb">// РОЗЫГРЫШ НА ШОУ</div>
            <h2 className="ipz-title">
              <span className="ipz-head"><span className="ipz-shine">iPhone 18</span><span className="ipz-gb">512 ГБ</span></span>
              <span className="ipz-line">может стать твоим.</span>
            </h2>
            <p className="ipz-sub">Разыгрываем iPhone 18 512 ГБ</p>
            <a className="btn magnetic" href="#pricing" onClick={go}>Хочу на шоу <span className="arr">→</span></a>
          </div>
          <div className="ipz-stage" aria-hidden="true">
            <div className="ipz-glow" />
            <div className="ipz-rays" />
            <div className="ipz-rays ipz-rays-2" />
            <div className="ipz-core" />
            {[...Array(10)].map((_, i) => (
              <span className="ipz-spark" key={i} style={{ '--i': i } as React.CSSProperties} />
            ))}
            <div className="ipz-spin">
              <img src={iphone} alt="" loading="lazy" />
              <span className="ipz-gloss" />
            </div>
            <div className="ipz-floor" />
          </div>
        </div>
      </div>
    </section>
  );
}
