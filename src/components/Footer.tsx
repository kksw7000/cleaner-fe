/** 서비스 운영 정보와 고객센터 연락처를 페이지 하단에 표시합니다. */
export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0B1F3A] text-slate-300">
      <div className="mx-auto w-full px-5 py-8 text-[11px] leading-relaxed sm:px-6 lg:px-10">
        <div className="space-y-1">
          <div>
            고객센터 :{' '}
            <p className="inline hover:text-white">
              010-2602-0993
            </p>{' '}
            (평일 09:00~20:00) | 이메일 :{' '}
            <p className="inline hover:text-white">
              win_0993@naver.com
            </p>
          </div>
          <p>
            청만사 | 주소 : 대구광역시 화원읍 비슬로 2632, 2층 | 사업자등록번호 :
            260-31-01643
          </p>
        </div>
      </div>
    </footer>
  );
}
