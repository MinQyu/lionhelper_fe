import { useParams } from 'react-router-dom';
import IssueRegister from '@/components/bootcamp/IssueRegister';
import IssueList from '@/components/bootcamp/IssueList';

function IssuesTab() {
  const { CourseName } = useParams<{ CourseName: string }>();

  return (
    <div className="space-y-4">
      <IssueRegister />
      {CourseName && <IssueList courseName={CourseName} />}
    </div>
  );
}

export default IssuesTab;
