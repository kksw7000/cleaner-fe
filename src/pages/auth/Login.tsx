import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { login as loginApi } from '@/api/AuthApi';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, restoreSession } = useAuthStore();
  const locationState = location.state as { from?: unknown; draftComment?: unknown; registered?: unknown } | null;
  const from = typeof locationState?.from === 'string' ? locationState.from : '/';
  const returnState = typeof locationState?.draftComment === 'string'
    ? { draftComment: locationState.draftComment }
    : undefined;
  const registrationComplete = locationState?.registered === true;
  const [form, setForm] = useState({ email: '', password: '' });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('이메일과 비밀번호를 모두 입력해 주세요.'); return; }
    setError('');
    setIsSubmitting(true);
    try {
      const tokenResponse = await loginApi(form.email, form.password);
      const role = tokenResponse.role;
      // 로그인 직후에도 회원가입 시 저장한 닉네임을 표시하도록 서버 응답의 이름을 전달합니다.
      login(form.email, tokenResponse.accessToken, role, tokenResponse.name);
      // 마이페이지로 이동하기 전에 본인 프로필을 조회해 전화번호를 포함한 최신 정보를 채웁니다.
      await restoreSession(false);
      navigate(from, { state: returnState });
    } catch {
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1F3A] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-white">로그인</h1>
        </div>

        <div className="bg-[#111827] border border-white/10 rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {registrationComplete && <p className="text-sm text-emerald-300 bg-emerald-900/20 border border-emerald-800/30 rounded p-3">회원가입이 완료되었습니다. 로그인해 주세요.</p>}
            {error && <p className="text-sm text-red-400 bg-red-900/20 border border-red-800/30 rounded p-3">{error}</p>}
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1.5">이메일</label>
              <input type="email" required placeholder="이메일 주소를 입력하세요" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/30" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1.5">비밀번호</label>
              <div className="relative">
                <input type={passwordVisible ? 'text' : 'password'} required placeholder="비밀번호를 입력하세요" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 pr-11 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/30" />
                <button
                  type="button"
                  aria-label={passwordVisible ? '비밀번호 숨기기' : '비밀번호 표시'}
                  aria-pressed={passwordVisible}
                  onClick={() => setPasswordVisible((visible) => !visible)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white/30 rounded-r"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    {passwordVisible ? (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
                        <circle cx="12" cy="12" r="3" strokeWidth={1.8} />
                      </>
                    ) : (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4 9.5 7-.4 1.1-1.2 2.3-2.3 3.4M6.2 6.2C3.9 7.6 2.8 9.5 2.5 12c.5 1.4 1.6 2.8 3.1 3.9A10.2 10.2 0 0012 18c.9 0 1.8-.1 2.6-.4" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-white text-[#0B1F3A] font-black rounded hover:bg-blue-600 hover:text-white transition-colors text-sm tracking-wide disabled:cursor-not-allowed disabled:opacity-60">
              로그인
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-slate-500">또는</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* 소셜 로그인 */}
          <div className="space-y-2">
            {[{ name: 'Google', color: '#4285F4' }, { name: 'Naver', color: '#03C75A' }, { name: 'Kakao', color: '#FEE500' }].map((p) => (
              <button key={p.name} type="button" onClick={() => setError('소셜 로그인은 아직 연동되지 않았습니다. 이메일 로그인을 이용해 주세요.')} className="w-full flex items-center justify-center gap-3 py-3 border border-white/10 rounded-lg text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors font-medium">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                {p.name}로 로그인
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-slate-500 mt-4">
            아직 회원이 아니신가요? <Link to="/signup" className="text-white font-medium hover:underline">회원가입</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
