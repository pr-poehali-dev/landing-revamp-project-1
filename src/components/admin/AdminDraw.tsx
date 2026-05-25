import { useState, useRef, useEffect } from 'react';

const PRESET_PRIZES = [
  'Сертификат в караоке-бар "Бархат"',
  'Banyan Group: Бесплатное проживание до 5 ночей на лучшем курорте Тайланда — Лагуна Пхукет',
  'ЭДУКО — сертификат центра развития навыков',
  'Сертификат в водный комплекс Акватория',
  'ROSE SPA: сертификат на тайский массаж',
  'ROSE SPA: сертификат на Филиппинский массаж хилот',
  'ROSE SPA: сертификат на Программу Спа-день',
  'Сертификат от Дальневосточной Ассоциации ИЖС',
  'Сертификат от Школы «Хакни Нейросети» на 30% скидки',
  'Сертификат от компании МотоРом на 2 часа проката мотоцикла',
  'SEDA: аренда поверхности на Театре оперы и балета «Сторона на мост»',
  'SEDA: аренда поверхности на Морвокзале',
  'Набор косметики от Real Green',
  'Подарок от Т2',
];
import confetti from 'canvas-confetti';
import { runDraw } from '@/lib/api';

const BG_IMAGE = 'https://cdn.poehali.dev/projects/d47b551f-c654-4b4a-9304-5aab4ecf9265/bucket/09be47ea-364d-4348-b416-605c0282c254.png';
const LOGO_BANNER = 'https://cdn.poehali.dev/projects/d47b551f-c654-4b4a-9304-5aab4ecf9265/bucket/5dd48417-c7e4-4bcd-813a-59f545288154.png';

interface DrawWinner { ticket_number: number; full_name: string; phone: string; }

interface Props {
  token: string;
  onClose: () => void;
  onDrawComplete: () => void;
}

const maskPhone = (phone: string) => {
  if (!phone) return '—';
  const digits = phone.replace(/\D/g, '');
  if (digits.length >= 11) return `+7 (${digits.slice(1, 4)}) ***-**-${digits.slice(-2)}`;
  return phone.slice(0, 3) + '***' + phone.slice(-2);
};

export default function AdminDraw({ token, onClose, onDrawComplete }: Props) {
  const [drawPrize, setDrawPrize] = useState('');
  const [drawLoading, setDrawLoading] = useState(false);
  const [drawWinner, setDrawWinner] = useState<DrawWinner | null>(null);
  const [drawError, setDrawError] = useState('');
  const [drawPhase, setDrawPhase] = useState<'idle' | 'spinning' | 'winner'>('idle');
  const [spinNumber, setSpinNumber] = useState(0);
  const spinIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [showPresets, setShowPresets] = useState(false);
  const presetsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (presetsRef.current && !presetsRef.current.contains(e.target as Node)) {
        setShowPresets(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const playFanfare = () => {
    try {
      const ctx = new AudioContext();
      const notes = [523, 659, 784, 1047, 784, 1047, 1047, 1047];
      const durations = [0.12, 0.12, 0.12, 0.3, 0.12, 0.12, 0.12, 0.5];
      let time = ctx.currentTime + 0.05;
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.35, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + durations[i]);
        osc.start(time);
        osc.stop(time + durations[i]);
        time += durations[i] * 0.9;
      });
    } catch (e) {
      console.log('Audio not available', e);
    }
  };

  const fireConfetti = () => {
    const duration = 4000;
    const end = Date.now() + duration;
    const colors = ['#00d4e8', '#ffffff', '#ffd700', '#00aaff', '#ff6bff'];
    const frame = () => {
      confetti({ particleCount: 6, angle: 60, spread: 70, origin: { x: 0 }, colors });
      confetti({ particleCount: 6, angle: 120, spread: 70, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  const handleRunDraw = async () => {
    if (!drawPrize.trim()) { setDrawError('Укажите название приза'); return; }
    setDrawError('');
    setDrawWinner(null);
    setDrawPhase('spinning');
    setDrawLoading(true);

    spinIntervalRef.current = setInterval(() => {
      setSpinNumber(Math.floor(Math.random() * 9999) + 1);
    }, 55);

    await new Promise(r => setTimeout(r, 3500));

    const result = await runDraw(token, { title: drawPrize.trim(), prize_name: drawPrize.trim() });

    if (spinIntervalRef.current) clearInterval(spinIntervalRef.current);
    setDrawLoading(false);

    if (result.status === 200 && result.data.success) {
      setDrawWinner(result.data.winner);
      setDrawPhase('winner');
      setTimeout(() => { playFanfare(); fireConfetti(); }, 300);
      onDrawComplete();
    } else {
      setDrawPhase('idle');
      setDrawError(result.data.error || 'Ошибка при проведении розыгрыша');
    }
  };

  const resetDraw = () => {
    setDrawPhase('idle');
    setDrawWinner(null);
    setDrawPrize('');
    setDrawError('');
  };

  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{ top: 0, left: 0, right: 0, bottom: 0, zIndex: 10, backgroundImage: `url(${BG_IMAGE})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0" style={{ background: 'rgba(5,15,35,0.72)' }} />

      <div className="relative flex flex-col h-full">
        <div className="flex items-center justify-between px-6 py-4 gap-4" style={{ borderBottom: '1px solid rgba(0,212,232,0.2)' }}>
          <a href="https://chernikovgpt.ru" target="_blank" rel="noopener noreferrer">
            <img src={LOGO_BANNER} alt="Бизнес у моря × Хакни Нейросети" className="h-12 object-contain" style={{ borderRadius: 10, cursor: 'pointer' }} />
          </a>
          <button
            onClick={onClose}
            className="shrink-0 text-xs px-3 py-1.5 rounded-lg transition"
            style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}
          >
            ✕ Закрыть
          </button>
        </div>

        <style>{`
          @keyframes slotBounce {
            0%,100% { transform: scale(1) rotate(-3deg); }
            25%     { transform: scale(1.12) rotate(3deg); }
            50%     { transform: scale(1.08) rotate(-2deg); }
            75%     { transform: scale(1.15) rotate(4deg); }
          }
          @keyframes titleGlow {
            0%,100% { text-shadow: 0 0 20px rgba(0,212,232,0.6), 0 0 40px rgba(0,212,232,0.3); }
            50%      { text-shadow: 0 0 30px rgba(0,212,232,1),   0 0 60px rgba(0,212,232,0.5); }
          }
          @keyframes btnPulse {
            0%,100% { box-shadow: 0 8px 32px rgba(0,212,232,0.35); }
            50%      { box-shadow: 0 8px 48px rgba(0,212,232,0.7), 0 0 24px rgba(0,212,232,0.4); }
          }
          .draw-title { animation: titleGlow 2.5s ease-in-out infinite; }
          .btn-pulse  { animation: btnPulse 2s ease-in-out infinite; }
          .slot-icon  { display: inline-block; animation: slotBounce 1.6s ease-in-out infinite; }
        `}</style>

        <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
          <h1 className="draw-title font-black text-center mb-8" style={{ fontSize: 'clamp(28px,5vw,52px)', letterSpacing: '1px', color: '#fff', textTransform: 'uppercase' }}>
            🎰 Розыгрыш призов
          </h1>

          <div className="relative flex items-center justify-center mb-8">
            <div className="absolute rounded-full" style={{ width: 200, height: 200, border: '1px solid rgba(0,212,232,0.12)' }} />
            <div className="absolute rounded-full" style={{ width: 250, height: 250, border: '1px solid rgba(0,212,232,0.07)' }} />
            <div
              className="relative flex items-center justify-center rounded-full transition-all duration-500 overflow-hidden"
              style={{
                width: 160, height: 160,
                background: drawPhase === 'winner' ? 'linear-gradient(135deg,#00d4e8,#0088aa)' : 'rgba(0,212,232,0.08)',
                border: `2px solid ${drawPhase === 'winner' ? '#00d4e8' : 'rgba(0,212,232,0.35)'}`,
                boxShadow: drawPhase !== 'idle' ? '0 0 60px rgba(0,212,232,0.5)' : '0 0 20px rgba(0,212,232,0.1)',
              }}
            >
              {drawPhase === 'idle' && (
                <span className="slot-icon" style={{ fontSize: 56 }}>🎰</span>
              )}
              {drawPhase === 'spinning' && (
                <span className="font-black tabular-nums" style={{ fontSize: 38, color: '#00d4e8' }}>
                  {String(spinNumber).padStart(4, '0')}
                </span>
              )}
              {drawPhase === 'winner' && drawWinner && (
                <span className="font-black" style={{ fontSize: 40, color: '#0d1b35' }}>
                  #{drawWinner.ticket_number}
                </span>
              )}
            </div>
          </div>

          {drawPhase === 'winner' && drawWinner && (
            <div
              className="w-full max-w-sm rounded-3xl p-6 text-center mb-6"
              style={{ background: 'rgba(0,212,232,0.1)', border: '1px solid rgba(0,212,232,0.4)', backdropFilter: 'blur(16px)' }}
            >
              <div className="text-4xl mb-2">🏆</div>
              <div className="font-bold mb-1 text-sm" style={{ color: '#00d4e8', letterSpacing: 2 }}>ПОБЕДИТЕЛЬ</div>
              <div className="text-white font-black mb-1" style={{ fontSize: 'clamp(20px,4vw,30px)' }}>{drawWinner.full_name}</div>
              <div className="mb-3 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{maskPhone(drawWinner.phone)}</div>
              {drawPrize && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: 'rgba(255,215,0,0.12)', border: '1px solid rgba(255,215,0,0.3)' }}>
                  <span>🎁</span>
                  <span className="font-semibold text-sm" style={{ color: '#ffd700' }}>{drawPrize}</span>
                </div>
              )}
            </div>
          )}

          {drawPhase !== 'winner' && (
            <div className="w-full max-w-sm">
              <div ref={presetsRef} className="relative mb-4">
                <input
                  type="text"
                  value={drawPrize}
                  onChange={e => { setDrawPrize(e.target.value); setDrawError(''); }}
                  onFocus={() => setShowPresets(true)}
                  placeholder="Название приза..."
                  disabled={drawPhase === 'spinning'}
                  className="w-full rounded-xl px-4 py-4 text-center text-2xl font-black"
                  style={{ background: 'rgba(0,20,50,0.7)', border: drawError ? '2px solid #ff6b6b' : '2px solid #00d4e8', color: 'white', outline: 'none', boxShadow: drawError ? 'none' : '0 0 20px rgba(0,212,232,0.4)', letterSpacing: '0.05em', caretColor: '#00d4e8' }}
                />
                {showPresets && drawPhase !== 'spinning' && (
                  <div className="absolute left-0 right-0 bottom-full mb-1 rounded-xl overflow-hidden z-10" style={{ background: '#0a1a35', border: '1px solid rgba(0,212,232,0.35)', boxShadow: '0 -8px 32px rgba(0,0,0,0.5)' }}>
                    {PRESET_PRIZES.map(prize => (
                      <button
                        key={prize}
                        type="button"
                        onMouseDown={() => { setDrawPrize(prize); setDrawError(''); setShowPresets(false); }}
                        className="w-full text-left px-4 py-3 text-sm font-semibold transition-colors hover:bg-white/10"
                        style={{ color: 'rgba(255,255,255,0.85)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                      >
                        {prize}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {drawError && <p className="text-red-400 text-sm text-center mb-3">{drawError}</p>}
              <button
                onClick={handleRunDraw}
                disabled={drawLoading}
                className={`w-full font-black py-5 rounded-2xl transition disabled:opacity-50 flex items-center justify-center gap-3 ${drawPhase !== 'spinning' ? 'btn-pulse' : ''}`}
                style={{
                  background: drawPhase === 'spinning' ? 'rgba(0,212,232,0.25)' : 'linear-gradient(135deg,#00d4e8,#0077a8)',
                  color: '#fff', fontSize: 22, letterSpacing: '0.05em', textTransform: 'uppercase',
                  boxShadow: '0 8px 32px rgba(0,212,232,0.35)',
                }}
              >
                {drawPhase === 'spinning' ? (
                  <>
                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Выбираем победителя...
                  </>
                ) : '🎰 Запустить розыгрыш'}
              </button>
            </div>
          )}

          {drawPhase === 'winner' && (
            <button
              onClick={resetDraw}
              className="px-8 py-3 rounded-xl font-semibold transition"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              Провести ещё один розыгрыш
            </button>
          )}
        </div>
      </div>
    </div>
  );
}