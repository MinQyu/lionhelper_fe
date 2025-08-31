import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, LaptopMinimalCheck, Bell, Shield, LogOut } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface MenuItem {
  id: string;
  title: string;
  icon: LucideIcon;
  href?: string;
}

// 공통 스타일 생성 함수
const getMenuItemStyles = (isActive: boolean, isSubItem = false) => {
  const baseStyles =
    'flex items-center gap-3 hover:bg-menu-hover rounded-lg transition-colors xl:gap-4';
  const paddingStyles = isSubItem ? 'p-2 pl-6' : 'p-2';
  const activeStyles = isActive
    ? 'text-primary bg-menu-active'
    : 'text-foreground';
  const subItemStyles = isSubItem && isActive ? 'bg-sidebar' : '';

  return `${baseStyles} ${paddingStyles} ${activeStyles} ${subItemStyles}`.trim();
};

const MenuItemComponent = ({
  item,
  className,
  onMouseEnter,
  onMouseLeave,
}: {
  item: MenuItem;
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) => (
  <Link
    to={item.href || '#'}
    className={className}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <item.icon className="w-5 h-5 xl:w-6 xl:h-6" />
    <span className="font-bold">{item.title}</span>
  </Link>
);

interface SidebarProps {
  onCourseHover?: () => void;
  onCourseLeave?: () => void;
}

function Sidebar({ onCourseHover, onCourseLeave }: SidebarProps = {}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const currentPath = location.pathname;

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      title: '대시보드',
      icon: Home,
      href: '/dashboard',
    },
    {
      id: 'bootcamp',
      title: '부트캠프 관리',
      icon: LaptopMinimalCheck,
      href: '/bootcamp/overview',
    },
    {
      id: 'notice',
      title: '공지사항',
      icon: Bell,
      href: '/notice',
    },
    {
      id: 'admin',
      title: '어드민',
      icon: Shield,
      href: '/admin',
    },
  ];

  const isActiveMenu = (href: string) => {
    if (href === '/bootcamp/overview') {
      return currentPath.startsWith('/bootcamp');
    }
    return currentPath === href;
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  return (
    <aside className="w-56 xl:w-64 fixed bg-sidebar border-r border-border h-screen shadow-sm flex flex-col text-lg xl:text-xl z-100">
      <div className="p-4 flex-1 xl:p-5">
        <div className="mt-2 mb-8">
          <Link to="/dashboard" className="block">
            <img
              src="/likelion_logo.png"
              alt="멋쟁이사자처럼 로고"
              className="w-40 object-contain max-h-16"
            />
          </Link>
        </div>

        <div className="flex items-center pl-2 mt-10 mb-10">
          <span className="font-bold">
            {user?.name || user?.username}님의 라이언헬퍼
          </span>
        </div>

        <nav aria-label="메인 네비게이션">
          <ul className="space-y-4 list-none">
            {menuItems.map(item => (
              <li key={item.id}>
                <MenuItemComponent
                  item={item}
                  className={getMenuItemStyles(isActiveMenu(item.href || '#'))}
                  onMouseEnter={
                    item.id === 'bootcamp' ? onCourseHover : undefined
                  }
                  onMouseLeave={
                    item.id === 'bootcamp' ? onCourseLeave : undefined
                  }
                />
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* 로그아웃 버튼 */}
      <div className="px-4 py-2 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-2 hover:cursor-pointer hover:text-primary rounded-lg transition-colors text-foreground w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-bold">로그아웃</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
