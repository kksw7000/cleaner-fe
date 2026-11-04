import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/members', label: 'Members', icon: '👥', end: false },
  { to: '/admin/posts', label: 'Posts', icon: '📝', end: false },
  { to: '/admin/services', label: 'Services', icon: '🧹', end: false },
  { to: '/admin/reservations', label: 'Reservations', icon: '📅', end: false },
];

export default function AdminLayout() {
  const { user, isLoggedIn } = useAuthStore();
  const navigate = useNavigate();

  if (!isLoggedIn || user?.role !== 'ADMIN') { navigate('/login'); return null; }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-56 bg-[#060F1E] text-white flex flex-col shrink-0">
        <div className="h-16 flex items-center px-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-white/10 border border-white/20 flex items-center justify-center text-xs font-black" style={{ fontFamily: 'Outfit' }}>C</div>
            <span className="font-bold text-sm tracking-wide" style={{ fontFamily: 'Outfit' }}>ADMIN</span>
          </div>
        </div>
        <nav className="flex-1 py-4">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({ isActive }) => `flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${isActive ? 'bg-white/10 text-white font-semibold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10 text-xs text-slate-500">{user?.email}</div>
      </aside>
      <main className="flex-1 overflow-auto"><Outlet /></main>
    </div>
  );
}
