import { useState } from 'react';
import { Link } from 'react-router-dom';
import { categoryLabels, type ServiceCategory } from '../data/mockData';
import { categoryPhotos, slideshowPhotos } from '../data/photoData';

const categories = Object.keys(categoryLabels) as ServiceCategory[];

export default function Portfolio() {
  const [active, setActive] = useState<ServiceCategory | 'ALL'>('ALL');
  const [lightbox, setLightbox] = useState<string | null>(null);

  const allPhotos = active === 'ALL'
    ? slideshowPhotos
    : categoryPhotos[active].slice(0, 12);

  return (
    <div className="bg-white">
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <img src={`https://images.unsplash.com/${lightbox}?w=1200&h=900&fit=crop&auto=format`} alt="" className="max-w-full max-h-full rounded object-contain" onClick={(e) => e.stopPropagation()} />
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl w-10 h-10 flex items-center justify-center">✕</button>
        </div>
      )}

      <div className="bg-[#0B1F3A] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400 mb-3">Real Work</p>
          <h1 className="text-4xl md:text-5xl font-black" style={{ fontFamily: 'Outfit' }}>Work Portfolio</h1>
          <p className="text-slate-300 mt-3 max-w-xl text-sm">Browse our cleaning work by category. Every photo represents a real completed project.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActive('ALL')}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${active === 'ALL' ? 'bg-[#0B1F3A] text-white' : 'border border-slate-200 text-slate-600 hover:border-[#0B1F3A] hover:text-[#0B1F3A]'}`}
          >
            All Work
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${active === cat ? 'bg-[#0B1F3A] text-white' : 'border border-slate-200 text-slate-600 hover:border-[#0B1F3A] hover:text-[#0B1F3A]'}`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>

        {/* Photo grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
          {allPhotos.map((id, i) => (
            <button
              key={`${id}-${i}`}
              onClick={() => setLightbox(id)}
              className="group relative aspect-square overflow-hidden rounded bg-slate-100"
            >
              <img
                src={`https://images.unsplash.com/${id}?w=400&h=400&fit=crop&auto=format`}
                alt={`Work photo ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-[#0B1F3A]/0 group-hover:bg-[#0B1F3A]/25 transition-colors" />
            </button>
          ))}
        </div>

        {active !== 'ALL' && (
          <div className="text-center mt-8">
            <Link to={`/services/${active.toLowerCase()}`} className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B1F3A] border-b border-[#0B1F3A] hover:text-slate-600 transition-colors">
              View {categoryLabels[active]} Service Details →
            </Link>
          </div>
        )}
      </div>

      <div className="bg-[#0B1F3A] text-white py-14 text-center">
        <h2 className="text-2xl font-black mb-3" style={{ fontFamily: 'Outfit' }}>Interested in our work?</h2>
        <p className="text-slate-300 mb-6 text-sm">Book a professional cleaning and get results like these.</p>
        <Link to="/reservation" className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-[#0B1F3A] font-bold rounded text-sm hover:bg-slate-100 transition-colors">BOOK A SERVICE</Link>
      </div>
    </div>
  );
}
