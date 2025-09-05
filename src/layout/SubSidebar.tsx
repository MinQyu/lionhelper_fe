import { Link, useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiClient } from '@/api/apiClient';
import { Button } from '@/components/ui/button';

interface SubSidebarProps {
  isVisible: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function SubSidebar({
  isVisible,
  onMouseEnter,
  onMouseLeave,
}: SubSidebarProps) {
  const { CourseName } = useParams<{ CourseName: string }>();
  const navigate = useNavigate();
  const [courseNames, setCourseNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.trainingCourses.trainingCoursesList();
        if (response.data.success && response.data.data) {
          setCourseNames(response.data.data);
        }
      } catch (error) {
        console.error('코스 목록 조회 오류:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const isActiveCourse = (courseName: string) => {
    // URL 디코딩된 CourseName과 비교
    const decodedCourseName = CourseName ? decodeURIComponent(CourseName) : '';
    return decodedCourseName === courseName;
  };

  if (isLoading) {
    return (
      <div
        className={`fixed left-56 xl:left-64 top-0 h-screen bg-sidebar border-r border-border shadow-lg transition-all duration-200 ease-in-out z-50 ${
          isVisible
            ? 'translate-x-0 opacity-100'
            : '-translate-x-full opacity-0 pointer-events-none'
        }`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="p-4 h-full xl:p-5 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">코스 목록을 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed left-56 xl:left-64 top-0 h-screen bg-sidebar border-r border-border shadow-lg transition-all duration-200 ease-in-out z-50 ${
        isVisible
          ? 'translate-x-0 opacity-100'
          : '-translate-x-full opacity-0 pointer-events-none'
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="p-4 h-full xl:p-5 flex flex-col">
        <div className="flex items-center justify-between">
          <div className="mb-6 pt-4 pl-2.5 flex-shrink-0">
            <h2 className="text-lg xl:text-xl font-bold text-foreground">
              부트캠프 과정 목록
            </h2>
            <p className="text-sm xl:text-base text-muted-foreground mt-1">
              과정을 선택하세요
            </p>
          </div>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => navigate('/bootcamp/registration')}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto min-h-0">
          <ul className="space-y-2 pr-2">
            {courseNames.map(course => (
              <li key={course}>
                <Link
                  to={`/bootcamp/${encodeURIComponent(course)}`}
                  className={`block p-2 rounded-lg transition-colors hover:bg-menu-hover border ${
                    isActiveCourse(course)
                      ? 'bg-menu-active text-primary border-primary/20'
                      : 'text-foreground border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-2 pt-0.5">
                    <BookOpen className="w-5 h-5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm xl:text-base leading-tight">
                        {course}
                      </h3>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default SubSidebar;
