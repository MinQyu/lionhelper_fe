import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Tab from '@/layout/Tab';
import TaskStatusCard from '@/components/dashboard/TaskStatusCard';
import { useAuthStore } from '@/store/authStore';
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
  const [searchParams] = useSearchParams();
  const [activeCourseName, setActiveCourseName] = useState<string | null>(null);
  const [taskStatusData, setTaskStatusData] = useState<TaskStatusData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // taskStatusCombinedList API에서 데이터 가져오기
  useEffect(() => {
    const fetchTaskStatus = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.admin.taskStatusCombinedList();
        if (response.data.success && response.data.data) {
          // 사용자가 담당하는 과정만 필터링
          const filteredData = response.data.data.filter(
            (item: TaskStatusData) => {
              if (!user) return false;
              return (
                user.name === item.manager_name ||
                user.username === item.manager_name
              );
            }
          );

          // test 계정인 경우 모든 과정 표시
          if (user?.username === 'test') {
            setTaskStatusData(response.data.data);
          } else {
            setTaskStatusData(filteredData);
          }
        } else {
          setError(
            response.data.message || '태스크 상태를 불러올 수 없습니다.'
          );
        }
      } catch (error) {
        console.error('태스크 상태 조회 오류:', error);
        setError('태스크 상태를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTaskStatus();
  }, [user]);

  useEffect(() => {
    const courseName = searchParams.get('course');
    if (courseName) {
      setActiveCourseName(courseName);
    } else if (taskStatusData.length > 0) {
      setActiveCourseName(taskStatusData[0].training_course || '');
    }
  }, [searchParams, taskStatusData]);

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

  // 탭 변경 핸들러
  const handleTabChange = (value: string) => {
    setActiveCourseName(value);
  };

  // 현재 과정에 대한 태스크 데이터를 TaskStatusCard props에 맞게 변환
  const getTaskData = (courseName: string) => {
    const course = taskStatusData.find(c => c.training_course === courseName);
    if (!course) return null;

    return {
      training_course: courseName,
      daily_task: Math.random() > 0.5, // 임시 데이터
      unchecked_task: Math.floor(Math.random() * 10),
      issue: Math.floor(Math.random() * 5),
      check_rate: course.overall_check_rate,
      start_date: new Date(), // 임시로 현재 날짜 사용
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 임시로 30일 후
    };
  };

  const taskData = currentCourse
    ? getTaskData(currentCourse.training_course || '')
    : null;

  return (
    <div className="space-y-6 pt-16">
      <Tab
        items={tabItems}
        defaultTab={activeCourseName || undefined}
        basePath="/dashboard"
        queryParam="course"
        onTabChange={handleTabChange}
      >
        {taskData && currentCourse ? (
          <div className="space-y-6">
            <TaskStatusCard {...taskData} />
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
