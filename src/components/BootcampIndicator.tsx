import { useParams, useLocation } from 'react-router-dom';
import { ChevronRight, BarChart3 } from 'lucide-react';
import { useBootcampStore } from '@/store';

const BootcampIndicator = () => {
  const { CourseId } = useParams<{ CourseId: string }>();
  const location = useLocation();
  const getCourseById = useBootcampStore(state => state.getCourseById);

  // overview 페이지인지 확인
  const isOverviewPage = location.pathname.includes('/bootcamp/overview');

  // 현재 과정 정보 찾기
  const currentCourse = CourseId ? getCourseById(CourseId) : null;

  // 표시할 제목 결정
  const getTitle = () => {
    if (isOverviewPage) {
      return '전체 현황';
    }
    return currentCourse?.course_name || '부트캠프 관리';
  };

  // 아이콘 결정
  const getIcon = () => {
    if (isOverviewPage) {
      return <BarChart3 className="w-5 h-5" />;
    }
    return <ChevronRight className="w-5 h-5" />;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
          {getIcon()}
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">{getTitle()}</h1>
          <p className="text-sm text-muted-foreground">
            {isOverviewPage
              ? '모든 부트캠프 과정의 현황을 확인하세요'
              : '선택된 과정의 상세 정보를 관리하세요'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BootcampIndicator;
