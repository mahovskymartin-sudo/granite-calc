import type { OfferParams } from '../../../../shared/types';

interface Props {
  customer: string; setCustomer: (v: string) => void;
  date: string; setDate: (v: string) => void;
  validDays: number; setValidDays: (v: number) => void;
  params: OfferParams; setParams: (p: Partial<OfferParams>) => void;
}

export default function OfferHeader({ customer, setCustomer, date, setDate, validDays, setValidDays, params, setParams }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 p-4 border-b border-stone-800">
      {/* Left: offer info */}
      <div className="space-y-2">
        <div className="label mb-2">Nabídka</div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="label block mb-1">Zákazník</label>
            <input value={customer} onChange={e => setCustomer(e.target.value)} className="w-full" placeholder="Název zákazníka" />
          </div>
          <div>
            <label className="label block mb-1">Datum</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full" />
          </div>
          <div>
            <label className="label block mb-1">Platnost (dní)</label>
            <input type="number" value={validDays} onChange={e => setValidDays(parseInt(e.target.value) || 14)} className="w-full" />
          </div>
        </div>
      </div>

      {/* Right: params */}
      <div className="space-y-2">
        <div className="label mb-2">Parametry</div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="label block mb-1">Kurz PLN→CZK</label>
            <input type="number" step="0.01" value={params.exchangeRate}
              onChange={e => setParams({ exchangeRate: parseFloat(e.target.value) || 0 })}
              className="w-full font-mono" />
          </div>
          <div>
            <label className="label block mb-1">Kamion sypané (Kč)</label>
            <input type="number" step="100" value={params.truckPriceBulk}
              onChange={e => setParams({ truckPriceBulk: parseFloat(e.target.value) || 0 })}
              className="w-full font-mono" />
          </div>
          <div>
            <label className="label block mb-1">Kamion paletové (Kč)</label>
            <input type="number" step="100" value={params.truckPricePallet}
              onChange={e => setParams({ truckPricePallet: parseFloat(e.target.value) || 0 })}
              className="w-full font-mono" />
          </div>
          <div>
            <label className="label block mb-1">Marže sypané (%)</label>
            <input type="number" step="1" value={Math.round(params.defaultMarginBulk * 100)}
              onChange={e => setParams({ defaultMarginBulk: (parseFloat(e.target.value) || 0) / 100 })}
              className="w-full font-mono" />
          </div>
          <div>
            <label className="label block mb-1">Marže paletové (%)</label>
            <input type="number" step="1" value={Math.round(params.defaultMarginPallet * 100)}
              onChange={e => setParams({ defaultMarginPallet: (parseFloat(e.target.value) || 0) / 100 })}
              className="w-full font-mono" />
          </div>
        </div>
      </div>
    </div>
  );
}
