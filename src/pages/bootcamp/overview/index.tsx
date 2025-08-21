import { useSearchParams } from 'react-router-dom';
import Tab from '@/layout/Tab';
import TaskStatusTab from './TaskStatusTab.tsx';
import UncheckedTab from './UncheckedTab.tsx';
import IssuesTab from './IssuesTab.tsx';

function BootcampOverview() {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'taskStatus';

  const tabItems = [
    {
      id: 'taskStatus',
      label: '업무 현황',
      value: 'taskStatus',
    },
    {
      id: 'uncheckedDescription',
      label: '미체크 항목',
      value: 'uncheckedDescription',
    },
    {
      id: 'issues',
      label: '이슈 관리',
      value: 'issues',
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'taskStatus':
        return <TaskStatusTab />;
      case 'uncheckedDescription':
        return <UncheckedTab />;
      case 'issues':
        return <IssuesTab />;
      default:
        return <TaskStatusTab />;
    }
  };

  return (
    <div className="space-y-6 pt-16">
      <Tab
        items={tabItems}
        defaultTab="taskStatus"
        basePath="/bootcamp/overview"
        queryParam="tab"
      >
        {renderTabContent()}
      </Tab>
    </div>
  );
}

export default BootcampOverview;
