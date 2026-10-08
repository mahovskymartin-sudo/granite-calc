import type { OfferLine, OfferParams, Lom } from '../types';
import {
  PRODUCT_MAP, GRANITE_DENSITY, MAX_TONS_BULK, MAX_TONS_PALLET,
  getRadiusCoef, getPriceLevel, isArc, isBulk
} from './products';

// ────────────────────────────────────────────
// t/j calculations per category
// ────────────────────────────────────────────

export const calcTjPerUnit = (line: OfferLine): number => {
  const prod = line.productCode ? PRODUCT_MAP.get(line.productCode) : null;
  const w = line.width  ?? prod?.width  ?? 0;
  const h = line.height ?? prod?.height ?? 0;
  const d = line.depth  ?? prod?.depth  ?? 0;

  switch (line.category) {
    case 'SYP':
      return prod?.tjFixed ?? 0.2;

    case 'REZ_OB':
      // t/bm = š × v × d × 2.65  (obloukové — stejný vzorec, PLN násobí koef.R)
      return w * h * d * GRANITE_DENSITY;

    case 'LAM_OB':
      // t/bm = š × v × 2.65  (bez délky!)
      return w * h * GRANITE_DENSITY;

    case 'DLAZBA':
      // t/m² = tloušťka × 2.65
      return d * GRANITE_DENSITY;

    case 'SCHODY':
      // t/bm = š × v × d × 2.65
      return w * h * d * GRANITE_DENSITY;

    default:
      return 0;
  }
};

// ────────────────────────────────────────────
// PLN/j from pricelist (auto-lookup)
// ────────────────────────────────────────────

export const lookupPlnPerUnit = (
  line: OfferLine,
  loms: Lom[],
  tonsTotal: number
): number | null => {
  if (!line.productCode) return null;
  const lom = loms.find(l => l.id === line.lomId);
  if (!lom) return null;
  const prices = lom.prices[line.productCode];
  if (!prices) return null;

  // U lámaných: ceníková cena je PLN/t, je potřeba přepočítat níže
  const level = getPriceLevel(line.category, line.category === 'SYP' ? tonsTotal : line.quantity);
  return prices[level] ?? null;
};

// ────────────────────────────────────────────
// Full line calculation
// ────────────────────────────────────────────

export interface CalcResult {
  tjPerUnit: number;
  tonsTotal: number;
  trucksCount: number;
  rCoef: number | undefined;
  pcsPerTon: number | undefined;  // pro lámané
  plnPerUnit: number;             // finální PLN/j (ceník nebo přepsané)
  transportPerUnit: number;
  czkBasePerUnit: number;
  priceWithMargin: number;
  totalCzk: number;
}

export const calcLine = (
  line: OfferLine,
  params: OfferParams,
  loms: Lom[]
): CalcResult => {
  const tj = calcTjPerUnit(line);
  const tonsTotal = line.quantity * tj;

  const maxTons = isBulk(line.category) ? MAX_TONS_BULK : MAX_TONS_PALLET;
  const trucksCount = tonsTotal > 0 ? Math.ceil(tonsTotal / maxTons) : 0;

  // Transport per unit
  const truckPrice = isBulk(line.category)
    ? params.truckPriceBulk
    : params.truckPricePallet;
  const transportTotal = trucksCount * truckPrice;
  const transportPerUnit = line.quantity > 0 && tonsTotal > 0
    ? (transportTotal * (tj / (tonsTotal / line.quantity))) / 1
    : 0;
  // Simplified: distribute transport proportionally by tons share
  const transportPerUnitFinal = line.quantity > 0
    ? transportTotal / line.quantity
    : 0;

  // PLN/j (prefer manual override, else lookup)
  let plnPerUnit = line.plnPerUnit ?? 0;
  if (!line.plnPerUnit) {
    plnPerUnit = lookupPlnPerUnit(line, loms, tonsTotal) ?? 0;
  }

  // Koeficient R (obloukové)
  let rCoef: number | undefined;
  let pcsPerTon: number | undefined;
  let czkBase: number;

  if (isArc(line.productCode ?? '' as any)) {
    rCoef = line.radiusR != null ? getRadiusCoef(line.radiusR) : 1;
    // (PLN/bm × koef.R × kurz) + doprava/bm) × marže
    czkBase = plnPerUnit * rCoef * params.exchangeRate;
  } else if (line.category === 'LAM_OB') {
    // PLN ceník = PLN/t → přepočet na bm
    // ks/t = FLOOR(1 / tj, 1)
    pcsPerTon = tj > 0 ? Math.floor(1 / tj) : 0;
    const plnPerBm = pcsPerTon > 0 ? plnPerUnit / pcsPerTon : 0;
    czkBase = plnPerBm * params.exchangeRate;
  } else {
    czkBase = plnPerUnit * params.exchangeRate;
  }

  const priceWithMargin = (czkBase + transportPerUnitFinal) * (1 + line.margin);
  const totalCzk = line.quantity * priceWithMargin;

  return {
    tjPerUnit: tj,
    tonsTotal,
    trucksCount,
    rCoef,
    pcsPerTon,
    plnPerUnit,
    transportPerUnit: transportPerUnitFinal,
    czkBasePerUnit: czkBase,
    priceWithMargin,
    totalCzk,
  };
};

// ────────────────────────────────────────────
// Offer total
// ────────────────────────────────────────────

export const calcOfferTotal = (
  lines: OfferLine[],
  params: OfferParams,
  loms: Lom[]
): number => {
  return lines.reduce((sum, line) => {
    if (!line.quantity) return sum;
    const r = calcLine(line, params, loms);
    return sum + r.totalCzk;
  }, 0);
};

// ────────────────────────────────────────────
// Format helpers
// ────────────────────────────────────────────

export const fmt = {
  czk: (n: number) => new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(n),
  pln: (n: number) => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', maximumFractionDigits: 2 }).format(n),
  num: (n: number, dec = 3) => new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: dec }).format(n),
  pct: (n: number) => `${Math.round(n * 100)} %`,
};
