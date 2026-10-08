import { useState } from 'react';
import { useStore } from '../store';
import { PRODUCTS } from '../../../shared/utils/products';
import type { ProductCategory, LomId } from '../../../shared/types';
import { api } from '../api';

const CATS: { key: ProductCategory; label: string }[] = [
  { key: 'SYP',    label: 'Sypané kostky' },
  { key: 'REZ_OB', label: 'Řezané obrubníky' },
  { key: 'LAM_OB', label: 'Lámané obrubníky' },
  { key: 'DLAZBA', label: 'Dlažba / kostky' },
  { key: 'SCHODY', label: 'Schody' },
];

const HEADERS: Record<ProductCategory, string[]> = {
  SYP:    ['0–125 t', '126–250 t', '250+ t'],
  REZ_OB: ['0–500 bm', '501–1500 bm', '1500+ bm'],
  DLAZBA: ['0–300 m²', '301–1000 m²', '1000+ m²'],
  LAM_OB: ['PLN/t', '', ''],
  SCHODY: ['PLN/bm', '', ''],
};

const LOMS: LomId[] = ['Lom1', 'Lom2', 'Lom3', 'Lom4'];

export default function PricelistPage() {
  const { loms, setLoms } = useStore();
  const [saving, setSaving] = useState<string | null>(null);
  const [activeLom, setActiveLom] = useState<LomId>('Lom1');

  const lom = loms.find(l => l.id === activeLom)!;

  const updatePrice = (code: string, level: 'h1' | 'h2' | 'h3', val: string) => {
    const num = val === '' ? null : parseFloat(val);
    setLoms(loms.map(l => l.id !== activeLom ? l : {
      ...l,
      prices: {
        ...l.prices,
        [code]: { ...l.prices[code], [level]: num }
      }
    }));
  };

  const updateLomName = (name: string) => {
    setLoms(loms.map(l => l.id !== activeLom ? l : { ...l, name }));
  };

  const saveLom = async () => {
    setSaving(activeLom);
    try {
      await api.pricelist.updateLom(activeLom, lom);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-stone-800 bg-stone-900/50">
        <h1 className="text-sm font-medium text-stone-200">Ceníky</h1>
        <button onClick={saveLom} disabled={!!saving} className="btn-primary">
          {saving ? 'Ukládám…' : 'Uložit ceník'}
        </button>
      </div>

      {/* Lom tabs */}
      <div className="flex border-b border-stone-800 bg-stone-900/30">
        {LOMS.map(id => {
          const l = loms.find(x => x.id === id)!;
          return (
            <button
              key={id}
              onClick={() => setActiveLom(id)}
              className={`px-4 py-2 text-xs transition-colors border-b-2 ${
                activeLom === id
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              {l?.name || id}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-auto p-4">
        {/* Lom name */}
        <div className="flex items-center gap-3 mb-5">
          <label className="label whitespace-nowrap">Název lomu:</label>
          <input
            value={lom?.name || ''}
            onChange={e => updateLomName(e.target.value)}
            placeholder={activeLom}
            className="w-60"
          />
        </div>

        {/* Price tables per category */}
        {CATS.map(({ key, label }) => {
          const prods = PRODUCTS.filter(p => p.category === key);
          const headers = HEADERS[key];
          const hasThree = key !== 'LAM_OB' && key !== 'SCHODY';

          return (
            <div key={key} className="mb-6">
              <div className="label mb-2">{label}</div>
              <table className="calc-table" style={{ maxWidth: 600 }}>
                <thead>
                  <tr>
                    <th style={{ width: 260 }}>Produkt</th>
                    <th className="text-right">{headers[0]}</th>
                    {hasThree && <><th className="text-right">{headers[1]}</th><th className="text-right">{headers[2]}</th></>}
                  </tr>
                </thead>
                <tbody>
                  {prods.map(p => {
                    const prices = lom?.prices?.[p.code] ?? {};
                    return (
                      <tr key={p.code}>
                        <td className="text-stone-300">{p.name}</td>
                        <td>
                          <input type="number" min="0" step="any"
                            value={prices.h1 ?? ''}
                            onChange={e => updatePrice(p.code, 'h1', e.target.value)}
                            className="w-full text-right font-mono text-[11px]"
                          />
                        </td>
                        {hasThree && (
                          <>
                            <td>
                              <input type="number" min="0" step="any"
                                value={prices.h2 ?? ''}
                                onChange={e => updatePrice(p.code, 'h2', e.target.value)}
                                className="w-full text-right font-mono text-[11px]"
                              />
                            </td>
                            <td>
                              <input type="number" min="0" step="any"
                                value={prices.h3 ?? ''}
                                onChange={e => updatePrice(p.code, 'h3', e.target.value)}
                                className="w-full text-right font-mono text-[11px]"
                              />
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}
