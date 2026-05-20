import { useState, useEffect, useCallback } from 'react';
import {
  adminLogin, adminLogout, getStats, getParticipants,
  getParticipantsCsvUrl, runDraw, getDrawHistory
} from '@/lib/api';

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

  const [drawTitle, setDrawTitle] = useState('');
  const [drawPrize, setDrawPrize] = useState('');
  const [drawLoading, setDrawLoading] = useState(false);
  const [drawWinner, setDrawWinner] = useState<DrawWinner | null>(null);
  const [drawError, setDrawError] = useState('');

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

  const handleRunDraw = async () => {
    if (!drawTitle.trim() || !drawPrize.trim()) {
      setDrawError('Заполните название розыгрыша и приза');
      return;
    }
    setDrawLoading(true);
    setDrawError('');
    setDrawWinner(null);
    const result = await runDraw(token, { title: drawTitle.trim(), prize_name: drawPrize.trim() });
    setDrawLoading(false);
    if (result.status === 200 && result.data.success) {
      setDrawWinner(result.data.winner);
      fetchStats();
      fetchHistory();
    } else {
      setDrawError(result.data.error || 'Ошибка при проведении розыгрыша');
    }
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
          <div className="max-w-lg">
            <h2 className="text-xl font-bold mb-4">Запустить розыгрыш</h2>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-1">Название розыгрыша</label>
                <input
                  value={drawTitle}
                  onChange={e => setDrawTitle(e.target.value)}
                  placeholder="Например: Летний розыгрыш 2025"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-1">Название приза</label>
                <input
                  value={drawPrize}
                  onChange={e => setDrawPrize(e.target.value)}
                  placeholder="Например: iPhone 15 Pro"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500"
                />
              </div>
              {drawError && (
                <div className="mb-4 bg-red-950 border border-red-800 rounded-xl px-4 py-3 text-red-400 text-sm">
                  {drawError}
                </div>
              )}
              <button
                onClick={handleRunDraw}
                disabled={drawLoading}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 text-white font-bold py-4 rounded-xl transition disabled:opacity-60 text-lg"
              >
                {drawLoading ? '🎰 Выбираем победителя...' : '🎰 Запустить розыгрыш'}
              </button>
            </div>

            {drawWinner && (
              <div className="mt-6 bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border border-yellow-700/50 rounded-2xl p-6 text-center">
                <div className="text-4xl mb-2">🏆</div>
                <div className="text-yellow-400 font-bold text-lg mb-1">Победитель!</div>
                <div className="text-white text-2xl font-black mb-1">{drawWinner.full_name}</div>
                <div className="text-gray-300 mb-2">{maskPhone(drawWinner.phone)}</div>
                <div className="inline-block bg-yellow-500/20 border border-yellow-500/40 rounded-xl px-4 py-2">
                  <span className="text-yellow-300 font-bold text-xl">#{drawWinner.ticket_number}</span>
                </div>
              </div>
            )}
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