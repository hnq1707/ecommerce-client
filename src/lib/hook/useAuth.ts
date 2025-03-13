/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '../utils/api';
import { useState } from 'react';

export const useAuthApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callApi = async (endpoint: string, data?: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post(endpoint, data);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    verify: (data: any) => callApi('/api/auth/verify', data),
    getToken: (data: any) => callApi('/api/auth/token', data),
    register: (data: any) => callApi('/api/auth/register', data),
    refresh: (data: any) => callApi('/api/auth/refresh', data),
    logout: (data: any) => callApi('/api/auth/logout'),
    introspect: (data: any) => callApi('/api/auth/introspect', data),
  };
};
