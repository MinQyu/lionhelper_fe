import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Tab from '@/layout/Tab';
import TaskStatusCard from '@/components/dashboard/TaskStatusCard';
import { useAuthStore } from '@/store/authStore';
import { useBootcampStore } from '@/store/bootcampStore';
import { apiClient } from '@/api/apiClient';

interface TaskStatusData {
  training_course?: string;
  manager_name?: string;
  dept?: string;
  daily_check_rate?: string;
  yesterday_check_rate?: string;
  overall_check_rate?: string;
}

function Dashboard() {
  const { user } = useAuthStore();
  const { getCourseByName, fetchCourses } = useBootcampStore();
  const [searchParams] = useSearchParams();
  const [activeCourseName, setActiveCourseName] = useState<string | null>(null);
  const [taskStatusData, setTaskStatusData] = useState<TaskStatusData[]>([]);
  const [currentTaskData, setCurrentTaskData] = useState<{
    training_course: string;
    daily_task: boolean;
    unchecked_task: number;
    issue: number;
    check_rate: string;
    start_date: Date;
    end_date: Date;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTabLoading, setIsTabLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTaskData = useCallback(
    async (courseName: string) => {
      const course = taskStatusData.find(c => c.training_course === courseName);
      if (!course) return null;

      const bootcampCourse = getCourseByName(courseName);
      const startDate = bootcampCourse?.start_date
        ? new Date(bootcampCourse.start_date)
        : new Date();

      const endDate = bootcampCourse?.end_date
        ? new Date(bootcampCourse.end_date)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      try {
        // 미체크 항목 수 조회
        const uncheckedResponse =
          await apiClient.uncheckedDescriptions.uncheckedDescriptionsList();
        const uncheckedCount =
          uncheckedResponse.data.success && uncheckedResponse.data.data
            ? uncheckedResponse.data.data.filter(
                item => item.training_course === courseName
              ).length
            : 0;

        // 이슈 수 조회
        const issuesResponse = await apiClient.issues.issuesList();
        const issuesCount =
          issuesResponse.data.success && issuesResponse.data.data
            ? issuesResponse.data.data
                .filter(courseData => courseData.training_course === courseName)
                .reduce(
                  (total, courseData) =>
                    total + (courseData.issues?.length || 0),
                  0
                )
            : 0;

        return {
          training_course: courseName,
          daily_task: course.daily_check_rate === '100%',
          unchecked_task: uncheckedCount,
          issue: issuesCount,
          check_rate: course.overall_check_rate as string,
          start_date: startDate,
          end_date: endDate,
        };
      } catch (error) {
        console.error('데이터 조회 중 오류:', error);
        // 에러 발생 시 기본값 반환
        return {
          training_course: courseName,
          daily_task: course.daily_check_rate === '100%',
          unchecked_task: 0,
          issue: 0,
          check_rate: course.overall_check_rate as string,
          start_date: startDate,
          end_date: endDate,
        };
      }
    },
    [taskStatusData, getCourseByName]
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // bootcampstore 데이터 로드
        await fetchCourses();

        // taskStatusCombinedList API 호출
        const response = await apiClient.admin.taskStatusCombinedList();
        if (response.data.success && response.data.data) {
          const filteredData = response.data.data.filter(
            (item: TaskStatusData) => {
              if (!user) return false;
              return (
                user.name === item.manager_name ||
                user.username === item.manager_name
              );
            }
          );
          setTaskStatusData(filteredData);
        } else {
          setError(
            response.data.message || '태스크 상태를 불러올 수 없습니다.'
          );
        }
      } catch (error) {
        console.error('데이터 조회 오류:', error);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, fetchCourses]);

  useEffect(() => {
    const courseName = searchParams.get('course');
    if (courseName) {
      setActiveCourseName(courseName);
    } else if (taskStatusData.length > 0) {
      setActiveCourseName(taskStatusData[0].training_course || '');
    }
  }, [searchParams, taskStatusData]);

  // activeCourseName이 변경될 때마다 taskData 로드
  useEffect(() => {
    if (activeCourseName && taskStatusData.length > 0) {
      const loadTaskData = async () => {
        setIsTabLoading(true);
        try {
          const data = await getTaskData(activeCourseName);
          setCurrentTaskData(data);
        } catch (error) {
          console.error('Task 데이터 로드 중 오류:', error);
        } finally {
          setIsTabLoading(false);
        }
      };
      loadTaskData();
    }
  }, [activeCourseName, taskStatusData, getTaskData]);

  const currentCourse = taskStatusData.find(
    course => course.training_course === activeCourseName
  );

  if (isLoading) {
    return (
      <div className="space-y-6 pt-16">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">담당 과정을 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 pt-16">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2 text-destructive">
              오류가 발생했습니다
            </h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6 pt-16">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">로그인이 필요합니다</h3>
            <p className="text-muted-foreground">
              대시보드를 보려면 로그인해주세요.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (taskStatusData.length === 0) {
    return (
      <div className="space-y-6 pt-16">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">담당 과정이 없습니다</h3>
            <p className="text-muted-foreground">
              현재 담당하고 있는 과정이 없습니다.
              <br />
              관리자에게 문의하시기 바랍니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const tabItems = taskStatusData.map(course => ({
    id: course.training_course || '과정명 없음',
    label: course.training_course || '과정명 없음',
    value: course.training_course || '과정명 없음',
    href: `/dashboard?course=${course.training_course}`,
  }));

  const handleTabChange = (value: string) => {
    setActiveCourseName(value);
  };

  return (
    <div className="space-y-6 pt-16">
      <Tab
        items={tabItems}
        defaultTab={activeCourseName || undefined}
        basePath="/dashboard"
        queryParam="course"
        onTabChange={handleTabChange}
      >
        {isTabLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">
                과정 데이터를 불러오는 중...
              </p>
            </div>
          </div>
        ) : currentTaskData && currentCourse ? (
          <div className="space-y-6">
            <TaskStatusCard {...currentTaskData} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-muted-foreground">과정을 선택해주세요</p>
            </div>
          </div>
        )}
      </Tab>
    </div>
  );
}

export default Dashboard;
