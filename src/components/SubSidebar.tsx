import { Link, useLocation } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

interface Course {
  id: string;
  course_name: string;
}

interface SubSidebarProps {
  isVisible: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

// 목업용 데이터
const mockCourses: Course[] = [
  { id: '1', course_name: '프론트엔드 14기' },
  { id: '2', course_name: '백엔드 14기' },
  { id: '3', course_name: '풀스택 14기' },
  { id: '4', course_name: 'AI/ML 14기' },
  { id: '5', course_name: '클라우드 엔지니어링 3기' },
];

const SubSidebar = ({
  isVisible,
  onMouseEnter,
  onMouseLeave,
}: SubSidebarProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActiveCourse = (courseId: string) =>
    currentPath === `/bootcamp/${courseId}`;

  return (
    <div
      className={`fixed left-56 top-0 h-screen bg-background border-r border-border shadow-lg transition-all duration-200 ease-in-out z-0 ${
        isVisible
          ? 'translate-x-0 opacity-100'
          : '-translate-x-full opacity-0 pointer-events-none'
      }`}
      style={{ width: '280px' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="p-4 h-full overflow-y-auto">
        <div className="mb-6 pt-2">
          <h2 className="text-lg font-bold text-foreground">
            부트캠프 과정 목록
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            과정을 선택하세요
          </p>
        </div>

        <nav>
          <ul className="space-y-2">
            {mockCourses.map(course => (
              <li key={course.id}>
                <Link
                  to={`/bootcamp/${course.id}`}
                  className={`block p-2 rounded-lg transition-colors hover:bg-menu-hover ${
                    isActiveCourse(course.id)
                      ? 'bg-menu-active text-primary border border-primary/20'
                      : 'text-foreground'
                  }`}
                >
                  <div className="flex items-start gap-3 pt-0.5" justify-center>
                    <BookOpen className="w-5 h-5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm leading-tight">
                        {course.course_name}
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
};

export default SubSidebar;
