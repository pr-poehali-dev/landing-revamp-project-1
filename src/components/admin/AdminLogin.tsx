interface Props {
  password: string;
  setPassword: (v: string) => void;
  loginError: string;
  loginLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AdminLogin({ password, setPassword, loginError, loginLoading, onSubmit }: Props) {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🔐</div>
          <h1 className="text-xl font-bold text-white">Панель администратора</h1>
          <p className="text-gray-400 text-sm mt-1">Введите пароль для входа</p>
        </div>
        <form onSubmit={onSubmit}>
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
