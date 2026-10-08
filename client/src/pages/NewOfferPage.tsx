import { useState, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { useStore } from '../store';
import { api } from '../api';
import { calcLine } from '../../../shared/utils/calc';
import { generateEmailText } from '../../../shared/utils/emailExport';
import type { OfferLine, ProductCategory } from '../../../shared/types';
import OfferHeader from '../components/offer/OfferHeader';
import OfferLineRow from '../components/offer/OfferLineRow';

const makeEmptyLine = (params: any): OfferLine => ({
  id: nanoid(8),
  productCode: null,
  category: 'REZ_OB' as ProductCategory,
  unit: 'bm',
  quantity: 0,
  lomId: 'Lom1',
  plnPerUnit: null,
  margin: params.defaultMarginPallet,
});

const today = () => new Date().toISOString().slice(0, 10);

export default function NewOfferPage() {
  const { params, setParams, loms } = useStore();
  const [localParams, setLocalParams] = useState({ ...params });
  const [customer, setCustomer] = useState('');
  const [date, setDate] = useState(today());
  const [validDays, setValidDays] = useState(14);
  const [lines, setLines] = useState<OfferLine[]>([makeEmptyLine(params)]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const mergedParams = { ...params, ...localParams };

  const updateLine = useCallback((id: string, patch: Partial<OfferLine>) => {
    setLines(prev => prev.map(l => l.id === id ? { ...l, ...patch } : l));
  }, []);

  const deleteLine = useCallback((id: string) => {
    setLines(prev => prev.filter(l => l.id !== id));
  }, []);

  const addLine = () => {
    setLines(prev => [...prev, makeEmptyLine(mergedParams)]);
  };

  const totalCzk = lines.reduce((sum, line) => {
    if (!line.quantity || !line.productCode) return sum;
    return sum + calcLine(line, mergedParams, loms).totalCzk;
  }, 0);

  const handleSave = async () => {
    if (!customer) { alert('Zadejte zákazníka'); return; }
    setSaving(true);
    try {
      await api.offers.create({
        customer, date, validDays,
        params: mergedParams,
        lines: lines.filter(l => l.quantity > 0 && l.productCode),
        totalCzk,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCopyEmail = async () => {
    const offer = {
      id: '', customer, date, validDays,
      params: mergedParams,
      lines: lines.filter(l => l.quantity > 0 && l.productCode),
      totalCzk,
      createdAt: '', updatedAt: '', createdBy: '',
    };
    const text = generateEmailText(offer as any, loms);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    if (!confirm('Vymazat nabídku?')) return;
    setCustomer(''); setDate(today()); setValidDays(14);
    setLines([makeEmptyLine(mergedParams)]);
  };

  const activeLines = lines.filter(l => l.quantity > 0 && l.productCode);

  return (
    <div className="flex flex-col h-full">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-stone-800 bg-stone-900/50">
        <h1 className="text-sm font-medium text-stone-200">Nová nabídka</h1>
        <div className="flex items-center gap-2">
          <button onClick={handleReset} className="btn-ghost">Vymazat</button>
          <button onClick={handleCopyEmail} className="btn-ghost">
            {copied ? '✓ Zkopírováno' : 'Kopírovat email'}
          </button>
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? 'Ukládám…' : saved ? '✓ Uloženo' : 'Uložit nabídku'}
          </button>
        </div>
      </div>

      {/* Offer params */}
      <OfferHeader
        customer={customer} setCustomer={setCustomer}
        date={date} setDate={setDate}
        validDays={validDays} setValidDays={setValidDays}
        params={mergedParams}
        setParams={p => setLocalParams(prev => ({ ...prev, ...p }))}
      />

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="calc-table" style={{ minWidth: 1100 }}>
          <thead className="sticky top-0 bg-stone-950 z-10">
            <tr>
              <th>Produkt</th>
              <th>Lom</th>
              <th>Množství</th>
              <th>R (m)</th>
              <th>PLN/j</th>
              <th>t/j</th>
              <th>Tuny</th>
              <th>Kam.</th>
              <th>Koef.</th>
              <th>Dop./j Kč</th>
              <th>CZK/j</th>
              <th>Marže</th>
              <th>Cena/j Kč</th>
              <th>Celkem Kč</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {lines.map(line => (
              <OfferLineRow
                key={line.id}
                line={line}
                params={mergedParams}
                onChange={updateLine}
                onDelete={deleteLine}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="border-t border-stone-800 px-4 py-3 bg-stone-900/50 flex items-center justify-between">
        <button onClick={addLine} className="btn-ghost text-amber-500 hover:text-amber-400">
          + Přidat položku
        </button>

        <div className="flex items-center gap-6">
          {activeLines.length > 0 && (
            <span className="text-stone-500 text-xs">{activeLines.length} položek</span>
          )}
          <div className="text-right">
            <div className="label">Celková nabídková cena</div>
            <div className="text-xl font-semibold font-mono text-amber-400 mt-0.5">
              {totalCzk.toLocaleString('cs-CZ', { maximumFractionDigits: 0 })} Kč
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
