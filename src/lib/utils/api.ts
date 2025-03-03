import axios from 'axios';
import { getSession } from 'next-auth/react'; // 🔥 Lấy session từ NextAuth

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Thêm interceptor để tự động thêm token từ NextAuth
api.interceptors.request.use(async (config) => {
  const session = await getSession(); // Lấy session hiện tại
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

export default api;
