import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Services from './pages/Services';
import CategoryPage from './pages/CategoryPage';
import ServiceDetail from './pages/ServiceDetail';
import Portfolio from './pages/Portfolio';
import Company from './pages/Company';
import Reservation from './pages/Reservation';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import MyPage from './pages/MyPage';
import Board from './pages/Board';
import BoardDetail from './pages/BoardDetail';
import CreatePost from './pages/CreatePost';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMembers from './pages/admin/AdminMembers';
import AdminPosts from './pages/admin/AdminPosts';
import AdminServices from './pages/admin/AdminServices';
import AdminReservations from './pages/admin/AdminReservations';

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth — no nav */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Admin — own layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="members" element={<AdminMembers />} />
          <Route path="posts" element={<AdminPosts />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="reservations" element={<AdminReservations />} />
        </Route>

        {/* Public */}
        <Route path="/" element={<PublicLayout><Landing /></PublicLayout>} />
        <Route path="/company" element={<PublicLayout><Company /></PublicLayout>} />
        <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
        <Route path="/services/:category" element={<PublicLayout><CategoryPage /></PublicLayout>} />
        <Route path="/services/detail/:id" element={<PublicLayout><ServiceDetail /></PublicLayout>} />
        <Route path="/portfolio" element={<PublicLayout><Portfolio /></PublicLayout>} />
        <Route path="/reservation" element={<PublicLayout><Reservation /></PublicLayout>} />
        <Route path="/mypage" element={<PublicLayout><MyPage /></PublicLayout>} />
        <Route path="/board" element={<PublicLayout><Board /></PublicLayout>} />
        <Route path="/board/:id" element={<PublicLayout><BoardDetail /></PublicLayout>} />
        <Route path="/board/new" element={<PublicLayout><CreatePost /></PublicLayout>} />
      </Routes>
    </BrowserRouter>
  );
}
