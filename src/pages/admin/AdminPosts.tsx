import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteAdminBoard, formatBoardDate, getAdminBoards } from '@/features/board/BoardApi';

/** 관리자 게시글 목록을 조회하고 실제 게시글 삭제 API를 실행합니다. */
export default function AdminPosts() {
  const queryClient = useQueryClient();
  const [searchInput, setSearchInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const boardsQuery = useQuery({ queryKey: ['admin-boards', page, keyword], queryFn: () => getAdminBoards(page, keyword) });
  const deleteMutation = useMutation({
    mutationFn: deleteAdminBoard,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-boards'] });
      void queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });
  const boards = boardsQuery.data;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6"><h1 className="text-2xl font-bold text-slate-900">게시글 관리</h1><span className="text-sm text-slate-500">총 {boards?.totalElements ?? 0}건</span></div>
      <form onSubmit={(event) => { event.preventDefault(); setPage(0); setKeyword(searchInput.trim()); }} className="mb-6 flex max-w-lg gap-2">
        <label htmlFor="admin-board-search" className="sr-only">게시글 제목 또는 작성자 검색</label>
        <input id="admin-board-search" type="search" placeholder="게시글 제목 검색" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
        <button className="rounded-lg bg-[#0B1F3A] px-4 text-sm font-semibold text-white">검색</button>
      </form>
      {boardsQuery.isPending && <p role="status" className="py-12 text-center text-slate-500">게시글을 불러오는 중입니다.</p>}
      {boardsQuery.isError && <p role="alert" className="py-12 text-center text-red-600">게시글을 불러오지 못했습니다.</p>}
      {boards && <>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm"><thead className="bg-slate-50 border-b border-slate-200"><tr>{['번호', '제목', '작성자', '조회수', '작성일', ''].map((heading) => <th key={heading} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{heading}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-100">{boards.content.map((post) => <tr key={post.id} className="hover:bg-slate-50 transition-colors"><td className="px-4 py-3 text-slate-400 text-xs font-mono">#{post.id}</td><td className="px-4 py-3 font-medium text-slate-900 max-w-xs truncate">{post.notice && <span className="mr-2 text-amber-700">[공지]</span>}{post.title}</td><td className="px-4 py-3 text-slate-600">{post.authorName}</td><td className="px-4 py-3 text-slate-500">{post.viewCount}</td><td className="px-4 py-3 text-slate-400 text-xs">{formatBoardDate(post.createdAt)}</td><td className="px-4 py-3"><button disabled={deleteMutation.isPending} onClick={() => { if (confirm('이 게시글을 삭제하시겠습니까?')) deleteMutation.mutate(post.id); }} className="text-xs text-red-500 hover:text-red-700 font-medium disabled:opacity-50">삭제</button></td></tr>)}</tbody>
          </table>
          {boards.content.length === 0 && <div className="text-center py-12 text-slate-400 text-sm">게시글이 없습니다.</div>}
        </div>
        {deleteMutation.isError && <p role="alert" className="mt-3 text-sm text-red-600">게시글을 삭제하지 못했습니다.</p>}
        {boards.totalPages > 1 && <nav aria-label="관리자 게시글 페이지" className="mt-6 flex items-center justify-center gap-4"><button disabled={boards.first} onClick={() => setPage((current) => current - 1)} className="rounded border px-4 py-2 text-sm disabled:opacity-40">이전</button><span className="text-sm text-slate-600">{boards.page + 1} / {boards.totalPages}</span><button disabled={boards.last} onClick={() => setPage((current) => current + 1)} className="rounded border px-4 py-2 text-sm disabled:opacity-40">다음</button></nav>}
      </>}
    </div>
  );
}
