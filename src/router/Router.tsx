import { useEffect } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStream } from '@/features/notification/useNotificationStream';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminLayout from '@/pages/admin/AdminLayout';
import AdminMembers from '@/pages/admin/AdminMembers';
import AdminPosts from '@/pages/admin/AdminPosts';
import AdminReservations from '@/pages/admin/AdminReservations';
import AdminServices from '@/pages/admin/AdminServices';
import Home from '@/pages/Home';
import MyPage from '@/pages/MyPage';
import Reservation from '@/pages/Reservation';
import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/Signup';
import Appliance from '@/pages/services/Appliance';
import CategoryPage from '@/pages/services/CategoryPage';
import Commercial from '@/pages/services/Commercial';
import Construction from '@/pages/services/Construction';
import EstateCleaning from '@/pages/services/EstateCleaning';
import Mattress from '@/pages/services/Mattress';
import MoveIn from '@/pages/services/MoveIn';
import RegularCleaning from '@/pages/services/RegularCleaning';
import ServiceDetail from '@/pages/services/ServiceDetail';
import Services from '@/pages/services/Services';
import Fabric from '@/pages/services/Fabric';
import WaxCoating from '@/pages/services/WaxCoating';
import BoardDetail from '@/pages/board/BoardDetail';
import BoardList from '@/pages/board/BoardList';
import BoardWrite from '@/pages/board/BoardWrite';
import Notifications from '@/pages/Notifications';

/** 공통 헤더와 푸터가 필요한 페이지에만 공개 레이아웃을 적용합니다. */
function PublicLayout({ children }: { children: React.ReactNode }) {
  useNotificationStream();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

/** 관리자 화면의 목업 데이터와 실제 관리자 API를 일반 회원이 열람하지 못하도록 접근을 제한합니다. */
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, user } = useAuthStore();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

/** 만료된 Refresh Token 때문에 인증을 복구하지 못하면 로그인 화면으로 안전하게 이동합니다. */
function AuthExpiryHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const handleExpiredSession = () => {
      logout();
      navigate('/login', { replace: true, state: { from: location.pathname } });
    };

    window.addEventListener('auth:expired', handleExpiredSession);
    return () => window.removeEventListener('auth:expired', handleExpiredSession);
  }, [location.pathname, logout, navigate]);

  return null;
}

/** 브라우저 뒤로 가기는 스크롤 위치를 유지하고 새 화면으로 이동할 때만 맨 위로 이동합니다. */
function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === 'POP') return;
    window.scrollTo(0, 0);
  }, [pathname, navigationType]);

  return null;
}

/** 일치하는 주소가 없을 때 안내와 홈 이동 경로를 제공해 빈 화면을 방지합니다. */
function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-3xl font-bold text-slate-900">페이지를 찾을 수 없습니다.</h1>
      <p className="mt-3 text-sm text-slate-500">주소가 올바른지 확인하거나 홈으로 이동해 주세요.</p>
      <Link to="/" className="mt-6 rounded bg-[#0B1F3A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#060F1E]">
        홈으로
      </Link>
    </div>
  );
}

/** URL을 화면 컴포넌트에 연결하고 앱 전체에 브라우저 라우팅을 제공합니다. */
export default function Router() {
  const isInitializing = useAuthStore((state) => state.isInitializing);
  const restoreFailed = useAuthStore((state) => state.restoreFailed);
  const restoreSession = useAuthStore((state) => state.restoreSession);

  useEffect(() => {
    void restoreSession();
  }, [restoreSession]);

  if (isInitializing) {
    return <div role="status" className="flex min-h-screen items-center justify-center text-sm text-slate-500">계정 정보를 불러오는 중입니다.</div>;
  }
  if (restoreFailed) {
    return <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-sm text-slate-600"><p role="alert">계정 정보를 불러오지 못했습니다.</p><button type="button" onClick={() => void restoreSession()} className="rounded bg-[#0B1F3A] px-4 py-2 font-semibold text-white">다시 시도</button></div>;
  }

  return (
    <BrowserRouter>
      <AuthExpiryHandler />
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="members" element={<AdminMembers />} />
          <Route path="posts" element={<AdminPosts />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="reservations" element={<AdminReservations />} />
        </Route>

        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/company" element={<Navigate to="/" replace />} />
        <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
        <Route path="/services/mattress" element={<PublicLayout><Mattress /></PublicLayout>} />
        <Route path="/services/fabric" element={<PublicLayout><Fabric /></PublicLayout>} />
        <Route path="/services/sofa_carpet" element={<Navigate to="/services/fabric" replace />} />
        <Route path="/services/move_in" element={<PublicLayout><MoveIn /></PublicLayout>} />
        <Route path="/services/appliance" element={<PublicLayout><Appliance /></PublicLayout>} />
        <Route path="/services/construction" element={<PublicLayout><Construction /></PublicLayout>} />
        <Route path="/services/commercial" element={<PublicLayout><Commercial /></PublicLayout>} />
        <Route path="/services/wax_coating" element={<PublicLayout><WaxCoating /></PublicLayout>} />
        <Route path="/services/regular_cleaning" element={<PublicLayout><RegularCleaning /></PublicLayout>} />
        <Route path="/services/estate_cleaning" element={<PublicLayout><EstateCleaning /></PublicLayout>} />
        <Route path="/services/:category" element={<PublicLayout><CategoryPage /></PublicLayout>} />
        <Route path="/services/detail/:id" element={<PublicLayout><ServiceDetail /></PublicLayout>} />
        <Route path="/portfolio" element={<Navigate to="/board" replace />} />
        <Route path="/reservation" element={<PublicLayout><Reservation /></PublicLayout>} />
        <Route path="/mypage" element={<PublicLayout><MyPage /></PublicLayout>} />
        <Route path="/notifications" element={<PublicLayout><Notifications /></PublicLayout>} />
        <Route path="/board" element={<PublicLayout><BoardList /></PublicLayout>} />
        <Route path="/board/:id" element={<PublicLayout><BoardDetail /></PublicLayout>} />
        <Route path="/board/new" element={<PublicLayout><BoardWrite /></PublicLayout>} />
        <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
      </Routes>
    </BrowserRouter>
  );
}
