import { useAuth } from './useAuth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAdmin = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user?.role !== 'admin') {
      navigate('/');
    }
  }, [user, loading, navigate]);

  return { isAdmin: user?.role === 'admin', loading };
};