import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockPosts } from '../data/mockData';
import { useAuthStore } from '../store/authStore';

export default function BoardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [posts, setPosts] = useState(mockPosts);
  const post = posts.find((p) => p.id === Number(id));
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: post?.title || '', content: post?.content || '' });

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Post not found.</p>
          <Link to="/board" className="text-teal-600 hover:underline">Back to Board</Link>
        </div>
      </div>
    );
  }

  const isAuthor = user?.nickname === post.writer;

  const handleDelete = () => {
    if (confirm('Delete this post?')) {
      navigate('/board');
    }
  };

  const handleSave = () => {
    setPosts((prev) => prev.map((p) => p.id === post.id ? { ...p, ...editForm } : p));
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <Link to="/board" className="text-sm text-slate-400 hover:text-teal-600 transition-colors inline-flex items-center gap-1 mb-8">
          ← Back to Board
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
              <button onClick={handleSave} className="px-5 py-2 bg-teal-600 text-white text-sm font-medium rounded-full hover:bg-teal-700 transition-colors">Save</button>
              <button onClick={() => setEditing(false)} className="px-5 py-2 border border-slate-200 text-slate-600 text-sm rounded-full hover:border-slate-400 transition-colors">Cancel</button>
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
                  <button onClick={() => setEditing(true)} className="text-slate-500 hover:text-teal-600 transition-colors font-medium">Edit</button>
                  <button onClick={handleDelete} className="text-slate-500 hover:text-red-500 transition-colors font-medium">Delete</button>
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
      </div>
    </div>
  );
}
