import UIGuide from '@/pages/UIGuide';
import Layout from '@/layout/Layout';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from '@/pages/dashboard';
import BootcampIndex from '@/pages/bootcamp';
import BootcampOverview from '@/pages/bootcamp/overview';
import BootcampDetail from '@/pages/bootcamp/[bootcampId]';
import Notice from '@/pages/notice';
import Admin from '@/pages/admin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UIGuide />} />
      </Routes>
      <Layout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bootcamp" element={<BootcampIndex />} />
          <Route path="/bootcamp/overview" element={<BootcampOverview />} />
          <Route path="/bootcamp/:bootcampId" element={<BootcampDetail />} />
          <Route path="/notice" element={<Notice />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
