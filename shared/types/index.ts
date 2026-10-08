// ============================================================
// SHARED TYPES — granite-calc
// ============================================================

// --- Product codes & categories ---

export type ProductCode =
  | 'KOS_46' | 'KOS_811' | 'KOS_1517'           // Sypané
  | 'OP1' | 'OP2' | 'OP3' | 'OP4' | 'OP5' | 'OP6' | 'OP7'  // Řezané
  | 'OP1_OBL' | 'OP2_OBL' | 'OP3_OBL' | 'OP4_OBL' | 'OP5_OBL' | 'OP6_OBL' // Obloukové
  | 'KS1' | 'KS2' | 'KS3' | 'G3'               // Lámané
  | 'DLAZ_1' | 'KOST_RST'                        // Dlažba
  | 'SCHOD_1' | 'OBKL_1';                        // Schody

export type ProductCategory = 'SYP' | 'REZ_OB' | 'LAM_OB' | 'DLAZBA' | 'SCHODY';

export type Unit = 'm²' | 't' | 'bm';

export type LomId = 'Lom1' | 'Lom2' | 'Lom3' | 'Lom4';

// --- Product definitions ---

export interface ProductDef {
  code: ProductCode;
  name: string;
  namePL: string;
  category: ProductCategory;
  unit: Unit;
  width?: number;   // š (m)
  height?: number;  // v (m)
  depth?: number;   // d/tl (m)
  tjFixed?: number; // fixní t/j (sypané)
}

// --- Pricelist ---

export interface PriceLevel {
  h1: number | null;
  h2: number | null;
  h3: number | null;
}

export interface LomPrices {
  [productCode: string]: PriceLevel;
}

export interface Lom {
  id: LomId;
  name: string;
  contact?: string;
  prices: LomPrices;
}

export interface Pricelist {
  loms: Lom[];
  updatedAt: string;
}

// --- Offer params ---

export interface OfferParams {
  exchangeRate: number;        // PLN → CZK
  truckPriceBulk: number;     // Kč / kamion sypané
  truckPricePallet: number;   // Kč / kamion paletové
  defaultMarginBulk: number;  // 0–1 (20% = 0.2)
  defaultMarginPallet: number;
}

// --- Offer line ---

export interface OfferLine {
  id: string;
  productCode: ProductCode | null;
  customName?: string;
  category: ProductCategory;
  unit: Unit;
  width?: number;
  height?: number;
  depth?: number;
  radiusR?: number;   // R (m) pro obloukové
  quantity: number;
  lomId: LomId;
  plnPerUnit: number | null;  // přepisatelné
  margin: number;             // 0–1
  // Computed (derived, not stored separately in DB):
  tjPerUnit?: number;
  tonsTotal?: number;
  trucksCount?: number;
  transportPerUnit?: number;
  czkBasePerUnit?: number;
  rCoef?: number;
  pcsPerTon?: number;        // pro lámané: ks/t
  priceWithMargin?: number;
  totalCzk?: number;
}

// --- Offer ---

export interface Offer {
  id: string;
  customer: string;
  date: string;        // ISO
  validDays: number;
  params: OfferParams;
  lines: OfferLine[];
  totalCzk: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// --- API responses ---

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
