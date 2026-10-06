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
              <span className="ipz-shine">iPhone 18</span>
              <span className="ipz-line">может стать твоим.</span>
            </h2>
            <p className="ipz-sub">Разыгрываем iPhone 18</p>
            <a className="btn magnetic" href="#pricing" onClick={go}>Хочу на шоу <span className="arr">→</span></a>
          </div>
          <div className="ipz-stage" aria-hidden="true">
            <div className="ipz-glow" />
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
