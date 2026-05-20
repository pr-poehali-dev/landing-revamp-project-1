import { useState, useEffect } from 'react';
import { runDraw, getDrawHistory } from '@/lib/api';

const LOGO_BANNER = 'https://cdn.poehali.dev/projects/d47b551f-c654-4b4a-9304-5aab4ecf9265/bucket/5dd48417-c7e4-4bcd-813a-59f545288154.png';

const TOKEN_KEY = 'raffle_admin_token';

function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, '');
  if (digits.length >= 11) return `+7 (${digits.slice(1, 4)}) ***-**-${digits.slice(-2)}`;
  return phone.slice(0, 3) + '***' + phone.slice(-2);
}

type Phase = 'idle' | 'spinning' | 'winner';

export default function Draw() {
  const token = localStorage.getItem(TOKEN_KEY) || '';
  const [prize, setPrize] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [winner, setWinner] = useState<{ full_name: string; phone: string; ticket_number: number } | null>(null);
  const [error, setError] = useState('');
  const [spinNumber, setSpinNumber] = useState(0);
  const [lastWinners, setLastWinners] = useState<{ winner_name: string; winner_ticket: number; prize_name: string }[]>([]);

  useEffect(() => {
    if (token) {
      getDrawHistory(token).then((d: { history?: typeof lastWinners }) => {
        if (d.history) setLastWinners(d.history.slice(0, 5));
      });
    }
  }, [token]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (phase === 'spinning') {
      interval = setInterval(() => {
        setSpinNumber(Math.floor(Math.random() * 9999) + 1);
      }, 60);
    }
    return () => clearInterval(interval);
  }, [phase]);

  const handleDraw = async () => {
    if (!prize.trim()) { setError('Введите название приза'); return; }
    if (!token) { setError('Нет токена администратора'); return; }
    setError('');
    setWinner(null);
    setPhase('spinning');

    await new Promise(r => setTimeout(r, 3000));

    const result = await runDraw(token, { title: prize.trim(), prize_name: prize.trim() });
    if (result.status === 200 && result.data.success) {
      setWinner(result.data.winner);
      setPhase('winner');
      getDrawHistory(token).then((d: { history?: typeof lastWinners }) => {
        if (d.history) setLastWinners(d.history.slice(0, 5));
      });
    } else {
      setPhase('idle');
      setError(result.data.error || 'Ошибка при проведении розыгрыша');
    }
  };

  const reset = () => {
    setPhase('idle');
    setWinner(null);
    setPrize('');
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundImage: 'url(https://cdn.poehali.dev/projects/d47b551f-c654-4b4a-9304-5aab4ecf9265/bucket/ee8e85b7-5bc4-488b-81e2-ff6047f87421.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Хедер с баннером */}
      <header className="flex items-center justify-between px-6 py-4 gap-4" style={{ borderBottom: '1px solid rgba(0,212,232,0.15)' }}>
        <a href="https://chernikovgpt.ru" target="_blank" rel="noopener noreferrer">
          <img src={LOGO_BANNER} alt="Бизнес у моря × Хакни Нейросети" className="h-12 object-contain" style={{ borderRadius: 10, cursor: 'pointer' }} />
        </a>
        <span className="shrink-0 text-xs font-medium px-3 py-1 rounded-full" style={{ background: 'rgba(0,212,232,0.15)', color: '#00d4e8', border: '1px solid rgba(0,212,232,0.3)' }}>
          РОЗЫГРЫШ
        </span>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">

        {/* ЗАГОЛОВОК */}
        <div className="text-center mb-10">
          <h1 className="font-black text-white mb-2" style={{ fontSize: 'clamp(28px, 6vw, 52px)', letterSpacing: '-1px' }}>
            Розыгрыш призов
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 16 }}>V Предпринимательский форум Приморского края</p>
        </div>

        {/* БАРАБАН */}
        <div className="relative flex items-center justify-center mb-10">
          {/* Декоративные кольца */}
          <div className="absolute rounded-full" style={{ width: 220, height: 220, border: '1px solid rgba(0,212,232,0.1)' }} />
          <div className="absolute rounded-full" style={{ width: 270, height: 270, border: '1px solid rgba(0,212,232,0.06)' }} />

          <div
            className="relative flex items-center justify-center rounded-full"
            style={{
              width: 180, height: 180,
              background: phase === 'winner'
                ? 'linear-gradient(135deg, #00d4e8, #0099b8)'
                : 'rgba(0,212,232,0.08)',
              border: `2px solid ${phase === 'winner' ? '#00d4e8' : 'rgba(0,212,232,0.3)'}`,
              boxShadow: phase !== 'idle' ? '0 0 60px rgba(0,212,232,0.4)' : '0 0 20px rgba(0,212,232,0.1)',
              transition: 'all 0.5s ease',
            }}
          >
            {phase === 'idle' && (
              <span style={{ fontSize: 52 }}>🎰</span>
            )}
            {phase === 'spinning' && (
              <span className="font-black tabular-nums" style={{ fontSize: 42, color: '#00d4e8', fontVariantNumeric: 'tabular-nums' }}>
                {String(spinNumber).padStart(4, '0')}
              </span>
            )}
            {phase === 'winner' && winner && (
              <span className="font-black" style={{ fontSize: 48, color: '#0d1b35' }}>
                #{winner.ticket_number}
              </span>
            )}
          </div>
        </div>

        {/* ПОБЕДИТЕЛЬ */}
        {phase === 'winner' && winner && (
          <div
            className="w-full max-w-md rounded-3xl p-6 text-center mb-8"
            style={{ background: 'rgba(0,212,232,0.08)', border: '1px solid rgba(0,212,232,0.35)', backdropFilter: 'blur(12px)' }}
          >
            <div className="text-4xl mb-3">🏆</div>
            <div className="text-sm font-medium mb-1" style={{ color: '#00d4e8' }}>ПОБЕДИТЕЛЬ</div>
            <div className="text-white font-black mb-1" style={{ fontSize: 'clamp(20px, 5vw, 32px)' }}>{winner.full_name}</div>
            <div className="mb-3" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15 }}>{maskPhone(winner.phone)}</div>
            {prize && (
              <div className="inline-flex items-center gap-2 rounded-xl px-4 py-2" style={{ background: 'rgba(0,212,232,0.12)', border: '1px solid rgba(0,212,232,0.25)' }}>
                <span>🎁</span>
                <span className="text-white font-semibold text-sm">{prize}</span>
              </div>
            )}
          </div>
        )}

        {/* ФОРМА */}
        {phase !== 'winner' && (
          <div className="w-full max-w-md">
            <div className="mb-4">
              <input
                type="text"
                value={prize}
                onChange={e => { setPrize(e.target.value); setError(''); }}
                placeholder="Название приза..."
                disabled={phase === 'spinning'}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: error ? '1px solid #ff6b6b' : '1px solid rgba(0,212,232,0.25)',
                  color: 'white',
                  outline: 'none',
                }}
                className="w-full rounded-xl px-4 py-3 placeholder-white/30 text-center text-lg font-medium"
              />
              {error && <p className="text-red-400 text-sm text-center mt-2">{error}</p>}
            </div>

            <button
              onClick={handleDraw}
              disabled={phase === 'spinning'}
              className="w-full font-black py-5 rounded-2xl transition disabled:opacity-50 flex items-center justify-center gap-3"
              style={{
                background: phase === 'spinning'
                  ? 'rgba(0,212,232,0.3)'
                  : 'linear-gradient(135deg, #00d4e8, #0077a8)',
                color: '#0d1b35',
                fontSize: 20,
                boxShadow: '0 8px 32px rgba(0,212,232,0.3)',
              }}
            >
              {phase === 'spinning' ? (
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

        {phase === 'winner' && (
          <button
            onClick={reset}
            className="px-8 py-3 rounded-xl font-semibold transition"
            style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            Провести ещё один розыгрыш
          </button>
        )}

        {/* ИСТОРИЯ */}
        {lastWinners.length > 0 && (
          <div className="w-full max-w-md mt-10">
            <div className="text-center text-xs font-medium mb-3" style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: 2 }}>ПРЕДЫДУЩИЕ ПОБЕДИТЕЛИ</div>
            <div className="flex flex-col gap-2">
              {lastWinners.map((w, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div>
                    <span className="text-white text-sm font-medium">{w.winner_name}</span>
                    <span className="ml-2 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>🎁 {w.prize_name}</span>
                  </div>
                  <span className="font-bold text-sm" style={{ color: '#00d4e8' }}>#{w.winner_ticket}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="text-center py-4 text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
        Хакни Нейросети × Бизнес у моря
      </footer>
    </div>
  );
}