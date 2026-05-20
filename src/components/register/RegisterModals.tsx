interface AdminModalProps {
  password: string;
  error: string;
  loading: boolean;
  onPasswordChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export function AdminModal({ password, error, loading, onPasswordChange, onSubmit, onClose }: AdminModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="rounded-2xl shadow-2xl p-6 w-full max-w-xs" style={{ background: '#1a2f5a', border: '1px solid rgba(0,212,232,0.3)' }}>
        <div className="text-center mb-4">
          <div className="text-3xl mb-1">🔐</div>
          <h3 className="font-bold text-white">Вход для администратора</h3>
        </div>
        <form onSubmit={onSubmit}>
          <input
            type="password"
            value={password}
            onChange={e => { onPasswordChange(e.target.value); }}
            placeholder="Пароль"
            autoFocus
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(0,212,232,0.3)', color: 'white', outline: 'none' }}
            className="w-full rounded-xl px-4 py-3 placeholder-white/30 mb-3"
            disabled={loading}
          />
          {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full font-bold py-3 rounded-xl transition disabled:opacity-60 mb-2"
            style={{ background: '#00d4e8', color: '#0d1b35' }}
          >
            {loading ? 'Вхожу...' : 'Войти'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full text-sm py-1 transition"
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            Отмена
          </button>
        </form>
      </div>
    </div>
  );
}

interface ConsentModalProps {
  onClose: () => void;
}

export function ConsentModal({ onClose }: ConsentModalProps) {
  return (
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
            onClick={onClose}
            className="w-full font-bold py-2.5 rounded-xl transition"
            style={{ background: '#00d4e8', color: '#0d1b35' }}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}

interface PrivacyModalProps {
  onClose: () => void;
}

export function PrivacyModal({ onClose }: PrivacyModalProps) {
  return (
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
            onClick={onClose}
            className="w-full font-bold py-2.5 rounded-xl transition"
            style={{ background: '#00d4e8', color: '#0d1b35' }}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
