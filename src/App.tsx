import UIGuide from '@/pages/UIGuide';
import Layout from '@/layout/Layout';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from '@/pages/dashboard';
import BootcampIndex from '@/pages/bootcamp';
import BootcampOverview from '@/pages/bootcamp/overview';
import BootcampDetail from '@/pages/bootcamp/[CourseName]';
import Notice from '@/pages/notice';
import Admin from '@/pages/admin';
import Login from '@/pages/login';
import PrivateRoute from '@/components/PrivateRoute';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import BootcampRegistration from './pages/bootcamp/registration';

function AppContent() {
  const { checkAuthStatus, initialized } = useAuthStore();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/uiguide" element={<UIGuide />} />
      <Route path="/" element={<Login />} />

      <Route element={<Layout />}>
        {/* 로그인이 필요한 라우트 */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bootcamp" element={<BootcampIndex />} />
          <Route path="/bootcamp/overview" element={<BootcampOverview />} />
          <Route path="/bootcamp/:CourseName" element={<BootcampDetail />} />
          <Route
            path="/bootcamp/registration"
            element={<BootcampRegistration />}
          />
          <Route path="/notice" element={<Notice />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
