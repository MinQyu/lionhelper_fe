import { useParams } from 'react-router-dom';

function BootcampDetail() {
  // ▶ useParams 훅을 사용하여 URL 매개변수에 액세스합니다.
  //    useParams는 현재 경로의 모든 동적 매개변수를 객체 형태로 반환합니다.
  // → 구조 분해 할당을 이용하여 바로 값을 넣습니다.
  const { BootcampId } = useParams();

  return <div>Bootcamp id: {BootcampId}</div>;
}

export default BootcampDetail;
