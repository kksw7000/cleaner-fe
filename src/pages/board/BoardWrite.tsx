import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export default function BoardWrite() {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuthStore();
  const [form, setForm] = useState({ title: '', content: '' });

  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/board');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <Link to="/board" className="text-sm text-slate-400 hover:text-teal-600 transition-colors inline-flex items-center gap-1 mb-8">
          ← 게시판으로 돌아가기
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 mb-6" style={{ fontFamily: 'Outfit' }}>새 글 작성</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">제목</label>
            <input
              required
              placeholder="게시글 제목을 입력하세요"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">내용</label>
            <textarea
              required
              rows={12}
              placeholder="경험이나 유용한 정보, 궁금한 점을 작성해 주세요..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="px-6 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-full hover:bg-teal-700 transition-colors">
              게시글 등록
            </button>
            <Link to="/board" className="px-6 py-2.5 border border-slate-200 text-slate-600 text-sm rounded-full hover:border-slate-400 transition-colors">
              취소
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
