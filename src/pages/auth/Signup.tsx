import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '', confirm: '', nickname: '', phone: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    login(form.email, 'USER', form.nickname.trim());
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0B1F3A] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-white" style={{ fontFamily: 'Outfit' }}>Create Account</h1>
          <p className="text-slate-400 text-sm mt-1">Start booking professional cleaning services</p>
        </div>

        <div className="bg-[#111827] border border-white/10 rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-sm text-red-400 bg-red-900/20 border border-red-800/30 rounded p-3">{error}</p>}
            {[
              { label: 'Email', type: 'email', key: 'email', placeholder: 'you@example.com' },
              { label: 'Nickname', type: 'text', key: 'nickname', placeholder: 'Display name' },
              { label: 'Phone', type: 'tel', key: 'phone', placeholder: '010-0000-0000' },
              { label: 'Password', type: 'password', key: 'password', placeholder: '••••••••' },
              { label: 'Confirm Password', type: 'password', key: 'confirm', placeholder: '••••••••' },
            ].map((f) => (
              <div key={f.key}>
                <label className="text-xs font-medium text-slate-400 block mb-1.5">{f.label}</label>
                <input
                  type={f.type}
                  required={f.key !== 'phone'}
                  placeholder={f.placeholder}
                  value={(form as any)[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
            ))}
            <button type="submit" className="w-full py-3 bg-white text-[#0B1F3A] font-black rounded hover:bg-slate-100 transition-colors text-sm tracking-wide">
              CREATE ACCOUNT
            </button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-4">
            Already have an account? <Link to="/login" className="text-white font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
