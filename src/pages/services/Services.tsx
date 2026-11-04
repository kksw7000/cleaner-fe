import { Link } from 'react-router-dom';
import { categoryLabels, categoryIcons, type ServiceCategory } from '@/data/mockData';
import { slideshowPhotos } from '@/data/photoData';

const categories = Object.keys(categoryLabels) as ServiceCategory[];

const heroImages: Record<ServiceCategory, string> = {
  MATTRESS: 'photo-1631049307264-da0ec9d70304',
  SOFA_CARPET: 'photo-1555041469-a586c61ea9bc',
  MOVE_IN: 'photo-1527515637462-cff94aca208b',
  APPLIANCE: 'photo-1630427804340-0b8524e85f25',
  CONSTRUCTION: 'photo-1504307651254-35680f356dfd',
  COMMERCIAL: 'photo-1497366216548-37526070297c',
  WAX_COATING: 'photo-1581578731548-c64695cc6952',
  REGULAR_CLEANING: 'photo-1563453392212-326f5e854473',
  ESTATE_CLEANING: 'photo-1614771637369-ed94441a651c',
};

const categoryDescriptions: Record<ServiceCategory, string> = {
  MATTRESS: '자외선 살균과 고온 스팀 청소로 진드기, 알레르기 유발 물질과 세균을 제거합니다.',
  SOFA_CARPET: '고압 스팀과 온수 추출 방식으로 패브릭 소파와 카페트를 깨끗하게 관리합니다.',
  MOVE_IN: '이사 전후 새 보금자리의 구석구석을 꼼꼼하게 청소합니다.',
  APPLIANCE: '에어컨과 세탁기를 분해해 세척하고 위생적으로 재조립합니다.',
  CONSTRUCTION: '공사 후 남은 먼지와 페인트 자국, 잔여물을 전문적으로 제거합니다.',
  COMMERCIAL: '사무실과 매장 등 다양한 상업 공간을 전문적으로 청소합니다.',
  WAX_COATING: '마루와 타일 바닥에 왁스 코팅을 시공해 광택과 보호 효과를 더합니다.',
  REGULAR_CLEANING: '거실, 주방, 욕실 등 생활 공간을 정기적으로 청소해 드립니다.',
  ESTATE_CLEANING: '유품과 생활용품을 정리하고 공간을 세심하게 청소합니다.',
};

export default function Services() {
  return (
    <div className="bg-white">
      {/* Page header */}
      <div className="bg-[#0B1F3A] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 mb-3">전문 청소 서비스</p>
          <h1 className="text-4xl md:text-5xl font-black">청소 서비스</h1>
          <p className="text-slate-300 mt-3 max-w-xl">카테고리를 선택해 작업 사진과 서비스 내용, 요금을 확인해 보세요.</p>
        </div>
      </div>

      {/* Categories grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat}
              to={`/services/${cat.toLowerCase()}`}
              className="group relative overflow-hidden rounded-xl bg-[#0B1F3A] aspect-[4/3] flex items-end"
            >
              <img
                src={`https://images.unsplash.com/${heroImages[cat]}?w=700&h=525&fit=crop&auto=format`}
                alt={categoryLabels[cat]}
                className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-40 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-[#0B1F3A]/20 to-transparent" />
              <div className="relative p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{categoryIcons[cat]}</span>
                </div>
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Outfit' }}>{categoryLabels[cat]}</h3>
                <p className="text-slate-300 text-sm mt-1 line-clamp-2">{categoryDescriptions[cat]}</p>
                <div className="mt-3 text-xs text-white/60 group-hover:text-white/90 transition-colors flex items-center gap-1">
                  작업 사진 보기 →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[#F8FAFC] border-t border-slate-200 py-14 text-center">
        <h2 className="text-2xl font-black text-[#0B1F3A] mb-3">어떤 서비스가 필요한지 고민되시나요?</h2>
        <p className="text-slate-500 mb-6 text-sm">무료 상담을 통해 공간에 맞는 청소 서비스를 안내해 드립니다.</p>
        <Link to="/reservation" className="inline-flex items-center gap-2 px-7 py-3 bg-[#0B1F3A] text-white font-semibold rounded text-sm hover:bg-[#060F1E] transition-colors">
          무료 상담 신청
        </Link>
      </div>
    </div>
  );
}
