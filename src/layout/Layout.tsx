import { useState, useRef } from 'react';
import Sidebar from '@/layout/Sidebar';
import SubSidebar from '@/layout/SubSidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSubSidebarVisible, setIsSubSidebarVisible] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSubSidebarShow = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setIsSubSidebarVisible(true);
  };

  const handleSubSidebarHide = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setIsSubSidebarVisible(false);
      hideTimeoutRef.current = null;
    }, 200);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar
        onCourseHover={handleSubSidebarShow}
        onCourseLeave={handleSubSidebarHide}
      />
      <SubSidebar
        isVisible={isSubSidebarVisible}
        onMouseEnter={handleSubSidebarShow}
        onMouseLeave={handleSubSidebarHide}
      />
      <main className="flex-1 bg-background p-8 ml-56 px-32">{children}</main>
    </div>
  );
}
