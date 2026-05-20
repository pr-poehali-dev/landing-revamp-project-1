import { useState } from 'react';
import { registerParticipant, adminLogin } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import RegisterPageWrapper from '@/components/register/RegisterPageWrapper';
import RegisterForm from '@/components/register/RegisterForm';
import { SuccessScreen, DuplicateScreen, ErrorScreen } from '@/components/register/RegisterScreens';
import { AdminModal, ConsentModal, PrivacyModal } from '@/components/register/RegisterModals';

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

  if (screen === 'success') return <SuccessScreen ticketNumber={ticketNumber} />;
  if (screen === 'duplicate') return <DuplicateScreen onBack={() => setScreen('form')} />;
  if (screen === 'error') return <ErrorScreen onBack={() => setScreen('form')} />;

  return (
    <RegisterPageWrapper>
      <RegisterForm
        name={name}
        phone={phone}
        errors={errors}
        loading={loading}
        consentChecked={consentChecked}
        onNameChange={v => { setName(v); setErrors(p => ({ ...p, name: undefined })); }}
        onPhoneChange={v => { setPhone(v); setErrors(p => ({ ...p, phone: undefined })); }}
        onConsentChange={setConsentChecked}
        onSubmit={handleSubmit}
        onOpenConsent={() => setShowConsentModal(true)}
        onOpenPrivacy={() => setShowPrivacyModal(true)}
      />

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

      <button
        onClick={() => { setShowAdminModal(true); setAdminError(''); setAdminPassword(''); }}
        className="fixed bottom-4 right-4 transition-opacity opacity-20 hover:opacity-50 text-white text-xs"
      >
        ⚙️
      </button>

      {showAdminModal && (
        <AdminModal
          password={adminPassword}
          error={adminError}
          loading={adminLoading}
          onPasswordChange={v => { setAdminPassword(v); setAdminError(''); }}
          onSubmit={handleAdminLogin}
          onClose={() => setShowAdminModal(false)}
        />
      )}
      {showConsentModal && <ConsentModal onClose={() => setShowConsentModal(false)} />}
      {showPrivacyModal && <PrivacyModal onClose={() => setShowPrivacyModal(false)} />}
    </RegisterPageWrapper>
  );
}
