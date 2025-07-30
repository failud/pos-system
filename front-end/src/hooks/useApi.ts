import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useState, useCallback } from 'react';
import apiClient from '../api';


interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (config: AxiosRequestConfig) => Promise<AxiosResponse<T> | void>;
}

export function useApi<T = any>(): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (config: AxiosRequestConfig): Promise<AxiosResponse<T> | void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.request<T>(config);
      setData(response.data);
      return response;
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, execute };
}