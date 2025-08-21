import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface TabItem {
  id: string;
  label: string;
  value: string;
  href?: string;
}

interface TabProps {
  items: TabItem[];
  defaultTab?: string;
  basePath?: string;
  className?: string;
  queryParam?: string;
  onTabChange?: (value: string) => void;
  children?: React.ReactNode;
}

function Tab({
  items,
  defaultTab,
  basePath = '',
  className,
  queryParam = 'tab',
  onTabChange,
  children,
}: TabProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentTabFromUrl = useCallback(() => {
    const currentPath = location.pathname;
    const activeItemByPath = items.find(item => item.href === currentPath);
    if (activeItemByPath) {
      return activeItemByPath.value;
    }

    // href가 없거나 매칭되지 않으면 쿼리 매개변수 확인
    const searchParams = new URLSearchParams(location.search);
    const tabFromUrl = searchParams.get(queryParam);
    return tabFromUrl || defaultTab || items[0]?.value || '';
  }, [location.search, location.pathname, defaultTab, items, queryParam]);

  const [activeTab, setActiveTab] = useState(getCurrentTabFromUrl);

  useEffect(() => {
    const currentTab = getCurrentTabFromUrl();
    setActiveTab(currentTab);
  }, [getCurrentTabFromUrl]);

  const handleTabChange = (value: string, href?: string) => {
    setActiveTab(value);
    // 커스텀 href가 있으면 해당 경로로 이동
    if (href) {
      navigate(href);
    } else {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set(queryParam, value); // 설정 가능한 쿼리 매개변수 사용
      const newPath = `${basePath || location.pathname}?${searchParams.toString()}`;
      navigate(newPath, { replace: true });
    }
    onTabChange?.(value);
  };

  return (
    <div className={cn('w-full', className)}>
      {/* 탭 헤더 */}
      <div className="border-b border-border">
        <nav className="flex space-x-8" aria-label="탭 네비게이션">
          {items.map(item => {
            const isActive = activeTab === item.value;

            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.value, item.href)}
                className={cn(
                  'whitespace-nowrap py-2 px-1 border-b-2 font-bold text-sm transition-colors',
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                )}
                aria-selected={isActive}
                role="tab"
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 탭 컨텐츠 */}
      {children && (
        <div className="mt-4" role="tabpanel">
          {children}
        </div>
      )}
    </div>
  );
}

export default Tab;
