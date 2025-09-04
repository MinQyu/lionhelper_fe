import { useParams } from 'react-router-dom';
import UncheckedTaskList from '@/components/bootcamp/UncheckedTaskList';

function UncheckedTaskTab() {
  const { CourseName } = useParams<{ CourseName: string }>();

  return (
    <div>
      <UncheckedTaskList courseFilter={CourseName} />
    </div>
  );
}

export default UncheckedTaskTab;
