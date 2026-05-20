import { useState } from 'react';
import { registerParticipant, adminLogin } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

type Screen = 'form' | 'success' | 'duplicate' | 'error';

export default function Register() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>('form');
  const [ticketNumber, setTicketNumber] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string; general?: string }>({});

  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoading(true);
    setAdminError('');
    const result = await adminLogin(adminPassword);
    setAdminLoading(false);
    if (result.status === 200 && result.data.token) {
      localStorage.setItem('raffle_admin_token', result.data.token);
      navigate('/admin');
    } else {
      setAdminError(result.data.error || 'Неверный пароль');
    }
  };

  const validate = () => {
    const errs: typeof errors = {};
    if (!name.trim() || name.trim().length < 2) errs.name = 'Введите имя (минимум 2 символа)';
    if (name.trim().length > 100) errs.name = 'Имя не должно превышать 100 символов';
    if (!phone.trim()) errs.phone = 'Введите номер телефона';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const result = await registerParticipant({ full_name: name.trim(), phone: phone.trim() });
      if (result.status === 200 && result.data.success) {
        setTicketNumber(result.data.ticket_number);
        setScreen('success');
      } else if (result.status === 409 && result.data.error === 'duplicate') {
        setScreen('duplicate');
      } else if (result.status === 400) {
        setErrors({ general: result.data.error || 'Проверьте введённые данные' });
      } else {
        setScreen('error');
      }
    } catch {
      setScreen('error');
    } finally {
      setLoading(false);
    }
  };

  if (screen === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Вы зарегистрированы!</h2>
          <p className="text-gray-500 mb-6">Ваш номер участника</p>
          <div className="bg-gradient-to-r from-violet-500 to-indigo-500 rounded-2xl p-6 mb-6">
            <span className="text-6xl font-black text-white">#{ticketNumber}</span>
          </div>
          <p className="text-sm text-gray-400">Запомните или сохраните ваш номерок — он понадобится при розыгрыше</p>
        </div>
      </div>
    );
  }

  if (screen === 'duplicate') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full text-center">
          <div className="text-6xl mb-4">📱</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Вы уже участвуете!</h2>
          <p className="text-gray-500">Этот номер телефона уже зарегистрирован в розыгрыше.</p>
          <button
            onClick={() => setScreen('form')}
            className="mt-6 text-violet-600 underline text-sm"
          >
            Попробовать другой номер
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Что-то пошло не так</h2>
          <p className="text-gray-500 mb-6">Не удалось зарегистрироваться. Попробуйте ещё раз.</p>
          <button
            onClick={() => setScreen('form')}
            className="bg-violet-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-violet-700 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-sm w-full">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎁</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Участвуй в розыгрыше</h1>
          <p className="text-gray-500 text-sm">Зарегистрируйся и получи свой уникальный номерок</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Ваше имя</label>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: undefined })); }}
              placeholder="Иван Иванов"
              className={`w-full border rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
              disabled={loading}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Номер телефона</label>
            <input
              type="tel"
              value={phone}
              onChange={e => { setPhone(e.target.value); setErrors(p => ({ ...p, phone: undefined })); }}
              placeholder="+7 999 123-45-67"
              className={`w-full border rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition ${errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
              disabled={loading}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          {errors.general && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
              {errors.general}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold py-4 rounded-xl hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2 text-lg"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Регистрируем...
              </>
            ) : 'Получить номерок 🎟️'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">Один номер телефона — один номерок участника</p>
      </div>

      {/* Незаметная кнопка для администратора */}
      <button
        onClick={() => { setShowAdminModal(true); setAdminError(''); setAdminPassword(''); }}
        className="fixed bottom-4 right-4 text-gray-300/40 hover:text-gray-400/70 text-xs transition-colors"
      >
        ⚙️
      </button>

      {/* Модалка входа в админку */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-xs">
            <div className="text-center mb-4">
              <div className="text-3xl mb-1">🔐</div>
              <h3 className="font-bold text-gray-900">Вход для администратора</h3>
            </div>
            <form onSubmit={handleAdminLogin}>
              <input
                type="password"
                value={adminPassword}
                onChange={e => { setAdminPassword(e.target.value); setAdminError(''); }}
                placeholder="Пароль"
                autoFocus
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500 mb-3"
                disabled={adminLoading}
              />
              {adminError && <p className="text-red-500 text-sm mb-3">{adminError}</p>}
              <button
                type="submit"
                disabled={adminLoading}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-xl transition disabled:opacity-60 mb-2"
              >
                {adminLoading ? 'Вхожу...' : 'Войти'}
              </button>
              <button
                type="button"
                onClick={() => setShowAdminModal(false)}
                className="w-full text-gray-400 text-sm py-1 hover:text-gray-600 transition"
              >
                Отмена
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}