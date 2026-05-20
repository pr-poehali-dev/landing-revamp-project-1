import { useState } from 'react';
import { registerParticipant, adminLogin } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

type Screen = 'form' | 'success' | 'duplicate' | 'error';

const LOGO_BANNER = 'https://cdn.poehali.dev/projects/d47b551f-c654-4b4a-9304-5aab4ecf9265/bucket/5dd48417-c7e4-4bcd-813a-59f545288154.png';

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', backgroundImage: 'url(https://cdn.poehali.dev/projects/d47b551f-c654-4b4a-9304-5aab4ecf9265/bucket/ee8e85b7-5bc4-488b-81e2-ff6047f87421.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} className="flex flex-col items-center py-5 px-4">
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 0, pointerEvents: 'none' }} />
      <div className="w-full max-w-sm" style={{ position: 'relative', zIndex: 1 }}>
        {/* Баннер */}
        <div className="mb-4">
          <a href="https://chernikovgpt.ru" target="_blank" rel="noopener noreferrer">
            <img
              src={LOGO_BANNER}
              alt="Бизнес у моря × Хакни Нейросети"
              className="w-full object-contain"
              style={{ borderRadius: 14, cursor: 'pointer' }}
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

  const [consentChecked, setConsentChecked] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

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
          <style>{`
            @keyframes importantPulse {
              0%,100% { box-shadow: 0 0 10px rgba(255,200,0,0.3); border-color: rgba(255,200,0,0.5); }
              50%     { box-shadow: 0 0 22px rgba(255,200,0,0.7), 0 0 40px rgba(255,200,0,0.3); border-color: rgba(255,200,0,0.9); }
            }
            @keyframes textBlink {
              0%,100% { opacity: 1; }
              50%     { opacity: 0.7; }
            }
            .notice-pulse {
              animation: importantPulse 1.8s ease-in-out infinite;
            }
            .notice-text {
              animation: textBlink 1.8s ease-in-out infinite;
            }
          `}</style>
          <div className="notice-pulse rounded-xl px-4 py-3 mt-2" style={{ background: 'rgba(255,200,0,0.1)', border: '2px solid rgba(255,200,0,0.5)' }}>
            <p className="notice-text text-sm font-bold text-center" style={{ color: '#ffd700' }}>
              ⚠️ Запомните ваш номерок — он понадобится при розыгрыше
            </p>
          </div>
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
      <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(0,212,232,0.2)', backdropFilter: 'blur(12px)' }}>

        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-3 ticket-gold-badge">
            <span className="text-3xl ticket-shake">🎟️</span>
          </div>
          <style>{`
            @keyframes goldPulse {
              0%, 100% { box-shadow: 0 0 12px 2px #f5c842, 0 0 28px 6px rgba(245,200,66,0.35); background: linear-gradient(135deg,#7a5200,#e6a817,#fff0a0,#c87d00,#f5c842); }
              50% { box-shadow: 0 0 22px 6px #f5c842, 0 0 48px 14px rgba(245,200,66,0.55); background: linear-gradient(135deg,#c87d00,#fff0a0,#f5c842,#7a5200,#e6a817); }
            }
            @keyframes ticketShake {
              0%, 100% { transform: rotate(-8deg) scale(1); }
              25% { transform: rotate(8deg) scale(1.15); }
              50% { transform: rotate(-4deg) scale(1.05); }
              75% { transform: rotate(6deg) scale(1.1); }
            }
            .ticket-gold-badge {
              animation: goldPulse 2s ease-in-out infinite;
              border: 2px solid #f5c842;
            }
            .ticket-shake {
              display: inline-block;
              animation: ticketShake 2s ease-in-out infinite;
            }
          `}</style>
          <h1 className="text-xl font-bold text-white mb-1">Участвуй в розыгрыше</h1>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Зарегистрируйся и получи уникальный номерок</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.75)' }}>Ваше имя</label>
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
              className="w-full rounded-xl px-3 py-2.5 placeholder-white/30 transition"
              disabled={loading}
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.75)' }}>Номер телефона</label>
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
              className="w-full rounded-xl px-3 py-2.5 placeholder-white/30 transition"
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
            disabled={loading || !consentChecked}
            className="w-full font-bold py-3 rounded-xl transition disabled:opacity-40 flex items-center justify-center gap-2 text-base"
            style={{ background: 'linear-gradient(135deg, #00d4e8, #0099b8)', color: '#0d1b35', boxShadow: consentChecked ? '0 4px 20px rgba(0,212,232,0.35)' : 'none' }}
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

        <div className="flex items-start gap-2.5 mt-3 select-none">
          <div
            onClick={() => setConsentChecked(v => !v)}
            className="shrink-0 mt-0.5 w-4 h-4 rounded flex items-center justify-center transition-all cursor-pointer"
            style={{
              border: consentChecked ? '2px solid #00d4e8' : '2px solid rgba(255,255,255,0.3)',
              background: consentChecked ? '#00d4e8' : 'rgba(255,255,255,0.05)',
            }}
          >
            {consentChecked && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4L3.5 6.5L9 1" stroke="#0d1b35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Даю{' '}
            <button type="button" onClick={() => setShowConsentModal(true)} className="underline underline-offset-2 transition-opacity hover:opacity-80" style={{ color: '#00d4e8' }}>
              согласие
            </button>
            {' '}на обработку персональных данных на условиях, изложенных в{' '}
            <button type="button" onClick={() => setShowPrivacyModal(true)} className="underline underline-offset-2 transition-opacity hover:opacity-80" style={{ color: '#00d4e8' }}>
              Политике конфиденциальности
            </button>.
          </p>
        </div>

        <p className="text-center text-xs mt-2" style={{ color: 'rgba(255,255,255,0.25)' }}>Один номер телефона — один номерок участника</p>
      </div>

      {/* Trust-блок о школе */}
      <style>{`
        @keyframes botPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0,212,232,0.4); }
          50% { transform: scale(1.12); box-shadow: 0 0 0 6px rgba(0,212,232,0); }
        }
      `}</style>
      <div
        className="w-full max-w-sm mt-3 rounded-2xl px-4 py-4"
        style={{
          background: 'linear-gradient(135deg, rgba(0,212,232,0.10) 0%, rgba(0,150,200,0.07) 100%)',
          border: '1px solid rgba(0,212,232,0.3)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <p className="text-xs font-semibold mb-2" style={{ color: 'rgba(0,212,232,0.7)', letterSpacing: '1px', textTransform: 'uppercase' }}>Приложение разработано:</p>
        <div className="flex items-center gap-3">
          <div
            className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-base"
            style={{
              background: 'rgba(0,212,232,0.15)',
              border: '1px solid rgba(0,212,232,0.3)',
              animation: 'botPulse 2s ease-in-out infinite',
            }}
          >
            🤖
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white leading-tight">Школа ИИ «Хакни Нейросети»</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Единственная живая школа ИИ во Владивостоке</p>
          </div>
        </div>
        <p className="text-xs leading-relaxed mt-2 mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>
          Обучаем применению нейросетей для бизнеса, контента и автоматизации.
        </p>
        <a
          href="https://chernikovgpt.ru"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 w-full text-xs font-bold py-2 rounded-lg transition-opacity hover:opacity-80"
          style={{ background: 'rgba(0,212,232,0.18)', color: '#00d4e8', border: '1px solid rgba(0,212,232,0.35)' }}
        >
          Узнать подробнее →
        </a>
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

      {/* Модалка: Согласие на обработку ПД */}
      {showConsentModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
          <div className="rounded-2xl w-full max-w-sm flex flex-col" style={{ background: '#0f1e3a', border: '1px solid rgba(0,212,232,0.3)', maxHeight: '85vh' }}>
            <div className="px-5 pt-5 pb-3" style={{ borderBottom: '1px solid rgba(0,212,232,0.15)' }}>
              <h3 className="font-bold text-white text-base leading-tight">Согласие на обработку персональных данных</h3>
            </div>
            <div className="overflow-y-auto px-5 py-4 flex-1" style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, lineHeight: 1.65 }}>
              <p className="mb-3">Я, как субъект персональных данных, оставляя свои данные в форме регистрации в веб-приложении для участия в розыгрыше, свободно, своей волей и в своем интересе даю согласие Индивидуальному предпринимателю Черникову Сергею Николаевичу (далее — Оператор) на обработку моих персональных данных на следующих условиях.</p>

              <p className="font-semibold text-white mb-1">1. Оператор персональных данных:</p>
              <p className="mb-3">ИП Черников Сергей Николаевич<br/>ИНН: 783801003680<br/>ОГРНИП: 321253600091137<br/>Адрес: 690025, Россия, Приморский край, г. Владивосток, СНТ Вербное, уч-к 16<br/>Email: chernikovru@yandex.ru</p>

              <p className="font-semibold text-white mb-1">2. Перечень персональных данных:</p>
              <ul className="mb-3 pl-3 space-y-0.5">
                {['имя', 'номер телефона', 'IP-адрес', 'user-agent', 'дата и время отправки формы', 'иные технические данные, автоматически передаваемые при использовании веб-приложения'].map(i => (
                  <li key={i}>— {i};</li>
                ))}
              </ul>

              <p className="font-semibold text-white mb-1">3. Цели обработки:</p>
              <ul className="mb-3 pl-3 space-y-0.5">
                {['регистрация пользователя в веб-приложении', 'присвоение уникального номера участника розыгрыша', 'проверка отсутствия повторной регистрации', 'связь с пользователем по вопросам участия', 'информирование о результатах розыгрыша', 'обработка обращений пользователя', 'обеспечение работоспособности и безопасности', 'ведение внутреннего учёта и журналов событий'].map(i => (
                  <li key={i}>— {i};</li>
                ))}
              </ul>

              <p className="font-semibold text-white mb-1">4. Перечень действий:</p>
              <p className="mb-3">Сбор, запись, систематизация, накопление, хранение, уточнение, извлечение, использование, передача в случаях, предусмотренных законодательством РФ, блокирование, удаление, уничтожение.</p>

              <p className="font-semibold text-white mb-1">5. Способы обработки:</p>
              <p className="mb-3">С использованием средств автоматизации, а также без использования таких средств.</p>

              <p className="font-semibold text-white mb-1">6. Срок действия согласия:</p>
              <p className="mb-3">До достижения целей обработки либо до момента отзыва субъектом персональных данных.</p>

              <p className="font-semibold text-white mb-1">7. Порядок отзыва:</p>
              <p className="mb-3">Направить обращение на: <span style={{ color: '#00d4e8' }}>chernikovru@yandex.ru</span>, указав имя, номер телефона и суть требования.</p>

              <p className="font-semibold text-white mb-1">8. Подтверждение:</p>
              <p>Проставляя отметку в чекбоксе и нажимая кнопку отправки, я подтверждаю, что ознакомлен(а) с условиями обработки персональных данных и даю на неё согласие.</p>
            </div>
            <div className="px-5 pb-5 pt-3">
              <button
                onClick={() => setShowConsentModal(false)}
                className="w-full font-bold py-2.5 rounded-xl transition"
                style={{ background: '#00d4e8', color: '#0d1b35' }}
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модалка: Политика конфиденциальности */}
      {showPrivacyModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
          <div className="rounded-2xl w-full max-w-sm flex flex-col" style={{ background: '#0f1e3a', border: '1px solid rgba(0,212,232,0.3)', maxHeight: '85vh' }}>
            <div className="px-5 pt-5 pb-3" style={{ borderBottom: '1px solid rgba(0,212,232,0.15)' }}>
              <h3 className="font-bold text-white text-base leading-tight">Политика конфиденциальности и обработки персональных данных</h3>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Дата редакции: 26 мая 2026 года</p>
            </div>
            <div className="overflow-y-auto px-5 py-4 flex-1" style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, lineHeight: 1.65 }}>

              <p className="font-semibold text-white mb-1">1. Общие положения</p>
              <p className="mb-3">1.1. Настоящая Политика определяет порядок обработки персональных данных пользователей веб-приложения для регистрации участников розыгрыша.<br/>1.2. Оператор — ИП Черников Сергей Николаевич.<br/>1.3. Обработка осуществляется в соответствии с ФЗ от 27.07.2006 № 152-ФЗ «О персональных данных».<br/>1.4. Политика применяется ко всей информации, получаемой при использовании Сервиса.</p>

              <p className="font-semibold text-white mb-1">2. Персональные данные, которые обрабатываются</p>
              <ul className="mb-3 pl-3 space-y-0.5">
                {['имя', 'номер телефона', 'IP-адрес', 'user-agent', 'дата и время заполнения и отправки формы', 'иные технические данные, необходимые для работы и безопасности Сервиса'].map(i => (
                  <li key={i}>— {i};</li>
                ))}
              </ul>
              <p className="mb-3">2.2. Оператор не обрабатывает специальные категории персональных данных и биометрические данные.</p>

              <p className="font-semibold text-white mb-1">3. Оператор персональных данных</p>
              <p className="mb-3">ИП Черников Сергей Николаевич<br/>ИНН: 783801003680<br/>ОГРНИП: 321253600091137<br/>Адрес: 690025, Россия, Приморский край, г. Владивосток, СНТ Вербное, уч-к 16<br/>Email: <span style={{ color: '#00d4e8' }}>chernikovru@yandex.ru</span></p>

              <p className="font-semibold text-white mb-1">4. Цели обработки</p>
              <ul className="mb-3 pl-3 space-y-0.5">
                {['регистрация пользователя в Сервисе', 'присвоение уникального номера участника', 'исключение повторной регистрации', 'связь с пользователем по вопросам участия', 'информирование о результатах розыгрыша', 'обработка запросов и обращений', 'обеспечение корректной работы Сервиса', 'защита от злоупотреблений и мошенничества', 'соблюдение требований законодательства РФ'].map(i => (
                  <li key={i}>— {i};</li>
                ))}
              </ul>

              <p className="font-semibold text-white mb-1">5. Правовые основания обработки</p>
              <ul className="mb-3 pl-3 space-y-0.5">
                {['согласие субъекта персональных данных', 'необходимость обработки для предоставления функционала Сервиса', 'исполнение обязанностей Оператора, предусмотренных законодательством РФ'].map(i => (
                  <li key={i}>— {i};</li>
                ))}
              </ul>

              <p className="font-semibold text-white mb-1">6. Порядок и условия обработки</p>
              <p className="mb-3">Обработка осуществляется законно и справедливо, ограничивается заранее определёнными целями. Оператор принимает необходимые технические и организационные меры защиты. Доступ предоставляется только уполномоченным лицам. Данные не передаются третьим лицам без согласия, кроме случаев, предусмотренных законодательством РФ.</p>

              <p className="font-semibold text-white mb-1">7. Сроки хранения</p>
              <p className="mb-3">Данные хранятся не дольше, чем требуют цели обработки. По достижении целей или при поступлении законного требования — удаляются или уничтожаются.</p>

              <p className="font-semibold text-white mb-1">8. Права субъекта персональных данных</p>
              <ul className="mb-3 pl-3 space-y-0.5">
                {['получать сведения об обработке своих данных', 'требовать уточнения, блокирования или уничтожения данных', 'отозвать согласие на обработку', 'направлять обращения Оператору', 'защищать свои права способами, предусмотренными законодательством РФ'].map(i => (
                  <li key={i}>— {i};</li>
                ))}
              </ul>

              <p className="font-semibold text-white mb-1">9. Порядок обращения</p>
              <p className="mb-3">Направьте обращение на: <span style={{ color: '#00d4e8' }}>chernikovru@yandex.ru</span>, указав имя, номер телефона и описание требования.</p>

              <p className="font-semibold text-white mb-1">10. Изменение Политики</p>
              <p>Оператор вправе вносить изменения. Новая редакция вступает в силу с момента размещения в Сервисе. Актуальная версия всегда доступна в интерфейсе.</p>
            </div>
            <div className="px-5 pb-5 pt-3">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="w-full font-bold py-2.5 rounded-xl transition"
                style={{ background: '#00d4e8', color: '#0d1b35' }}
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}