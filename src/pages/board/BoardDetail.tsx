import { useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { mockPosts } from '@/data/mockData';
import { useAuthStore } from '@/store/authStore';

interface Comment {
  id: number;
  writer: string;
  authorEmail: string;
  content: string;
  createdAt: string;
}

export default function BoardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn } = useAuthStore();
  const routeState = location.state as { draftComment?: unknown } | null;
  const [posts, setPosts] = useState(mockPosts);
  const post = posts.find((p) => p.id === Number(id));
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: post?.title || '', content: post?.content || '' });
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState(() =>
    typeof routeState?.draftComment === 'string' ? routeState.draftComment : '',
  );
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">게시글을 찾을 수 없습니다.</p>
          <Link to="/board" className="text-teal-600 hover:underline">게시판으로 돌아가기</Link>
        </div>
      </div>
    );
  }

  const isAuthor = user?.nickname === post.writer;

  const handleDelete = () => {
    if (confirm('이 게시글을 삭제하시겠습니까?')) {
      navigate('/board');
    }
  };

  const handleSave = () => {
    setPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, ...editForm } : p));
    setEditing(false);
  };

  const handleCommentSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!isLoggedIn || !user) {
      navigate('/login', {
        state: { from: location.pathname, draftComment: commentContent },
      });
      return;
    }

    const content = commentContent.trim();
    if (!content) return;

    setComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        writer: user?.nickname || '회원',
        authorEmail: user.email,
        content,
        createdAt: new Date().toLocaleString('ko-KR'),
      },
    ]);
    setCommentContent('');
  };

  const canManageComment = (comment: Comment) =>
    isLoggedIn && (user?.role === 'ADMIN' || user?.email === comment.authorEmail);

  const handleCommentSave = (event: React.FormEvent, commentId: number) => {
    event.preventDefault();
    const comment = comments.find((item) => item.id === commentId);
    const content = editingCommentContent.trim();
    if (!comment || !canManageComment(comment) || !content) return;

    setComments((prev) =>
      prev.map((item) => item.id === commentId ? { ...item, content } : item),
    );
    setEditingCommentId(null);
    setEditingCommentContent('');
  };

  const handleCommentDelete = (comment: Comment) => {
    if (!canManageComment(comment) || !confirm('이 댓글을 삭제하시겠습니까?')) return;
    setComments((prev) => prev.filter((item) => item.id !== comment.id));
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <Link to="/board" className="text-sm text-slate-400 hover:text-teal-600 transition-colors inline-flex items-center gap-1 mb-8">
          ← 게시판으로 돌아가기
        </Link>

        {editing ? (
          <div className="space-y-4">
            <input
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              className="w-full text-2xl font-bold border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              style={{ fontFamily: 'Outfit' }}
            />
            <textarea
              rows={10}
              value={editForm.content}
              onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none leading-relaxed"
            />
            <div className="flex gap-3">
              <button onClick={handleSave} className="px-5 py-2 bg-teal-600 text-white text-sm font-medium rounded-full hover:bg-teal-700 transition-colors">저장</button>
              <button onClick={() => setEditing(false)} className="px-5 py-2 border border-slate-200 text-slate-600 text-sm rounded-full hover:border-slate-400 transition-colors">취소</button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight" style={{ fontFamily: 'Outfit' }}>{post.title}</h1>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xs">
                  {post.writer[0]}
                </div>
                <span className="font-medium text-slate-700">{post.writer}</span>
                <span>·</span>
                <span>{post.createdAt}</span>
                <span>·</span>
                <span>👁 {post.viewCount}</span>
              </div>
              {isAuthor && (
                <div className="flex gap-3 text-sm">
                  <button onClick={() => setEditing(true)} className="text-slate-500 hover:text-teal-600 transition-colors font-medium">수정</button>
                  <button onClick={handleDelete} className="text-slate-500 hover:text-red-500 transition-colors font-medium">삭제</button>
                </div>
              )}
            </div>
            <div className="prose prose-slate max-w-none">
              {post.content.split('\n').map((line, i) => (
                <p key={i} className="text-slate-700 leading-relaxed mb-3 text-sm sm:text-base">{line}</p>
              ))}
            </div>
          </>
        )}

        <section className="mt-10 border-t border-slate-200 pt-8">
          <h2 className="mb-5 text-lg font-bold text-slate-900">
            댓글 <span className="text-teal-600">{comments.length}</span>
          </h2>
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <label htmlFor="board-comment" className="sr-only">댓글 작성</label>
            <textarea
              id="board-comment"
              rows={3}
              value={commentContent}
              onChange={(event) => setCommentContent(event.target.value)}
              placeholder="댓글을 입력하세요."
              className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <div className="mt-2 flex justify-end">
              <button
                type="submit"
                className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-700"
              >
                댓글 등록
              </button>
            </div>
          </form>

          <div className="divide-y divide-slate-100">
            {comments.map((comment) => (
              <article key={comment.id} className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-3 text-sm">
                      <span className="font-semibold text-slate-700">{comment.writer}</span>
                      <time className="text-xs text-slate-400">{comment.createdAt}</time>
                    </div>
                    {editingCommentId === comment.id ? (
                      <form onSubmit={(event) => handleCommentSave(event, comment.id)}>
                        <textarea
                          required
                          rows={3}
                          value={editingCommentContent}
                          onChange={(event) => setEditingCommentContent(event.target.value)}
                          className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                          aria-label="댓글 수정"
                        />
                        <div className="mt-2 flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingCommentId(null)}
                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                          >
                            취소
                          </button>
                          <button
                            type="submit"
                            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
                          >
                            저장
                          </button>
                        </div>
                      </form>
                    ) : (
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">{comment.content}</p>
                    )}
                  </div>
                  {editingCommentId !== comment.id && canManageComment(comment) && (
                    <div className="flex shrink-0 gap-3 text-sm">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCommentId(comment.id);
                          setEditingCommentContent(comment.content);
                        }}
                        className="text-slate-500 hover:text-teal-600"
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCommentDelete(comment)}
                        className="text-slate-500 hover:text-red-500"
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
            {comments.length === 0 && (
              <p className="py-5 text-center text-sm text-slate-400">아직 댓글이 없습니다.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
