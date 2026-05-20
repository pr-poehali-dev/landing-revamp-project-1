import { useState, useEffect, useCallback } from 'react';
import { adminLogin, adminLogout, getStats, getParticipants, getDrawHistory } from '@/lib/api';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminParticipants from '@/components/admin/AdminParticipants';
import AdminDraw from '@/components/admin/AdminDraw';
import AdminHistory from '@/components/admin/AdminHistory';

type Tab = 'dashboard' | 'participants' | 'draw' | 'history';

interface Stats { total_participants: number; active_participants: number; total_draws: number; }
interface Participant { ticket_number: number; full_name: string; phone_normalized: string; status: string; created_at: string; }
interface DrawHistoryItem {
  draw_id: number; title: string; prize_name: string;
  participants_count: number; started_at: string;
  winner_ticket: number; winner_name: string; winner_phone: string;
}

const TOKEN_KEY = 'raffle_admin_token';

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

  if (!token) {
    return (
      <AdminLogin
        password={password}
        setPassword={setPassword}
        loginError={loginError}
        loginLoading={loginLoading}
        onSubmit={handleLogin}
      />
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
          <AdminParticipants
            token={token}
            participants={participants}
            search={search}
            setSearch={setSearch}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            loadingPart={loadingPart}
            fetchParticipants={fetchParticipants}
          />
        )}

        {/* РОЗЫГРЫШ */}
        {tab === 'draw' && (
          <AdminDraw
            token={token}
            onClose={() => setTab('dashboard')}
            onDrawComplete={() => { fetchStats(); fetchHistory(); }}
          />
        )}

        {/* ИСТОРИЯ */}
        {tab === 'history' && (
          <AdminHistory history={history} />
        )}

      </main>
    </div>
  );
}
