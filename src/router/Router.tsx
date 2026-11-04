import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
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
import SofaCarpet from '@/pages/services/SofaCarpet';
import WaxCoating from '@/pages/services/WaxCoating';
import BoardDetail from '@/pages/board/BoardDetail';
import BoardList from '@/pages/board/BoardList';
import BoardWrite from '@/pages/board/BoardWrite';

/** 공통 헤더와 푸터가 필요한 페이지에만 공개 레이아웃을 적용합니다. */
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

/** URL을 화면 컴포넌트에 연결하고 앱 전체에 브라우저 라우팅을 제공합니다. */
export default function Router() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/admin" element={<AdminLayout />}>
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
        <Route path="/services/sofa_carpet" element={<PublicLayout><SofaCarpet /></PublicLayout>} />
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
        <Route path="/board" element={<PublicLayout><BoardList /></PublicLayout>} />
        <Route path="/board/:id" element={<PublicLayout><BoardDetail /></PublicLayout>} />
        <Route path="/board/new" element={<PublicLayout><BoardWrite /></PublicLayout>} />
      </Routes>
    </BrowserRouter>
  );
}
