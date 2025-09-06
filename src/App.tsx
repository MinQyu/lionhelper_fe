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
import ErrorBoundary from '@/components/ErrorBoundary';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import BootcampRegistration from './pages/bootcamp/registration';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

function AppContent() {
  const { checkAuthStatus, initialized, loading } = useAuthStore();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  if (!initialized && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" message="앱을 초기화하는 중..." />
      </div>
    );
  }

  return (
    <Routes>
      {/* 공개 라우트 */}
      <Route path="/uiguide" element={<UIGuide />} />
      <Route path="/" element={<Login />} />

      {/* 보호된 라우트 */}
      <Route element={<Layout />}>
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
    <ErrorBoundary>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
