import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { createComment, deleteBoard, deleteComment, formatBoardDate, getBoard, updateBoard, updateComment, type BoardComment } from '@/features/board/BoardApi';
import { useAuthStore } from '@/store/authStore';

/** 게시글과 댓글을 조회하고 백엔드 권한 규칙에 맞춰 변경합니다. */
export default function BoardDetail() {
  const { id: idParam } = useParams();
  const id = Number(idParam);
  const isValidBoardId = Number.isInteger(id) && id > 0;
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { user, isLoggedIn } = useAuthStore();
  const routeState = location.state as { draftComment?: unknown } | null;
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', content: '' });
  const [commentContent, setCommentContent] = useState(() => typeof routeState?.draftComment === 'string' ? routeState.draftComment : '');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');
  const boardQuery = useQuery({ queryKey: ['board', id], queryFn: () => getBoard(id), enabled: isValidBoardId });
  const refreshBoard = () => queryClient.invalidateQueries({ queryKey: ['board', id] });
  const updateBoardMutation = useMutation({ mutationFn: () => updateBoard(id, { ...editForm, notice: Boolean(boardQuery.data?.notice) }), onSuccess: () => { setEditing(false); void refreshBoard(); void queryClient.invalidateQueries({ queryKey: ['boards'] }); } });
  const deleteBoardMutation = useMutation({ mutationFn: () => deleteBoard(id), onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ['boards'] }); navigate('/board'); } });
  const createCommentMutation = useMutation({ mutationFn: (content: string) => createComment(id, content), onSuccess: () => { setCommentContent(''); void refreshBoard(); } });
  const updateCommentMutation = useMutation({ mutationFn: ({ commentId, content }: { commentId: number; content: string }) => updateComment(id, commentId, content), onSuccess: () => { setEditingCommentId(null); setEditingCommentContent(''); void refreshBoard(); } });
  const deleteCommentMutation = useMutation({ mutationFn: (commentId: number) => deleteComment(id, commentId), onSuccess: () => { void refreshBoard(); } });
  const post = boardQuery.data;

  if (!isValidBoardId) return <div className="min-h-[50vh] flex flex-col items-center justify-center"><p role="alert" className="mb-4 text-slate-500">게시글을 불러오지 못했거나 존재하지 않습니다.</p><Link to="/board" className="text-teal-600 hover:underline">게시판으로 돌아가기</Link></div>;
  if (boardQuery.isPending) return <div role="status" className="min-h-[50vh] flex items-center justify-center text-slate-500">게시글을 불러오는 중입니다.</div>;
  if (boardQuery.isError || !post) return <div className="min-h-[50vh] flex flex-col items-center justify-center"><p role="alert" className="mb-4 text-slate-500">게시글을 불러오지 못했거나 존재하지 않습니다.</p><Link to="/board" className="text-teal-600 hover:underline">게시판으로 돌아가기</Link></div>;

  const isAuthor = user?.id === post.authorId;
  const canDeletePost = isAuthor || user?.role === 'ADMIN';
  const canManageComment = (comment: BoardComment) => isLoggedIn && user?.id === comment.authorId;
  const canDeleteComment = (comment: BoardComment) => canManageComment(comment) || user?.role === 'ADMIN';
  const handleCommentSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!isLoggedIn) {
      navigate('/login', { state: { from: location.pathname, draftComment: commentContent } });
      return;
    }
    const content = commentContent.trim();
    if (content) createCommentMutation.mutate(content);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <Link to="/board" className="text-sm text-slate-400 hover:text-teal-600 transition-colors inline-flex items-center gap-1 mb-8">← 게시판으로 돌아가기</Link>
        {editing ? <div className="space-y-4">
          <input aria-label="게시글 제목" value={editForm.title} onChange={(event) => setEditForm({ ...editForm, title: event.target.value })} className="w-full text-2xl font-bold border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500" />
          <textarea aria-label="게시글 내용" rows={10} value={editForm.content} onChange={(event) => setEditForm({ ...editForm, content: event.target.value })} className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none leading-relaxed" />
          {updateBoardMutation.isError && <p role="alert" className="text-sm text-red-600">게시글을 수정하지 못했습니다.</p>}
          <div className="flex gap-3"><button disabled={updateBoardMutation.isPending} onClick={() => updateBoardMutation.mutate()} className="px-5 py-2 bg-teal-600 text-white text-sm font-medium rounded-full disabled:opacity-50">저장</button><button onClick={() => { updateBoardMutation.reset(); setEditing(false); }} className="px-5 py-2 border border-slate-200 text-slate-600 text-sm rounded-full">취소</button></div>
        </div> : <>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight">{post.notice && <span className="mr-2 rounded bg-amber-100 px-2 py-1 align-middle text-xs text-amber-800">공지</span>}{post.title}</h1>
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div className="flex items-center gap-3 text-sm text-slate-500"><div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xs">{post.authorName[0]}</div><span className="font-medium text-slate-700">{post.authorName}</span><span>·</span><time>{formatBoardDate(post.createdAt)}</time><span>·</span><span>👁 {post.viewCount}</span></div>
            {isAuthor && <div className="flex gap-3 text-sm"><button onClick={() => { updateBoardMutation.reset(); setEditForm({ title: post.title, content: post.content }); setEditing(true); }} className="text-slate-500 hover:text-teal-600 font-medium">수정</button></div>}
            {canDeletePost && <button onClick={() => { if (confirm('이 게시글을 삭제하시겠습니까?')) deleteBoardMutation.mutate(); }} disabled={deleteBoardMutation.isPending} className="text-sm text-slate-500 hover:text-red-500 font-medium disabled:opacity-50">삭제</button>}
          </div>
          {deleteBoardMutation.isError && <p role="alert" className="mb-4 text-sm text-red-600">게시글을 삭제하지 못했습니다.</p>}
          <div className="prose prose-slate max-w-none">{post.content.split('\n').map((line, index) => <p key={index} className="text-slate-700 leading-relaxed mb-3 text-sm sm:text-base">{line || '\u00a0'}</p>)}</div>
        </>}

        <section className="mt-10 border-t border-slate-200 pt-8">
          <h2 className="mb-5 text-lg font-bold text-slate-900">댓글 <span className="text-teal-600">{post.comments.length}</span></h2>
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <label htmlFor="board-comment" className="sr-only">댓글 작성</label>
            <textarea id="board-comment" rows={3} value={commentContent} onChange={(event) => setCommentContent(event.target.value)} placeholder="댓글을 입력하세요." className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
            <div className="mt-2 flex justify-end"><button type="submit" disabled={createCommentMutation.isPending} className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50">댓글 등록</button></div>
            {createCommentMutation.isError && <p role="alert" className="mt-2 text-sm text-red-600">댓글을 등록하지 못했습니다.</p>}
          </form>
          <div className="divide-y divide-slate-100">
            {post.comments.map((comment) => <article key={comment.id} className="py-4"><div className="flex items-start justify-between gap-4"><div className="min-w-0 flex-1"><div className="mb-2 flex items-center gap-3 text-sm"><span className="font-semibold text-slate-700">{comment.authorName}</span><time className="text-xs text-slate-400">{formatBoardDate(comment.createdAt)}</time></div>
              {editingCommentId === comment.id ? <form onSubmit={(event) => { event.preventDefault(); const content = editingCommentContent.trim(); if (content) updateCommentMutation.mutate({ commentId: comment.id, content }); }}><textarea required rows={3} value={editingCommentContent} onChange={(event) => setEditingCommentContent(event.target.value)} className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm" aria-label="댓글 수정" /><div className="mt-2 flex justify-end gap-2"><button type="button" onClick={() => setEditingCommentId(null)} className="rounded-lg border px-4 py-2 text-sm transition-colors hover:bg-slate-50">취소</button><button type="submit" disabled={updateCommentMutation.isPending} className="rounded-lg bg-teal-600 px-4 py-2 text-sm text-white transition-colors hover:bg-teal-700 disabled:opacity-50">저장</button></div>{updateCommentMutation.isError && <p role="alert" className="text-sm text-red-600">댓글을 수정하지 못했습니다.</p>}</form> : <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{comment.content}</p>}
            </div>{editingCommentId !== comment.id && (canManageComment(comment) || canDeleteComment(comment)) && <div className="flex shrink-0 gap-3 text-sm">{canManageComment(comment) && <button type="button" onClick={() => { setEditingCommentId(comment.id); setEditingCommentContent(comment.content); }} className="text-slate-500 hover:text-teal-600">수정</button>}{canDeleteComment(comment) && <button type="button" onClick={() => { if (confirm('이 댓글을 삭제하시겠습니까?')) deleteCommentMutation.mutate(comment.id); }} className="text-slate-500 hover:text-red-500">삭제</button>}</div>}</div></article>)}
            {post.comments.length === 0 && <p className="py-5 text-center text-sm text-slate-400">아직 댓글이 없습니다.</p>}
            {deleteCommentMutation.isError && <p role="alert" className="py-3 text-sm text-red-600">댓글을 삭제하지 못했습니다.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
