import { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  adminLogin, adminLogout, getStats, getParticipants,
  getParticipantsCsvUrl, runDraw, getDrawHistory
} from '@/lib/api';

const BG_IMAGE = 'https://cdn.poehali.dev/projects/d47b551f-c654-4b4a-9304-5aab4ecf9265/bucket/ee8e85b7-5bc4-488b-81e2-ff6047f87421.png';
const LOGO_HACKNEURO = 'https://cdn.poehali.dev/projects/d47b551f-c654-4b4a-9304-5aab4ecf9265/bucket/3e6191c2-c830-4bdb-b051-0e3d8dae2b2d.png';
const LOGO_BIZMORE = 'https://cdn.poehali.dev/projects/d47b551f-c654-4b4a-9304-5aab4ecf9265/bucket/7114106d-a8ac-4739-8ac5-4a9fe853d89f.png';

type Tab = 'dashboard' | 'participants' | 'draw' | 'history';

interface Stats { total_participants: number; active_participants: number; total_draws: number; }
interface Participant { ticket_number: number; full_name: string; phone_normalized: string; status: string; created_at: string; }
interface DrawWinner { ticket_number: number; full_name: string; phone: string; }
interface DrawHistoryItem {
  draw_id: number; title: string; prize_name: string;
  participants_count: number; started_at: string;
  winner_ticket: number; winner_name: string; winner_phone: string;
}

const TOKEN_KEY = 'raffle_admin_token';

const maskPhone = (phone: string) => {
  if (!phone) return '—';
  const digits = phone.replace(/\D/g, '');
  if (digits.length >= 11) {
    return `+7 (${digits.slice(1, 4)}) ***-**-${digits.slice(-2)}`;
  }
  return phone.slice(0, 3) + '***' + phone.slice(-2);
};

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState<Tab>('dashboard');

  const [stats, setStats] = useState<Stats | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loadingPart, setLoadingPart] = useState(false);

  const [drawPrize, setDrawPrize] = useState('');
  const [drawLoading, setDrawLoading] = useState(false);
  const [drawWinner, setDrawWinner] = useState<DrawWinner | null>(null);
  const [drawError, setDrawError] = useState('');
  const [drawPhase, setDrawPhase] = useState<'idle' | 'spinning' | 'winner'>('idle');
  const [spinNumber, setSpinNumber] = useState(0);
  const spinIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [history, setHistory] = useState<DrawHistoryItem[]>([]);

  const logout = useCallback(() => {
    if (token) adminLogout(token);
    localStorage.removeItem(TOKEN_KEY);
    setToken('');
  }, [token]);

  const fetchStats = useCallback(async () => {
    if (!token) return;
    const data = await getStats(token);
    if (!data.error) setStats(data);
  }, [token]);

  const fetchParticipants = useCallback(async () => {
    if (!token) return;
    setLoadingPart(true);
    const data = await getParticipants(token, { search, status: statusFilter });
    if (!data.error) setParticipants(data.participants || []);
    setLoadingPart(false);
  }, [token, search, statusFilter]);

  const fetchHistory = useCallback(async () => {
    if (!token) return;
    const data = await getDrawHistory(token);
    if (!data.error) setHistory(data.history || []);
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchStats();
      if (tab === 'participants') fetchParticipants();
      if (tab === 'history') fetchHistory();
    }
  }, [token, tab, fetchStats, fetchParticipants, fetchHistory]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    const result = await adminLogin(password);
    setLoginLoading(false);
    if (result.status === 200 && result.data.token) {
      localStorage.setItem(TOKEN_KEY, result.data.token);
      setToken(result.data.token);
    } else {
      setLoginError(result.data.error || 'Ошибка входа');
    }
  };

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
    if (!drawPrize.trim()) {
      setDrawError('Укажите название приза');
      return;
    }
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
      fetchStats();
      fetchHistory();
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

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🔐</div>
            <h1 className="text-xl font-bold text-white">Панель администратора</h1>
            <p className="text-gray-400 text-sm mt-1">Введите пароль для входа</p>
          </div>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Пароль"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-violet-500"
              disabled={loginLoading}
            />
            {loginError && <p className="text-red-400 text-sm mb-3">{loginError}</p>}
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-60"
            >
              {loginLoading ? 'Вхожу...' : 'Войти'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const TABS: { id: Tab; label: string; emoji: string }[] = [
    { id: 'dashboard', label: 'Дашборд', emoji: '📊' },
    { id: 'participants', label: 'Участники', emoji: '👥' },
    { id: 'draw', label: 'Розыгрыш', emoji: '🎰' },
    { id: 'history', label: 'История', emoji: '📋' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎁</span>
          <span className="font-bold text-white">Розыгрыш — Админка</span>
        </div>
        <button onClick={logout} className="text-gray-400 hover:text-white text-sm transition">Выйти</button>
      </header>

      <nav className="bg-gray-900 border-b border-gray-800 px-4 flex gap-1 overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition border-b-2 ${tab === t.id ? 'border-violet-500 text-violet-400' : 'border-transparent text-gray-400 hover:text-white'}`}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </nav>

      <main className="p-4 max-w-5xl mx-auto">

        {/* ДАШБОРД */}
        {tab === 'dashboard' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Дашборд</h2>
            {stats ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
                  <div className="text-4xl font-black text-violet-400">{stats.total_participants}</div>
                  <div className="text-gray-400 text-sm mt-1">Всего участников</div>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
                  <div className="text-4xl font-black text-green-400">{stats.active_participants}</div>
                  <div className="text-gray-400 text-sm mt-1">Активных участников</div>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
                  <div className="text-4xl font-black text-yellow-400">{stats.total_draws}</div>
                  <div className="text-gray-400 text-sm mt-1">Проведено розыгрышей</div>
                </div>
              </div>
            ) : (
              <div className="text-gray-400">Загрузка...</div>
            )}
          </div>
        )}

        {/* УЧАСТНИКИ */}
        {tab === 'participants' && (
          <div>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchParticipants()}
                placeholder="Поиск по имени или телефону..."
                className="flex-1 bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:border-violet-500"
              />
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-2 focus:outline-none"
              >
                <option value="">Все статусы</option>
                <option value="active">Активные</option>
                <option value="inactive">Неактивные</option>
              </select>
              <button
                onClick={fetchParticipants}
                className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-xl font-medium transition"
              >
                Найти
              </button>
              <a
                href={getParticipantsCsvUrl(token, { search, status: statusFilter })}
                download="participants.csv"
                className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl font-medium transition text-center text-sm"
              >
                📥 CSV
              </a>
            </div>
            {loadingPart ? (
              <div className="text-gray-400 py-8 text-center">Загрузка...</div>
            ) : participants.length === 0 ? (
              <div className="text-gray-400 py-8 text-center">Участников не найдено</div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-800">
                <table className="w-full text-sm">
                  <thead className="bg-gray-900">
                    <tr>
                      {['#', 'Имя', 'Телефон', 'Статус', 'Дата'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-gray-400 font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {participants.map((p, i) => (
                      <tr key={p.ticket_number} className={i % 2 === 0 ? 'bg-gray-900/40' : 'bg-gray-900/20'}>
                        <td className="px-4 py-3 font-bold text-violet-400">#{p.ticket_number}</td>
                        <td className="px-4 py-3 text-white">{p.full_name}</td>
                        <td className="px-4 py-3 text-gray-300">{p.phone_normalized}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.status === 'active' ? 'bg-green-900/60 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
                            {p.status === 'active' ? 'активен' : p.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs">
                          {p.created_at ? new Date(p.created_at).toLocaleString('ru-RU') : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* РОЗЫГРЫШ */}
        {tab === 'draw' && (
          <div
            className="fixed inset-0 flex flex-col"
            style={{
              top: 0, left: 0, right: 0, bottom: 0,
              zIndex: 10,
              backgroundImage: `url(${BG_IMAGE})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Тёмный оверлей */}
            <div className="absolute inset-0" style={{ background: 'rgba(5,15,35,0.72)' }} />

            {/* Контент */}
            <div className="relative flex flex-col h-full">
              {/* Хедер */}
              <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(0,212,232,0.2)' }}>
                <img src={LOGO_HACKNEURO} alt="Хакни нейросети" className="h-8 object-contain" />
                <button
                  onClick={() => setTab('dashboard')}
                  className="text-xs px-3 py-1.5 rounded-lg transition"
                  style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}
                >
                  ✕ Закрыть
                </button>
                <img src={LOGO_BIZMORE} alt="Бизнес у моря" className="h-8 object-contain" />
              </div>

              {/* Основная сцена */}
              <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">

                <h1 className="text-white font-black text-center mb-8" style={{ fontSize: 'clamp(22px,4vw,40px)', letterSpacing: '-0.5px' }}>
                  Розыгрыш призов
                </h1>

                {/* Барабан */}
                <div className="relative flex items-center justify-center mb-8">
                  <div className="absolute rounded-full" style={{ width: 200, height: 200, border: '1px solid rgba(0,212,232,0.12)' }} />
                  <div className="absolute rounded-full" style={{ width: 250, height: 250, border: '1px solid rgba(0,212,232,0.07)' }} />
                  <div
                    className="relative flex items-center justify-center rounded-full transition-all duration-500"
                    style={{
                      width: 160, height: 160,
                      background: drawPhase === 'winner' ? 'linear-gradient(135deg,#00d4e8,#0088aa)' : 'rgba(0,212,232,0.08)',
                      border: `2px solid ${drawPhase === 'winner' ? '#00d4e8' : 'rgba(0,212,232,0.35)'}`,
                      boxShadow: drawPhase !== 'idle' ? '0 0 60px rgba(0,212,232,0.5)' : '0 0 20px rgba(0,212,232,0.1)',
                    }}
                  >
                    {drawPhase === 'idle' && <span style={{ fontSize: 52 }}>🎰</span>}
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

                {/* Карточка победителя */}
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

                {/* Форма ввода */}
                {drawPhase !== 'winner' && (
                  <div className="w-full max-w-sm">
                    <input
                      type="text"
                      value={drawPrize}
                      onChange={e => { setDrawPrize(e.target.value); setDrawError(''); }}
                      placeholder="Название приза..."
                      disabled={drawPhase === 'spinning'}
                      className="w-full rounded-xl px-4 py-3 text-center text-lg font-medium placeholder-white/30 mb-4"
                      style={{ background: 'rgba(255,255,255,0.07)', border: drawError ? '1px solid #ff6b6b' : '1px solid rgba(0,212,232,0.3)', color: 'white', outline: 'none' }}
                    />
                    {drawError && <p className="text-red-400 text-sm text-center mb-3">{drawError}</p>}
                    <button
                      onClick={handleRunDraw}
                      disabled={drawPhase === 'spinning'}
                      className="w-full font-black py-5 rounded-2xl transition disabled:opacity-50 flex items-center justify-center gap-3"
                      style={{
                        background: drawPhase === 'spinning' ? 'rgba(0,212,232,0.25)' : 'linear-gradient(135deg,#00d4e8,#0077a8)',
                        color: '#0d1b35', fontSize: 20,
                        boxShadow: '0 8px 32px rgba(0,212,232,0.3)',
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
        )}

        {/* ИСТОРИЯ */}
        {tab === 'history' && (
          <div>
            <h2 className="text-xl font-bold mb-4">История розыгрышей</h2>
            {history.length === 0 ? (
              <div className="text-gray-400 py-8 text-center">Розыгрышей ещё не проводилось</div>
            ) : (
              <div className="flex flex-col gap-4">
                {history.map(item => (
                  <div key={item.draw_id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <div className="font-bold text-white text-lg">{item.title}</div>
                        <div className="text-gray-400 text-sm">🎁 {item.prize_name}</div>
                        <div className="text-gray-500 text-xs mt-1">
                          {item.started_at ? new Date(item.started_at).toLocaleString('ru-RU') : '—'} · {item.participants_count} участников
                        </div>
                      </div>
                      {item.winner_name && (
                        <div className="bg-yellow-900/30 border border-yellow-700/40 rounded-xl p-3 text-right min-w-[160px]">
                          <div className="text-yellow-400 text-xs font-medium mb-1">Победитель</div>
                          <div className="text-white font-bold">{item.winner_name}</div>
                          <div className="text-gray-400 text-sm">{maskPhone(item.winner_phone)}</div>
                          <div className="text-yellow-400 font-bold">#{item.winner_ticket}</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}