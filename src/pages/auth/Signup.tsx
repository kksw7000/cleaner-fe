import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { signup as signupApi } from '@/api/AuthApi';

/** 회원가입 입력 상태와 비밀번호 확인값을 함께 담습니다. */
interface SignupForm {
  email: string;
  password: string;
  confirm: string;
  nickname: string;
  phone: string;
}

/** 회원가입 입력 필드 정의이며, key는 SignupForm 속성으로 제한합니다. */
interface SignupField {
  label: string;
  type: React.HTMLInputTypeAttribute;
  key: keyof SignupForm;
  placeholder: string;
}

const signupFields: SignupField[] = [
  { label: '이메일', type: 'email', key: 'email', placeholder: '이메일 주소를 입력하세요' },
  { label: '닉네임', type: 'text', key: 'nickname', placeholder: '사용할 닉네임을 입력하세요' },
  { label: '전화번호', type: 'tel', key: 'phone', placeholder: '010-0000-0000' },
  { label: '비밀번호', type: 'password', key: 'password', placeholder: '비밀번호를 입력하세요' },
  { label: '비밀번호 확인', type: 'password', key: 'confirm', placeholder: '비밀번호를 다시 입력하세요' },
];

/** Axios 응답 코드를 사용자에게 조치 방법이 보이는 회원가입 안내로 바꿉니다. */
function getSignupErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return '회원가입 중 오류가 발생했습니다. 입력한 정보를 확인해 주세요.';
  }

  const responseData: unknown = error.response?.data;
  if (typeof responseData === 'object' && responseData !== null && 'message' in responseData
    && typeof responseData.message === 'string') {
    return responseData.message;
  }

  if (!error.response) {
    return '서버에 연결할 수 없습니다. 서버 상태를 확인한 뒤 다시 시도해 주세요.';
  }
  if (error.response.status === 404) {
    return '회원가입 API를 찾을 수 없습니다. 서버 주소와 실행 상태를 확인해 주세요.';
  }
  if (error.response.status === 400) {
    return '입력한 이메일, 비밀번호, 닉네임 또는 전화번호 형식을 확인해 주세요.';
  }
  if (error.response.status === 409) {
    return '이미 가입된 이메일 또는 전화번호인지 확인해 주세요.';
  }
  return '서버 오류로 회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요.';
}

/** 입력값을 검사한 뒤 백엔드 회원가입 API를 호출하는 화면입니다. */
export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState<SignupForm>({ email: '', password: '', confirm: '', nickname: '', phone: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /** 비밀번호 제약을 먼저 확인해 유효한 정보만 서버로 보내고 결과에 따라 이동합니다. */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('비밀번호가 일치하지 않습니다.'); return; }
    if (form.password.length < 8 || form.password.length > 30) {
      setError('비밀번호는 8~30자로 입력해 주세요.');
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) {
      setError('비밀번호에 허용된 특수문자(!@#$%^&*(),.?":{}|<>)를 1개 이상 포함해 주세요.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await signupApi(form.email, form.password, form.nickname.trim(), form.phone.trim());
      navigate('/login', { state: { registered: true } });
    } catch (signupError: unknown) {
      setError(getSignupErrorMessage(signupError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1F3A] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-base font-bold text-white">회원가입</h1>
          <Link to="/" className="inline-block text-slate-400 text-2xl font-black mt-3 hover:text-white hover:underline">
            청소를 만드는 사람들
          </Link>
        </div>

        <div className="bg-[#111827] border border-white/10 rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-sm text-red-400 bg-red-900/20 border border-red-800/30 rounded p-3">{error}</p>}
            {signupFields.map((f) => (
              <div key={f.key}>
                <label htmlFor={f.key} className="text-xs font-medium text-slate-400 block mb-1.5">{f.label}</label>
                <input
                  id={f.key}
                  type={f.type}
                  required
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                {f.key === 'password' && (
                  <p className="mt-1.5 text-xs text-slate-500">
                    {'8~30자이며 허용된 특수문자(!@#$%^&*(),.?":{}|<>)를 1개 이상 포함해야 합니다.'}
                  </p>
                )}
              </div>
            ))}
            <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-white text-[#0B1F3A] font-black rounded hover:bg-slate-100 transition-colors text-sm tracking-wide disabled:cursor-not-allowed disabled:opacity-60">
              가입하기
            </button>
          </form>
          <p className="text-center text-sm text-slate-500 mt-4">
            이미 회원이신가요? <Link to="/login" className="text-white font-medium hover:underline">로그인</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
