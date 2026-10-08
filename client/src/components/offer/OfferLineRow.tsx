import { useStore } from '../../store';
import { PRODUCTS, isArc } from '../../../../shared/utils/products';
import { calcLine } from '../../../../shared/utils/calc';
import type { OfferLine, ProductCode, ProductCategory, Unit } from '../../../../shared/types';

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  SYP: 'Sypané', REZ_OB: 'Řezané/Obloukové', LAM_OB: 'Lámané',
  DLAZBA: 'Dlažba', SCHODY: 'Schody',
};

interface Props {
  line: OfferLine;
  onChange: (id: string, patch: Partial<OfferLine>) => void;
  onDelete: (id: string) => void;
  params: any;
}

const fmt = (n: number | undefined, dec = 0) =>
  n != null && isFinite(n) && n !== 0
    ? n.toLocaleString('cs-CZ', { minimumFractionDigits: dec, maximumFractionDigits: dec })
    : '—';

export default function OfferLineRow({ line, onChange, onDelete, params }: Props) {
  const loms = useStore(s => s.loms);
  const prod = PRODUCTS.find(p => p.code === line.productCode);

  const calc = line.quantity > 0
    ? calcLine(line, params, loms)
    : null;

  const isArcLine = line.productCode ? isArc(line.productCode) : false;
  const isBulkLine = line.category === 'SYP';

  const set = (patch: Partial<OfferLine>) => onChange(line.id, patch);

  return (
    <tr className="group">
      {/* Produkt */}
      <td style={{ minWidth: 220 }}>
        <select
          value={line.productCode ?? ''}
          onChange={e => {
            const code = e.target.value as ProductCode;
            const p = PRODUCTS.find(x => x.code === code);
            if (p) set({
              productCode: code,
              category: p.category,
              unit: p.unit,
              width: p.width, height: p.height, depth: p.depth,
              margin: p.category === 'SYP'
                ? params.defaultMarginBulk
                : params.defaultMarginPallet,
              plnPerUnit: null,
            });
          }}
          className="w-full text-[11px]"
        >
          <option value="">— vyberte —</option>
          {(['SYP', 'REZ_OB', 'LAM_OB', 'DLAZBA', 'SCHODY'] as ProductCategory[]).map(cat => (
            <optgroup key={cat} label={CATEGORY_LABELS[cat]}>
              {PRODUCTS.filter(p => p.category === cat).map(p => (
                <option key={p.code} value={p.code}>{p.name}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </td>

      {/* Lom */}
      <td style={{ width: 90 }}>
        <select value={line.lomId} onChange={e => set({ lomId: e.target.value as any })} className="w-full text-[11px]">
          {loms.map(l => <option key={l.id} value={l.id}>{l.name || l.id}</option>)}
        </select>
      </td>

      {/* Množství */}
      <td style={{ width: 90 }}>
        <div className="flex items-center gap-1">
          <input
            type="number" min="0" step="any"
            value={line.quantity || ''}
            onChange={e => set({ quantity: parseFloat(e.target.value) || 0 })}
            className="w-16 text-right"
          />
          {isBulkLine ? (
            <select
              value={line.unit}
              onChange={e => set({ unit: e.target.value as Unit })}
              className="text-[10px] w-10 px-1"
            >
              <option value="m²">m²</option>
              <option value="t">t</option>
            </select>
          ) : (
            <span className="text-stone-500 text-[10px] w-8">{line.unit}</span>
          )}
        </div>
      </td>

      {/* R (obloukové) */}
      <td style={{ width: 60 }}>
        {isArcLine ? (
          <input
            type="number" min="0" step="0.1"
            value={line.radiusR ?? ''}
            placeholder="R"
            onChange={e => set({ radiusR: parseFloat(e.target.value) || undefined })}
            className="w-full text-right text-[11px]"
          />
        ) : <span className="text-stone-700">—</span>}
      </td>

      {/* PLN/j */}
      <td style={{ width: 80 }}>
        <input
          type="number" min="0" step="any"
          value={line.plnPerUnit ?? calc?.plnPerUnit ?? ''}
          placeholder={calc?.plnPerUnit ? String(calc.plnPerUnit.toFixed(2)) : 'auto'}
          onChange={e => set({ plnPerUnit: e.target.value ? parseFloat(e.target.value) : null })}
          className="w-full text-right font-mono text-[11px]"
        />
      </td>

      {/* t/j (read-only) */}
      <td className="num text-stone-500" style={{ width: 60 }}>
        {calc ? fmt(calc.tjPerUnit, 4) : '—'}
      </td>

      {/* Tuny */}
      <td className="num text-stone-400" style={{ width: 60 }}>
        {calc ? fmt(calc.tonsTotal, 2) : '—'}
      </td>

      {/* Kamiony */}
      <td className="num text-stone-400 text-center" style={{ width: 50 }}>
        {calc ? calc.trucksCount || '—' : '—'}
      </td>

      {/* Koef R */}
      <td className="num text-stone-400" style={{ width: 50 }}>
        {isArcLine && calc?.rCoef ? `×${calc.rCoef}` : '—'}
      </td>

      {/* Doprava/j */}
      <td className="num text-stone-400" style={{ width: 75 }}>
        {calc ? fmt(calc.transportPerUnit, 0) : '—'}
      </td>

      {/* CZK/j základ */}
      <td className="num text-stone-300" style={{ width: 80 }}>
        {calc ? fmt(calc.czkBasePerUnit, 2) : '—'}
      </td>

      {/* Marže */}
      <td style={{ width: 65 }}>
        <div className="flex items-center">
          <input
            type="number" min="0" max="100" step="1"
            value={Math.round(line.margin * 100)}
            onChange={e => set({ margin: (parseFloat(e.target.value) || 0) / 100 })}
            className="w-10 text-right font-mono text-[11px]"
          />
          <span className="text-stone-500 text-[10px] ml-0.5">%</span>
        </div>
      </td>

      {/* Cena s marží/j */}
      <td className="num text-amber-400 font-medium" style={{ width: 90 }}>
        {calc ? fmt(calc.priceWithMargin, 2) : '—'}
      </td>

      {/* Celkem */}
      <td className="num text-amber-300 font-semibold" style={{ width: 100 }}>
        {calc ? fmt(calc.totalCzk, 0) + ' Kč' : '—'}
      </td>

      {/* Delete */}
      <td style={{ width: 30 }}>
        <button
          onClick={() => onDelete(line.id)}
          className="opacity-0 group-hover:opacity-100 text-stone-600 hover:text-red-400 transition-all text-sm"
        >
          ×
        </button>
      </td>
    </tr>
  );
}
