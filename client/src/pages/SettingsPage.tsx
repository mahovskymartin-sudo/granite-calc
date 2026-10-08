import { useState } from 'react';
import { useStore } from '../store';
import { api } from '../api';

export default function SettingsPage() {
  const { params, setParams } = useStore();
  const [local, setLocal] = useState({ ...params });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (patch: Partial<typeof local>) => setLocal(p => ({ ...p, ...patch }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.settings.update({
        exchangeRate: local.exchangeRate,
        truckPriceBulk: local.truckPriceBulk,
        truckPricePallet: local.truckPricePallet,
        defaultMarginBulk: local.defaultMarginBulk,
        defaultMarginPallet: local.defaultMarginPallet,
      });
      setParams(local);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-stone-800 bg-stone-900/50">
        <h1 className="text-sm font-medium text-stone-200">Nastavení</h1>
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          {saving ? 'Ukládám…' : saved ? '✓ Uloženo' : 'Uložit'}
        </button>
      </div>

      <div className="p-6 max-w-md space-y-6">
        <div>
          <div className="label mb-3">Výchozí parametry kalkulace</div>
          <div className="card p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label block mb-1">Kurz PLN → CZK</label>
                <input type="number" step="0.01" value={local.exchangeRate}
                  onChange={e => set({ exchangeRate: parseFloat(e.target.value) || 0 })}
                  className="w-full font-mono" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label block mb-1">Kamion sypané (Kč)</label>
                <input type="number" step="100" value={local.truckPriceBulk}
                  onChange={e => set({ truckPriceBulk: parseFloat(e.target.value) || 0 })}
                  className="w-full font-mono" />
              </div>
              <div>
                <label className="label block mb-1">Kamion paletové (Kč)</label>
                <input type="number" step="100" value={local.truckPricePallet}
                  onChange={e => set({ truckPricePallet: parseFloat(e.target.value) || 0 })}
                  className="w-full font-mono" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label block mb-1">Výchozí marže sypané (%)</label>
                <input type="number" step="1" value={Math.round(local.defaultMarginBulk * 100)}
                  onChange={e => set({ defaultMarginBulk: (parseFloat(e.target.value) || 0) / 100 })}
                  className="w-full font-mono" />
              </div>
              <div>
                <label className="label block mb-1">Výchozí marže paletové (%)</label>
                <input type="number" step="1" value={Math.round(local.defaultMarginPallet * 100)}
                  onChange={e => set({ defaultMarginPallet: (parseFloat(e.target.value) || 0) / 100 })}
                  className="w-full font-mono" />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="label mb-3">Tyto hodnoty se použijí jako výchozí pro každou novou nabídku</div>
          <p className="text-stone-500 text-xs">
            Parametry jde přepsat i přímo v nabídce. Ceníky lomů se nastavují v sekci Ceníky.
          </p>
        </div>
      </div>
    </div>
  );
}
