import { create } from 'zustand';
import type { OfferParams, OfferLine, Lom } from '../../../shared/types';

interface AppStore {
  user: any | null;
  setUser: (u: any) => void;
  logout: () => void;

  params: OfferParams;
  setParams: (p: Partial<OfferParams>) => void;

  loms: Lom[];
  setLoms: (l: Lom[]) => void;
}

const DEFAULT_PARAMS: OfferParams = {
  exchangeRate: 5.85,
  truckPriceBulk: 0,
  truckPricePallet: 0,
  defaultMarginBulk: 0.20,
  defaultMarginPallet: 0.12,
};

export const useStore = create<AppStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null });
  },

  params: DEFAULT_PARAMS,
  setParams: (p) => set(s => ({ params: { ...s.params, ...p } })),

  loms: [
    { id: 'Lom1', name: 'Lom 1', prices: {} },
    { id: 'Lom2', name: 'Lom 2', prices: {} },
    { id: 'Lom3', name: 'Lom 3', prices: {} },
    { id: 'Lom4', name: 'Lom 4', prices: {} },
  ] as Lom[],
  setLoms: (loms) => set({ loms }),
}));
