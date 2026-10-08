import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useStore } from '../../store';

const NAV = [
  { to: '/offer/new', label: 'Nová nabídka',  icon: '✦' },
  { to: '/history',   label: 'Historie',       icon: '◈' },
  { to: '/pricelist', label: 'Ceníky',         icon: '◉' },
  { to: '/settings',  label: 'Nastavení',      icon: '◎' },
];

export default function Layout() {
  const { user, logout } = useStore();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-48 flex-shrink-0 bg-stone-900 border-r border-stone-800 flex flex-col">
        {/* Logo */}
        <div className="px-4 py-5 border-b border-stone-800">
          <div className="text-amber-500 font-mono text-xs tracking-widest uppercase">Granite</div>
          <div className="text-stone-300 font-mono text-xs tracking-widest">Calc</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3">
          {NAV.map(n => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-4 py-2.5 text-xs transition-colors
                 ${isActive
                   ? 'text-amber-400 bg-stone-800/70'
                   : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
                 }`
              }
            >
              <span className="text-[10px] opacity-70">{n.icon}</span>
              {n.label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="px-4 py-3 border-t border-stone-800">
          <div className="text-stone-400 text-[10px] truncate mb-1">{user?.email}</div>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="text-stone-500 hover:text-stone-300 text-[10px] transition-colors"
          >
            Odhlásit se
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-stone-950">
        <Outlet />
      </main>
    </div>
  );
}
