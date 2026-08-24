import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';
import { hasSubmittedLead, LEAD_SUBMITTED_EVENT } from '@/lib/leadTracking';

type Phase = 'idle' | 'open' | 'min-pulse' | 'min-static';

const OPEN_DELAY = 30000;
const REOPEN_DELAY = 120000;

const messengers = [
  { key: 'tg', label: 'Telegram', href: 'https://t.me/HackNeuro_bot?start=s=3803564', icon: 'Send' },
  { key: 'max', label: 'MAX', href: 'https://max.ru/id783801003680_bot?start=s=3803571', icon: 'MessageCircle' },
  { key: 'vk', label: 'ВКонтакте', href: 'https://vk.ru/app5898182_-41953587#s=3803568', icon: null },
];

export default function GiftPopup() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [suppressed, setSuppressed] = useState(() => hasSubmittedLead());
  const reopenTimerRef = useRef<number | null>(null);
  const clickedRef = useRef(false);

  const clearReopenTimer = () => {
    if (reopenTimerRef.current) {
      window.clearTimeout(reopenTimerRef.current);
      reopenTimerRef.current = null;
    }
  };

  useEffect(() => {
    const onLeadSubmitted = () => {
      setSuppressed(true);
      clearReopenTimer();
      setPhase('idle');
    };
    window.addEventListener(LEAD_SUBMITTED_EVENT, onLeadSubmitted);
    return () => window.removeEventListener(LEAD_SUBMITTED_EVENT, onLeadSubmitted);
  }, []);

  useEffect(() => {
    if (suppressed) return;
    const t = window.setTimeout(() => setPhase('open'), OPEN_DELAY);
    return () => window.clearTimeout(t);
  }, [suppressed]);

  useEffect(() => () => clearReopenTimer(), []);

  useEffect(() => {
    document.body.style.overflow = phase === 'open' ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'open') return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closePopup(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase]);

  const closePopup = () => {
    clearReopenTimer();
    if (clickedRef.current || suppressed) {
      setPhase('min-static');
      return;
    }
    setPhase('min-pulse');
    reopenTimerRef.current = window.setTimeout(() => {
      if (!hasSubmittedLead()) setPhase('open');
    }, REOPEN_DELAY);
  };

  const openPopup = () => {
    clearReopenTimer();
    setPhase('open');
  };

  const onMessengerClick = () => {
    clickedRef.current = true;
    clearReopenTimer();
    setPhase('min-static');
  };

  if (phase === 'idle') return null;

  const minimized = phase === 'min-pulse' || phase === 'min-static';

  return (
    <>
      <div className={`gift-modal-overlay${phase === 'open' ? ' open' : ''}`} onClick={closePopup}>
        {phase === 'open' && (
          <div className="gift-modal" onClick={(e) => e.stopPropagation()}>
            <button className="gift-modal-close" onClick={closePopup} aria-label="Закрыть">×</button>
            <div className="gift-modal-inner">
              <div className="gift-badge">
                <Icon name="Gift" size={36} strokeWidth={1.6} />
              </div>
              <div className="gift-eyebrow">ВАМ ПОДАРОК</div>
              <h3 className="gift-title">Получи первые 3 урока бесплатно</h3>
              <p className="gift-sub">Подпишись на нашего бота в Telegram, VK или MAX</p>
              <div className="gift-messengers">
                {messengers.map((m) => (
                  <a
                    key={m.key}
                    className={`gift-msg-btn ${m.key}`}
                    href={m.href}
                    target="_blank"
                    rel="noopener"
                    onClick={onMessengerClick}
                  >
                    <span className="gift-msg-icon">
                      {m.icon ? <Icon name={m.icon} size={24} strokeWidth={2} /> : <span className="gift-vk-text">VK</span>}
                    </span>
                    <span className="gift-msg-label">{m.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {minimized && (
        <button
          className={`gift-mini-btn${phase === 'min-pulse' ? ' pulse' : ''}`}
          onClick={openPopup}
          aria-label="Открыть подарок"
        >
          <Icon name="Gift" size={26} strokeWidth={2} />
        </button>
      )}
    </>
  );
}