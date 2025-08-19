import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Bell,
  Shield,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Users,
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
  const subItemStyles =
    isSubItem && !isActive ? 'text-muted-foreground hover:text-foreground' : '';

  return `${baseStyles} ${paddingStyles} ${activeStyles} ${subItemStyles}`.trim();
};

// 메뉴 아이템 컴포넌트
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

// 서브메뉴 아이템 컴포넌트
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

// 아코디언 버튼 컴포넌트
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
  <button onClick={onClick} className={className}>
    <div className="flex items-center gap-3">
      <item.icon className="w-5 h-5" />
      <span className="font-bold">{item.title}</span>
    </div>
    {isOpen ? (
      <ChevronDown className="w-4 h-4" />
    ) : (
      <ChevronRight className="w-4 h-4" />
    )}
  </button>
);

function Sidebar() {
  const [isBootcampOpen, setIsBootcampOpen] = useState(false);
  const location = useLocation();
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
      icon: BookOpen,
      hasSubMenu: true,
      subItems: [
        {
          id: 'overview',
          title: '전체 현황',
          icon: BarChart3,
          href: '/bootcamp/overview',
        },
        {
          id: 'individual',
          title: '개별 과정',
          icon: Users,
          href: '/bootcamp/individual',
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
    <aside className="w-56 bg-sidebar border-r border-border h-screen shadow-sm">
      <div className="p-4">
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
          <span>000님의 라이언헬퍼</span>
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
                    {isBootcampOpen && (
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
                    )}
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
    </aside>
  );
}

export default Sidebar;
