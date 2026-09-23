import hlebImolokoLogo from '@/assets/sponsors/hleb-i-moloko-white.png';
import tbilissimoLogo from '@/assets/sponsors/tbilissimo.png';
import oporaRossiiLogo from '@/assets/sponsors/opora-rossii.png';
import tatevLogo from '@/assets/sponsors/tatev.png';
import bushkovskyLogo from '@/assets/sponsors/bushkovsky.png';
import kofeMashinaLogo from '@/assets/sponsors/kofe-mashina.png';
import ecoCentrLogo from '@/assets/sponsors/eco-centr.png';
import mariaShugaiLogo from '@/assets/sponsors/maria-shugai.png';
import perviyVzrosliyLogo from '@/assets/sponsors/perviy-vzrosliy.png';
import pacificProtekLogo from '@/assets/sponsors/pacific-protek.png';
import superSmmLogo from '@/assets/sponsors/super-smm.png';
import plesyLogo from '@/assets/sponsors/plesy-peschanogo.png';

const rowTop = [hlebImolokoLogo, tbilissimoLogo, oporaRossiiLogo, tatevLogo, bushkovskyLogo, superSmmLogo];
const rowBottom = [kofeMashinaLogo, ecoCentrLogo, plesyLogo, mariaShugaiLogo, perviyVzrosliyLogo, pacificProtekLogo];

const tallLogos = new Set([mariaShugaiLogo, plesyLogo]);

function Marquee({ logos, dir }: { logos: string[]; dir: 'left' | 'right' }) {
  const loop = [...logos, ...logos, ...logos];
  return (
    <div className="spx-row">
      <div className={`spx-track spx-${dir}`}>
        {loop.map((logo, i) => (
          <div className="spx-item" key={i}>
            <img src={logo} alt="Логотип партнёра ИИ ШОУ БЕЗ ШИРМЫ во Владивостоке" loading="lazy" data-tall={tallLogos.has(logo) ? '1' : undefined} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EventSponsors() {
  return (
    <section id="event-sponsors">
      <div className="wrap">
        <div className="eyebrow rv">// 02 · СПОНСОРЫ</div>
        <h2 className="h2 rv">БРЕНДЫ, КОТОРЫЕ С НАМИ</h2>
        <p className="lead rv" style={{ maxWidth: 640 }}>Компании, которые поддерживают шоу «Без Ширмы» и стоят рядом с 300 предпринимателями в зале.</p>
      </div>
      <div className="spx rv">
        <Marquee logos={rowTop} dir="left" />
        <Marquee logos={rowBottom} dir="right" />
      </div>
    </section>
  );
}