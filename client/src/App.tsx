import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useStore } from './store';
import { api } from './api';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import NewOfferPage from './pages/NewOfferPage';
import HistoryPage from './pages/HistoryPage';
import PricelistPage from './pages/PricelistPage';
import SettingsPage from './pages/SettingsPage';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const user = useStore(s => s.user);
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const { user, setUser, setParams, setLoms } = useStore();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    api.auth.me().then(setUser).catch(() => localStorage.removeItem('token'));

    // Load global settings & pricelist
    api.settings.get()
      .then(s => setParams({
        exchangeRate: s.exchangeRate,
        truckPriceBulk: s.truckPriceBulk,
        truckPricePallet: s.truckPricePallet,
        defaultMarginBulk: s.defaultMarginBulk,
        defaultMarginPallet: s.defaultMarginPallet,
      }))
      .catch(() => {});

    api.pricelist.list()
      .then(loms => { if (loms.length) setLoms(loms); })
      .catch(() => {});
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<RequireAuth><Layout /></RequireAuth>}>
        <Route index element={<Navigate to="/offer/new" replace />} />
        <Route path="offer/new" element={<NewOfferPage />} />
        <Route path="offer/:id" element={<NewOfferPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="pricelist" element={<PricelistPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
