import { useCallback, useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';

const ADMIN_URL = 'https://functions.poehali.dev/8f5aa87f-3349-49d0-b749-9874e234ac1f';
const STORE_KEY = 'blogger_admin_pass';

interface Application {
  id: number;
  name: string;
  socialNetwork: string;
  socialLink: string;
  followersCount: string;
  reach: string;
  phone: string;
  ip: string;
  createdAt: string;
}

const fmtDate = (iso: string) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
};

const clean = (v: string) => (!v || v === '—' ? '' : v);

export default function BloggerAdmin() {
  const [pass, setPass] = useState('');
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [items, setItems] = useState<Application[]>([]);

  const load = useCallback(async (password: string, silent = false) => {
    if (!silent) setLoading(true);
    setError('');
    try {
      const res = await fetch(ADMIN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.status === 401) {
        localStorage.removeItem(STORE_KEY);
        setAuthed(false);
        setError('Неверный пароль');
        return;
      }
      if (!res.ok) throw new Error('fail');
      const data = await res.json();
      setItems(data.items || []);
      setAuthed(true);
      localStorage.setItem(STORE_KEY, password);
    } catch {
      setError('Не удалось загрузить заявки. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    document.title = 'Заявки блогеров · админка';
    const saved = localStorage.getItem(STORE_KEY);
    if (saved) {
      setPass(saved);
      load(saved);
    }
  }, [load]);

  const logout = () => {
    localStorage.removeItem(STORE_KEY);
    setAuthed(false);
    setItems([]);
    setPass('');
  };

  const exportCsv = () => {
    const head = ['Дата', 'Имя', 'Соцсеть', 'Ссылка', 'Подписчики', 'Охваты', 'Телефон'];
    const rows = items.map((a) => [fmtDate(a.createdAt), a.name, a.socialNetwork, a.socialLink, clean(a.followersCount), clean(a.reach), a.phone]);
    const csv = [head, ...rows].map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(';')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blogger-applications-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!authed) {
    return (
      <div className="badm-gate">
        <form
          className="badm-card"
          onSubmit={(e) => {
            e.preventDefault();
            if (pass.trim()) load(pass.trim());
          }}
        >
          <div className="badm-lock"><Icon name="Lock" size={22} /></div>
          <h1>Заявки блогеров</h1>
          <p>Закрытый раздел. Введите пароль.</p>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Пароль"
            autoFocus
          />
          {error && <div className="badm-err">{error}</div>}
          <button type="submit" disabled={loading}>{loading ? 'Проверяем…' : 'Войти'}</button>
        </form>
      </div>
    );
  }

  return (
    <div className="badm">
      <header className="badm-top">
        <div>
          <h1>Заявки блогеров</h1>
          <span className="badm-count">Всего: {items.length}</span>
        </div>
        <div className="badm-actions">
          <button onClick={() => load(pass, true)} disabled={loading}>
            <Icon name="RefreshCw" size={16} /> Обновить
          </button>
          <button onClick={exportCsv} disabled={!items.length}>
            <Icon name="Download" size={16} /> Excel
          </button>
          <button onClick={logout} className="ghost">
            <Icon name="LogOut" size={16} /> Выйти
          </button>
        </div>
      </header>

      {error && <div className="badm-err">{error}</div>}

      {!items.length && !loading ? (
        <div className="badm-empty">
          <Icon name="Inbox" size={40} />
          <p>Заявок пока нет</p>
        </div>
      ) : (
        <div className="badm-table-wrap">
          <table className="badm-table">
            <thead>
              <tr>
                <th>Дата</th>
                <th>Имя</th>
                <th>Соцсеть</th>
                <th>Ссылка</th>
                <th>Аудитория</th>
                <th>Телефон</th>
              </tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <tr key={a.id}>
                  <td className="nowrap">{fmtDate(a.createdAt)}</td>
                  <td>{a.name}</td>
                  <td><span className="badm-tag">{a.socialNetwork || '—'}</span></td>
                  <td className="badm-link">
                    <a href={a.socialLink} target="_blank" rel="noopener noreferrer">{a.socialLink}</a>
                  </td>
                  <td>
                    {clean(a.followersCount) && <div>{a.followersCount} подписчиков</div>}
                    {clean(a.reach) && <div className="badm-dim">{a.reach}</div>}
                    {!clean(a.followersCount) && !clean(a.reach) && '—'}
                  </td>
                  <td className="nowrap"><a href={`tel:${a.phone}`}>{a.phone}</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
