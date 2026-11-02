import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { services, categoryLabels } from '../data/mockData';
import { useAuthStore } from '../store/authStore';

export default function Reservation() {
  const { isLoggedIn } = useAuthStore();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '', phone: '', email: '', serviceId: '', date: '', time: '10:00', address: '', memo: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate('/login', { state: { from: '/reservation' } });
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
          <h2 className="text-2xl font-black text-[#0B1F3A] mb-2" style={{ fontFamily: 'Outfit' }}>Request Submitted!</h2>
          <p className="text-slate-500 mb-6 text-sm">We'll contact you within 24 hours to confirm your reservation and provide a detailed quote.</p>
          <div className="flex gap-3 justify-center">
            <Link to="/" className="px-6 py-2.5 bg-[#0B1F3A] text-white text-sm font-semibold rounded hover:bg-[#060F1E] transition-colors">Home</Link>
            <Link to="/services" className="px-6 py-2.5 border border-slate-200 text-slate-600 text-sm rounded hover:border-slate-400 transition-colors">Browse Services</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="bg-[#0B1F3A] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400 mb-3">Get Started</p>
          <h1 className="text-4xl md:text-5xl font-black" style={{ fontFamily: 'Outfit' }}>Book a Service</h1>
          <p className="text-slate-300 mt-3 text-sm max-w-lg">Fill out the form and we'll confirm your booking within 24 hours. Free consultation available.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
        {!isLoggedIn && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
            <Link to="/login" className="font-semibold underline">Log in</Link> to submit a reservation, or fill out the form and we'll contact you directly.
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Full Name</label>
            <input required placeholder="Kim Minjun" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-slate-200 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Phone</label>
            <input required placeholder="010-0000-0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-slate-200 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Email</label>
            <input type="email" required placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-slate-200 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Service</label>
            <select required value={form.serviceId} onChange={(e) => setForm({ ...form, serviceId: e.target.value })} className="w-full border border-slate-200 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] bg-white">
              <option value="">Select a service...</option>
              {Object.entries(categoryLabels).map(([cat, label]) => (
                <optgroup key={cat} label={label}>
                  {services.filter((s) => s.category === cat).map((s) => (
                    <option key={s.id} value={s.id}>{s.name} — ₩{s.price.toLocaleString()}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Preferred Date</label>
            <input type="date" required min={new Date().toISOString().split('T')[0]} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full border border-slate-200 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Preferred Time</label>
            <select value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full border border-slate-200 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] bg-white">
              {['08:00','09:00','10:00','11:00','13:00','14:00','15:00','16:00'].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Service Address</label>
            <input required placeholder="Seoul, Gangnam-gu, Teheran-ro 123" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full border border-slate-200 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Additional Notes</label>
            <textarea rows={4} placeholder="Any specific requests, access instructions, or details about the space..." value={form.memo} onChange={(e) => setForm({ ...form, memo: e.target.value })} className="w-full border border-slate-200 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] resize-none" />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="w-full py-4 bg-[#0B1F3A] text-white font-black rounded hover:bg-[#060F1E] transition-colors tracking-wide">
              SUBMIT RESERVATION REQUEST
            </button>
            <p className="text-xs text-slate-400 mt-3 text-center">We'll confirm your booking within 24 hours.</p>
          </div>
        </form>
      </div>
    </div>
  );
}
