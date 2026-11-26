import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { categoryLabels, type ServiceCategory } from '@/data/mockData';
import {
  getNotificationHome,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  notificationKeys,
} from '@/features/notification/NotificationApi';
import { logoutFromServer } from '@/api/AuthApi';

const categories = Object.keys(categoryLabels) as ServiceCategory[];

/** 공통 내비게이션과 로그인 회원의 알림 요약을 표시합니다. */
export default function Header() {
  const { isLoggedIn, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const notificationHomeQuery = useQuery({
    queryKey: notificationKeys.home,
    queryFn: getNotificationHome,
    enabled: isLoggedIn,
  });
  // 읽음 처리 후 헤더와 알림 보관함이 같은 최신 서버 상태를 보도록 관련 캐시를 갱신합니다.
  const invalidateNotifications = () => queryClient.invalidateQueries({ queryKey: notificationKeys.all });
  const markReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: invalidateNotifications,
  });
  const markAllMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: invalidateNotifications,
  });

  useEffect(() => {
    // 드롭다운 바깥을 클릭하면 메뉴를 닫고, 언마운트 시 전역 이벤트 리스너를 정리합니다.
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  /** 로컬 인증 상태를 먼저 정리해 즉시 화면을 전환하고 서버 쿠키 만료도 요청합니다. */
  const handleLogout = () => {
    // 다른 계정으로 전환할 때 이전 회원의 알림 캐시가 노출되지 않도록 먼저 제거합니다.
    queryClient.removeQueries({ queryKey: notificationKeys.all });
    logout();
    void logoutFromServer().catch((error: unknown) => {
      console.error('로그아웃 쿠키를 서버에서 만료하지 못했습니다.', error);
    });
    navigate('/');
    setMenuOpen(false);
    setNotificationsOpen(false);
  };

  /** 현재 경로와 정확히 일치하는 메뉴에 활성 스타일을 적용합니다. */
  const isActive = (path: string) => location.pathname === path;

  /** 현재 경로에 맞는 내비게이션 링크 스타일을 계산합니다. */
  const navLinkCls = (path: string) =>
    `text-sm transition-colors ${isActive(path) ? 'text-white font-semibold' : 'text-slate-300 hover:text-white'}`;

  return (
    <header className="sticky top-0 z-50 bg-[#0B1F3A] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="lg:hidden font-bold text-lg tracking-wide text-white"
        >
          청소를 만드는 사람들
        </Link>

        {/* 데스크톱 메뉴 */}
        <nav className="hidden lg:flex items-center gap-7">
          <Link to="/" className={navLinkCls('/')}>청소를 만드는 사람들</Link>
          {/* 청소 서비스 메뉴 */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setServicesOpen(!servicesOpen)}
              className={`text-sm transition-colors flex items-center gap-1 ${location.pathname.startsWith('/services') ? 'text-white font-semibold' : 'text-slate-300 hover:text-white'}`}
            >
              청소 서비스
              <svg className={`w-3.5 h-3.5 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {servicesOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-[#0B1F3A] border border-white/10 rounded-lg shadow-2xl py-1 z-50">
                <Link to="/services" onClick={() => setServicesOpen(false)} className="block px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors font-medium border-b border-white/10">
                  전체 서비스
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    to={`/services/${cat.toLowerCase()}`}
                    onClick={() => setServicesOpen(false)}
                    className="block px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    {categoryLabels[cat]}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to="/board" className={navLinkCls('/board')}>게시판</Link>
          <Link to="/reservation" className={navLinkCls('/reservation')}>예약</Link>
        </nav>

        {/* 로그인 상태별 메뉴 */}
        <div className="hidden lg:flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link to="/mypage" className="text-sm text-slate-300 hover:text-white transition-colors">{user?.nickname ?? '내 계정'} 님</Link>
              <div className="relative" ref={notificationRef}>
                <button
                  type="button"
                  aria-label={`알림${notificationHomeQuery.data?.unreadCount ? `, 읽지 않은 알림 ${notificationHomeQuery.data.unreadCount}개` : ''}`}
                  aria-expanded={notificationsOpen}
                  onClick={() => setNotificationsOpen((open) => !open)}
                  className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M18 8a6 6 0 00-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
                  </svg>
                  {!!notificationHomeQuery.data?.unreadCount && (
                    <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-red-500 px-1 text-center text-[10px] font-bold leading-5 text-white">
                      {notificationHomeQuery.data.unreadCount > 99 ? '99+' : notificationHomeQuery.data.unreadCount}
                    </span>
                  )}
                </button>
                {notificationsOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-800 shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                      <h2 className="text-sm font-bold">알림</h2>
                      <button
                        type="button"
                        onClick={() => markAllMutation.mutate()}
                        disabled={!notificationHomeQuery.data?.unreadCount || markAllMutation.isPending}
                        className="text-xs font-medium text-slate-500 hover:text-[#0B1F3A] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        모두 읽음
                      </button>
                    </div>
                    {notificationHomeQuery.isPending ? (
                      <p role="status" className="px-4 py-6 text-center text-sm text-slate-500">알림을 불러오는 중입니다.</p>
                    ) : notificationHomeQuery.isError ? (
                      <p role="alert" className="px-4 py-6 text-center text-sm text-red-600">알림을 불러오지 못했습니다.</p>
                    ) : notificationHomeQuery.data.notifications.length ? (
                      <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
                        {notificationHomeQuery.data.notifications.map((notification) => (
                          <li key={notification.id} className="flex items-start gap-2 px-4 py-3 hover:bg-slate-50">
                            <Link
                              to="/notifications"
                              onClick={() => setNotificationsOpen(false)}
                              className="min-w-0 flex-1"
                            >
                              <span className="block truncate text-xs leading-5 text-slate-700">{notification.message}</span>
                              <span className="mt-1 block text-[11px] text-slate-400">
                                {notification.readAt ? '확인한 알림' : '읽지 않은 알림'}
                              </span>
                            </Link>
                            {!notification.readAt && (
                              <button
                                type="button"
                                aria-label="알림 읽음 처리"
                                onClick={() => markReadMutation.mutate(notification.id)}
                                disabled={markReadMutation.isPending}
                                className="shrink-0 rounded px-2 py-1 text-xs text-slate-500 hover:bg-slate-200 disabled:opacity-50"
                              >
                                읽음
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="px-4 py-6 text-center text-sm text-slate-500">새 알림이 없습니다.</p>
                    )}
                    {markReadMutation.isError || markAllMutation.isError ? (
                      <p role="alert" className="border-t border-red-100 bg-red-50 px-4 py-3 text-center text-sm text-red-700">읽음 상태를 변경하지 못했습니다. 기존 버튼으로 다시 시도해 주세요.</p>
                    ) : null}
                    <Link
                      to="/notifications"
                      onClick={() => setNotificationsOpen(false)}
                      className="block border-t border-slate-100 px-4 py-3 text-center text-xs font-semibold text-[#0B1F3A] hover:bg-slate-50"
                    >
                      알림 전체 보기
                    </Link>
                  </div>
                )}
              </div>
              {user?.role === 'ADMIN' && (
                <Link to="/admin" className="text-sm text-slate-400 hover:text-white transition-colors">관리자</Link>
              )}
              <button onClick={handleLogout} className="text-sm px-4 py-1.5 border border-white/20 rounded text-slate-300 hover:text-white hover:border-white/40 transition-colors">
                로그아웃
              </button>
              <Link to="/reservation" className="text-sm px-5 py-2 bg-white text-[#0B1F3A] font-semibold rounded hover:bg-slate-100 transition-colors">
                예약하기
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-slate-300 hover:text-white transition-colors">로그인</Link>
              <Link to="/signup" className="text-sm px-5 py-2 bg-white text-[#0B1F3A] font-semibold rounded hover:bg-slate-100 transition-colors">
                회원가입
              </Link>
            </>
          )}
        </div>

        {/* 모바일 메뉴 버튼 */}
        <button className="lg:hidden p-2 text-slate-300 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* 모바일 메뉴 */}
      {menuOpen && (
        <div className="lg:hidden bg-[#060F1E] border-t border-white/10 px-4 py-5 space-y-4 text-sm">
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">청소 서비스</p>
            <div className="space-y-2 pl-2">
              <Link to="/services" onClick={() => setMenuOpen(false)} className="block text-slate-400 hover:text-white">전체 서비스</Link>
              {categories.map((cat) => (
                <Link key={cat} to={`/services/${cat.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="block text-slate-500 hover:text-white text-xs">{categoryLabels[cat]}</Link>
              ))}
            </div>
          </div>
          <Link to="/board" onClick={() => setMenuOpen(false)} className="block text-slate-300 hover:text-white">게시판</Link>
          <Link to="/reservation" onClick={() => setMenuOpen(false)} className="block text-slate-300 hover:text-white">예약</Link>
          {isLoggedIn ? (
            <>
              <Link to="/notifications" onClick={() => setMenuOpen(false)} className="block text-slate-300 hover:text-white">
                알림 {notificationHomeQuery.data?.unreadCount ? `(${notificationHomeQuery.data.unreadCount})` : ''}
              </Link>
              <Link to="/mypage" onClick={() => setMenuOpen(false)} className="block text-slate-300 hover:text-white">마이페이지</Link>
              <button onClick={handleLogout} className="block text-slate-400 hover:text-white">로그아웃</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-slate-300 hover:text-white">로그인</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="block text-slate-300 hover:text-white">회원가입</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
