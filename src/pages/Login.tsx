import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();
  const from = (location.state as any)?.from || '/';
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    const role = form.email === 'admin@cleaner.com' ? 'ADMIN' : 'USER';
    login(form.email, role);
    navigate(from);
  };

  const handleSocial = (provider: string) => {
    login(`user@${provider.toLowerCase()}.com`);
    navigate(from);
  };

  return (
    <div className="min-h-screen bg-[#0B1F3A] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded bg-white/10 border border-white/20 flex items-center justify-center">
              <span className="text-white font-black" style={{ fontFamily: 'Outfit' }}>C</span>
            </div>
            <span className="font-bold text-xl text-white tracking-wide" style={{ fontFamily: 'Outfit' }}>CLEANER</span>
          </Link>
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: 'Outfit' }}>Sign In</h1>
          <p className="text-slate-400 text-sm mt-1">Access your bookings and account</p>
        </div>

        <div className="bg-[#111827] border border-white/10 rounded-xl p-6">
          {/* Social */}
          <div className="space-y-2 mb-5">
            {[{ name: 'Google', color: '#4285F4' }, { name: 'Naver', color: '#03C75A' }, { name: 'Kakao', color: '#FEE500' }].map((p) => (
              <button key={p.name} onClick={() => handleSocial(p.name)} className="w-full flex items-center justify-center gap-3 py-3 border border-white/10 rounded-lg text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors font-medium">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                Continue with {p.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-slate-500">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-sm text-red-400 bg-red-900/20 border border-red-800/30 rounded p-3">{error}</p>}
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1.5">Email</label>
              <input type="email" required placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/30" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1.5">Password</label>
              <input type="password" required placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/30" />
            </div>
            <button type="submit" className="w-full py-3 bg-white text-[#0B1F3A] font-black rounded hover:bg-slate-100 transition-colors text-sm tracking-wide">
              SIGN IN
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-4">
            No account? <Link to="/signup" className="text-white font-medium hover:underline">Create one</Link>
          </p>
          <p className="text-center text-xs text-slate-600 mt-2">Admin: admin@cleaner.com / any password</p>
        </div>
      </div>
    </div>
  );
}
