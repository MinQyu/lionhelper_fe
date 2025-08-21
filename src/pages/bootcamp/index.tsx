import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function BootcampIndex() {
  //리다이렉트용 페이지
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/bootcamp/overview', { replace: true });
  }, [navigate]);

  return null;
}

export default BootcampIndex;
