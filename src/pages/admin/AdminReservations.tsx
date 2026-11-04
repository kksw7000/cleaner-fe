import { useState } from 'react';
import { adminReservations as initial, type ReservationStatus } from '@/data/mockData';

const statusColors: Record<ReservationStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-teal-100 text-teal-700',
  CANCELED: 'bg-slate-100 text-slate-500',
};

const nextStatus: Record<ReservationStatus, ReservationStatus | null> = {
  PENDING: 'CONFIRMED',
  CONFIRMED: 'COMPLETED',
  COMPLETED: null,
  CANCELED: null,
};

export default function AdminReservations() {
  const [list, setList] = useState(initial);
  const [filter, setFilter] = useState<ReservationStatus | 'ALL'>('ALL');

  const filtered = filter === 'ALL' ? list : list.filter((r) => r.status === filter);

  const handleAdvance = (id: number, current: ReservationStatus) => {
    const next = nextStatus[current];
    if (!next) return;
    setList((prev) => prev.map((r) => r.id === id ? { ...r, status: next } : r));
  };

  const handleCancel = (id: number) => {
    setList((prev) => prev.map((r) => r.id === id ? { ...r, status: 'CANCELED' } : r));
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Outfit' }}>Reservations</h1>
        <span className="text-sm text-slate-500">{list.length} total</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {(['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELED'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === s ? 'bg-teal-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'}`}
          >
            {s === 'ALL' ? 'All' : s}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((r) => (
          <div key={r.id} className="bg-white rounded-xl border border-slate-200 p-5 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <span className="font-semibold text-slate-900 text-sm" style={{ fontFamily: 'Outfit' }}>{r.userName}</span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500">{r.email}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[r.status]}`}>{r.status}</span>
              </div>
              <p className="text-sm text-teal-700 font-medium">{r.serviceName}</p>
              <p className="text-xs text-slate-400 mt-0.5">{r.reservationDate} · {r.address}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              {nextStatus[r.status] && (
                <button
                  onClick={() => handleAdvance(r.id, r.status)}
                  className="text-xs px-3 py-1.5 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors font-medium"
                >
                  → {nextStatus[r.status]}
                </button>
              )}
              {r.status !== 'CANCELED' && r.status !== 'COMPLETED' && (
                <button
                  onClick={() => handleCancel(r.id)}
                  className="text-xs px-3 py-1.5 border border-red-200 text-red-500 rounded-full hover:bg-red-50 transition-colors font-medium"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-14 text-slate-400 text-sm">No reservations in this status.</div>
        )}
      </div>
    </div>
  );
}
