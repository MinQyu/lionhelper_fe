import { useParams } from 'react-router-dom';

function BootcampDetail() {
  const { CourseId } = useParams<{ CourseId: string }>();

  return (
    <div className="p-6">
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
