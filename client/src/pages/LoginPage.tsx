import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useStore } from '../store';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.auth.login(email, password);
      localStorage.setItem('token', res.token);
      setUser(res.user);
      navigate('/offer/new');
    } catch (err: any) {
      setError(err.message || 'Chyba přihlášení');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center">
      <div className="w-80">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="text-amber-500 font-mono text-2xl tracking-widest">GRANITE</div>
          <div className="text-stone-500 font-mono text-xs tracking-widest mt-1">KALKULÁTOR NABÍDEK</div>
        </div>

        <div className="card p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full"
                autoFocus
                required
              />
            </div>
            <div>
              <label className="label block mb-1">Heslo</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full"
                required
              />
            </div>
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
              {loading ? 'Přihlašuji…' : 'Přihlásit se'}
            </button>
          </form>
        </div>

        <p className="text-center text-stone-600 text-[10px] mt-6 font-mono">
          © Granite Calc · max 5 uživatelů
        </p>
      </div>
    </div>
  );
}
