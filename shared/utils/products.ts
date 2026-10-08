import type { ProductDef, ProductCode, ProductCategory } from '../types';

export const PRODUCTS: ProductDef[] = [
  // --- SYPANÉ ---
  { code: 'KOS_46',   name: 'Štípané žulové kostky 4/6 cm, sypané',   namePL: 'Kostka granitowa łupana 4/6 cm',   category: 'SYP', unit: 'm²', tjFixed: 0.125 },
  { code: 'KOS_811',  name: 'Štípané žulové kostky 8/11 cm, sypané',  namePL: 'Kostka granitowa łupana 8/11 cm',  category: 'SYP', unit: 'm²', tjFixed: 0.200 },
  { code: 'KOS_1517', name: 'Štípané žulové kostky 15/17 cm, sypané', namePL: 'Kostka granitowa łupana 15/17 cm', category: 'SYP', unit: 'm²', tjFixed: 0.400 },

  // --- ŘEZANÉ OBRUBNÍKY (PLN/bm, t/bm = š × v × d × 2.65) ---
  { code: 'OP1', name: 'Žul. řez. obrubník OP1 32/24/100 cm', namePL: 'Krawężnik gran. cięty 32/24/100', category: 'REZ_OB', unit: 'bm', width: 0.32, height: 0.24, depth: 1.0 },
  { code: 'OP2', name: 'Žul. řez. obrubník OP2 30/20/100 cm', namePL: 'Krawężnik gran. cięty 30/20/100', category: 'REZ_OB', unit: 'bm', width: 0.30, height: 0.20, depth: 1.0 },
  { code: 'OP3', name: 'Žul. řez. obrubník OP3 25/20/100 cm', namePL: 'Krawężnik gran. cięty 25/20/100', category: 'REZ_OB', unit: 'bm', width: 0.25, height: 0.20, depth: 1.0 },
  { code: 'OP4', name: 'Žul. řez. obrubník OP4 20/25/100 cm', namePL: 'Krawężnik gran. cięty 20/25/100', category: 'REZ_OB', unit: 'bm', width: 0.20, height: 0.25, depth: 1.0 },
  { code: 'OP5', name: 'Žul. řez. obrubník OP5 20/20/100 cm', namePL: 'Krawężnik gran. cięty 20/20/100', category: 'REZ_OB', unit: 'bm', width: 0.20, height: 0.20, depth: 1.0 },
  { code: 'OP6', name: 'Žul. řez. obrubník OP6 15/25/100 cm', namePL: 'Krawężnik gran. cięty 15/25/100', category: 'REZ_OB', unit: 'bm', width: 0.15, height: 0.25, depth: 1.0 },
  { code: 'OP7', name: 'Žul. řez. obrubník OP7 12/25/100 cm', namePL: 'Krawężnik gran. cięty 12/25/100', category: 'REZ_OB', unit: 'bm', width: 0.12, height: 0.25, depth: 1.0 },

  // --- OBLOUKOVÉ (stejné rozměry jako řezané + koef. R) ---
  { code: 'OP1_OBL', name: 'Žul. řez. oblouk. obrubník OP1 32/24', namePL: 'Krawężnik łukowy 32/24', category: 'REZ_OB', unit: 'bm', width: 0.32, height: 0.24, depth: 1.0 },
  { code: 'OP2_OBL', name: 'Žul. řez. oblouk. obrubník OP2 30/20', namePL: 'Krawężnik łukowy 30/20', category: 'REZ_OB', unit: 'bm', width: 0.30, height: 0.20, depth: 1.0 },
  { code: 'OP3_OBL', name: 'Žul. řez. oblouk. obrubník OP3 25/20', namePL: 'Krawężnik łukowy 25/20', category: 'REZ_OB', unit: 'bm', width: 0.25, height: 0.20, depth: 1.0 },
  { code: 'OP4_OBL', name: 'Žul. řez. oblouk. obrubník OP4 20/25', namePL: 'Krawężnik łukowy 20/25', category: 'REZ_OB', unit: 'bm', width: 0.20, height: 0.25, depth: 1.0 },
  { code: 'OP5_OBL', name: 'Žul. řez. oblouk. obrubník OP5 20/20', namePL: 'Krawężnik łukowy 20/20', category: 'REZ_OB', unit: 'bm', width: 0.20, height: 0.20, depth: 1.0 },
  { code: 'OP6_OBL', name: 'Žul. řez. oblouk. obrubník OP6 15/25', namePL: 'Krawężnik łukowy 15/25', category: 'REZ_OB', unit: 'bm', width: 0.15, height: 0.25, depth: 1.0 },

  // --- LÁMANÉ OBRUBNÍKY (PLN/t, t/bm = š × v × 2.65, bez délky) ---
  { code: 'KS1', name: 'Žul. lám. obrubník KS1 18/20/40-60 cm', namePL: 'Krawężnik gran. łamany 18/20', category: 'LAM_OB', unit: 'bm', width: 0.18, height: 0.20 },
  { code: 'KS2', name: 'Žul. lám. obrubník KS2 16/20/40-60 cm', namePL: 'Krawężnik gran. łamany 16/20', category: 'LAM_OB', unit: 'bm', width: 0.16, height: 0.20 },
  { code: 'KS3', name: 'Žul. lám. obrubník KS3 13/20/40-60 cm', namePL: 'Krawężnik gran. łamany 13/20', category: 'LAM_OB', unit: 'bm', width: 0.13, height: 0.20 },
  { code: 'G3',  name: 'Žul. lám. obrubník G3 10/20/40-60 cm',  namePL: 'Krawężnik gran. łamany 10/20',  category: 'LAM_OB', unit: 'bm', width: 0.10, height: 0.20 },

  // --- DLAŽBA / KOSTKY (PLN/m², t/m² = tloušťka × 2.65) ---
  { code: 'DLAZ_1',   name: 'Žul. dlažba řez. 10×10 cm, síla 5 cm',    namePL: 'Kostka gran. cięta',           category: 'DLAZBA', unit: 'm²', depth: 0.05 },
  { code: 'KOST_RST', name: 'Žul. kostka řez.-štíp. 6/6/4 cm',         namePL: 'Kostka gran. cięto-łupana 6/6/4', category: 'DLAZBA', unit: 'm²', depth: 0.04 },

  // --- SCHODY ---
  { code: 'SCHOD_1', name: 'Žul. schod řez. tryskáný 30/15/100 cm', namePL: 'Schody granitowe cięte',      category: 'SCHODY', unit: 'bm', width: 0.30, height: 0.15, depth: 1.0 },
  { code: 'OBKL_1',  name: 'Žul. obklad schodu 30/3/100 cm',         namePL: 'Obłożenie schodów gran.',    category: 'SCHODY', unit: 'bm', width: 0.30, height: 0.03, depth: 1.0 },
];

export const PRODUCT_MAP = new Map<ProductCode, ProductDef>(
  PRODUCTS.map(p => [p.code, p])
);

export const GRANITE_DENSITY = 2.65; // t/m³

// Max tons per truck
export const MAX_TONS_BULK = 25;    // vana sypané
export const MAX_TONS_PALLET = 24;  // plachtový paletové

// Obloukový koeficient dle R
export const getRadiusCoef = (r: number): number => {
  if (r <= 0.7) return 3.0;
  if (r <= 0.9) return 2.5;
  if (r <= 2.0) return 2.2;
  if (r <= 3.0) return 2.1;
  if (r <= 5.0) return 2.0;
  return 1.8;
};

// Množstevní hladina
export const getPriceLevel = (category: ProductCategory, quantity: number): 'h1' | 'h2' | 'h3' => {
  switch (category) {
    case 'SYP':
      if (quantity <= 125) return 'h1';
      if (quantity <= 250) return 'h2';
      return 'h3';
    case 'REZ_OB':
      if (quantity <= 500)  return 'h1';
      if (quantity <= 1500) return 'h2';
      return 'h3';
    case 'DLAZBA':
      if (quantity <= 300)  return 'h1';
      if (quantity <= 1000) return 'h2';
      return 'h3';
    case 'LAM_OB':
    case 'SCHODY':
      return 'h1'; // jedna hladina
  }
};

export const isArc = (code: ProductCode): boolean =>
  code.endsWith('_OBL');

export const isBulk = (category: ProductCategory): boolean =>
  category === 'SYP';
