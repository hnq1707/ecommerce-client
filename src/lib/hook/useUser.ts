/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import api from '../utils/api';

export const useUserApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callApi = async (method: string, endpoint: string, data?: unknown) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api({
        method,
        url: endpoint,
        data,
      });
      return response.data;
    } catch (err : any ) {
      setError(err.response?.data?.message || 'Something went wrong');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getUser: (userId: string) => callApi('GET', `/users/${userId}`),
    updateUser: (userId: string, data: unknown) => callApi('PUT', `/users/${userId}`, data),
    deleteUser: (userId: string) => callApi('DELETE', `/users/${userId}`),
    getAllUsers: () => callApi('GET', '/users'),
    createUser: (data: unknown) => callApi('POST', '/users', data),
    getMyInfo: () => callApi('GET', '/users/my-info'),
  };
};
