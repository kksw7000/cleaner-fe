import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { services, categoryLabels } from '@/data/mockData';
import { useAuthStore } from '@/store/authStore';

const serviceNames: Record<number, string> = {
  1: '매트리스 살균 청소',
  2: '매트리스 얼룩 제거',
  3: '소파 스팀 청소',
  4: '카페트 집중 청소',
  5: '입주 종합 청소',
  6: '퇴거 청소',
  7: '에어컨 청소',
  8: '세탁기 내부 청소',
  9: '준공 청소',
  10: '사무실 청소',
  11: '바닥 왁스 코팅',
  12: '주 1회 정기 청소',
  13: '유품 정리 및 정돈',
};

export default function Reservation() {
  const { isLoggedIn } = useAuthStore();
  const navigate = useNavigate();
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const today = new Date();
  const todayValue = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [form, setForm] = useState({
    name: '', phone: '', email: '', serviceId: '', date: '', time: '10:00', address: '', memo: '',
  });
  const calendarDays = Array.from({ length: 42 }, (_, index) =>
    new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1 - calendarMonth.getDay() + index),
  );
  const formatDateValue = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const selectedDateLabel = form.date
    ? new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })
      .format(new Date(`${form.date}T00:00:00`))
    : '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate('/login', { state: { from: '/reservation' } });
      return;
    }
    if (!form.date) {
      setCalendarOpen(true);
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-[#0B1F3A] rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-[#0B1F3A] mb-2">예약 신청이 완료되었습니다!</h2>
          <div className="flex gap-3 justify-center">
            <Link to="/" className="px-6 py-2.5 bg-[#0B1F3A] text-white text-sm font-semibold rounded hover:bg-[#060F1E] transition-colors">홈으로</Link>
            <Link to="/services" className="px-6 py-2.5 border border-slate-200 text-slate-600 text-sm rounded hover:border-slate-400 transition-colors">서비스 둘러보기</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="min-h-[340px] bg-[#0B1F3A] text-white flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 mb-3">서비스 신청</p>
          <h1 className="text-4xl md:text-5xl font-black">청소 서비스 예약</h1>
          <p className="text-slate-300 mt-3 text-sm max-w-lg">신청서를 작성해 주시면 24시간 이내에 예약을 확인해 드립니다. 무료 상담도 가능합니다.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
        {!isLoggedIn && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
            예약 신청을 위해 <Link to="/login" className="font-semibold underline">로그인</Link>해 주세요. 신청서를 작성하시면 직접 연락드리겠습니다.
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-semibold text-slate-500 tracking-wide block mb-1.5">이름</label>
            <input required placeholder="이름을 입력하세요" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-slate-200 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 tracking-wide block mb-1.5">연락처</label>
            <input required placeholder="010-0000-0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-slate-200 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-500 tracking-wide block mb-1.5">이메일</label>
            <input type="email" required placeholder="이메일 주소를 입력하세요" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-slate-200 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-500 tracking-wide block mb-1.5">청소 서비스</label>
            <select required value={form.serviceId} onChange={(e) => setForm({ ...form, serviceId: e.target.value })} className="w-full border border-slate-200 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] bg-white">
              <option value="">서비스를 선택하세요</option>
              {Object.entries(categoryLabels).map(([cat, label]) => (
                <optgroup key={cat} label={label}>
                  {services.filter((s) => s.category === cat).map((s) => (
                    <option key={s.id} value={s.id}>{serviceNames[s.id] ?? s.name} — ₩{s.price.toLocaleString()}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div className="relative">
            <label htmlFor="reservation-date" className="text-xs font-semibold text-slate-500 tracking-wide block mb-1.5">희망 날짜</label>
            <input
              id="reservation-date"
              ref={dateInputRef}
              type="text"
              aria-required="true"
              readOnly
              aria-haspopup="dialog"
              aria-expanded={calendarOpen}
              placeholder="날짜를 선택하세요"
              value={selectedDateLabel}
              onClick={() => setCalendarOpen(!calendarOpen)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setCalendarOpen(!calendarOpen);
                }
              }}
              className="w-full border border-slate-200 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] cursor-pointer"
            />
            {calendarOpen && (
              <div role="dialog" aria-label="날짜 선택" className="absolute left-0 top-full z-20 mt-2 w-full min-w-[280px] rounded-lg border border-slate-200 bg-white p-4 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                  <button
                    type="button"
                    aria-label="이전 달"
                    onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
                    className="rounded px-3 py-1 text-slate-600 hover:bg-slate-100"
                  >
                    ‹
                  </button>
                  <span className="font-semibold text-[#0B1F3A]">
                    {new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long' }).format(calendarMonth)}
                  </span>
                  <button
                    type="button"
                    aria-label="다음 달"
                    onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
                    className="rounded px-3 py-1 text-slate-600 hover:bg-slate-100"
                  >
                    ›
                  </button>
                </div>
                <div className="grid grid-cols-7 text-center text-xs text-slate-500">
                  {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                    <span key={day} className="py-2">{day}</span>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-y-1 text-center">
                  {calendarDays.map((day) => {
                    const dateValue = formatDateValue(day);
                    const isCurrentMonth = day.getMonth() === calendarMonth.getMonth();
                    const isSelected = dateValue === form.date;
                    const isPast = dateValue < todayValue;

                    return (
                      <button
                        key={dateValue}
                        type="button"
                        disabled={!isCurrentMonth || isPast}
                        aria-pressed={isSelected}
                        onClick={() => {
                          setForm({ ...form, date: dateValue });
                          setCalendarOpen(false);
                          dateInputRef.current?.focus();
                        }}
                        className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors ${
                          isSelected
                            ? 'bg-[#0B1F3A] text-white'
                            : isCurrentMonth && !isPast
                              ? 'text-slate-700 hover:bg-slate-100'
                              : 'cursor-default text-slate-300'
                        }`}
                      >
                        {day.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 tracking-wide block mb-1.5">희망 시간</label>
            <select value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full border border-slate-200 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] bg-white">
              {['08:00','09:00','10:00','11:00','13:00','14:00','15:00','16:00'].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-500 tracking-wide block mb-1.5">서비스 주소</label>
            <input required placeholder="주소를 입력하세요" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full border border-slate-200 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-500 tracking-wide block mb-1.5">요청 사항</label>
            <textarea rows={4} placeholder="특별 요청 사항이나 출입 방법 등 전달할 내용을 입력하세요." value={form.memo} onChange={(e) => setForm({ ...form, memo: e.target.value })} className="w-full border border-slate-200 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] resize-none" />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="w-full py-4 bg-[#0B1F3A] text-white font-black rounded hover:bg-[#060F1E] transition-colors tracking-wide">
              예약 신청하기
            </button>
            <p className="text-xs text-slate-400 mt-3 text-center">24시간 이내에 예약을 확인해 드리겠습니다.</p>
          </div>
        </form>
      </div>
    </div>
  );
}
