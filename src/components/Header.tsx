import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { categoryLabels, type ServiceCategory } from '@/data/mockData';

const categories = Object.keys(categoryLabels) as ServiceCategory[];

export default function Header() {
  const { isLoggedIn, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinkCls = (path: string) =>
    `text-sm transition-colors ${isActive(path) ? 'text-white font-semibold' : 'text-slate-300 hover:text-white'}`;

  return (
    <header className="sticky top-0 z-50 bg-[#0B1F3A] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="lg:hidden font-bold text-lg tracking-wide text-white"
        >
          정오클린케어
        </Link>

        {/* 데스크톱 메뉴 */}
        <nav className="hidden lg:flex items-center gap-7">
          <Link to="/" className={navLinkCls('/')}>정오클린케어</Link>
          {/* 청소 서비스 메뉴 */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setServicesOpen(!servicesOpen)}
              className={`text-sm transition-colors flex items-center gap-1 ${location.pathname.startsWith('/services') ? 'text-white font-semibold' : 'text-slate-300 hover:text-white'}`}
            >
              청소 서비스
              <svg className={`w-3.5 h-3.5 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {servicesOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-[#0B1F3A] border border-white/10 rounded-lg shadow-2xl py-1 z-50">
                <Link to="/services" onClick={() => setServicesOpen(false)} className="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors font-medium border-b border-white/10">
                  전체 서비스
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    to={`/services/${cat.toLowerCase()}`}
                    onClick={() => setServicesOpen(false)}
                    className="block px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    {categoryLabels[cat]}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/board" className={navLinkCls('/board')}>게시판</Link>
          <Link to="/reservation" className={navLinkCls('/reservation')}>예약</Link>
        </nav>

        {/* 로그인 상태별 메뉴 */}
        <div className="hidden lg:flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link to="/mypage" className="text-sm text-slate-300 hover:text-white transition-colors">{user?.nickname} 님</Link>
              {user?.role === 'ADMIN' && (
                <Link to="/admin" className="text-sm text-slate-400 hover:text-white transition-colors">관리자</Link>
              )}
              <button onClick={handleLogout} className="text-sm px-4 py-1.5 border border-white/20 rounded text-slate-300 hover:text-white hover:border-white/40 transition-colors">
                로그아웃
              </button>
              <Link to="/reservation" className="text-sm px-5 py-2 bg-white text-[#0B1F3A] font-semibold rounded hover:bg-slate-100 transition-colors">
                예약하기
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-slate-300 hover:text-white transition-colors">로그인</Link>
              <Link to="/signup" className="text-sm px-5 py-2 bg-white text-[#0B1F3A] font-semibold rounded hover:bg-slate-100 transition-colors">
                회원가입
              </Link>
            </>
          )}
        </div>

        {/* 모바일 메뉴 버튼 */}
        <button className="lg:hidden p-2 text-slate-300 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {menuOpen && (
        <div className="lg:hidden bg-[#060F1E] border-t border-white/10 px-4 py-5 space-y-4 text-sm">
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">청소 서비스</p>
            <div className="space-y-2 pl-2">
              <Link to="/services" onClick={() => setMenuOpen(false)} className="block text-slate-400 hover:text-white">전체 서비스</Link>
              {categories.map((cat) => (
                <Link key={cat} to={`/services/${cat.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="block text-slate-500 hover:text-white text-xs">{categoryLabels[cat]}</Link>
              ))}
            </div>
          </div>
          <Link to="/board" onClick={() => setMenuOpen(false)} className="block text-slate-300 hover:text-white">게시판</Link>
          <Link to="/reservation" onClick={() => setMenuOpen(false)} className="block text-slate-300 hover:text-white">예약</Link>
          {isLoggedIn ? (
            <>
              <Link to="/mypage" onClick={() => setMenuOpen(false)} className="block text-slate-300 hover:text-white">마이페이지</Link>
              <button onClick={handleLogout} className="block text-slate-400 hover:text-white">로그아웃</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-slate-300 hover:text-white">로그인</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="block text-slate-300 hover:text-white">회원가입</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
