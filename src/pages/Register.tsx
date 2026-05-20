import { useState } from 'react';
import { registerParticipant, adminLogin } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

type Screen = 'form' | 'success' | 'duplicate' | 'error';

const LOGO_BANNER = 'https://cdn.poehali.dev/projects/d47b551f-c654-4b4a-9304-5aab4ecf9265/bucket/5dd48417-c7e4-4bcd-813a-59f545288154.png';

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', backgroundImage: 'url(https://cdn.poehali.dev/projects/d47b551f-c654-4b4a-9304-5aab4ecf9265/bucket/ee8e85b7-5bc4-488b-81e2-ff6047f87421.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Баннер */}
        <div className="mb-6">
          <a href="https://chernikovgpt.ru" target="_blank" rel="noopener noreferrer">
            <img
              src={LOGO_BANNER}
              alt="Бизнес у моря × Хакни Нейросети"
              className="w-full object-contain"
              style={{ borderRadius: 16, cursor: 'pointer' }}
            />
          </a>
        </div>
        {children}
      </div>
    </div>
  );
}

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
      <PageWrapper>
        <div className="rounded-3xl p-8 text-center" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(0,212,232,0.25)', backdropFilter: 'blur(12px)' }}>
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-2">Вы зарегистрированы!</h2>
          <p className="mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>Ваш номер участника</p>
          <div className="rounded-2xl p-6 mb-6" style={{ background: 'linear-gradient(135deg, #00d4e8, #0099b8)', boxShadow: '0 0 32px rgba(0,212,232,0.4)' }}>
            <span className="text-6xl font-black text-white">#{ticketNumber}</span>
          </div>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>Запомните ваш номерок — он понадобится при розыгрыше</p>
        </div>
      </PageWrapper>
    );
  }

  if (screen === 'duplicate') {
    return (
      <PageWrapper>
        <div className="rounded-3xl p-8 text-center" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(0,212,232,0.25)', backdropFilter: 'blur(12px)' }}>
          <div className="text-6xl mb-4">📱</div>
          <h2 className="text-2xl font-bold text-white mb-3">Вы уже участвуете!</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>Этот номер телефона уже зарегистрирован в розыгрыше.</p>
          <button
            onClick={() => setScreen('form')}
            className="mt-6 text-sm underline transition"
            style={{ color: '#00d4e8' }}
          >
            Попробовать другой номер
          </button>
        </div>
      </PageWrapper>
    );
  }

  if (screen === 'error') {
    return (
      <PageWrapper>
        <div className="rounded-3xl p-8 text-center" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(0,212,232,0.25)', backdropFilter: 'blur(12px)' }}>
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-white mb-3">Что-то пошло не так</h2>
          <p className="mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>Не удалось зарегистрироваться. Попробуйте ещё раз.</p>
          <button
            onClick={() => setScreen('form')}
            className="px-6 py-3 rounded-xl font-semibold transition"
            style={{ background: '#00d4e8', color: '#0d1b35' }}
          >
            Попробовать снова
          </button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="rounded-3xl p-8" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(0,212,232,0.2)', backdropFilter: 'blur(12px)' }}>

        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{ background: 'rgba(0,212,232,0.15)', border: '1px solid rgba(0,212,232,0.3)' }}>
            <span className="text-3xl">🎟️</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Участвуй в розыгрыше</h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Зарегистрируйся и получи уникальный номерок</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.75)' }}>Ваше имя</label>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: undefined })); }}
              placeholder="Иван Иванов"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: errors.name ? '1px solid #ff6b6b' : '1px solid rgba(0,212,232,0.25)',
                color: 'white',
                outline: 'none',
              }}
              className="w-full rounded-xl px-4 py-3 placeholder-white/30 focus:ring-2 transition w-full"
              disabled={loading}
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'rgba(255,255,255,0.75)' }}>Номер телефона</label>
            <input
              type="tel"
              value={phone}
              onChange={e => { setPhone(e.target.value); setErrors(p => ({ ...p, phone: undefined })); }}
              placeholder="+7 999 123-45-67"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: errors.phone ? '1px solid #ff6b6b' : '1px solid rgba(0,212,232,0.25)',
                color: 'white',
                outline: 'none',
              }}
              className="w-full rounded-xl px-4 py-3 placeholder-white/30 transition"
              disabled={loading}
            />
            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
          </div>

          {errors.general && (
            <div className="mb-4 rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(255,107,107,0.15)', border: '1px solid rgba(255,107,107,0.4)', color: '#ff9999' }}>
              {errors.general}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full font-bold py-4 rounded-xl transition disabled:opacity-60 flex items-center justify-center gap-2 text-lg"
            style={{ background: 'linear-gradient(135deg, #00d4e8, #0099b8)', color: '#0d1b35', boxShadow: '0 4px 20px rgba(0,212,232,0.35)' }}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Регистрируем...
              </>
            ) : 'Получить номерок'}
          </button>
        </form>

        <p className="text-center text-xs mt-4" style={{ color: 'rgba(255,255,255,0.3)' }}>Один номер телефона — один номерок участника</p>
      </div>

      {/* Trust-блок о школе */}
      <div
        className="w-full max-w-sm mt-4 rounded-2xl px-5 py-5"
        style={{
          background: 'linear-gradient(135deg, rgba(0,212,232,0.10) 0%, rgba(0,150,200,0.07) 100%)',
          border: '1px solid rgba(0,212,232,0.3)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <p className="text-xs font-semibold mb-3" style={{ color: 'rgba(0,212,232,0.7)', letterSpacing: '1px', textTransform: 'uppercase' }}>Приложение разработано:</p>
        <div className="flex items-start gap-3">
          <div
            className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-lg"
            style={{
              background: 'rgba(0,212,232,0.15)',
              border: '1px solid rgba(0,212,232,0.3)',
              animation: 'botPulse 2s ease-in-out infinite',
            }}
          >
            🤖
          </div>
          <style>{`
            @keyframes botPulse {
              0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0,212,232,0.4); }
              50% { transform: scale(1.12); box-shadow: 0 0 0 6px rgba(0,212,232,0); }
            }
          `}</style>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white mb-0.5">Школа ИИ «Хакни Нейросети»</p>
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Единственной живой школой во Владивостоке, которая обучает практическому применению нейросетей для бизнеса, работы, контента и автоматизации.
            </p>
            <a
              href="https://chernikovgpt.ru"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
              style={{ background: 'rgba(0,212,232,0.18)', color: '#00d4e8', border: '1px solid rgba(0,212,232,0.35)' }}
            >
              Узнать подробнее →
            </a>
          </div>
        </div>
      </div>

      {/* Незаметная кнопка для администратора */}
      <button
        onClick={() => { setShowAdminModal(true); setAdminError(''); setAdminPassword(''); }}
        className="fixed bottom-4 right-4 transition-opacity opacity-20 hover:opacity-50 text-white text-xs"
      >
        ⚙️
      </button>

      {/* Модалка входа в админку */}
      {showAdminModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="rounded-2xl shadow-2xl p-6 w-full max-w-xs" style={{ background: '#1a2f5a', border: '1px solid rgba(0,212,232,0.3)' }}>
            <div className="text-center mb-4">
              <div className="text-3xl mb-1">🔐</div>
              <h3 className="font-bold text-white">Вход для администратора</h3>
            </div>
            <form onSubmit={handleAdminLogin}>
              <input
                type="password"
                value={adminPassword}
                onChange={e => { setAdminPassword(e.target.value); setAdminError(''); }}
                placeholder="Пароль"
                autoFocus
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(0,212,232,0.3)', color: 'white', outline: 'none' }}
                className="w-full rounded-xl px-4 py-3 placeholder-white/30 mb-3"
                disabled={adminLoading}
              />
              {adminError && <p className="text-red-400 text-sm mb-3">{adminError}</p>}
              <button
                type="submit"
                disabled={adminLoading}
                className="w-full font-bold py-3 rounded-xl transition disabled:opacity-60 mb-2"
                style={{ background: '#00d4e8', color: '#0d1b35' }}
              >
                {adminLoading ? 'Вхожу...' : 'Войти'}
              </button>
              <button
                type="button"
                onClick={() => setShowAdminModal(false)}
                className="w-full text-sm py-1 transition"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                Отмена
              </button>
            </form>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}