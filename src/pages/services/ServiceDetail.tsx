import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { services, categoryLabels, categoryIcons } from '@/data/mockData';
import { categoryPhotos } from '@/data/photoData';
import { useAuthStore } from '@/store/authStore';

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();

  const service = services.find((s) => s.id === Number(id));
  const [form, setForm] = useState({ date: '', time: '10:00', address: '', memo: '' });
  const [submitted, setSubmitted] = useState(false);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">서비스를 찾을 수 없습니다.</p>
          <Link to="/services" className="text-[#0B1F3A] hover:underline font-medium">← 서비스 목록으로</Link>
        </div>
      </div>
    );
  }

  const photos = categoryPhotos[service.category];

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate('/login', { state: { from: `/services/detail/${id}` } });
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-[#0B1F3A] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-[#0B1F3A] mb-2">예약 신청이 완료되었습니다</h2>
          <p className="text-slate-500 mb-2"><strong>{service.name}</strong> 예약이 확인 대기 중입니다.</p>
          <p className="text-slate-400 text-sm mb-8">24시간 이내에 예약을 확인해 드립니다. 마이페이지에서 진행 상황을 확인하세요.</p>
          <div className="flex gap-3 justify-center">
            <Link to="/mypage" className="px-6 py-2.5 bg-[#0B1F3A] text-white text-sm font-semibold rounded hover:bg-[#060F1E] transition-colors">마이페이지</Link>
            <Link to="/services" className="px-6 py-2.5 border border-slate-200 text-slate-600 text-sm rounded hover:border-slate-400 transition-colors">다른 서비스 보기</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero */}
      <div className="relative bg-[#0B1F3A] text-white h-64 overflow-hidden">
        <img
          src={`https://images.unsplash.com/${photos[0]}?w=1400&h=400&fit=crop&auto=format`}
          alt={service.name}
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A] to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 h-full flex flex-col justify-end pb-8">
          <nav className="text-xs text-slate-400 mb-3 flex items-center gap-2">
            <Link to="/services" className="hover:text-white">서비스</Link>
            <span>/</span>
            <Link to={`/services/${service.category.toLowerCase()}`} className="hover:text-white">{categoryLabels[service.category]}</Link>
            <span>/</span>
            <span className="text-white">{service.name}</span>
          </nav>
          <div className="flex items-center gap-2 mb-1">
            <span>{categoryIcons[service.category]}</span>
            <span className="text-xs text-slate-400 uppercase tracking-wider">{categoryLabels[service.category]}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black" style={{ fontFamily: 'Outfit' }}>{service.name}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left — details */}
          <div className="lg:col-span-3">
            <p className="text-slate-600 leading-relaxed text-base mb-6">{service.description}</p>
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-4xl font-black text-[#0B1F3A]" style={{ fontFamily: 'Outfit' }}>₩{service.price.toLocaleString()}</span>
              <span className="text-slate-400 text-sm">/ 1회</span>
            </div>

            {/* Sample photos */}
            <h3 className="font-bold text-[#0B1F3A] mb-3 text-sm tracking-wider">작업 사진</h3>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {photos.slice(0, 6).map((pid, i) => (
                <div key={i} className="aspect-square overflow-hidden rounded bg-slate-100">
                  <img src={`https://images.unsplash.com/${pid}?w=300&h=300&fit=crop&auto=format`} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>
            <Link to={`/services/${service.category.toLowerCase()}`} className="text-sm text-[#0B1F3A] hover:underline font-medium">
              {categoryLabels[service.category]} 작업 사진 전체 보기 →
            </Link>
          </div>

          {/* Right — booking */}
          <div className="lg:col-span-2">
            <div className="sticky top-20 bg-[#F8FAFC] border border-slate-200 rounded-xl p-6">
              <h2 className="text-lg font-black text-[#0B1F3A] mb-5">서비스 예약</h2>
              {!isLoggedIn && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
                  예약하려면 <Link to="/login" className="font-semibold underline">로그인</Link>해 주세요.
                </div>
              )}
              <form onSubmit={handleBook} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-500 block mb-1">날짜</label>
                    <input type="date" required min={new Date().toISOString().split('T')[0]} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 block mb-1">시간</label>
                    <select value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] bg-white">
                      {['08:00','09:00','10:00','11:00','13:00','14:00','15:00','16:00'].map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 block mb-1">주소</label>
                  <input type="text" required placeholder="주소를 입력하세요" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 block mb-1">요청 사항 (선택)</label>
                  <textarea rows={3} placeholder="추가 요청 사항을 입력하세요." value={form.memo} onChange={(e) => setForm({ ...form, memo: e.target.value })} className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] resize-none" />
                </div>
                <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400">총 금액</div>
                    <div className="font-black text-[#0B1F3A]" style={{ fontFamily: 'Outfit' }}>₩{service.price.toLocaleString()}</div>
                  </div>
                  <button type="submit" className="px-6 py-2.5 bg-[#0B1F3A] text-white font-bold rounded text-sm hover:bg-[#060F1E] transition-colors">
                    {isLoggedIn ? '예약 신청' : '로그인 후 예약'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
