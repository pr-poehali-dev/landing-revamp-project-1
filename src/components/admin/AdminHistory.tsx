interface DrawHistoryItem {
  draw_id: number;
  title: string;
  prize_name: string;
  participants_count: number;
  started_at: string;
  winner_ticket: number;
  winner_name: string;
  winner_phone: string;
}

interface Props {
  history: DrawHistoryItem[];
}

const maskPhone = (phone: string) => {
  if (!phone) return '—';
  const digits = phone.replace(/\D/g, '');
  if (digits.length >= 11) return `+7 (${digits.slice(1, 4)}) ***-**-${digits.slice(-2)}`;
  return phone.slice(0, 3) + '***' + phone.slice(-2);
};

export default function AdminHistory({ history }: Props) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">История розыгрышей</h2>
      {history.length === 0 ? (
        <div className="text-gray-400 py-8 text-center">Розыгрышей ещё не проводилось</div>
      ) : (
        <div className="flex flex-col gap-4">
          {history.map(item => (
            <div key={item.draw_id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="font-bold text-white text-lg">{item.title}</div>
                  <div className="text-gray-400 text-sm">🎁 {item.prize_name}</div>
                  <div className="text-gray-500 text-xs mt-1">
                    {item.started_at ? new Date(item.started_at).toLocaleString('ru-RU') : '—'} · {item.participants_count} участников
                  </div>
                </div>
                {item.winner_name && (
                  <div className="bg-yellow-900/30 border border-yellow-700/40 rounded-xl p-3 text-right min-w-[160px]">
                    <div className="text-yellow-400 text-xs font-medium mb-1">Победитель</div>
                    <div className="text-white font-bold">{item.winner_name}</div>
                    <div className="text-gray-400 text-sm">{maskPhone(item.winner_phone)}</div>
                    <div className="text-yellow-400 font-bold">#{item.winner_ticket}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
