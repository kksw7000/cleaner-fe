import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mockPosts } from '@/data/mockData';
import { useAuthStore } from '@/store/authStore';

export default function BoardList() {
  const { isLoggedIn } = useAuthStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = mockPosts.filter((p) =>
    !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.writer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="min-h-[340px] bg-[#0B1F3A] text-white flex items-center">
        <div className="relative max-w-7xl w-full mx-auto px-4 sm:px-6 py-16 flex flex-col items-center justify-center gap-6">
          <div className="text-center">
            <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 mb-3">커뮤니티</p>
            <h1 className="text-4xl md:text-5xl font-black">게시판</h1>
          </div>
          <div className="md:absolute md:right-6 md:top-1/2 md:-translate-y-1/2">
            <button
              onClick={() => isLoggedIn ? navigate('/board/new') : navigate('/login', { state: { from: '/board/new' } })}
              className="px-5 py-2 bg-white text-[#0B1F3A] font-bold rounded text-sm hover:bg-slate-100 transition-colors"
            >
              + 새 글 작성
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <input type="text" placeholder="게시글 검색..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full border border-slate-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] mb-6" />

        <div className="divide-y divide-slate-100">
          {filtered.map((post) => (
            <Link key={post.id} to={`/board/${post.id}`} className="block py-5 -mx-4 px-4 hover:bg-slate-50 rounded-lg transition-colors group">
              <h2 className="font-bold text-[#0B1F3A] group-hover:text-slate-600 transition-colors text-sm sm:text-base" style={{ fontFamily: 'Outfit' }}>{post.title}</h2>
              <p className="text-sm text-slate-500 mt-1 line-clamp-2 leading-relaxed">{post.content}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                <span>{post.writer}</span>
                <span>·</span>
                <span>{post.createdAt}</span>
                <span>·</span>
                <span>👁 {post.viewCount}</span>
              </div>
            </Link>
          ))}
          {filtered.length === 0 && <div className="text-center py-16 text-slate-400">게시글이 없습니다.</div>}
        </div>
      </div>
    </div>
  );
}
