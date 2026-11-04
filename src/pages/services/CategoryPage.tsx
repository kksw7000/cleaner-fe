import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { categoryLabels, categoryIcons, services, type ServiceCategory } from '@/data/mockData';
import { categoryPhotos } from '@/data/photoData';

const PHOTOS_PER_PAGE = 9;

const categoryDescriptions: Record<ServiceCategory, string> = {
  MATTRESS: '자외선 살균과 고온 스팀으로 매트리스의 진드기, 알레르기 유발 물질, 세균과 냄새를 제거해 새것처럼 쾌적하게 관리합니다.',
  SOFA_CARPET: '고압 스팀과 온수 추출 방식으로 다양한 패브릭 소파와 카페트의 오염을 말끔히 제거합니다.',
  MOVE_IN: '이사 전후 집 안의 모든 표면과 설비, 수납장, 구석까지 꼼꼼하게 청소해 드립니다.',
  APPLIANCE: '벽걸이·스탠드 에어컨과 세탁기를 분해해 살균 세척한 뒤 꼼꼼하게 재조립합니다.',
  CONSTRUCTION: '공사 후 남은 콘크리트 먼지와 페인트 자국, 접착제 잔여물과 미세 먼지를 전문적으로 제거합니다.',
  COMMERCIAL: '사무실, 회의실, 매장, 로비 등 다양한 규모의 상업 공간을 정기 또는 일회성으로 청소합니다.',
  WAX_COATING: '마루와 타일 바닥에 왁스 코팅을 시공해 광택을 되살리고 표면을 보호합니다.',
  REGULAR_CLEANING: '주간·격주·월간 일정에 맞춰 거실, 주방, 욕실 등 생활 공간을 정기적으로 관리합니다.',
  ESTATE_CLEANING: '유품과 생활용품을 세심하게 분류·정리하고 공간을 깨끗하게 정돈해 드립니다.',
};

interface CategoryPageProps {
  categoryOverride?: ServiceCategory;
}

export default function CategoryPage({ categoryOverride }: CategoryPageProps) {
  const { category } = useParams<{ category: string }>();
  const catKey = categoryOverride ?? (category?.toUpperCase() as ServiceCategory) ?? null;

  const [page, setPage] = useState(1);
  const [lightbox, setLightbox] = useState<string | null>(null);

  if (!catKey || !categoryLabels[catKey]) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">서비스 카테고리를 찾을 수 없습니다.</p>
          <Link to="/services" className="text-[#0B1F3A] hover:underline font-medium">← 서비스 목록으로</Link>
        </div>
      </div>
    );
  }

  const photos = categoryPhotos[catKey];
  const totalPages = Math.ceil(photos.length / PHOTOS_PER_PAGE);
  const pagePhotos = photos.slice((page - 1) * PHOTOS_PER_PAGE, page * PHOTOS_PER_PAGE);
  const relatedServices = services.filter((s) => s.category === catKey);

  return (
    <div className="bg-white">
      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <img
            src={`https://images.unsplash.com/${lightbox}?w=1200&h=900&fit=crop&auto=format`}
            alt=""
            className="max-w-full max-h-full rounded object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl w-10 h-10 flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      )}

      {/* Hero */}
      <div className="relative min-h-[340px] bg-[#0B1F3A] text-white overflow-hidden flex items-center">
        <div className="absolute inset-0">
          <img
            src={`https://images.unsplash.com/${photos[0]}?w=1400&h=500&fit=crop&auto=format`}
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A] via-[#0B1F3A]/70 to-transparent" />
        </div>
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <nav className="text-xs text-slate-400 mb-6 flex items-center gap-2">
            <Link to="/" className="hover:text-white transition-colors">홈</Link>
            <span>/</span>
            <Link to="/services" className="hover:text-white transition-colors">서비스</Link>
            <span>/</span>
            <span className="text-white">{categoryLabels[catKey]}</span>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{categoryIcons[catKey]}</span>
            <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">청소 서비스</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: 'Outfit' }}>{categoryLabels[catKey]}</h1>
          <p className="text-slate-300 max-w-2xl leading-relaxed text-sm md:text-base">{categoryDescriptions[catKey]}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Service info strip */}
        {relatedServices.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {relatedServices.map((s) => (
              <div key={s.id} className="border border-slate-200 rounded-lg p-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-[#0B1F3A] text-sm mb-1" style={{ fontFamily: 'Outfit' }}>{s.name}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{s.description}</p>
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-black text-[#0B1F3A] text-sm" style={{ fontFamily: 'Outfit' }}>₩{s.price.toLocaleString()}</div>
                  <Link to={`/services/detail/${s.id}`} className="text-xs text-slate-400 hover:text-[#0B1F3A] transition-colors mt-1 block">예약하기 →</Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Photo grid heading */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-[#0B1F3A]">작업 사진</h2>
            <p className="text-slate-400 text-sm mt-1">사진 {photos.length}장 · {totalPages}페이지 중 {page}페이지</p>
          </div>
        </div>

        {/* 3×3 Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
          {pagePhotos.map((id, i) => (
            <button
              key={`${id}-${i}`}
              onClick={() => setLightbox(id)}
              className="group relative aspect-square overflow-hidden rounded-lg bg-slate-100"
            >
              <img
                src={`https://images.unsplash.com/${id}?w=500&h=500&fit=crop&auto=format`}
                alt={`${categoryLabels[catKey]} 작업 사진 ${(page - 1) * PHOTOS_PER_PAGE + i + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-[#0B1F3A]/0 group-hover:bg-[#0B1F3A]/20 transition-colors flex items-center justify-center">
                <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                {(page - 1) * PHOTOS_PER_PAGE + i + 1}
              </div>
            </button>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <button
              onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              disabled={page === 1}
              className="px-5 py-2 border border-slate-200 rounded text-sm font-medium text-slate-600 hover:border-[#0B1F3A] hover:text-[#0B1F3A] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ← 이전
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`w-9 h-9 text-sm font-medium rounded transition-colors ${p === page ? 'bg-[#0B1F3A] text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              disabled={page === totalPages}
              className="px-5 py-2 border border-slate-200 rounded text-sm font-medium text-slate-600 hover:border-[#0B1F3A] hover:text-[#0B1F3A] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              다음 →
            </button>
          </div>
        )}

        {/* Category nav */}
        <div className="mt-16 pt-10 border-t border-slate-100">
          <h3 className="text-sm font-bold text-[#0B1F3A] mb-4 tracking-wider">다른 서비스</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(categoryLabels)
              .filter(([key]) => key !== catKey)
              .map(([key, label]) => (
                <Link
                  key={key}
                  to={`/services/${key.toLowerCase()}`}
                  className="px-4 py-2 border border-slate-200 rounded text-sm text-slate-600 hover:border-[#0B1F3A] hover:text-[#0B1F3A] transition-colors"
                >
                  {label}
                </Link>
              ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[#0B1F3A] text-white py-14 mt-8 text-center">
        <h2 className="text-2xl md:text-3xl font-black mb-3">{categoryLabels[catKey]} 서비스를 예약하시겠어요?</h2>
        <p className="text-slate-300 mb-6 text-sm">검증된 전문 서비스로 깨끗한 공간을 만들어 드립니다.</p>
        <Link to="/reservation" className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-[#0B1F3A] font-bold rounded text-sm hover:bg-slate-100 transition-colors tracking-wide">
          지금 예약하기
        </Link>
      </div>
    </div>
  );
}
