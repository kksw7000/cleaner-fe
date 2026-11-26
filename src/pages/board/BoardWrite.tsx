import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { createBoard } from '@/features/board/BoardApi';
import { useAuthStore } from '@/store/authStore';

/** 로그인 회원이 작성한 게시글을 백엔드에 등록합니다. */
export default function BoardWrite() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [form, setForm] = useState({ title: '', content: '' });
  const createMutation = useMutation({
    mutationFn: () => createBoard({ title: form.title.trim(), content: form.content.trim() }),
    onSuccess: (board) => {
      void queryClient.invalidateQueries({ queryKey: ['boards'] });
      navigate(`/board/${board.id}`);
    },
  });

  if (!isLoggedIn) return <Navigate to="/login" replace state={{ from: '/board/new' }} />;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <Link to="/board" className="text-md text-slate-400 hover:text-teal-600 transition-colors inline-flex items-center gap-1 mb-8">← 게시판으로 돌아가기</Link>
        <h1 className="text-2xl font-bold text-slate-900 mb-6">새 글 작성</h1>
        <form onSubmit={(event) => { event.preventDefault(); createMutation.mutate(); }} className="space-y-4">
          <div><label htmlFor="post-title" className="text-xs font-medium text-slate-500 block mb-1">제목</label><input id="post-title" required maxLength={100} placeholder="게시글 제목을 입력하세요" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" /></div>
          <div><label htmlFor="post-content" className="text-xs font-medium text-slate-500 block mb-1">내용</label><textarea id="post-content" required rows={12} placeholder="경험이나 유용한 정보, 궁금한 점을 작성해 주세요..." value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none" /></div>
          {createMutation.isError && <p role="alert" className="text-sm text-red-600">게시글을 등록하지 못했습니다. 로그인 상태를 확인한 뒤 다시 시도해 주세요.</p>}
          <div className="flex gap-3"><button type="submit" disabled={createMutation.isPending} className="px-6 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-full hover:bg-teal-700 disabled:opacity-50">{createMutation.isPending ? '등록 중...' : '게시글 등록'}</button><Link to="/board" className="px-6 py-2.5 border border-slate-200 text-slate-600 text-sm rounded-full hover:border-slate-400">취소</Link></div>
        </form>
      </div>
    </div>
  );
}
