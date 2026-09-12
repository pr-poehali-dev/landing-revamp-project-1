import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Icon from '@/components/ui/icon';
import { useCounters } from './useCounters';
import BloggerApplication from './BloggerApplication';
import { markLeadSubmitted } from '@/lib/leadTracking';

export default function Pricing() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [rootEl, setRootEl] = useState<HTMLDivElement | null>(null);

  useEffect(() => { setRootEl(rootRef.current); }, []);
  useCounters(rootEl);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let st: ScrollTrigger | null = null;
    if (!RM) {
      const anim = gsap.fromTo(root.querySelectorAll('.price'), { opacity: 0, y: 56, z: -90 }, {
        opacity: 1, y: 0, z: 0, duration: 0.55, ease: 'expo.out', stagger: 0.12,
        scrollTrigger: {
          trigger: root.querySelector('.price-grid'), start: 'top 78%', once: true,
          onEnter: () => {
            gsap.fromTo('.price.hot', { boxShadow: '0 0 0px rgba(0,229,245,0)' }, { boxShadow: '0 0 40px rgba(0,229,245,.25)', duration: 0.9, delay: 0.6, yoyo: true, repeat: 1 });
          },
        },
      });
      st = anim.scrollTrigger as ScrollTrigger;
    }
    return () => { st?.kill(); };
  }, []);

  return (
    <section id="pricing" ref={rootRef}>
      <div className="wrap">
        <div className="eyebrow rv">// 12 · ТАРИФЫ</div>
        <h2 className="h2 rv">ЗАЛ — 300 МЕСТ. ЭТО ВСЁ.</h2>
        <p className="lead rv" style={{ maxWidth: 720 }}>Каждый билет включает все 11 блоков и участие в розыгрыше курса на 150 000 ₽.</p>
        <div className="deficit rv">
          <span className="chip o"><span className="warn">⚠</span> МЕСТ СТРОГО ОГРАНИЧЕНО</span>
          <span className="txt">Когда зал заполнится — продажи закроются.</span>
        </div>
        <div className="price-grid">
          <div className="price brk">
            <i></i><i></i><i></i><i></i>
            <h4>БАЗА</h4>
            <div className="amount"><span data-count="5000" data-fmt="rub">0</span> ₽</div>
            <div className="p-note">ВСЯ ПРАКТИКА ДНЯ</div>
            <ul>
              <li>Все 11 блоков шоу</li>
              <li>Раздатка с промпт-цепочками по каждому блоку</li>
              <li>Промпт-гайд «50 промптов»</li>
              <li>Участие в розыгрыше курса на 150 000 ₽</li>
              <li>Чат участников</li>
            </ul>
            <a className="btn btn-ghost magnetic" href="https://torguykriptoy.getcourse.ru/baza2.0" target="_blank" rel="noopener" onClick={markLeadSubmitted}>Взять БАЗУ <span className="arr">→</span></a>
          </div>
          <div className="price hot brk">
            <i></i><i></i><i></i><i></i>
            <span className="chip fill">ВЫБОР БОЛЬШИНСТВА</span>
            <h4>ПРЕМИУМ</h4>
            <div className="amount"><span data-count="7500" data-fmt="rub">0</span> ₽</div>
            <div className="p-note">ПРАКТИКА + ЗАПИСИ + ПЕРВЫЕ РЯДЫ</div>
            <ul>
              <li>Всё из тарифа БАЗА</li>
              <li>Расширенные материалы</li>
              <li>Первые ряды в зале</li>
              <li>Персональная 30-минутная консультация со специалистом школы</li>
              <li>2 билета на розыгрыш курса</li>
              <li>Билет на единоразовое бесплатное посещение мастер-класса</li>
            </ul>
            <a className="btn magnetic" href="https://torguykriptoy.getcourse.ru/baza2.0_premium" target="_blank" rel="noopener" onClick={markLeadSubmitted}>Взять ПРЕМИУМ <span className="arr">→</span></a>
          </div>
          <div className="price brk">
            <i></i><i></i><i></i><i></i>
            <span className="chip o">ВСЕГО 30 МЕСТ</span>
            <h4>VIP</h4>
            <div className="amount"><span data-count="15000" data-fmt="rub">0</span> ₽</div>
            <ul>
              <li>Всё из тарифа ПРЕМИУМ</li>
              <li>Личная консультация Сергея и команды — 60 минут (стоимостью 10 000 руб.)</li>
              <li>VIP-зона</li>
              <li>Сертификат участника</li>
              <li>3 билета на бесплатное посещение мастер-класса</li>
              <li className="li-hot">Закрытое VIP Afterparty в TATEV</li>
            </ul>
            <a className="btn btn-orange magnetic" href="https://torguykriptoy.getcourse.ru/baza2.0_vip" target="_blank" rel="noopener" onClick={markLeadSubmitted}>Взять VIP <span className="arr">→</span></a>
          </div>
        </div>
        <BloggerApplication />
        <div className="afterparty-block rv">
          <div className="afterparty-head">
            <span className="afterparty-icon">
              <Icon name="PartyPopper" size={28} strokeWidth={2} />
            </span>
            <div className="afterparty-head-text">
              <span className="afterparty-tag">Только для VIP, партнёров и спонсоров</span>
              <span className="afterparty-title">Закрытое VIP Afterparty в TATEV</span>
            </div>
          </div>
          <div className="afterparty-gallery">
            <img src="https://cdn.poehali.dev/projects/d47b551f-c654-4b4a-9304-5aab4ecf9265/bucket/112f805f-40fd-438a-8ac9-2a47a74598ee.jpg" alt="Зал ресторана TATEV с панорамными окнами" loading="lazy" />
            <img src="https://cdn.poehali.dev/projects/d47b551f-c654-4b4a-9304-5aab4ecf9265/bucket/4429fbd8-d23d-4b79-a70e-e21e0f89343c.png" alt="Вечер в TATEV" loading="lazy" />
            <img src="https://cdn.poehali.dev/projects/d47b551f-c654-4b4a-9304-5aab4ecf9265/bucket/8eb65ac9-50f7-452f-b4de-f9f276b477db.jpg" alt="Лаундж-зона TATEV с живым огнём" loading="lazy" />
          </div>
          <p className="afterparty-desc">Выбирайте VIP, если хотите не только увидеть новые инструменты, но и войти в круг людей, с которыми можно создавать новые проекты, партнёрства и возможности</p>
          <ul className="afterparty-list">
            <li><Icon name="Mic" size={18} strokeWidth={2} /> Развлекательная программа с ведущим</li>
            <li><Icon name="Martini" size={18} strokeWidth={2} /> Велком-дринк и фуршет</li>
            <li><Icon name="Camera" size={18} strokeWidth={2} /> Фотограф</li>
            <li><Icon name="Users" size={18} strokeWidth={2} /> Нетворкинг, близкое общение и личные знакомства, обмен ресурсами</li>
          </ul>
          <p className="afterparty-note">Именно такие вечера заканчиваются партнёрством и заключением договоров 💰</p>
          <a className="btn btn-orange magnetic afterparty-btn" href="https://torguykriptoy.getcourse.ru/baza2.0_vip" target="_blank" rel="noopener" onClick={markLeadSubmitted}>Взять VIP и попасть на Afterparty <span className="arr">→</span></a>
        </div>
        <div className="chat-notify rv">
          <span className="cn-txt">Чтобы не пропустить информацию, присоединяйтесь в чат в Telegram или в MAX</span>
          <div className="cn-links">
            <a className="cn-link" href="https://t.me/aishowgpt" target="_blank" rel="noopener" aria-label="Чат в Telegram">
              <Icon name="Send" size={20} strokeWidth={2} />
            </a>
            <a className="cn-link" href="https://max.ru/join/lQb92euN2wMC4OXbOJK_7m6k9xr2P-JGp7pDx6RZHos" target="_blank" rel="noopener" aria-label="Чат в MAX">
              <Icon name="MessageCircle" size={20} strokeWidth={2} />
            </a>
          </div>
        </div>
        <div className="price-foot rv">Оплата от юрлиц — по счёту. Вопросы по билетам и командам: Дарья · <a href="tel:+79811292499">+7 981 129-24-99</a> · TG <a href="https://t.me/chernikova_dary" target="_blank" rel="noopener">@chernikova_dary</a> · <a href="https://max.ru/u/f9LHodD0cOKBLVDjyIazOQYrynC-NgyWbNi2E6gOfAgMljaJllQCdC9fb4g" target="_blank" rel="noopener">Написать в МАХ</a></div>
      </div>
    </section>
  );
}