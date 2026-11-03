import { useState } from 'react';
import { mockPosts } from '@/data/mockData';

export default function AdminPosts() {
  const [posts, setPosts] = useState(mockPosts);
  const [search, setSearch] = useState('');

  const filtered = posts.filter((p) =>
    !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.writer.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (confirm('Delete this post?')) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Outfit' }}>Board Posts</h1>
        <span className="text-sm text-slate-500">{posts.length} total</span>
      </div>

      <input
        type="text"
        placeholder="Search posts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 mb-6"
      />

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['ID', 'Title', 'Author', 'Views', 'Date', ''].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 text-slate-400 text-xs font-mono">#{p.id}</td>
                <td className="px-4 py-3 font-medium text-slate-900 max-w-xs truncate">{p.title}</td>
                <td className="px-4 py-3 text-slate-600">{p.writer}</td>
                <td className="px-4 py-3 text-slate-500">{p.viewCount}</td>
                <td className="px-4 py-3 text-slate-400 text-xs">{p.createdAt}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(p.id)} className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">No posts found.</div>
        )}
      </div>
    </div>
  );
}
