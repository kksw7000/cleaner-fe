import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { mockReservations, type ReservationStatus } from '@/data/mockData';

const statusColors: Record<ReservationStatus, string> = {
  PENDING: 'bg-amber-900/30 text-amber-400 border border-amber-700/30',
  CONFIRMED: 'bg-blue-900/30 text-blue-400 border border-blue-700/30',
  COMPLETED: 'bg-teal-900/30 text-teal-400 border border-teal-700/30',
  CANCELED: 'bg-slate-800 text-slate-400 border border-slate-700',
};

type Tab = 'profile' | 'reservations';

export default function MyPage() {
  const { isLoggedIn, user, updateUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('profile');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ nickname: user?.nickname || '', phone: user?.phone || '' });
  const [filterStatus, setFilterStatus] = useState<ReservationStatus | 'ALL'>('ALL');

  if (!isLoggedIn) { navigate('/login'); return null; }

  const handleSave = () => { updateUser(form); setEditing(false); };
  const filtered = filterStatus === 'ALL' ? mockReservations : mockReservations.filter((r) => r.status === filterStatus);

  return (
    <div className="min-h-screen bg-white">
      <div className="min-h-[340px] bg-[#0B1F3A] text-white flex items-center">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-16">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-xl font-black" style={{ fontFamily: 'Outfit' }}>
              {user?.nickname?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-black text-white" style={{ fontFamily: 'Outfit' }}>{user?.nickname}</h1>
              <p className="text-sm text-slate-400">{user?.email}</p>
            </div>
          </div>
          <div className="flex gap-6 mt-7 border-b border-white/10">
            {(['profile', 'reservations'] as Tab[]).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`text-sm font-medium pb-3 border-b-2 transition-colors capitalize ${tab === t ? 'border-white text-white' : 'border-transparent text-slate-400 hover:text-white'}`}
              >
                {t === 'profile' ? 'My Profile' : 'Reservations'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {tab === 'profile' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-black text-[#0B1F3A]" style={{ fontFamily: 'Outfit' }}>Personal Information</h2>
              {!editing ? (
                <button onClick={() => setEditing(true)} className="text-sm text-[#0B1F3A] hover:underline font-semibold">Edit</button>
              ) : (
                <div className="flex gap-3">
                  <button onClick={() => setEditing(false)} className="text-sm text-slate-500 hover:text-slate-700">Cancel</button>
                  <button onClick={handleSave} className="text-sm px-5 py-1.5 bg-[#0B1F3A] text-white rounded font-semibold hover:bg-[#060F1E] transition-colors">Save</button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Email</label>
                <p className="text-sm text-slate-700">{user?.email}</p>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Role</label>
                <span className={`inline-block text-xs px-2 py-0.5 rounded font-medium ${user?.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>{user?.role}</span>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Nickname</label>
                {editing ? <input value={form.nickname} onChange={(e) => setForm({ ...form, nickname: e.target.value })} className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]" /> : <p className="text-sm text-slate-700">{user?.nickname}</p>}
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Phone</label>
                {editing ? <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]" placeholder="010-0000-0000" /> : <p className="text-sm text-slate-700">{user?.phone || '—'}</p>}
              </div>
            </div>
            <div className="mt-8 pt-5 border-t border-slate-100">
              <button onClick={() => { logout(); navigate('/'); }} className="text-sm text-red-500 hover:text-red-600 font-medium">Sign Out</button>
            </div>
          </div>
        )}

        {tab === 'reservations' && (
          <div>
            <div className="flex flex-wrap gap-2 mb-5">
              {(['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELED'] as const).map((s) => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${filterStatus === s ? 'bg-[#0B1F3A] text-white' : 'border border-slate-200 text-slate-600 hover:border-[#0B1F3A]'}`}
                >
                  {s === 'ALL' ? 'All' : s}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {filtered.map((r) => (
                <div key={r.id} className="bg-white border border-slate-200 rounded-xl p-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-[#0B1F3A] text-sm" style={{ fontFamily: 'Outfit' }}>{r.serviceName}</h3>
                    <p className="text-xs text-slate-500 mt-1">{r.reservationDate} · {r.address}</p>
                    {r.memo && <p className="text-xs text-slate-400 mt-1 italic">"{r.memo}"</p>}
                    <p className="text-xs text-slate-300 mt-2">Booked {r.createdAt}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded ${statusColors[r.status]}`}>{r.status}</span>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="text-center py-14 text-slate-400"><p>No reservations in this status.</p></div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
