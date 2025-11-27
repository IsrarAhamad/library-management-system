import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/api';

export default function Home() {
  const nav = useNavigate();
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) nav('/login', { replace: true });
  }, [nav]);
  return null;
}
