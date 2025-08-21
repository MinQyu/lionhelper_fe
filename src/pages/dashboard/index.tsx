import Tab from '@/layout/Tab';
import TaskStatusCard from '@/components/dashboard/TaskStatusCard';
import { useDashboard } from '@/hooks/useDashboard';

function Dashboard() {
  const { courses, taskData, loading } = useDashboard();

  if (loading) {
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

  if (courses.length === 0) {
    return (
      <div className="space-y-6 pt-16">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">담당 과정이 없습니다</h3>
            <p className="text-muted-foreground">
              관리자에게 문의하시기 바랍니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const tabItems = courses.map(course => ({
    id: course.id,
    label: course.name,
    value: course.id,
    href: `/dashboard?course=${course.id}`,
  }));

  return (
    <div className="space-y-6 pt-16">
      <Tab
        items={tabItems}
        defaultTab={courses[0]?.id}
        basePath="/dashboard"
        queryParam="course"
      >
        {taskData && <TaskStatusCard {...taskData} />}
      </Tab>
    </div>
  );
}

export default Dashboard;
