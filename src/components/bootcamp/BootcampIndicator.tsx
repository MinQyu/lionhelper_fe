import { useParams, useLocation } from 'react-router-dom';
import { ChevronRight, BarChart3 } from 'lucide-react';
import { useBootcampStore } from '@/store';

function BootcampIndicator() {
  const { CourseId } = useParams<{ CourseId: string }>();
  const location = useLocation();
  const getCourseById = useBootcampStore(state => state.getCourseById);
  const isOverviewPage = location.pathname.includes('/bootcamp/overview');
  const currentCourse = CourseId ? getCourseById(CourseId) : null;

  const getTitle = () => {
    if (isOverviewPage) {
      return '전체 현황';
    }
    return currentCourse?.training_course || '부트캠프 관리';
  };

  const getIcon = () => {
    if (isOverviewPage) {
      return <BarChart3 className="w-5 h-5" />;
    }
    return <ChevronRight className="w-5 h-5" />;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-3 mb-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
          {getIcon()}
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">{getTitle()}</h1>
          <p className="text-sm text-muted-foreground">
            {isOverviewPage
              ? '진행중인 부트캠프의 전체 현황입니다'
              : `${currentCourse?.start_date} ~ ${currentCourse?.end_date}`}
          </p>
        </div>
      </div>
    </div>
  );
}

export default BootcampIndicator;
