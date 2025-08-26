import { Link, useLocation } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { useBootcampStore } from '@/store';

interface SubSidebarProps {
  isVisible: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const SubSidebar = ({
  isVisible,
  onMouseEnter,
  onMouseLeave,
}: SubSidebarProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const courses = useBootcampStore(state => state.courses);

  const isActiveCourse = (courseId: string) =>
    currentPath === `/bootcamp/${courseId}`;

  return (
    <div
      className={`fixed left-56 top-0 h-screen bg-sidebar border-r border-border shadow-lg transition-all duration-200 ease-in-out z-50 ${
        isVisible
          ? 'translate-x-0 opacity-100'
          : '-translate-x-full opacity-0 pointer-events-none'
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="p-4 h-full">
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
            {courses.map(course => (
              <li key={course.id}>
                <Link
                  to={`/bootcamp/${course.training_course}`}
                  className={`block p-2 rounded-lg transition-colors hover:bg-menu-hover border ${
                    isActiveCourse(course.id)
                      ? 'bg-menu-active text-primary border-primary/20'
                      : 'text-foreground border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-2 pt-0.5">
                    <BookOpen className="w-5 h-5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm leading-tight">
                        {course.training_course}
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
