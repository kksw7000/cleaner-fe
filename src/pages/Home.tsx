import { Link } from 'react-router-dom';
import { categoryLabels, mockPosts, type ServiceCategory } from '@/data/mockData';
import { useAuthStore } from '@/store/authStore';

const categories = Object.keys(categoryLabels) as ServiceCategory[];

// 현장 사진을 두 행으로 나누어 서로 다른 이미지가 이어지도록 구성합니다.
const row1Photos = [
  '/images/services/mattress/매트1.jpg',
  '/images/services/mattress/매트2.jpg',
  '/images/services/mattress/매트3.jpg',
  '/images/services/mattress/매트4.jpg',
  '/images/services/mattress/매트5.jpg',
  '/images/services/mattress/매트6.jpg',
  '/images/services/mattress/매트8.jpg',
  '/images/services/fabric/소파1.jpg',
  '/images/services/fabric/소파2.jpg',
  '/images/services/fabric/소파3.jpg',
  '/images/services/fabric/소파4.jpg',
  '/images/services/fabric/소파5.jpg',
  '/images/services/fabric/소파6.jpg',
  '/images/services/fabric/소파7.jpg',
  '/images/services/fabric/소파8.jpg',
  '/images/services/fabric/소파9.jpg',
];

const row2Photos = [
  '/images/services/commercial/상가청소1.jpg',
  '/images/services/commercial/상가청소2.jpg',
  '/images/services/commercial/상가청소3.jpg',
  '/images/services/commercial/상가청소4.jpg',
  '/images/services/commercial/상가청소5.jpg',
  '/images/services/commercial/상가청소6.jpg',
  '/images/services/commercial/상가청소7.jpg',
  '/images/services/commercial/상가청소8.jpg',
  '/images/services/coating/광택1.jpg',
  '/images/services/coating/광택2.jpg',
  '/images/services/coating/광택3.jpg',
  '/images/services/coating/광택4.jpg',
  '/images/services/coating/광택5.jpg',
  '/images/services/coating/광택6.jpg',
  '/images/services/coating/광택7.jpg',
  '/images/services/coating/광택8.jpg',
  '/images/services/coating/광택9.jpg',
];

/** 현장 작업 사진을 양방향으로 흐르는 두 줄의 이미지 띠로 보여줍니다. */
function OnSiteStrip() {
  // 배열을 두 번 이어 붙여 애니메이션이 끊기지 않도록 합니다.
  const r1 = [...row1Photos, ...row1Photos];
  const r2 = [...row2Photos, ...row2Photos];

  return (
    <section className="bg-[#060F1E] py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
        <div className="flex items-baseline gap-4">
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight" style={{ fontFamily: 'Outfit' }}>
            현장 사진
          </h2>
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500">
            실제 작업 사례
          </span>
        </div>
      </div>

      {/* 첫 번째 사진 행은 왼쪽으로 이동하고, 이미지 복제로 반복 구간을 자연스럽게 연결합니다. */}
      <div className="strip-track overflow-hidden mb-3">
        <div className="strip-left flex" style={{ width: 'max-content' }}>
          {r1.map((id, i) => (
            <div
              key={`r1-${i}`}
              className="mr-4 shrink-0 overflow-hidden rounded-md bg-slate-800"
              style={{ width: '220px', height: '220px' }}
            >
              <img
                src={id}
                alt=""
                draggable={false}
                className="w-full h-full object-cover opacity-90"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 두 번째 사진 행은 첫 번째 행과 반대 방향인 오른쪽으로 이동합니다. */}
      <div className="strip-track overflow-hidden">
        <div className="strip-right flex" style={{ width: 'max-content' }}>
          {r2.map((id, i) => (
            <div
              key={`r2-${i}`}
              className="mr-4 shrink-0 overflow-hidden rounded-md bg-slate-800"
              style={{ width: '220px', height: '220px' }}
            >
              <img
                src={id}
                alt=""
                draggable={false}
                className="w-full h-full object-cover opacity-90"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const features = [
  { title: '검증된 전문 인력', desc: '모든 작업자는 충분한 교육과 검증을 거쳐 안심하고 서비스를 이용하실 수 있습니다.' },
  { title: '믿을 수 있는 작업 결과', desc: '실제 작업 사례를 통해 청만사의 꼼꼼한 변화를 확인하실 수 있습니다.' },
  { title: '편리한 일정 예약', desc: '온라인으로 간편하게 예약하고 월요일부터 토요일까지 원하는 시간을 선택하세요.' },
  { title: '만족 보장 서비스', desc: '서비스 결과에 만족하지 못하셨다면 추가 비용 없이 불편 사항을 확인하고 조치해 드립니다.' },
];

/** 서비스 소개, 작업 사례, 목업 게시글을 한 화면에 모은 홈 페이지입니다. */
export default function Landing() {
  const { isLoggedIn } = useAuthStore();
  // 비로그인 사용자는 로그인 후 예약 화면으로 돌아오도록 원래 목적지를 전달합니다.
  const bookingPath = isLoggedIn ? '/reservation' : '/login';
  const bookingState = isLoggedIn ? undefined : { from: '/reservation' };

  return (
    <div className="bg-white">
      {/* ── HERO ─────────────────────────────── */}
      <section className="relative bg-[#0B1F3A] text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600&h=900&fit=crop&auto=format"
            alt="전문 청소 서비스"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A] via-[#0B1F3A]/80 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-28 md:py-40">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 mb-5">청만사 전문 청소 서비스</p>
            <h1 className="text-5xl md:text-7xl font-black leading-[1.05] mb-6 tracking-tight" style={{ fontFamily: 'Outfit' }}>
              검증된 실력으로,<br />
              전문적으로,<br />
              <span className="text-white/60">완벽하게.</span>
            </h1>
            <div className="flex flex-wrap gap-4">
              <Link to={bookingPath} state={bookingState} className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-[#0B1F3A] font-bold rounded text-sm hover:bg-slate-100 transition-colors tracking-wide">
                예약하기
              </Link>
              <Link to="/services" className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/30 text-white font-medium rounded text-sm hover:bg-white/5 transition-colors">
                서비스 보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── ON SITE PHOTO STRIP ──────────────── */}
      <OnSiteStrip />

      {/* ── WHY US ────────────────────────────── */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 mb-3">청만사를 선택하는 이유</p>
            <h2 className="text-3xl md:text-4xl font-black text-[#0B1F3A]" style={{ fontFamily: 'Outfit' }}>청만사 만의 차별점</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white border border-slate-200 rounded-lg p-6 hover:border-[#0B1F3A]/30 hover:shadow-sm transition-all">
                <div className="w-8 h-0.5 bg-[#0B1F3A] mb-4" />
                <h3 className="font-bold text-[#0B1F3A] mb-3 text-sm" style={{ fontFamily: 'Outfit' }}>{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOARD PREVIEW ─────────────────────── */}
      <section className="py-20 bg-[#0B1F3A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 mb-2">고객 소통 공간</p>
              <h2 className="text-3xl md:text-4xl font-black text-white">게시판</h2>
            </div>
            <Link to="/board" className="text-sm text-slate-400 hover:text-white transition-colors hidden sm:block">게시판 전체 보기 →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockPosts.slice(0, 3).map((post) => (
              <Link to={`/board/${post.id}`} key={post.id} className="group rounded-lg border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors">
                <h3 className="font-bold text-white group-hover:text-slate-200 transition-colors">{post.title}</h3>
                <p className="mt-3 text-sm text-slate-400 line-clamp-3 leading-relaxed">{post.content}</p>
                <div className="mt-5 flex items-center justify-between text-xs text-slate-500">
                  <span>{post.writer}</span>
                  <span>{post.createdAt}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
