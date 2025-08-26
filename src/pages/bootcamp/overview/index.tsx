import { useSearchParams } from 'react-router-dom';
import Tab from '@/layout/Tab';
import BootcampIndicator from '@/components/bootcamp/BootcampIndicator.tsx';
import TaskStatusTab from './TaskStatusTab.tsx';
import UncheckedTab from './UncheckedTab.tsx';
import IssuesTab from './IssuesTab.tsx';

function BootcampOverview() {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'task-status';

  const tabItems = [
    {
      id: 'task-status',
      label: '업무 현황',
      value: 'task-status',
    },
    {
      id: 'unchecked-description',
      label: '미체크 항목',
      value: 'unchecked-description',
    },
    {
      id: 'issues',
      label: '이슈 관리',
      value: 'issues',
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'task-status':
        return <TaskStatusTab />;
      case 'unchecked-description':
        return <UncheckedTab />;
      case 'issues':
        return <IssuesTab />;
      default:
        return <TaskStatusTab />;
    }
  };

  return (
    <div className="space-y-6">
      <BootcampIndicator />
      <Tab
        items={tabItems}
        defaultTab="task-status"
        basePath="/bootcamp/overview"
        queryParam="tab"
      >
        {renderTabContent()}
      </Tab>
    </div>
  );
}

export default BootcampOverview;
