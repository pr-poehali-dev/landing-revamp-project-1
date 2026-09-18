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

const rowTop = [hlebImolokoLogo, tbilissimoLogo, oporaRossiiLogo, tatevLogo, bushkovskyLogo];
const rowBottom = [kofeMashinaLogo, ecoCentrLogo, mariaShugaiLogo, perviyVzrosliyLogo, pacificProtekLogo];

const tallLogos = new Set([mariaShugaiLogo]);

function Marquee({ logos, dir }: { logos: string[]; dir: 'left' | 'right' }) {
  const loop = [...logos, ...logos, ...logos];
  return (
    <div className="spx-row">
      <div className={`spx-track spx-${dir}`}>
        {loop.map((logo, i) => (
          <div className="spx-item" key={i}>
            <img src={logo} alt="Логотип партнёра" loading="lazy" data-tall={tallLogos.has(logo) ? '1' : undefined} />
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