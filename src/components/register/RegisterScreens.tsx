import RegisterPageWrapper from './RegisterPageWrapper';

interface SuccessScreenProps {
  ticketNumber: number | null;
}

export function SuccessScreen({ ticketNumber }: SuccessScreenProps) {
  return (
    <RegisterPageWrapper>
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
    </RegisterPageWrapper>
  );
}

interface DuplicateScreenProps {
  onBack: () => void;
}

export function DuplicateScreen({ onBack }: DuplicateScreenProps) {
  return (
    <RegisterPageWrapper>
      <div className="rounded-3xl p-8 text-center" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(0,212,232,0.25)', backdropFilter: 'blur(12px)' }}>
        <div className="text-6xl mb-4">📱</div>
        <h2 className="text-2xl font-bold text-white mb-3">Вы уже участвуете!</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)' }}>Этот номер телефона уже зарегистрирован в розыгрыше.</p>
        <button
          onClick={onBack}
          className="mt-6 text-sm underline transition"
          style={{ color: '#00d4e8' }}
        >
          Попробовать другой номер
        </button>
      </div>
    </RegisterPageWrapper>
  );
}

interface ErrorScreenProps {
  onBack: () => void;
}

export function ErrorScreen({ onBack }: ErrorScreenProps) {
  return (
    <RegisterPageWrapper>
      <div className="rounded-3xl p-8 text-center" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(0,212,232,0.25)', backdropFilter: 'blur(12px)' }}>
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-white mb-3">Что-то пошло не так</h2>
        <p className="mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>Не удалось зарегистрироваться. Попробуйте ещё раз.</p>
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-xl font-semibold transition"
          style={{ background: '#00d4e8', color: '#0d1b35' }}
        >
          Попробовать снова
        </button>
      </div>
    </RegisterPageWrapper>
  );
}
