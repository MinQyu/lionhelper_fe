import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold">임시 랜딩</h2>
      <Link to="/uiguide" className="text-blue-500">
        UI 가이드
      </Link>
      <Link to="/dashboard" className="text-blue-500">
        대시보드
      </Link>
    </div>
  );
}

export default Landing;
