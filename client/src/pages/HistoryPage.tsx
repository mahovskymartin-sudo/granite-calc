import { useEffect, useState } from 'react';
import { api } from '../api';

export default function HistoryPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.offers.list()
      .then(setOffers)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Smazat nabídku?')) return;
    await api.offers.delete(id);
    setOffers(prev => prev.filter(o => o.id !== id));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-2.5 border-b border-stone-800 bg-stone-900/50">
        <h1 className="text-sm font-medium text-stone-200">Historie nabídek</h1>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {loading && <p className="text-stone-500 text-xs">Načítám…</p>}
        {!loading && offers.length === 0 && (
          <p className="text-stone-500 text-xs">Žádné nabídky zatím.</p>
        )}

        {offers.length > 0 && (
          <table className="calc-table" style={{ maxWidth: 900 }}>
            <thead>
              <tr>
                <th>Zákazník</th>
                <th>Datum</th>
                <th className="text-right">Celkem Kč</th>
                <th>Položek</th>
                <th>Vytvořeno</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {offers.map(o => (
                <tr key={o.id}>
                  <td className="text-stone-200 font-medium">{o.customer || '—'}</td>
                  <td className="text-stone-400">{new Date(o.date).toLocaleDateString('cs-CZ')}</td>
                  <td className="num text-amber-400 font-mono">
                    {o.totalCzk.toLocaleString('cs-CZ', { maximumFractionDigits: 0 })} Kč
                  </td>
                  <td className="text-stone-500 text-center">
                    {Array.isArray(o.lines) ? o.lines.length : '—'}
                  </td>
                  <td className="text-stone-500">
                    {new Date(o.createdAt).toLocaleDateString('cs-CZ')}
                  </td>
                  <td>
                    <button onClick={() => handleDelete(o.id)} className="btn-danger text-[10px]">
                      Smazat
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
