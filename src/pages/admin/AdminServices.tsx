import { useState } from 'react';
import { services as initialServices, categoryLabels, categoryIcons, type ServiceProduct, type ServiceCategory } from '@/data/mockData';

const categories = Object.keys(categoryLabels) as ServiceCategory[];

export default function AdminServices() {
  const [list, setList] = useState(initialServices);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', category: 'MATTRESS' as ServiceCategory, description: '', price: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId !== null) {
      setList((prev) => prev.map((s) => s.id === editId ? { ...s, ...form, price: Number(form.price) } : s));
      setEditId(null);
    } else {
      const newService: ServiceProduct = {
        id: Date.now(),
        name: form.name,
        category: form.category,
        description: form.description,
        price: Number(form.price),
        imageId: 'photo-1563453392212-326f5e854473',
      };
      setList((prev) => [...prev, newService]);
    }
    setForm({ name: '', category: 'MATTRESS', description: '', price: '' });
    setShowForm(false);
  };

  const handleEdit = (s: ServiceProduct) => {
    setForm({ name: s.name, category: s.category, description: s.description, price: String(s.price) });
    setEditId(s.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('이 서비스를 삭제하시겠습니까?')) {
      setList((prev) => prev.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">서비스 관리</h1>
        <button
          onClick={() => { setShowForm(true); setEditId(null); setForm({ name: '', category: 'MATTRESS', description: '', price: '' }); }}
          className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-full hover:bg-teal-700 transition-colors"
        >
          + 서비스 추가
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
          <h2 className="font-bold text-slate-900 mb-4 text-sm">{editId ? '서비스 수정' : '새 서비스 등록'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-500 block mb-1">서비스명</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">분류</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ServiceCategory })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white">
                {categories.map((c) => <option key={c} value={c}>{categoryLabels[c]}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-slate-500 block mb-1">설명</label>
              <textarea required rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none" />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-1">가격 (₩)</label>
              <input required type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            <div className="flex items-end gap-3">
              <button type="submit" className="px-5 py-2 bg-teal-600 text-white text-sm font-medium rounded-full hover:bg-teal-700 transition-colors">
                {editId ? '수정' : '등록'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="px-5 py-2 border border-slate-200 text-slate-600 text-sm rounded-full hover:border-slate-400 transition-colors">
                취소
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['분류', '서비스명', '가격', '설명', ''].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {list.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2 text-xs text-slate-600">
                    <span>{categoryIcons[s.category]}</span>
                    {categoryLabels[s.category]}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-slate-900">{s.name}</td>
                <td className="px-4 py-3 font-mono text-sm text-slate-700">₩{s.price.toLocaleString()}</td>
                <td className="px-4 py-3 text-slate-500 text-xs max-w-xs truncate">{s.description}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-3 text-xs">
                    <button onClick={() => handleEdit(s)} className="text-teal-600 hover:text-teal-700 font-medium transition-colors">수정</button>
                    <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-red-700 font-medium transition-colors">삭제</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
