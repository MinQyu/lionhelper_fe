import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  LaptopMinimalCheck,
  Bell,
  Shield,
  ChevronDown,
  BarChart3,
  ClipboardList,
  LogOut,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface MenuItem {
  id: string;
  title: string;
  icon: LucideIcon;
  href?: string;
  hasSubMenu?: boolean;
  subItems?: Array<{
    id: string;
    title: string;
    icon: LucideIcon;
    href: string;
  }>;
}

// 공통 스타일 생성 함수
const getMenuItemStyles = (isActive: boolean, isSubItem = false) => {
  const baseStyles =
    'flex items-center gap-3 hover:bg-menu-hover rounded-lg transition-colors';
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
}: {
  item: MenuItem;
  className?: string;
}) => (
  <Link to={item.href || '#'} className={className}>
    <item.icon className="w-5 h-5" />
    <span className="font-bold">{item.title}</span>
  </Link>
);

const SubMenuItemComponent = ({
  subItem,
  className,
}: {
  subItem: { id: string; title: string; icon: LucideIcon; href: string };
  className?: string;
}) => (
  <Link to={subItem.href} className={className}>
    <subItem.icon className="w-4 h-4" />
    <span className="font-semibold">{subItem.title}</span>
  </Link>
);

const AccordionButtonComponent = ({
  item,
  isOpen,
  onClick,
  className,
}: {
  item: MenuItem;
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}) => (
  <button onClick={onClick} className={`${className} accordion-button`}>
    <div className="flex items-center gap-3">
      <item.icon className="w-5 h-5" />
      <span className="font-bold">{item.title}</span>
    </div>
    <ChevronDown
      className={`w-4 h-4 chevron-icon ${isOpen ? 'rotated' : ''}`}
    />
  </button>
);

function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const isBootcampPath = currentPath.startsWith('/bootcamp/');
  const [isBootcampOpen, setIsBootcampOpen] = useState(isBootcampPath);

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
      hasSubMenu: true,
      subItems: [
        {
          id: 'overview',
          title: '전체 현황',
          icon: BarChart3,
          href: '/bootcamp/overview',
        },
        {
          id: 'course',
          title: '개별 과정',
          icon: ClipboardList,
          href: '/bootcamp/[bootcampId]',
        },
      ],
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

  const handleBootcampToggle = () => {
    setIsBootcampOpen(!isBootcampOpen);
  };

  const isActiveMenu = (href: string) => currentPath === href;

  const isActiveParent = (subItems?: Array<{ href: string }>) =>
    subItems?.some(subItem => currentPath === subItem.href) || false;

  return (
    <aside className="w-56 bg-sidebar border-r border-border h-screen shadow-sm flex flex-col text-lg">
      <div className="p-4 flex-1">
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
          <span className="font-bold">000님의 라이언헬퍼</span>
        </div>

        <nav aria-label="메인 네비게이션">
          <ul className="space-y-4 list-none">
            {menuItems.map(item => (
              <li key={item.id}>
                {item.hasSubMenu ? (
                  <div>
                    <AccordionButtonComponent
                      item={item}
                      isOpen={isBootcampOpen}
                      onClick={handleBootcampToggle}
                      className={`w-full text-left ${getMenuItemStyles(
                        isActiveParent(item.subItems)
                      )} justify-between`}
                    />
                    <div
                      className={`accordion-content ${
                        isBootcampOpen ? 'expanded' : 'collapsed'
                      }`}
                    >
                      <ul className="ml-4 mt-2 space-y-1 list-none">
                        {item.subItems?.map(subItem => (
                          <li key={subItem.id}>
                            <SubMenuItemComponent
                              subItem={subItem}
                              className={getMenuItemStyles(
                                isActiveMenu(subItem.href),
                                true
                              )}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <MenuItemComponent
                    item={item}
                    className={getMenuItemStyles(
                      isActiveMenu(item.href || '#')
                    )}
                  />
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* 로그아웃 버튼 */}
      <div className="px-4 py-2 border-t border-border">
        <button className="flex items-center gap-3 p-2 hover:cursor-pointer hover:text-primary rounded-lg transition-colors text-foreground w-full">
          <LogOut className="w-5 h-5" />
          <span className="font-bold">로그아웃</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
