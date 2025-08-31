import { useParams, useLocation } from 'react-router-dom';
import { ChevronRight, BarChart3 } from 'lucide-react';
import { useBootcampStore } from '@/store/bootcampStore';
import { useEffect } from 'react';

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 월은 0부터 시작
  const day = date.getDate();

  return `${year}.${month}.${day}`;
};

function BootcampIndicator() {
  const { CourseName } = useParams<{ CourseName: string }>();
  const location = useLocation();
  const { getCourseByName, fetchCourses, courses, isLoading } =
    useBootcampStore();
  const isOverviewPage = location.pathname.includes('/bootcamp/overview');

  const decodedCourseName = CourseName ? decodeURIComponent(CourseName) : '';
  const currentCourse = decodedCourseName
    ? getCourseByName(decodedCourseName)
    : null;

  useEffect(() => {
    if (courses.length === 0) {
      fetchCourses();
    }
  }, [courses.length, fetchCourses]);

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

  // 로딩 중일 때 표시
  if (isLoading && courses.length === 0) {
    return (
      <div className="border border-border rounded-lg p-3 mb-6 w-fit">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          </div>
          <div>
            <h1 className="text-lg xl:text-xl font-bold text-foreground">
              로딩 중...
            </h1>
            <p className="text-sm xl:text-base text-muted-foreground">
              코스 정보를 불러오는 중입니다
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg p-3 mb-6 w-fit">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
          {getIcon()}
        </div>
        <div>
          <h1 className="text-lg xl:text-xl font-bold text-foreground">
            {getTitle()}
          </h1>
          <p className="text-sm xl:text-base text-muted-foreground">
            {isOverviewPage
              ? '진행중인 부트캠프의 전체 현황입니다'
              : currentCourse?.start_date && currentCourse?.end_date
                ? `${formatDate(currentCourse.start_date)} ~ ${formatDate(currentCourse.end_date)}`
                : '기간 미정'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default BootcampIndicator;
