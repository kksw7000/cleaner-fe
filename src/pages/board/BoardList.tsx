import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { formatBoardDate, getBoards } from '@/features/board/BoardApi';
import { useAuthStore } from '@/store/authStore';

/** 백엔드 게시글 목록을 검색하고 페이지 단위로 보여줍니다. */
export default function BoardList() {
  const { isLoggedIn } = useAuthStore();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const boardsQuery = useQuery({
    queryKey: ['boards', page, keyword],
    queryFn: () => getBoards(page, keyword),
  });
  const boards = boardsQuery.data;

  return (
    <div className="min-h-screen bg-white">
      <div className="min-h-[340px] bg-[#0B1F3A] text-white flex items-center">
        <div className="relative max-w-7xl w-full mx-auto px-4 sm:px-6 py-16 flex flex-col items-center justify-center gap-6">
          <div className="text-center">
            <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 mb-3">커뮤니티</p>
            <h1 className="text-4xl md:text-5xl font-black">게시판</h1>
          </div>
          <div className="md:absolute md:right-6 md:top-1/2 md:-translate-y-1/2">
            <button onClick={() => isLoggedIn ? navigate('/board/new') : navigate('/login', { state: { from: '/board/new' } })} className="px-5 py-2 bg-white text-[#0B1F3A] font-bold rounded text-sm hover:bg-slate-100 transition-colors">+ 새 글 작성</button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <form onSubmit={(event) => { event.preventDefault(); setPage(0); setKeyword(searchInput.trim()); }} className="mb-6 flex gap-2">
          <label htmlFor="board-search" className="sr-only">게시글 제목 검색</label>
          <input id="board-search" type="search" placeholder="게시글 제목 검색..." value={searchInput} onChange={(event) => setSearchInput(event.target.value)} className="w-full border border-slate-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]" />
          <button type="submit" className="shrink-0 rounded bg-[#0B1F3A] px-5 text-sm font-semibold text-white">검색</button>
        </form>

        {boardsQuery.isPending && <p role="status" className="py-16 text-center text-slate-500">게시글을 불러오는 중입니다.</p>}
        {boardsQuery.isError && <div role="alert" className="py-16 text-center text-red-600">게시글을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</div>}
        {boards && <>
          <div className="divide-y divide-slate-100">
            {boards.content.map((post) => (
              <Link key={post.id} to={`/board/${post.id}`} className="block py-5 -mx-4 px-4 hover:bg-slate-50 rounded-lg transition-colors group">
                <h2 className="font-bold text-[#0B1F3A] group-hover:text-slate-600 transition-colors text-sm sm:text-base" style={{ fontFamily: 'Outfit' }}>
                  {post.notice && <span className="mr-2 rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800">공지</span>}{post.title}
                </h2>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                  <span>{post.authorName}</span><span>·</span><time>{formatBoardDate(post.createdAt)}</time><span>·</span><span>👁 {post.viewCount}</span>
                </div>
              </Link>
            ))}
            {boards.content.length === 0 && <div className="text-center py-16 text-slate-400">게시글이 없습니다.</div>}
          </div>
          {boards.totalPages > 1 && <nav aria-label="게시글 페이지" className="mt-8 flex items-center justify-center gap-4">
            <button type="button" disabled={boards.first} onClick={() => setPage((current) => current - 1)} className="rounded border px-4 py-2 text-sm disabled:opacity-40">이전</button>
            <span className="text-sm text-slate-600">{boards.page + 1} / {boards.totalPages}</span>
            <button type="button" disabled={boards.last} onClick={() => setPage((current) => current + 1)} className="rounded border px-4 py-2 text-sm disabled:opacity-40">다음</button>
          </nav>}
        </>}
      </div>
    </div>
  );
}
