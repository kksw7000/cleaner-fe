import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { categoryLabels, type ServiceCategory } from '../data/mockData';

const categories = Object.keys(categoryLabels) as ServiceCategory[];

export default function Navbar() {
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
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setMenuOpen(false)}>
          <div className="w-8 h-8 rounded bg-white/10 border border-white/20 flex items-center justify-center">
            <span className="text-white text-sm font-black" style={{ fontFamily: 'Outfit' }}>C</span>
          </div>
          <span className="font-bold text-lg text-white tracking-wide" style={{ fontFamily: 'Outfit' }}>CLEANER</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7">
          <Link to="/" className={navLinkCls('/')}>Home</Link>
          <Link to="/company" className={navLinkCls('/company')}>Company</Link>

          {/* Cleaning Services dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setServicesOpen(!servicesOpen)}
              className={`text-sm transition-colors flex items-center gap-1 ${location.pathname.startsWith('/services') ? 'text-white font-semibold' : 'text-slate-300 hover:text-white'}`}
            >
              Cleaning Services
              <svg className={`w-3.5 h-3.5 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {servicesOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-[#0B1F3A] border border-white/10 rounded-lg shadow-2xl py-1 z-50">
                <Link to="/services" onClick={() => setServicesOpen(false)} className="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors font-medium border-b border-white/10">
                  All Services
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

          <Link to="/portfolio" className={navLinkCls('/portfolio')}>Portfolio</Link>
          <Link to="/reservation" className={navLinkCls('/reservation')}>Reservation</Link>
        </nav>

        {/* Right side */}
        <div className="hidden lg:flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link to="/mypage" className="text-sm text-slate-300 hover:text-white transition-colors">{user?.nickname}</Link>
              {user?.role === 'ADMIN' && (
                <Link to="/admin" className="text-sm text-slate-400 hover:text-white transition-colors">Admin</Link>
              )}
              <button onClick={handleLogout} className="text-sm px-4 py-1.5 border border-white/20 rounded text-slate-300 hover:text-white hover:border-white/40 transition-colors">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-slate-300 hover:text-white transition-colors">Login</Link>
              <Link to="/reservation" className="text-sm px-5 py-2 bg-white text-[#0B1F3A] font-semibold rounded hover:bg-slate-100 transition-colors">
                Book Now
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="lg:hidden p-2 text-slate-300 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-[#060F1E] border-t border-white/10 px-4 py-5 space-y-4 text-sm">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block text-slate-300 hover:text-white">Home</Link>
          <Link to="/company" onClick={() => setMenuOpen(false)} className="block text-slate-300 hover:text-white">Company</Link>
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Cleaning Services</p>
            <div className="space-y-2 pl-2">
              <Link to="/services" onClick={() => setMenuOpen(false)} className="block text-slate-400 hover:text-white">All Services</Link>
              {categories.map((cat) => (
                <Link key={cat} to={`/services/${cat.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="block text-slate-500 hover:text-white text-xs">{categoryLabels[cat]}</Link>
              ))}
            </div>
          </div>
          <Link to="/portfolio" onClick={() => setMenuOpen(false)} className="block text-slate-300 hover:text-white">Portfolio</Link>
          <Link to="/reservation" onClick={() => setMenuOpen(false)} className="block text-slate-300 hover:text-white">Reservation</Link>
          {isLoggedIn ? (
            <>
              <Link to="/mypage" onClick={() => setMenuOpen(false)} className="block text-slate-300 hover:text-white">My Page</Link>
              <button onClick={handleLogout} className="block text-slate-400 hover:text-white">Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-slate-300 hover:text-white">Login</Link>
          )}
        </div>
      )}
    </header>
  );
}
