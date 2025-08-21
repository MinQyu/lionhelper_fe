import { useParams } from 'react-router-dom';

function BootcampDetail() {
  const { BootcampId } = useParams();
  return <div>Bootcamp id: {BootcampId}</div>;
}

export default BootcampDetail;
