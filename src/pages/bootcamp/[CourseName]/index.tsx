import { useParams } from 'react-router-dom';
import BootcampIndicator from '@/components/bootcamp/BootcampIndicator';
import Tab from '@/layout/Tab';
import DailyTaskTab from './tabs/DailyTaskTab';
import PeriodicTaskTab from './tabs/PeriodicTaskTab';
import AttendanceTab from './tabs/AttendanceTab';
import IssuesTab from './tabs/IssuesTab';
import { useSearchParams } from 'react-router-dom';

function BootcampDetail() {
  const { CourseName } = useParams<{ CourseName: string }>();
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
        return <DailyTaskTab />;
      case 'periodic-task':
        return <PeriodicTaskTab />;
      case 'issues':
        return <IssuesTab />;
      case 'attendance':
        return <AttendanceTab />;
    }
  };

  return (
    <div className="space-y-6">
      <BootcampIndicator />
      <Tab
        items={tabItems}
        basePath={`/bootcamp/${encodeURIComponent(CourseName as string)}`}
        queryParam="tab"
      >
        {renderTabContent()}
      </Tab>
    </div>
  );
}

export default BootcampDetail;
