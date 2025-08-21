import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

interface Course {
  id: string;
  name: string;
  cohort: number;
  start_date: string;
  end_date: string;
}

interface TaskData {
  daily_task: boolean;
  unchecked_task: number;
  issue: number;
  check_rate: number;
  start_date: Date;
  end_date: Date;
}

export const useDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [taskData, setTaskData] = useState<Record<string, TaskData>>({});
  const [loading, setLoading] = useState(true);

  const currentCourse = searchParams.get('course') || courses[0]?.id || '';

  // 담당 코스 목록 조회
  const fetchUserCourses = async () => {
    try {
      setLoading(true);
      // TODO: 실제 API 호출
      const mockCourses: Course[] = [
        {
          id: 'frontend-14',
          name: '프론트엔드 14기',
          cohort: 14,
          start_date: '2025-04-01',
          end_date: '2025-08-18',
        },
        {
          id: 'backend-12',
          name: '백엔드 12기',
          cohort: 12,
          start_date: '2025-03-01',
          end_date: '2025-09-01',
        },
      ];

      setCourses(mockCourses);

      // 첫 번째 코스를 기본값으로 설정
      if (!currentCourse && mockCourses.length > 0) {
        setSearchParams({ course: mockCourses[0].id });
      }
    } catch (error) {
      console.error('Failed to fetch user courses:', error);
    } finally {
      setLoading(false);
    }
  };

  // 특정 코스의 태스크 데이터 조회
  const fetchTaskData = async (courseId: string) => {
    try {
      // TODO: 실제 API 호출
      const mockTaskData: TaskData = {
        daily_task: true,
        unchecked_task: 1,
        issue: 0,
        check_rate: 85,
        start_date: new Date('2025-04-01'),
        end_date: new Date('2025-08-18'),
      };

      setTaskData(prev => ({
        ...prev,
        [courseId]: mockTaskData,
      }));
    } catch (error) {
      console.error(`Failed to fetch task data for ${courseId}:`, error);
    }
  };

  const handleCourseChange = (courseId: string) => {
    setSearchParams({ course: courseId });

    // 해당 코스의 데이터가 없으면 조회
    if (!taskData[courseId]) {
      fetchTaskData(courseId);
    }
  };

  useEffect(() => {
    fetchUserCourses();
  }, []);

  useEffect(() => {
    if (currentCourse && !taskData[currentCourse]) {
      fetchTaskData(currentCourse);
    }
  }, [currentCourse]);

  return {
    courses,
    currentCourse,
    taskData: taskData[currentCourse],
    loading,
    handleCourseChange,
  };
};
