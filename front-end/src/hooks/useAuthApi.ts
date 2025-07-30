import { useAuth } from '../contexts/AuthContext';
import { useApi } from './useApi';
import { useEffect } from 'react';

export function useAuthApi<T = any>() {
  const { isAuthenticated, logout } = useAuth();
  const api = useApi<T>();

  useEffect(() => {
    if (!isAuthenticated) {
      logout();
    }
  }, [isAuthenticated, logout]);

  return api;
}