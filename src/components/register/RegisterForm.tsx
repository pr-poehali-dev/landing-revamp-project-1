interface FormErrors {
  name?: string;
  phone?: string;
  general?: string;
}

interface RegisterFormProps {
  name: string;
  phone: string;
  errors: FormErrors;
  loading: boolean;
  consentChecked: boolean;
  onNameChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onConsentChange: (v: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onOpenConsent: () => void;
  onOpenPrivacy: () => void;
}

export default function RegisterForm({
  name, phone, errors, loading, consentChecked,
  onNameChange, onPhoneChange, onConsentChange,
  onSubmit, onOpenConsent, onOpenPrivacy,
}: RegisterFormProps) {
  return (
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

      <form onSubmit={onSubmit} noValidate>
        <div className="mb-3">
          <label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.75)' }}>Ваше имя</label>
          <input
            type="text"
            value={name}
            onChange={e => onNameChange(e.target.value)}
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
            onChange={e => onPhoneChange(e.target.value)}
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
          onClick={() => onConsentChange(!consentChecked)}
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
          <button type="button" onClick={onOpenConsent} className="underline underline-offset-2 transition-opacity hover:opacity-80" style={{ color: '#00d4e8' }}>
            согласие
          </button>
          {' '}на обработку персональных данных на условиях, изложенных в{' '}
          <button type="button" onClick={onOpenPrivacy} className="underline underline-offset-2 transition-opacity hover:opacity-80" style={{ color: '#00d4e8' }}>
            Политике конфиденциальности
          </button>.
        </p>
      </div>

      <p className="text-center text-xs mt-2" style={{ color: 'rgba(255,255,255,0.25)' }}>Один номер телефона — один номерок участника</p>
    </div>
  );
}
