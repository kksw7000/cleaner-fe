import { Link, Navigate, NavLink, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

const navItems = [
  { to: '/admin', label: '대시보드', icon: '📊', end: true },
  { to: '/admin/members', label: '회원 관리', icon: '👥', end: false },
  { to: '/admin/posts', label: '게시글 관리', icon: '📝', end: false },
  { to: '/admin/services', label: '서비스 관리', icon: '🧹', end: false },
  { to: '/admin/reservations', label: '예약 관리', icon: '📅', end: false },
];

/** 관리자 공통 내비게이션과 하위 화면 영역을 구성합니다. */
export default function AdminLayout() {
  const { user, isLoggedIn } = useAuthStore();

  // 화면 접근은 편의상 먼저 막고, 실제 권한 검증은 반드시 서버에서도 수행해야 합니다.
  if (!isLoggedIn || user?.role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-56 bg-[#060F1E] text-white flex flex-col shrink-0">
        <div className="h-16 flex items-center px-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-white/10 border border-white/20 flex items-center justify-center text-xs font-black" style={{ fontFamily: 'Outfit' }}>C</div>
            <span className="font-bold text-sm tracking-wide">관리자</span>
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
        <div className="border-t border-white/10">
          <Link to="/" className="flex items-center gap-3 px-5 py-3 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-white">
            <span aria-hidden="true">🏠</span>
            홈으로
          </Link>
          <div className="p-4 text-xs text-slate-500">{user?.email}</div>
        </div>
      </aside>
      <main className="flex-1 overflow-auto"><Outlet /></main>
    </div>
  );
}
