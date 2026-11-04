import { adminReservations, mockUsers, mockPosts, services } from '@/data/mockData';

const stats = [
  { label: 'Total Members', value: mockUsers.filter((u) => u.role === 'USER').length, icon: '👥', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { label: 'Total Services', value: services.length, icon: '🧹', color: 'bg-teal-50 text-teal-700 border-teal-200' },
  { label: 'Board Posts', value: mockPosts.length, icon: '📝', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { label: 'Reservations', value: adminReservations.length, icon: '📅', color: 'bg-amber-50 text-amber-700 border-amber-200' },
];

const statusColors: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-teal-100 text-teal-700',
  CANCELED: 'bg-slate-100 text-slate-500',
};

export default function AdminDashboard() {
  const pending = adminReservations.filter((r) => r.status === 'PENDING').length;
  const confirmed = adminReservations.filter((r) => r.status === 'CONFIRMED').length;
  const completed = adminReservations.filter((r) => r.status === 'COMPLETED').length;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6" style={{ fontFamily: 'Outfit' }}>Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className={`border rounded-xl p-5 ${s.color}`}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-3xl font-bold" style={{ fontFamily: 'Outfit' }}>{s.value}</div>
            <div className="text-xs font-medium mt-1 opacity-70">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Reservation breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-bold text-slate-900 mb-4 text-sm" style={{ fontFamily: 'Outfit' }}>Reservation Status</h2>
          <div className="space-y-3">
            {[
              { label: 'Pending', count: pending, color: 'bg-amber-400', total: adminReservations.length },
              { label: 'Confirmed', count: confirmed, color: 'bg-blue-400', total: adminReservations.length },
              { label: 'Completed', count: completed, color: 'bg-teal-400', total: adminReservations.length },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">{item.label}</span>
                  <span className="font-medium text-slate-900">{item.count}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${(item.count / item.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-bold text-slate-900 mb-4 text-sm" style={{ fontFamily: 'Outfit' }}>Recent Reservations</h2>
          <div className="space-y-3">
            {adminReservations.slice(0, 4).map((r) => (
              <div key={r.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">{r.userName}</p>
                  <p className="text-xs text-slate-400">{r.serviceName}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[r.status]}`}>{r.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
