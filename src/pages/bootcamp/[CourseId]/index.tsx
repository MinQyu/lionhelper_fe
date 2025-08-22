import { useParams } from 'react-router-dom';
import BootcampIndicator from '@/components/BootcampIndicator';

function BootcampDetail() {
  const { CourseId } = useParams<{ CourseId: string }>();

  return (
    <div className="pt-8">
      <BootcampIndicator />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          부트캠프 과정 상세
        </h1>
        <p className="text-muted-foreground">과정 ID: {CourseId}</p>
      </div>
    </div>
  );
}

export default BootcampDetail;
