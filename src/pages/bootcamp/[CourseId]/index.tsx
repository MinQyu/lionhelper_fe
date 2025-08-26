import { useParams } from 'react-router-dom';
import BootcampIndicator from '@/components/bootcamp/BootcampIndicator';
import Tab from '@/layout/Tab';
import DailyTaskTap from './DailyTaskTap';
import PeriodicTask from './PeriodicTaskTap';
import AttendanceTap from './AttendanceTap';
import IssuesTab from './IssuesTab';
import { useSearchParams } from 'react-router-dom';

function BootcampDetail() {
  const { CourseId } = useParams<{ CourseId: string }>();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'daily-task';

  const tabItems = [
    {
      label: '오늘의 업무',
      value: 'daily-task',
      id: 'daily-task',
    },
    {
      label: '기간별 업무',
      value: 'periodic-task',
      id: 'periodic-task',
    },
    {
      label: '이슈관리',
      value: 'issues',
      id: 'issues',
    },
    {
      label: '출퇴근 현황',
      value: 'attendance',
      id: 'attendance',
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'daily-task':
        return <DailyTaskTap />;
      case 'periodic-task':
        return <PeriodicTask />;
      case 'issues':
        return <IssuesTab />;
      case 'attendance':
        return <AttendanceTap />;
      default:
        return <DailyTaskTap />;
    }
  };

  return (
    <div className="space-y-6">
      <BootcampIndicator />
      <Tab
        items={tabItems}
        defaultTab="daily-task"
        basePath={`/bootcamp/${CourseId}`}
        queryParam="tab"
      >
        {renderTabContent()}
      </Tab>
    </div>
  );
}

export default BootcampDetail;
