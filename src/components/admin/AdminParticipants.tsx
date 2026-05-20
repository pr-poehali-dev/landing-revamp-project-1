import { getParticipantsCsvUrl } from '@/lib/api';

interface Participant {
  ticket_number: number;
  full_name: string;
  phone_normalized: string;
  status: string;
  created_at: string;
}

interface Props {
  token: string;
  participants: Participant[];
  search: string;
  setSearch: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  loadingPart: boolean;
  fetchParticipants: () => void;
}

export default function AdminParticipants({
  token, participants, search, setSearch,
  statusFilter, setStatusFilter, loadingPart, fetchParticipants,
}: Props) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && fetchParticipants()}
          placeholder="Поиск по имени или телефону..."
          className="flex-1 bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:border-violet-500"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-gray-900 border border-gray-700 text-white rounded-xl px-4 py-2 focus:outline-none"
        >
          <option value="">Все статусы</option>
          <option value="active">Активные</option>
          <option value="inactive">Неактивные</option>
        </select>
        <button
          onClick={fetchParticipants}
          className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-xl font-medium transition"
        >
          Найти
        </button>
        <a
          href={getParticipantsCsvUrl(token, { search, status: statusFilter })}
          download="participants.csv"
          className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl font-medium transition text-center text-sm"
        >
          📥 CSV
        </a>
      </div>
      {loadingPart ? (
        <div className="text-gray-400 py-8 text-center">Загрузка...</div>
      ) : participants.length === 0 ? (
        <div className="text-gray-400 py-8 text-center">Участников не найдено</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-800">
          <table className="w-full text-sm">
            <thead className="bg-gray-900">
              <tr>
                {['#', 'Имя', 'Телефон', 'Статус', 'Дата'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-gray-400 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {participants.map((p, i) => (
                <tr key={p.ticket_number} className={i % 2 === 0 ? 'bg-gray-900/40' : 'bg-gray-900/20'}>
                  <td className="px-4 py-3 font-bold text-violet-400">#{p.ticket_number}</td>
                  <td className="px-4 py-3 text-white">{p.full_name}</td>
                  <td className="px-4 py-3 text-gray-300">{p.phone_normalized}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.status === 'active' ? 'bg-green-900/60 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
                      {p.status === 'active' ? 'активен' : p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {p.created_at ? new Date(p.created_at).toLocaleString('ru-RU') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
