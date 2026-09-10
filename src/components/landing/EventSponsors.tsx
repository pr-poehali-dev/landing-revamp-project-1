import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Icon from '@/components/ui/icon';
import hlebImolokoLogo from '@/assets/sponsors/hleb-i-moloko-white.png';
import tbilissimoLogo from '@/assets/sponsors/tbilissimo.png';
import oporaRossiiLogo from '@/assets/sponsors/opora-rossii.png';
import tatevLogo from '@/assets/sponsors/tatev.png';
import bushkovskyLogo from '@/assets/sponsors/bushkovsky.png';
import kofeMashinaLogo from '@/assets/sponsors/kofe-mashina.png';

const sponsorLogos: (string | null)[] = [hlebImolokoLogo, tbilissimoLogo, oporaRossiiLogo, tatevLogo, bushkovskyLogo, kofeMashinaLogo, null, null];

export default function EventSponsors() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let st: ScrollTrigger | null = null;
    if (!RM) {
      const anim = gsap.fromTo(root.querySelectorAll('.sponsor-logo-slot'), { opacity: 0, y: 32 }, {
        opacity: 1, y: 0, duration: 0.5, ease: 'expo.out', stagger: 0.06,
        scrollTrigger: { trigger: root.querySelector('.sponsors-logo-grid'), start: 'top 85%', once: true },
      });
      st = anim.scrollTrigger as ScrollTrigger;
    }
    return () => { st?.kill(); };
  }, []);

  return (
    <section id="event-sponsors" ref={rootRef}>
      <div className="wrap">
        <div className="eyebrow rv">// 02 · СПОНСОРЫ</div>
        <h2 className="h2 rv">БРЕНДЫ, КОТОРЫЕ С НАМИ</h2>
        <p className="lead rv" style={{ maxWidth: 640 }}>Компании, которые поддерживают шоу «Без Ширмы» и стоят рядом с 300 предпринимателями в зале.</p>
        <div className="sponsors-logo-grid">
          {sponsorLogos.map((logo, i) => (
            <div className="sponsor-logo-slot brk" key={i}>
              <i></i><i></i><i></i><i></i>
              {logo ? (
                <img src={logo} alt="Логотип спонсора" />
              ) : (
                <>
                  <Icon name="ImagePlus" size={28} strokeWidth={1.5} />
                  <span>Логотип спонсора</span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}